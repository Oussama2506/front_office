import { Component, OnInit } from '@angular/core';
import { ToastService, ToastState } from '../../shared/services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {
  toast: ToastState = { message: '', visible: false };

  constructor(public toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.toast$.subscribe(state => {
      this.toast = state;
    });
  }
}