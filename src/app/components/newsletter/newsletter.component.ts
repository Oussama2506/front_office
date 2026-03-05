import { Component } from '@angular/core';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.scss']
})
export class NewsletterComponent {
  name  = '';
  email = '';

  constructor(public toastService: ToastService) {}

  subscribe(): void {
    if (!this.name.trim() || !this.email.trim()) {
      this.toastService.show('⚠️ Please enter your name and email');
      return;
    }
    this.toastService.show(`🎉 Welcome, ${this.name}! Check your inbox for your free kit!`);
    this.name = '';
    this.email = '';
  }
}