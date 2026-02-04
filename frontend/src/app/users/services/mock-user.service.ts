import { computed, Injectable, Signal, signal } from '@angular/core';
import { AbstractUserService } from './abstract-user.service';
import { User } from '../models/user.model';
import { OperationResult } from '../../models/operation-result.model';
import { Observable, of, throwError } from 'rxjs';

@Injectable()
export class MockUserService extends AbstractUserService {
  constructor() {
    super();
  }

  private _users = signal<User[]>([
    {
      id: 101,
      name: 'Robert',
      email: 'robert@gmail.com',
      matricula: '123456',
      password: 'Abc456',
    },
    {
      id: 102,
      name: 'Jose',
      email: 'jose@gmail.com',
      matricula: '123457',
      password: 'Abc456',
    },
    {
      id: 103,
      name: 'Renata',
      email: 'renata@gmail.com',
      matricula: '123458',
      password: 'Abc456',
    },
  ]);

  users = computed(() => this._users());

  refresh(): void {
    setTimeout(() => {
      this._users.set([...this._users()]);
    }, 1000);
  }

  add(user: Omit<User, 'id'>): Observable<OperationResult> {
    const newUser: User = {
      ...user,
      id: Math.max(0, ...this._users().map((u) => u.id)) + 1,
    };

    this._users.update((users) => [...users, newUser]);
    return of({ success: true, status: 201, data: newUser });
  }

  remove(id: number): Observable<OperationResult> {
    const userExists = this._users().some((u) => u.id === id);

    if (!userExists) {
      return of({
        success: false,
        status: 404,
        error: `Usuário com ID ${id} não encontrado`,
      });
    }

    this._users.update((users) => users.filter((u) => u.id !== id));

    // Simula 204 No Content do backend
    return of({
      success: true,
      status: 204,
    });
  }

  update(user: Partial<User> & { id: number }): Observable<OperationResult> {
    const existingUser = this._users().find((u) => u.id === user.id);

    if (!existingUser) {
      return of({
        success: false,
        status: 404,
        error: `Usuário com ID ${user.id} não encontrado`,
      });
    }

    const merged = { ...existingUser, ...user } as User;

    this._users.update((users) => users.map((u) => (u.id === merged.id ? merged : u)));

    return of({
      success: true,
      status: 200,
      data: merged,
    });
  }

  search_by_id(id: number): Observable<OperationResult> {
    const user = this._users().find((u) => u.id === id);

    if (!user) {
      return of({
        success: false,
        status: 404,
        error: `Usuário com ID ${id} não encontrado`,
      });
    }

    return of({
      success: true,
      status: 200,
    });
  }

  fetchUserById(id: number): Observable<User> {
    const user = this._users().find((u) => u.id === id);
    if (!user)
      return throwError(() => ({
        status: 404,
        error: `Usuário com ID ${id} não encontrado`,
      }));
    return of(user);
  }

  fetchAll(): void {
    this._users.set([...this._users()]);
  }

  getUserById(id: number): Signal<User | undefined> {
    return computed(() => this._users().find((u) => u.id === id));
  }
}
