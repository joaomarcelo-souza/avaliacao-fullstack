import { Component } from '@angular/core';
import { UserList } from '../../users/user-list/user-list.component';

@Component({
  selector: 'app-users',
  imports: [UserList],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class Users {}
