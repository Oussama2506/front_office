import { Component } from '@angular/core';
import { NutritionDataService } from '../../shared/services/nutrition-data.service';
import { ToastService } from '../../shared/services/toast.service';
import { MealPlanDay } from '../../shared/models/nutrition.models';

@Component({
  selector: 'app-meal-plans',
  templateUrl: './meal-plans.component.html',
  styleUrls: ['./meal-plans.component.scss']
})
export class MealPlansComponent {
  days: MealPlanDay[];
  planFeatures = [
    '7-day meal plans for every dietary style',
    'Complete grocery list, organized by aisle',
    'Meal prep guide to save hours each week',
    'Calorie & macro targets built in',
    'New plans added every Monday',
  ];

  constructor(private data: NutritionDataService, public toastService: ToastService) {
    this.days = this.data.mealPlanDays;
  }

  startPlan(): void    { this.toastService.show('📋 Meal plan quiz starting…'); }
  viewFullWeek(): void { this.toastService.show('📅 Full 7-day plan loading…'); }
}