export interface User {
  _id: string;
  email: string;
  createdAt: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
}

export interface SignupDto {
  email: string;
  password: string;
}

export interface SigninDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface ObjectItem {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  ownerId: string;
  owner?: {
    _id: string;
    email: string;
  };
  createdAt: string;
}

export interface CreateObjectDto {
  title: string;
  description: string;
}

export interface ObjectWithOwner extends ObjectItem {
  owner?: Pick<User, '_id' | 'email'>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

export enum WebSocketEvents {
  OBJECT_CREATED = 'object.created',
  OBJECT_DELETED = 'object.deleted',
  OBJECT_UPDATED = 'object.updated',
}

export interface WebSocketObjectCreatedPayload {
  object: ObjectItem;
}

export interface WebSocketObjectDeletedPayload {
  objectId: string;
}
