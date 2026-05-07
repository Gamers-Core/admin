import { authPurposes } from './const';

interface ValidationError<P extends string = string> {
  property: P;
  keys: string[];
  messages: string[];
  children: ValidationError<P>[];
}

export type ValidationErrors<K extends string = string> = {
  errors: ValidationError<K>[];
};

export interface AppError {
  message: string;
}

export type BackendError<E extends ValidationErrors | AppError = ValidationErrors | AppError> = {
  status: number;
} & E;

export interface OTPFlowResponse {
  sessionId: string;
}

export interface OtpVerifyResultMap {
  admin_signin: {
    user: BasicUser;
  };
}

export type AuthPurpose = (typeof authPurposes)[number];

export type VerifyOTPResponse = {
  [P in AuthPurpose]: { purpose: P } & OtpVerifyResultMap[P];
};

export interface BasicUser {
  id: number;
  name: string;
  email: string;
}
