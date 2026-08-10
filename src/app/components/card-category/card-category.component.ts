import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IonList, IonThumbnail } from '@ionic/angular/standalone';

import { Category } from '../../interfaces/category';
import { AnalyticsService } from '../../services/analytic.service';

@Component({
  selector: 'app-card-category',
  templateUrl: './card-category.component.html',
  styleUrls: ['./card-category.component.scss'],
  imports: [IonList, IonThumbnail, CommonModule],
})
export class CardCategoryComponent {
  // Inyección de Dependencias
  private router = inject(Router);
  private analyticsService = inject(AnalyticsService);

  // Variables
  @Input() category!: Category;

  // Ir a las comidas por categoría
  goToFoodCategory(categoryId: number): void {
    // Evento 4: Category Selected
    this.analyticsService.track('Category Selected', {
      category_id: this.category.id,
      category_name: this.category.name,
    });

    (document.activeElement as HTMLElement)?.blur();

    this.router.navigate(['/tabs/food', categoryId]);
  }

  // Método para cargar las imágenes alternativas
  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = '/assets/placeholder/foods.webp';
  }
}
