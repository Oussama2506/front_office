import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  showPassword = false;
  showConfirmPassword = false;
  loading = false;
  agreeTerms = false;

  constructor(
    private router: Router,
    private toastService: ToastService
  ) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  get passwordsMatch(): boolean {
    return this.password === this.confirmPassword;
  }

  get passwordStrength(): { label: string; color: string; width: number } {
    if (!this.password) return { label: '', color: '', width: 0 };
    const len = this.password.length;
    const hasUpper = /[A-Z]/.test(this.password);
    const hasLower = /[a-z]/.test(this.password);
    const hasNum = /[0-9]/.test(this.password);
    const hasSpecial = /[^A-Za-z0-9]/.test(this.password);
    let score = 0;
    if (len >= 8) score++;
    if (len >= 12) score++;
    if (hasUpper && hasLower) score++;
    if (hasNum) score++;
    if (hasSpecial) score++;

    if (score <= 1) return { label: 'Weak', color: '#c96a3f', width: 20 };
    if (score <= 2) return { label: 'Fair', color: '#e88f68', width: 40 };
    if (score <= 3) return { label: 'Good', color: '#a8c5ac', width: 65 };
    if (score <= 4) return { label: 'Strong', color: '#7a9e7e', width: 85 };
    return { label: 'Excellent', color: '#5c7d60', width: 100 };
  }

  signup(): void {
    if (!this.firstName || !this.lastName || !this.email || !this.password || !this.confirmPassword) {
      this.toastService.show('⚠️ Please fill in all fields');
      return;
    }
    if (!this.passwordsMatch) {
      this.toastService.show('⚠️ Passwords do not match');
      return;
    }
    if (this.password.length < 8) {
      this.toastService.show('⚠️ Password must be at least 8 characters');
      return;
    }
    if (!this.agreeTerms) {
      this.toastService.show('⚠️ Please agree to the terms');
      return;
    }

    this.loading = true;
    // TODO: Replace with real auth service call
    setTimeout(() => {
      this.toastService.show('✅ Account created! Please sign in.');
      this.loading = false;
      this.router.navigate(['/login']);
    }, 1200);
  }

  signupWithGoogle(): void {
    this.toastService.show('🔗 Google Sign-Up — coming soon');
    // TODO: Implement Google OAuth
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}