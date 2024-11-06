export interface TaskParameter {
  name: string;
  required: boolean;
  type: string;
}

export interface TaskParameters {
  [key: string]: TaskParameter[];
}

export interface TaskResponse {
  errorId: number;
  taskId?: string;
  balance?: number;
  solution?: any;
  status?: string;
}

export interface ErrorResponse {
  errorCode?: string;
  errorDescription?: string;
  code?: string;
  description?: string;
}

export interface HandlerOptions {
  task: any;
  apiKey: string;
  verbose: number;
  mustPoll?: boolean;
}

export interface BaseTask {
  type: string;
  [key: string]: any;
} 