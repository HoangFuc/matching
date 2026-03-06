import { ImageSourcePropType } from 'react-native';

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
