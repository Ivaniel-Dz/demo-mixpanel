import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// prettier-ignore
import { IonButton, IonContent, IonHeader, IonInfiniteScroll, IonList, IonSearchbar, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Food } from '../../interfaces/food';
import { AnalyticsService } from '../../services/analytic.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  // prettier-ignore
  imports: [IonSearchbar, IonList, IonInfiniteScroll, IonButton, IonContent, IonTitle, IonToolbar, IonHeader, CommonModule, FormsModule],
})
export class SearchPage {
  // Inyección de dependencias
  private router = inject(Router);
  private searchService = inject(SearchService);
  private analyticsService = inject(AnalyticsService);

  // Variables
  searchQuery = '';
  activeFilter = 'all';
  searchResults: Food[] = [];

  filters = [
    { id: 'all', name: 'Todos' },
    { id: '1', name: 'Hamburguesas' },
    { id: '2', name: 'Pizzas' },
    { id: '3', name: 'Tacos' },
    { id: '4', name: 'Ensaladas' },
    { id: '5', name: 'Postres' },
    { id: '6', name: 'Bebidas' },
  ];

  // Ejecuta la búsqueda mientras el usuario escribe
  async onSearch(event: any): Promise<void> {
    this.searchQuery = event.target.value;
    await this.performSearch();
  }

  // Registra la búsqueda confirmada
  onSearchConfirmed(event: any): void {
    const query = event.detail.value?.trim();

    if (!query) {
      return;
    }

    // Evento 6: Food Searched
    this.analyticsService.track('Food Searched', {
      search_term: query,
    });
  }

  // Limpiar búsqueda
  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults = [];
  }

  // Aplicar filtro
  async setFilter(filterId: string): Promise<void> {
    this.activeFilter = filterId;

    // Evento 7: Search Filter Applied
    const selectedFilter = this.filters.find(
      (filter) => filter.id === filterId,
    );

    this.analyticsService.track('Search Filter Applied', {
      filter_type: 'category',
      filter_id: filterId,
      filter_name: selectedFilter?.name,
    });

    if (this.searchQuery.trim() !== '') {
      await this.performSearch();
    }
  }

  // Ejecutar búsqueda
  async performSearch(): Promise<void> {
    const query = this.searchQuery.trim();

    if (query === '') {
      this.searchResults = [];
      return;
    }

    const results = await this.searchService.searchFoods(query);

    if (this.activeFilter === 'all') {
      this.searchResults = results;
    } else {
      this.searchResults = results.filter(
        (item) =>
          item.categoryId.toString() === this.activeFilter,
      );
    }
  }

  // Redirige a detalles
  goToFoodDetail(id: number): void {
    (document.activeElement as HTMLElement)?.blur();

    this.router.navigate(['/tabs/food/detail', id]);
  }

  // Método para cargar las imágenes alternativas
  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src =
      '/assets/placeholder/foods.webp';
  }
}
