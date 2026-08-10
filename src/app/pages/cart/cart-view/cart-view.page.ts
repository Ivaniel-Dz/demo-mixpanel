import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IonButton, IonContent, IonHeader, IonIcon, IonList, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { CartItem } from '../../../interfaces/cart-item';
import { CartService } from '../../../services/cart.service';
import { AnalyticsService } from '../../../services/analytic.service';

@Component({
  selector: 'app-cart-view',
  templateUrl: './cart-view.page.html',
  styleUrls: ['./cart-view.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonList, IonContent, IonTitle, IonToolbar, IonHeader, CommonModule, RouterModule,
  ],
})
export class CartViewPage implements OnInit {
  // Inyección del servicio
  private cartService = inject(CartService);
  private router = inject(Router);
  private analyticsService = inject(AnalyticsService);
  // Variables
  cartItems: CartItem[] = [];
  subtotal = 0;
  deliveryFee = 2.99;
  total = 0;

  ngOnInit() {
    this.loadCartItems();
    //Evento 10: Cart Viewed 
    this.analyticsService.track('Cart Viewed');
  }

  // Carga los items del carrito
  loadCartItems() {
    this.cartService.getCartItems().subscribe((items) => {
      this.cartItems = items;
      console.log(this.cartItems);
      this.calculateTotals();
    });
  }

  // Calcula el total
  calculateTotals() {
    this.subtotal = this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    this.total = this.subtotal + this.deliveryFee;
  }

  // Incrementa la cantidad de item
  incrementQuantity(itemId: number) {
    const item = this.cartItems.find((i) => i.id === itemId);
    if (item) {
      this.cartService.updateQuantity(itemId, item.quantity + 1);
    }
  }

  // decremento la cantidad de item
  decrementQuantity(itemId: number) {
    const item = this.cartItems.find((i) => i.id === itemId);
    if (item && item.quantity > 1) {
      this.cartService.updateQuantity(itemId, item.quantity - 1);
    }
  }

  // Quitar item del carrito
  removeItem(itemId: number): void {
    const item = this.cartItems.find((cartItem) => cartItem.id === itemId);

    if (!item) {
      return;
    }

    this.cartService.removeItem(itemId);

    // Evento 9: Product Removed
    this.analyticsService.track('Product Removed', {
      food_id: item.id,
      food_name: item.name,
      price: item.price,
      quantity: item.quantity,
    });
  }

  // Probar el carrito
  checkout() {
    (document.activeElement as HTMLElement)?.blur();
    this.router.navigate(['/tabs/cart/checkout']);
  }

  // Método para carga los imágenes alternativas
  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = '/assets/placeholder/foods.webp';
  }
}
