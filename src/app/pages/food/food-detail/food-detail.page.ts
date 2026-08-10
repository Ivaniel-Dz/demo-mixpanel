import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
// prettier-ignore
import {
  IonButton,
  IonContent,
  IonIcon,
  IonItemDivider,
} from '@ionic/angular/standalone';

import { Food } from '../../../interfaces/food';
import { AnalyticsService } from '../../../services/analytic.service';
import { CartService } from '../../../services/cart.service';
import { FoodService } from '../../../services/food.service';

@Component({
  selector: 'app-food-detail',
  templateUrl: './food-detail.page.html',
  styleUrls: ['./food-detail.page.scss'],
  standalone: true,
  imports: [IonItemDivider, IonIcon, IonButton, IonContent, CommonModule],
})
export class FoodDetailPage implements OnInit {
  // Inyección de dependencias
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private foodService = inject(FoodService);
  private cartService = inject(CartService);
  private navCtrl = inject(NavController);
  private analyticsService = inject(AnalyticsService);

  // Variables
  foodId!: number;
  foodData: Food | undefined;
  isFavorite = false;
  quantity = 1;

  // Se ejecuta al inicio del componente
  ngOnInit(): void {
    this.foodId = Number(this.route.snapshot.paramMap.get('id'));

    this.loadFoodDetails();
  }

  // Detalles de la comida
  async loadFoodDetails(): Promise<void> {
    this.foodData = await this.foodService.getFoodById(this.foodId);

    if (!this.foodData) {
      // Si no se encuentra, navegar de regreso
      (document.activeElement as HTMLElement)?.blur();
      this.router.navigate(['/tabs/home']);
      return;
    }

    // Evento 5: Food Viewed
    this.analyticsService.track('Food Viewed', {
      food_id: this.foodData.id,
      food_name: this.foodData.name,
      category_id: this.foodData.categoryId,
      price: this.foodData.price,
    });
  }

  // Regresar
  goBack(): void {
    this.navCtrl.back();
  }

  // Favorito
  toggleFavorite(): void {
    this.isFavorite = !this.isFavorite;
  }

  // Incrementar cantidad
  incrementQuantity(): void {
    this.quantity++;
  }

  // Quitar cantidad
  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  // Agregar producto al carrito
  addCartItem(): void {
    if (this.foodData) {
      this.cartService.addToCart({
        id: this.foodData.id,
        name: this.foodData.name,
        price: this.foodData.price,
        quantity: this.quantity,
        image: this.foodData.image,
      });
    }

    // Show toast or notification
    console.log(
      'Added to cart:',
      this.foodData?.name,
      'Quantity:',
      this.quantity,
    );

    // Redirige al carrito
    (document.activeElement as HTMLElement)?.blur();
    this.router.navigate(['/tabs/cart']);
  }

  // Método para cargar las imágenes alternativas
  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = '/assets/placeholder/foods.webp';
  }
}
