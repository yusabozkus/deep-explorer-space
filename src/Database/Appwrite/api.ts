import { ID, Query } from "appwrite";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import {
  INewArticle,
  INewComment,
  INewThought,
  INewUser,
  IUpdateUser,
} from "@/Types";
import toast from "react-hot-toast";

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      id: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      profile: avatarUrl,
      role: "user",
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function saveUserToDB(user: {
  id: string;
  email: string;
  name: string;
  profile: URL;
  username?: string;
  role: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.users_collection,
      ID.unique(),
      user
    );

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

export async function updateUser(user: IUpdateUser): Promise<any> {
  const hasProfileUpdate = user.pFile.length > 0;

  try {
    let profile = {
      profile: user.profile,
      profile_id: user.profile_id,
    };

    if (hasProfileUpdate) {
      // Upload new file to storage
      const uploadedFile = await uploadFile(user.pFile[0]);
      if (!uploadedFile || !uploadedFile.$id) {
        throw new Error("File upload failed.");
      }

      // Get new file URL
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw new Error("Failed to generate file URL.");
      }

      profile = { ...profile, profile: fileUrl, profile_id: uploadedFile.$id };
    }

    // Update user document
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.users_collection,
      user.id,
      {
        username: user.username,
        name: user.name,
        bio: user.bio,
        profile: profile.profile,
        profile_id: profile.profile_id,
      }
    );

    if (!updatedUser) {
      if (hasProfileUpdate) {
        await deleteFile(profile.profile_id);
      }
      throw new Error("Failed to update user document.");
    }

    // Delete old profile file if necessary
    if (user.profile_id && hasProfileUpdate) {
      await deleteFile(user.profile_id);
    }

    toast.success("Update successful!");
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    toast.error("Failed to update user. Please try again.");
    throw error; // Ensure error is propagated
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailPasswordSession(
      user.email,
      user.password
    );

    console.log(session);

    return session;
  } catch (error: any) {
    const errorCode = error.code ? error.code.toString() : "500";
    const errorMessage = await getError(errorCode);

    console.log(errorMessage);

    throw new Error(errorMessage);
  }
}

export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");
    localStorage.removeItem("id");

    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function sendRecoveryLink(email: string) {
  const loadingID = toast.loading("Bağlantı gönderiliyor...");
  try {
    const session = await account.createRecovery(
      email,
      "http://localhost:3000/reset-password"
    );

    toast.success("Bağlantı gönderildi! Gelen kutunuzu kontrol edin.", {
      id: loadingID,
    });

    return session;
  } catch (error) {
    console.error("Error sending recovery link:", error);
    return null;
  }
}

// ============================== RESET USER PASSWORD
export async function resetUserPassword(data: {
  userId: string;
  secret: string;
  password: string;
}) {
  const loadingID = toast.loading("Parola değiştiriliyor...");
  try {
    const session = await account.updateRecovery(
      data.userId,
      data.secret,
      data.password
    );

    toast.success("Parola başarıyla yenilendi!", { id: loadingID });
    return session;
  } catch (error: any) {
    toast.error(error, { id: loadingID });
    console.error("Error sending recovery link:", error);
    return null;
  }
}

export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    console.log(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.users_collection,
      [Query.equal("id", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getThoughts() {
  try {
    const thoughts = databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.thoughts_collection,
      [Query.orderDesc("$createdAt")]
    );

    if (!thoughts) throw Error;

    return thoughts;
  } catch (error) {
    console.log(error);
  }
}

export async function getArticles() {
  try {
    const articles = databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.articles_collection,
      [Query.orderDesc("$createdAt")]
    );

    if (!articles) throw Error;

    return articles;
  } catch (error) {
    console.log(error);
  }
}

export async function getThoughtBYID(id: string) {
  try {
    const item = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.thoughts_collection,
      id
    );
    if (!item) throw new Error("Thought not found.");
    return item;
  } catch (error) {
    console.error("Error fetching thought:", error);
    throw error;
  }
}

export async function getArticleBYID(id: string) {
  try {
    const item = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.articles_collection,
      id
    );
    if (!item) throw new Error("Article not found.");
    return item;
  } catch (error) {
    console.error("Error fetching thought:", error);
    throw error;
  }
}

export async function getThoughtByID(id: string) {
  try {
    const item = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.thoughts_collection,
      id
    );
    if (!item) throw new Error("Thought not found.");
    return item;
  } catch (error) {
    console.error("Error fetching thought:", error);
    throw error;
  }
}

export async function getUserBYID(username: string) {
  try {
    const user = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.users_collection,
      [Query.equal("username", username)]
    );

    console.log(user);

    if (!user.documents) throw new Error("User not found.");
    return user.documents[0];
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

export function getFilePreview(fileId: string): string | null {
  try {
    return storage.getFilePreview(
      appwriteConfig.user_image_storage,
      fileId,
      2000,
      2000,
      "top",
      100
    );
  } catch (error) {
    console.error("File preview generation failed:", error);
    return null;
  }
}

export async function saveUserThought(thought: INewThought) {
  const loadingToastID = toast.loading("Post sharing...");

  const imageURLArray: string[] = [];
  const imageIDArray: string[] = [];
  let videoFileUrl: string | null = null;
  let videoFileID: string | null = null;

  try {
    const video = thought.video;
    const images = thought.images;

    // Upload images concurrently
    if (images && images.length > 0) {
      const imageUploadPromises = images.map((image) => uploadImage(image));
      const uploadedImages = await Promise.all(imageUploadPromises);

      uploadedImages.forEach((uploadedImage) => {
        if (uploadedImage !== "error") {
          const fileUrl = `https://cloud.appwrite.io/v1/storage/buckets/${appwriteConfig.image_storage}/files/${uploadedImage.$id}/view?project=${appwriteConfig.projectId}`;
          imageURLArray.push(fileUrl);
          imageIDArray.push(uploadedImage.$id);

          toast.success("Image upload success", { id: loadingToastID });
        } else {
          toast.error("Image upload failed", { id: loadingToastID });
        }
      });
    }

    // Upload video if present
    if (video) {
      const uploadedVideo = await uploadVideo(video);
      if (uploadedVideo !== "error") {
        videoFileUrl = `https://cloud.appwrite.io/v1/storage/buckets/${appwriteConfig.video_storage}/files/${uploadedVideo.$id}/view?project=${appwriteConfig.projectId}`;
        videoFileID = uploadedVideo.$id;

        toast.success("Video upload success", { id: loadingToastID });
      } else {
        toast.error("Video upload failed", { id: loadingToastID });
      }
    }

    // Prepare data for the thought document
    const thoughtData: Record<string, any> = {
      creator: thought.user,
      caption: thought.caption,
      location: thought.location || null,
    };

    if (imageURLArray.length) thoughtData.images = imageURLArray;
    if (imageIDArray.length) thoughtData.image_ids = imageIDArray;
    if (videoFileUrl) {
      thoughtData.video_url = videoFileUrl;
      thoughtData.video_id = videoFileID;
    }

    // Attempt to save the thought document
    const savedThought = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.thoughts_collection,
      ID.unique(),
      thoughtData
    );

    if (!savedThought) {
      toast.error("Post sharing failed due to document save error.", {
        id: loadingToastID,
      });
      throw new Error("Document creation failed");
    } else {
      toast.success("Post sharing successful!", { id: loadingToastID });
    }
  } catch (error) {
    console.error(
      "Error occurred while saving thought:",
      getError(error.code) || error
    );

    toast.error("An unexpected error occurred during post sharing.", {
      id: loadingToastID,
    });
    await deleteFiles(
      [...imageIDArray, videoFileID].filter(Boolean) as string[]
    );
    return null;
  }
}

export async function saveUserThoughtComment(data: INewComment) {
  if (!data || !data.comment || !data.creator || !data.thought) {
    throw Error("Not enought data!");
  }

  try {
    const savedArticle = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.thought_comments_collection,
      ID.unique(),
      data
    );

    return savedArticle;
  } catch (error) {
    console.log(error);
  }
}

export async function saveUserArticle(data: INewArticle) {
  if (!data || !data.creator || !data.title || !data.subtitle || !data.inner) {
    throw Error("Not enought data!");
  }

  try {
    const savedArticle = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.articles_collection,
      ID.unique(),
      data
    );

    return savedArticle;
  } catch (error) {
    console.log(error);
  }
}

export async function saveUserThoughtLike(data: {
  user: string;
  item: string;
}) {
  if (!data) return;

  try {
    const existingLikes = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.thought_likes_collection,
      [Query.equal("user", data.user), Query.equal("item", data.item)]
    );

    if (existingLikes.total > 0) {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.thought_likes_collection,
        existingLikes.documents[0].$id
      );
      return;
    }

    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.thought_likes_collection,
      ID.unique(),
      data
    );
  } catch (error) {
    toast.error("An error occurred while updating like status");
    console.error(error);
  }
}

export async function saveUserArticleVote(data: {
  user: string;
  item: string;
}) {
  if (!data) return;

  try {
    const existingLikes = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.article_votes_collection,
      [Query.equal("user", data.user), Query.equal("item", data.item)]
    );

    if (existingLikes.total > 0) {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.article_votes_collection,
        existingLikes.documents[0].$id
      );
      return;
    }

    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.article_votes_collection,
      ID.unique(),
      data
    );
  } catch (error) {
    toast.error("An error occurred while updating like status");
    console.error(error);
  }
}

export async function followUser(data: { followed: string; follower: string }) {
  if (!data) return;

  try {
    const existingFollow = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followers_collection,
      [
        Query.equal("followed", data.followed),
        Query.equal("follower", data.follower),
      ]
    );

    if (existingFollow.total > 0) {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.followers_collection,
        existingFollow.documents[0].$id
      );
      return;
    }

    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followers_collection,
      ID.unique(),
      data
    );
  } catch (error) {
    toast.error("An error occurred while updating follow status");
    console.error(error);
  }
}

export async function deleteUserThought(id: string) {
  try {
    const thought = await getThoughtBYID(id);
    if (!thought) throw new Error("Thought not found.");

    // Backup files in case of rollback
    const originalFiles = {
      images: [...thought.image_ids],
      video: thought.video_id,
    };

    // Delete associated files first
    if (thought.image_ids.length > 0) await deleteFiles(thought.image_ids);
    if (thought.video_id) await deleteVideo(thought.video_id);

    // Proceed to delete the thought
    const deletedThought = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.thoughts_collection,
      id
    );

    if (!deletedThought) throw new Error("Failed to delete thought.");

    return deletedThought;
  } catch (error) {
    console.error("Error during thought deletion:", error);

    // Rollback file deletion if thought deletion failed
    if (error.message.includes("Failed to delete thought")) {
      await restoreFiles(originalFiles);
      toast.error("Thought deletion failed. Files restored.");
    } else {
      toast.error(`Error: ${error.message}`);
    }

    throw error;
  }
}

async function restoreFiles({
  images,
  video,
}: {
  images: string[];
  video: string | null;
}) {
  if (images.length > 0) await Promise.all(images.map(uploadImage));
  if (video) await uploadVideo(video);
}

async function deleteFiles(fileIds: string[]) {
  await Promise.all(fileIds.map((id) => deleteImage(id)));
}

async function uploadVideo(video: File) {
  try {
    return await storage.createFile(
      appwriteConfig.video_storage,
      ID.unique(),
      video
    );
  } catch (error) {
    console.error("Video upload failed:", error);
    return "error";
  }
}

async function uploadImage(image: File) {
  try {
    return await storage.createFile(
      appwriteConfig.image_storage,
      ID.unique(),
      image
    );
  } catch (error) {
    console.error("Image upload failed:", error);
    return "error";
  }
}

export async function uploadFile(file: File): Promise<any> {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.user_image_storage,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    console.error("File upload failed:", error);
    throw new Error("File upload failed.");
  }
}

async function deleteImage(id: string) {
  try {
    await storage.deleteFile(appwriteConfig.image_storage, id);
  } catch (error) {
    console.error("File delete failed:", error);
  }
}

async function deleteVideo(id: string) {
  try {
    await storage.deleteFile(appwriteConfig.video_storage, id);
  } catch (error) {
    console.error("File delete failed:", error);
  }
}

export async function deleteFile(fileId: string): Promise<{ status: string }> {
  try {
    await storage.deleteFile(appwriteConfig.user_image_storage, fileId);

    return { status: "ok" };
  } catch (error) {
    console.error("File deletion failed:", error);
    throw new Error("File deletion failed.");
  }
}

async function getError(errorCode: string) {
  const httpStatusCodes = [
    { code: 200, message: "OK", description: "Successful!" },
    {
      code: 201,
      message: "Created",
      description: "Resource created successfully.",
    },
    {
      code: 202,
      message: "Accepted",
      description: "Request accepted but not completed.",
    },
    {
      code: 204,
      message: "No Content",
      description: "Request succeeded with no content.",
    },
    { code: 400, message: "Bad Request", description: "Invalid request." },
    { code: 401, message: "Unauthorized", description: "Authorization error." },
    { code: 403, message: "Forbidden", description: "Access denied." },
    { code: 404, message: "Not Found", description: "Resource not found." },
    {
      code: 409,
      message: "Conflict",
      description: "Conflict, resource already exists.",
    },
    {
      code: 500,
      message: "Internal Server Error",
      description: "Server error.",
    },
    {
      code: 503,
      message: "Service Unavailable",
      description: "Server is overloaded, try again later.",
    },
  ];

  const error = httpStatusCodes.find(
    (status) => status.code.toString() === errorCode
  );
  return error
    ? `${error.code} - ${error.message}: ${error.description}`
    : "Unknown error code!";
}
