export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export type JwtPayload = {
  userId: number;
};

export type AdminJwtPayload = {
  adminId: number;
};
