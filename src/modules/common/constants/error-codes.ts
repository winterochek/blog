import { HttpStatus } from '@nestjs/common';

enum AppErrorCode {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_IS_BLOCKED = 'USER_IS_BLOCKED',
  USER_IS_UNAUTHORIZED = 'USER_IS_UNAUTHORIZED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  EMAIL_ALREADY_TAKEN = 'EMAIL_ALREADY_TAKEN',
  USERNAME_ALREADY_TAKEN = 'USERNAME_ALREADY_TAKEN',
  RESET_PASSWORD_TOKEN_EXPIRED = 'RESET_PASSWORD_TOKEN_EXPIRED',
  EMAIL_VERIFY_TOKEN_EXPIRED = 'EMAIL_VERIFY_TOKEN_EXPIRED',
  RESET_PASSWORD_TOKEN_EXISTS = 'RESET_PASSWORD_TOKEN_EXISTS',

  RESET_PASSWORD_TOKEN_USED = 'RESET_PASSWORD_TOKEN_USED',
  EMAIL_VERIFY_TOKEN_USED = 'EMAIL_VERIFY_TOKEN_USED',
  EMAIL_VERIFY_TOKEN_EXISTS = 'EMAIL_VERIFY_TOKEN_EXISTS',

  RESET_PASSWORD_TOKEN_NOT_FOUND = 'RESET_PASSWORD_TOKEN_NOT_FOUND',
  EMAIL_VERIFY_TOKEN_NOT_FOUND = 'EMAIL_VERIFY_TOKEN_NOT_FOUND',
  DONT_HAVE_PERMISSION = 'DONT_HAVE_PERMISSION',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  ALREADY_FOLLOWED_USER = 'ALREADY_FOLLOWED_USER',
  ALREADY_UNFOLLOWED_USER = 'ALREADY_UNFOLLOWED_USER',
}

export const ErrorCode = { ...AppErrorCode };
export type ErrorCodeType = AppErrorCode;

export const ErrorBody: {
  [code in ErrorCodeType]: { statusCode: HttpStatus; message: string };
} = {
  [AppErrorCode.USER_NOT_FOUND]: {
    statusCode: HttpStatus.NOT_FOUND,
    message: AppErrorCode.USER_NOT_FOUND,
  },
  [AppErrorCode.USER_IS_BLOCKED]: {
    statusCode: HttpStatus.CONFLICT,
    message: AppErrorCode.USER_IS_BLOCKED,
  },
  [AppErrorCode.USER_IS_UNAUTHORIZED]: {
    statusCode: HttpStatus.UNAUTHORIZED,
    message: AppErrorCode.USER_IS_UNAUTHORIZED,
  },
  [AppErrorCode.INVALID_CREDENTIALS]: {
    statusCode: HttpStatus.BAD_GATEWAY,
    message: AppErrorCode.INVALID_CREDENTIALS,
  },
  [AppErrorCode.EMAIL_ALREADY_TAKEN]: {
    statusCode: HttpStatus.CONFLICT,
    message: AppErrorCode.EMAIL_ALREADY_TAKEN,
  },
  [AppErrorCode.USERNAME_ALREADY_TAKEN]: {
    statusCode: HttpStatus.CONFLICT,
    message: AppErrorCode.USERNAME_ALREADY_TAKEN,
  },
  [AppErrorCode.RESET_PASSWORD_TOKEN_EXPIRED]: {
    statusCode: HttpStatus.CONFLICT,
    message: AppErrorCode.RESET_PASSWORD_TOKEN_EXPIRED,
  },
  [AppErrorCode.EMAIL_VERIFY_TOKEN_EXPIRED]: {
    statusCode: HttpStatus.CONFLICT,
    message: AppErrorCode.EMAIL_VERIFY_TOKEN_EXPIRED,
  },
  [AppErrorCode.RESET_PASSWORD_TOKEN_USED]: {
    statusCode: HttpStatus.CONFLICT,
    message: AppErrorCode.RESET_PASSWORD_TOKEN_USED,
  },
  [AppErrorCode.EMAIL_VERIFY_TOKEN_USED]: {
    statusCode: HttpStatus.CONFLICT,
    message: AppErrorCode.EMAIL_VERIFY_TOKEN_USED,
  },
  [AppErrorCode.RESET_PASSWORD_TOKEN_EXISTS]: {
    statusCode: HttpStatus.CONFLICT,
    message: AppErrorCode.RESET_PASSWORD_TOKEN_EXISTS,
  },
  [AppErrorCode.EMAIL_VERIFY_TOKEN_EXISTS]: {
    statusCode: HttpStatus.CONFLICT,
    message: AppErrorCode.EMAIL_VERIFY_TOKEN_EXISTS,
  },
  [AppErrorCode.RESET_PASSWORD_TOKEN_NOT_FOUND]: {
    statusCode: HttpStatus.NOT_FOUND,
    message: AppErrorCode.RESET_PASSWORD_TOKEN_NOT_FOUND,
  },
  [AppErrorCode.EMAIL_VERIFY_TOKEN_NOT_FOUND]: {
    statusCode: HttpStatus.NOT_FOUND,
    message: AppErrorCode.EMAIL_VERIFY_TOKEN_NOT_FOUND,
  },
  [AppErrorCode.DONT_HAVE_PERMISSION]: {
    statusCode: HttpStatus.FORBIDDEN,
    message: AppErrorCode.DONT_HAVE_PERMISSION,
  },
  [AppErrorCode.INTERNAL_SERVER_ERROR]: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: AppErrorCode.INTERNAL_SERVER_ERROR,
  },
  [AppErrorCode.ALREADY_FOLLOWED_USER]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: AppErrorCode.ALREADY_FOLLOWED_USER,
  },
  [AppErrorCode.ALREADY_UNFOLLOWED_USER]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: AppErrorCode.ALREADY_UNFOLLOWED_USER,
  },
};
