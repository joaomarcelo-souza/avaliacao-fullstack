export interface OperationResult<T = any> {
  success: boolean;
  status: number;
  error?: string;
  data?: T;
}
