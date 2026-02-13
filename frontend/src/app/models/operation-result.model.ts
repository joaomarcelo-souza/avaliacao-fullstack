import { User } from '../users/models/user.model';

export interface OperationResult<T = User> {
  success: boolean;
  status: number;
  error?: string;
  data?: T;
}
