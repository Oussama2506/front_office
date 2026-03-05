import { Component } from '@angular/core';
import { NutritionDataService } from '../../shared/services/nutrition-data.service';
import { Feature } from '../../shared/models/nutrition.models';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent {
  features: Feature[];
  constructor(private data: NutritionDataService) {
    this.features = this.data.features;
  }
}