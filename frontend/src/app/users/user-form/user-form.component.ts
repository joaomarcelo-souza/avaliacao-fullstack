import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { AbstractUserService } from '../services/abstract-user.service';
import { User } from '../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserForm implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(AbstractUserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  userForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  currentUserId: number | null = null;
  currentUser: User | null = null;

  constructor() {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      matricula: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      password: [
        '',
        [Validators.minLength(6), Validators.maxLength(6), Validators.pattern(/^[A-Za-z0-9]{6}$/)],
      ],
      confirmPassword: [''],
    });

    // Cross-field validator ensures passwords match; in create mode passwords are required and must match,
    // in edit mode validation only applies if a password is provided.
    this.userForm.setValidators(this.passwordsMatchValidator.bind(this));
  }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.isEditMode = true;
      this.currentUserId = +userId;
      this.loadUser(this.currentUserId);
    }

    // ensure validators that depend on isEditMode evaluate correctly
    this.userForm.updateValueAndValidity();
  }

  private loadUser(id: number): void {
    this.userService.fetchUserById(id).subscribe({
      next: (user) => {
        this.currentUser = user;
        this.userForm.patchValue({
          name: user.name,
          email: user.email,
          matricula: user.matricula,
        });
        // keep password fields empty when editing
        this.userForm.patchValue({ password: '', confirmPassword: '' });
      },
      error: () => {
        alert('Usuário não encontrado');
        this.router.navigate(['/users']);
      },
    });
  }

  private passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const group = control as FormGroup;
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;

    if (!this.isEditMode) {
      // create mode: password and confirm required and must match
      if (!pass || !confirm) return { passwordMismatch: true };
      return pass === confirm ? null : { passwordMismatch: true };
    }

    // edit mode: only validate when a password is provided
    if (!pass && !confirm) return null;
    return pass === confirm ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    this.isLoading = true;
    const v = this.userForm.value;

    if (this.isEditMode && this.currentUser) {
      const payload: Partial<User> & { id: number } = {
        id: this.currentUser.id,
        ...(v.name ? { name: v.name } : {}),
        ...(v.email ? { email: v.email } : {}),
        ...(v.matricula ? { matricula: v.matricula } : {}),
        ...(v.password ? { password: v.password } : {}),
      };

      this.userService.update(payload).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success) {
            alert('Usuário atualizado com sucesso');
            this.userService.refresh();
            this.router.navigate(['/users']);
          } else {
            alert(res.error || 'Erro ao atualizar usuário');
          }
        },
        error: () => {
          this.isLoading = false;
          alert('Erro ao atualizar usuário');
        },
      });
    } else {
      // in create mode both password and confirmPassword must be provided and valid (group validator guarantees matching)
      if (!v.password || !v.confirmPassword) {
        this.isLoading = false;
        alert('Senha e confirmação são obrigatórias');
        return;
      }

      const payload: Omit<User, 'id'> = {
        name: v.name,
        email: v.email,
        matricula: v.matricula,
        password: v.password,
      } as Omit<User, 'id'>;

      this.userService.add(payload).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success) {
            alert('Usuário cadastrado com sucesso');
            this.userForm.reset();
            this.userService.refresh();
            this.router.navigate(['/users']);
          } else {
            alert(res.error || 'Erro ao criar usuário');
          }
        },
        error: () => {
          this.isLoading = false;
          alert('Erro ao criar usuário');
        },
      });
    }
  }
}
