import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { AbstractUserService } from '../services/abstract-user.service';

@Component({
  selector: 'app-user-card',
  imports: [],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
})
export class UserCard {
  @Input() user!: User;

  private userService = inject(AbstractUserService);
  private router = inject(Router);

  editUser(): void {
    this.router.navigate(['/update-user', this.user.id]);
  }

  deleteUser(): void {
    if (!confirm(`Confirma remoção do usuário ${this.user.name}?`)) return;

    this.userService.remove(this.user.id).subscribe({
      next: (res) => {
        if (!res.success) {
          alert(res.error ?? 'Erro ao remover usuário');
        }
      },
      error: () => alert('Erro ao remover usuário'),
    });
  }
}
