import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  navItems: NavItem[] = [
    { label: 'Dashboard',  icon: '📊', route: '/admin/dashboard'  },
    { label: 'Clients',    icon: '👥', route: '/admin/clients',    badge: 3 },
    { label: 'Meal Plans', icon: '📋', route: '/admin/meal-plans'  },
    { label: 'Schedule',   icon: '📅', route: '/admin/schedule',   badge: 2 },
    { label: 'Reports',    icon: '📈', route: '/admin/reports'     },
    { label: 'Settings',   icon: '⚙️', route: '/admin/settings'    },
  ];

  constructor(public router: Router) {}

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}