import {
  INewArticle,
  INewComment,
  INewThought,
  INewUser,
  IUpdateUser,
} from "@/Types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUserAccount,
  deleteUserThought,
  followUser,
  getArticleBYID,
  getArticles,
  getThoughtBYID,
  getThoughts,
  getUserBYID,
  resetUserPassword,
  saveUserArticle,
  saveUserArticleVote,
  saveUserThought,
  saveUserThoughtComment,
  saveUserThoughtLike,
  sendRecoveryLink,
  signInAccount,
  signOutAccount,
  updateUser,
} from "../Appwrite/api";
import { QUERY_KEYS } from "./queryKeys";
import toast from "react-hot-toast";

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: IUpdateUser) => updateUser(user),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast.error("Profile update failed.");
    },
  });
};

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  });
};

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: signOutAccount,
  });
};

export const useFolllow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { followed: string; follower: string }) =>
      followUser(data),
    // onSuccess: () => {
    //   queryClient.invalidateQueries({
    //     queryKey: [QUERY_KEYS.GET_THOUGHTS],
    //   });
    // },
  });
};

export const useSendResetPasswordLink = () => {
  return useMutation({
    mutationFn: (email: { email: string }) => sendRecoveryLink(email.email),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: { userId: string; secret: string; password: string }) =>
      resetUserPassword(data),
  });
};

export const useCreateThought = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (thought: INewThought) => saveUserThought(thought),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_THOUGHTS],
      });
    },
  });
};

export const useSaveThoughtComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (thought: INewComment) => saveUserThoughtComment(thought),
    onSuccess: (data, thought) => {
      // `thought` içinden `thoughtId` alınıyor
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_THOUGHT_BY_ID, thought.thought],
      });
    },
  });
};

export const useCreateArticle = () => {
  return useMutation({
    mutationFn: (article: INewArticle) => saveUserArticle(article),
  });
};

export const useLikeThought = () => {
  return useMutation({
    mutationFn: (data: { user: string; item: string }) =>
      saveUserThoughtLike(data),
  });
};

export const useVoteArticle = () => {
  return useMutation({
    mutationFn: (data: { user: string; item: string }) =>
      saveUserArticleVote(data),
  });
};

export const useGetArticleByID = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ARTICLES_BY_ID],
    queryFn: () => getArticleBYID(id),
    enabled: !!id,
  });
};

export const useGetThoughtByID = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_THOUGHT_BY_ID],
    queryFn: () => getThoughtBYID(id),
    enabled: !!id,
  });
};

export const useGetUserByID = (username: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_USERNAME],
    queryFn: () => getUserBYID(username),
    enabled: !!username,
  });
};

export const useGetThoughts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_THOUGHTS],
    queryFn: getThoughts,
  });
};

export const useGetArticles = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ARTICLES],
    queryFn: getArticles,
  });
};

export const useDeleteThought = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUserThought(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_THOUGHTS] });
    },
    onError: (error) => {
      toast.error(`Error deleting thought: ${error}`);
    },
  });
};
