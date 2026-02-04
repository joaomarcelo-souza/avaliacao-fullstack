import { Injectable, computed, Signal, signal, inject } from '@angular/core';
import { AbstractUserService } from './abstract-user.service';
import { User } from '../models/user.model';
import { OperationResult } from '../../models/operation-result.model';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environments';

@Injectable()
export class UserService extends AbstractUserService {
  private _users = signal<User[]>([]);
  users = this._users.asReadonly();

  private _currentUser = signal<User | null>(null);
  currentUser = this._currentUser.asReadonly();

  private http = inject(HttpClient);

  constructor() {
    super();
    console.info('UserService ativo - conectado ao backend');
  }

  // --- ADD USER ---
  add(user: Omit<User, 'id'>): Observable<OperationResult> {
    return this.http.post<User>(`${environment.apiUrl}/users`, user).pipe(
      map((createdUser) => {
        // backend returns a DTO without password, preserve the original password in the local store
        const toStore: User = { ...createdUser, password: user.password } as User;
        this._users.update((u) => [...u, toStore]);
        return { success: true, status: 201, data: createdUser };
      }),
      catchError((error) =>
        throwError(() => ({
          success: false,
          status: error.status,
          error: error.error?.detail || 'Erro ao criar usuário',
        })),
      ),
    );
  }

  // --- REFRESH USERS LIST ---
  refresh(): void {
    this.http.get<User[]>(`${environment.apiUrl}/users`).subscribe((data) => this._users.set(data));
  }

  // --- GET BY ID ---
  fetchUserById(id: number): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  }

  search_by_id(id: number): Observable<OperationResult> {
    return this.fetchUserById(id).pipe(
      map((user) => ({
        success: true,
        status: 200,
        data: user,
      })),
      catchError(() =>
        of({
          success: false,
          status: 404,
          error: `Usuário com ID ${id} não encontrado`,
        }),
      ),
    );
  }

  getUserById(id: number): Signal<User | undefined> {
    return computed(() => this._users().find((u) => u.id === id));
  }

  // --- UPDATE ---
  update(user: Partial<User> & { id: number }): Observable<OperationResult> {
    return this.http.patch<User>(`${environment.apiUrl}/users/${user.id}`, user).pipe(
      map((updatedUser) => {
        this._users.update((users) =>
          users.map((u) => {
            if (u.id !== updatedUser.id) return u;
            // preserve password from local store if backend didn't return it
            const merged: User = {
              ...u,
              ...updatedUser,
              password: updatedUser.password ?? u.password,
            } as User;
            return merged;
          }),
        );
        return { success: true, status: 200, data: updatedUser };
      }),
      catchError((error) =>
        throwError(() => ({
          success: false,
          status: error.status,
          error: error.error?.detail || 'Erro ao atualizar usuário',
        })),
      ),
    );
  }

  // --- DELETE ---
  remove(id: number): Observable<OperationResult> {
    return this.http.delete<any>(`${environment.apiUrl}/users/${id}`).pipe(
      map(() => {
        this._users.update((users) => users.filter((u) => u.id !== id));
        // backend responds with 204 No Content on success
        return { success: true, status: 204 };
      }),
      catchError((error) =>
        throwError(() => ({
          success: false,
          status: error.status,
          error: error.error?.detail || 'Erro ao remover usuário',
        })),
      ),
    );
  }
}
