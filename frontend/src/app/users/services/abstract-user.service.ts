import { Signal } from '@angular/core';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { OperationResult } from '../../models/operation-result.model';

export abstract class AbstractUserService {
  abstract users: Signal<User[]>;
  abstract refresh(): void;

  // Creating a user: client provides everything except `id`;
  abstract add(user: Omit<User, 'id'>): Observable<OperationResult<User>>;

  // Remove returns no content (204) on success
  abstract remove(id: number): Observable<OperationResult>;

  // Update is partial (PATCH) so accept partial fields but require id
  abstract update(user: Partial<User> & { id: number }): Observable<OperationResult<User>>;

  abstract search_by_id(id: number): Observable<OperationResult<User>>;

  abstract getUserById(id: number): Signal<User | undefined>;
  abstract fetchUserById(id: number): Observable<User>;
}
