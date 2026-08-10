import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, WritableSignal, } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonList, IonThumbnail } from '@ionic/angular/standalone';
import { HeaderComponent } from '../../../components/header/header.component';
import { Category } from '../../../interfaces/category';
import { AnalyticsService } from '../../../services/analytic.service';
import { FoodService } from '../../../services/food.service';

@Component({
  selector: 'app-food-category',
  templateUrl: './food-category.page.html',
  styleUrls: ['./food-category.page.scss'],
  standalone: true,
  imports: [IonList, IonContent, IonThumbnail, CommonModule, HeaderComponent],
})
export class FoodCategoryPage implements OnInit {
  // Inyección de Dependencias
  private foodService = inject(FoodService);
  private router = inject(Router);
  private analyticsService = inject(AnalyticsService);

  // Variables
  categories: WritableSignal<Category[]> = signal([]);
  title = 'Categorías';

  ngOnInit(): void {
    this.loadCategories();
  }

  // Cargar todas las categorías
  loadCategories(): void {
    this.foodService.getCategories().then((res) => this.categories.set(res));
  }

  // Ir a las comidas por categoría
  goToFoodCategory(categoryId: number): void {
    const category = this.categories().find((item) => item.id === categoryId);

    // Evento 4: Category Selected
    this.analyticsService.track('Category Selected', {
      category_id: categoryId,
      category_name: category?.name,
    });

    (document.activeElement as HTMLElement)?.blur();

    this.router.navigate(['/tabs/food', categoryId]);
  }

  // Método para cargar las imágenes alternativas
  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = '/assets/placeholder/foods.webp';
  }

  goBack(): void {
    (document.activeElement as HTMLElement)?.blur();
    this.router.navigate(['/tabs/home']);
  }
}
