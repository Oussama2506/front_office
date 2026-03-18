import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = false;
  loading = false;

  constructor(
    private router: Router,
    private toastService: ToastService
  ) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    if (!this.email || !this.password) {
      this.toastService.show('⚠️ Please fill in all fields');
      return;
    }

    this.loading = true;
    // TODO: Replace with real auth service call
    setTimeout(() => {
      this.toastService.show('✅ Welcome back!');
      this.loading = false;
      this.router.navigate(['/dossier']);
    }, 1000);
  }

  loginWithGoogle(): void {
    this.toastService.show('🔗 Google Sign-In — coming soon');
    // TODO: Implement Google OAuth
  }

  goToSignup(): void {
    this.router.navigate(['/signup']);
  }
}