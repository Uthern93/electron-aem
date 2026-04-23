import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';
import { PouchdbService } from 'src/app/services/pouchdb.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private notify: NotificationService,
    private pouch: PouchdbService,
  ) {}

  message: string = '';
  messageType: 'success' | 'error' | '' = '';
  isLoading = false;

  ngOnInit(): void {
  }

  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  async onSubmit() {
    this.isLoading = true;

    if (!this.loginForm.valid) {
      this.isLoading = false;
      this.notify.show(
        'error',
        'Please fill in all required fields correctly.',
      );
      return;
    }

    const { username, password } = this.loginForm.value;

    this.auth.login({ username, password }).subscribe({
      next: async (token) => {
        this.isLoading = false;

        localStorage.setItem('auth_token', token);

        await this.pouch.saveUser({ username, password });

        this.notify.show('success', 'Login successful!');
        this.router.navigate(['/dashboard']);
      },

      error: async (err) => {
        console.error(err);
        const user = await this.pouch.getUser(username!);

        if (user && user.password === password) {
          localStorage.setItem('auth_token', 'offline-token');

          this.notify.show('success', 'Offline login successful!');
          this.router.navigate(['/dashboard']);
        } else {
          this.notify.show(
            'error',
            'Login failed. Invalid credentials.',
          );
        }

        this.isLoading = false;
      },
    });
  }
}
