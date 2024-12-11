import { Client, Account, Databases, Storage, Avatars } from "appwrite";

export const appwriteConfig = {
  url: import.meta.env.VITE_APPWRITE_URL,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,

  users_collection: import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID,
  thoughts_collection: import.meta.env.VITE_APPWRITE_THOUGHTS_COLLECTION_ID,
  thought_comments_collection: import.meta.env
    .VITE_APPWRITE_THOUGHT_COMMENTS_COLLECTION_ID,
  thought_likes_collection: import.meta.env
    .VITE_APPWRITE_THOUGHT_LIKES_COLLECTION_ID,
  articles_collection: import.meta.env.VITE_APPWRITE_ARTICLE_COLLECTION_ID,
  article_votes_collection: import.meta.env
    .VITE_APPWRITE_ARTICLE_VOTES_COLLECTION_ID,
  followers_collection: import.meta.env.VITE_APPWRITE_FOLLOWERS_COLLECTION_ID,

  video_storage: import.meta.env.VITE_APPWRITE_VIDEO_STORAGE_ID,
  image_storage: import.meta.env.VITE_APPWRITE_IMAGE_STORAGE_ID,
  user_image_storage: import.meta.env.VITE_APPWRITE_USER_IMAGE_STORAGE_ID,
};

export const client = new Client();

client.setEndpoint(appwriteConfig.url);
client.setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const avatars = new Avatars(client);
export const storage = new Storage(client);
