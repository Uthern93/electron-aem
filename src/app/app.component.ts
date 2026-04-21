import { Component } from '@angular/core';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'angular-aem';
  message: string | null = null;
  type: 'success' | 'error' | '' = '';

  constructor(private notify: NotificationService) {
    this.notify.message$.subscribe((msg) => {
      this.message = msg;
    });

    this.notify.type$.subscribe((type) => {
      this.type = type;
    });
  }
}
