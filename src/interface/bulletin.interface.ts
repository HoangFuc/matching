import { ImageSourcePropType } from 'react-native';

// API response types
export interface IBulletinAuthor {
  id: string;
  name: string;
  profileImage?: string;
}

export interface IBulletinImage {
  id: string;
  url: string;
}

export interface IBulletinPost {
  id: string;
  title: string;
  content: string;
  author: IBulletinAuthor;
  images: IBulletinImage[];
  likesCount: number;
  commentsCount: number;
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
