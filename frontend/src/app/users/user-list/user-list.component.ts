import { Component, inject } from '@angular/core';
import { UserCard } from '../user-card/user-card.component';
import { User } from '../models/user.model';
import { AbstractUserService } from '../services/abstract-user.service';

@Component({
  selector: 'app-user-list',
  imports: [UserCard],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserList {
  private userService = inject(AbstractUserService);

  users = this.userService.users;

  trackById = (index: number, user: User) => user.id;

  ngOnInit(): void {
    this.userService.refresh();
  }
}
