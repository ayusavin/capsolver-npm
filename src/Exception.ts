import { ErrorResponse } from './types';

export class TaskException extends Error {
  public code: string | null;
  public description: string | null;

  constructor(message: string, errorResponse: ErrorResponse) {
    super(message);
    this.code = errorResponse.errorCode ?? null;
    this.description = errorResponse.errorDescription ?? null;
  }
} 