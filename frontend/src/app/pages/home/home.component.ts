import { Component } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { DatePipe } from '@angular/common';
import { computed, signal } from '@angular/core';
import { TopBar } from '../../components/top-bar/top-bar.component';

@Component({
  selector: 'app-home',
  imports: [TopBar],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class Home {
  today = signal(new Date());

  formattedDate = computed(() => {
    const date = new DatePipe('pt-BR').transform(this.today(), 'dd, MMMM yyyy');

    return date ? new TitleCasePipe().transform(date) : '';
  });
}
