import { Component } from '@angular/core';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  socials = [
    { icon: '📸', msg: '📸 Opening Instagram…'  },
    { icon: '▶️', msg: '▶️ Opening YouTube…'    },
    { icon: '📌', msg: '📌 Opening Pinterest…'  },
    { icon: '🐦', msg: '🐦 Opening Twitter…'    },
  ];

  columns = [
    { heading: 'Explore',  links: ['All Recipes', 'Meal Plans', 'Nutrition Articles', 'Podcast', 'Video Tutorials'] },
    { heading: 'Goals',    links: ['Weight Loss', 'Muscle Building', 'Heart Health', 'Diabetes-Friendly', 'Plant-Based'] },
    { heading: 'Company',  links: ['About Us', 'Our Dietitians', 'Work With Us', 'Press Kit', 'Contact'] },
  ];

  constructor(public toastService: ToastService) {}

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}