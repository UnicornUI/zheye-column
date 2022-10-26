export interface ImageProps {
  _id?: string;
  url?: string;
  fitUrl?: string;
  createAt?: string;
}
export interface ColumnProps {
  _id: string;
  title: string;
  avatar: ImageProps;
  description: string;
}

export type MessageType = "success" | "error" | "default";

export interface UserProps {
  isLogin: boolean;
  nickName?: string;
  _id?: string;
  column?: string;
  email?: string;
  description?: string;
  avatar?: ImageProps;
}

export interface RuleProps {
  type: "required" | "email" | "custom";
  validator?: () => boolean;
  message: string;
}

export interface ResponseType<P = {}> {
  code: number;
  msg: string;
  data: P;
}

export interface PostProps {
  _id?: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: ImageProps | string;
  column: string;
  author?: string | UserProps;
  createdAt?: string;
  isHTML?: boolean;
}

export interface GlobalErrorProps {
  status: boolean;
  message?: string;
}

export interface ListProps<P> {
  [id: string]: P;
}

export interface LoadedPostProps {
  columnId?: string;
  currentPage?: number;
  total?: number;
}

export interface GlobalDataProps {
  token: string;
  error: GlobalErrorProps;
  loading: boolean;
  columns: {
    data: ListProps<ColumnProps>;
    currentPage: number;
    total: number;
  };
  posts: {
    data: ListProps<PostProps>;
    loadedColumns: ListProps<LoadedPostProps>;
  };
  user: UserProps;
}
