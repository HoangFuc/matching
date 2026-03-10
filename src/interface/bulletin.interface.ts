import { ImageSourcePropType } from 'react-native';

// API response types
export interface IBulletinAuthor {
  id: string;
  fullName: string;
  avatarUrl?: string;
}

export interface IBulletinImage {
  id: string;
  imageUrl: string;
  postId: string;
  presignedUrl: string;
}

export interface IBulletinPost {
  id: string;
  title: string;
  content: string;
  author: IBulletinAuthor;
  images: IBulletinImage[];
  thumbnailUrl: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  teamId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IBulletinListResponse {
  data: IBulletinPost[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IBulletinListParams {
  page?: number;
  limit?: number;
  teamId?: string;
}

export interface ICreateBulletinImage {
  uri: string;
  type: string;
  name: string;
}

export interface ICreateBulletinParams {
  title: string;
  content: string;
  images?: ICreateBulletinImage[];
}

export interface IToggleLikeResponse {
  likeCount: number;
  isLiked: boolean;
}

export interface ICreateCommentParams {
  postId: string;
  content: string;
  parentId?: string;
}

export interface IUpdateCommentParams {
  commentId: string;
  postId: string;
  content: string;
}

export interface IDeleteCommentParams {
  commentId: string;
  postId: string;
}

export interface IToggleCommentLikeParams {
  commentId: string;
  postId: string;
}

export interface IBulletinComment {
  id: string;
  content: string;
  author: IBulletinAuthor;
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
  replies?: IBulletinComment[];
  postId?: string;
}

export interface IBulletinCommentListResponse {
  data: IBulletinComment[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Legacy mock types (kept for backward compatibility during migration)
export type TBulletinPost = {
  id: string;
  author: string;
  avatar: ImageSourcePropType;
  timeAgo: string;
  title: string;
  content: string;
  images?: ImageSourcePropType[];
  likes: number;
  comments: number;
};

export type TBulletinComment = {
  id: string;
  author: string;
  avatar: ImageSourcePropType;
  timeAgo: string;
  content: string;
  likes: number;
  isAuthor?: boolean;
  replies?: TBulletinComment[];
};
