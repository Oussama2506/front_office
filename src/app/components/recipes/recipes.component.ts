import { Component } from '@angular/core';
import { NutritionDataService } from '../../shared/services/nutrition-data.service';
import { ToastService } from '../../shared/services/toast.service';
import { Recipe } from '../../shared/models/nutrition.models';

interface FilterTab { label: string; value: string; }

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent {
  activeFilter = 'all';
  filteredRecipes: Recipe[] = [];

  filters: FilterTab[] = [
    { label: 'All',           value: 'all'       },
    { label: 'Breakfast',     value: 'breakfast'  },
    { label: 'Lunch',         value: 'lunch'      },
    { label: 'Dinner',        value: 'dinner'     },
    { label: 'Snacks',        value: 'snacks'     },
    { label: 'Vegan',         value: 'vegan'      },
    { label: 'Quick (≤15min)', value: 'quick'    },
  ];

  constructor(
    private data: NutritionDataService,
    public toastService: ToastService
  ) {
    this.filteredRecipes = this.data.recipes;
  }

  setFilter(value: string): void {
    this.activeFilter = value;
    this.filteredRecipes = this.data.getRecipesByCategory(value);
    const label = this.filters.find(f => f.value === value)?.label;
    this.toastService.show(`🍽️ Showing: ${label}`);
  }

  openRecipe(recipe: Recipe): void {
    this.toastService.show(`📖 Opening: ${recipe.title}`);
  }
}