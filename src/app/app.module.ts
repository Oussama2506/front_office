import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastComponent } from './components/toast/toast.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { PressStripComponent } from './components/press-strip/press-strip.component';
import { FeaturesComponent } from './components/features/features.component';
import { RecipesComponent } from './components/recipes/recipes.component';
import { MealPlansComponent } from './components/meal-plans/meal-plans.component';
import { CalculatorComponent } from './components/calculator/calculator.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { BlogComponent } from './components/blog/blog.component';
import { NewsletterComponent } from './components/newsletter/newsletter.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    ToastComponent,
    NavbarComponent,
    HeroComponent,
    PressStripComponent,
    FeaturesComponent,
    RecipesComponent,
    MealPlansComponent,
    CalculatorComponent,
    TestimonialsComponent,
    BlogComponent,
    NewsletterComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
