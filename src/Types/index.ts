export type IUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  profile: string;
  bio: string;
  role: string;
};

export type INewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};

export type IUpdateUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  profile_id: string;
  profile: URL | string;
  pFile: File[];
  bio: string;
};

export type INewThought = {
  user: string;
  caption: string;
  location?: string;
  images?: File[];
  video?: File;
};

export type INewArticle = {
  creator: string;
  title: string;
  subtitle: string;
  inner: string;
};

export type INewComment = {
  creator: string;
  thought: string;
  comment: string;
};
