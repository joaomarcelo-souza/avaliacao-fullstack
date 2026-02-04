import { Component } from '@angular/core';
import { UserForm } from '../../users/user-form/user-form.component';

@Component({
  selector: 'app-register',
  imports: [UserForm],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class Register {}
