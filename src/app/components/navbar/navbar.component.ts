import { Component, OnInit, HostListener } from '@angular/core';
import { ToastService } from '../../shared/services/toast.service';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss',
  ]
})
export class NavbarComponent {
  menuOpen = false;
  scrolled = false;
  modalOpen = false;
  modalName = '';
  modalEmail = '';

  navLinks = [
    { label: 'Recipes',    anchor: 'recipes'    },
    { label: 'Meal Plans', anchor: 'mealplans'  },
    { label: 'Articles',   anchor: 'blog'       },
    { label: 'Calculator', anchor: 'calculator' },
    { label: 'Dossier',    route: '/dossier'    },
    { label: 'About',      anchor: 'about'      },
    
  ];

  constructor(public toastService: ToastService) {}

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled = window.scrollY > 40;
  }

  toggleMenu(): void  { this.menuOpen = !this.menuOpen; }
  closeMenu(): void   { this.menuOpen = false; }
  openModal(): void   { this.modalOpen = true; }
  closeModal(): void  { this.modalOpen = false; }

  scrollTo(anchor: string): void {
    this.closeMenu();
    document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
  }

  handleSignup(): void {
    if (!this.modalName.trim() || !this.modalEmail.trim()) {
      this.toastService.show('⚠️ Please enter your name and email');
      return;
    }
    this.closeModal();
    this.toastService.show(`🎉 Welcome, ${this.modalName}! Your kit is on its way!`);
    this.modalName = '';
    this.modalEmail = '';
  }
}