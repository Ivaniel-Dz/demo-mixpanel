## Tecnologías usadas en el Proyecto
- Angular v19
- Ionic Framework v8
- Capacitor v7

## Mixpanel: SDK Javascript

```bash
npm install --save mixpanel-browser
```

### Nota
No se recomienda registrar biometrías en Mixpanel. Según la guía de privacidad, los datos de alto riesgo como identificadores gubernamentales, datos de pago y secretos de autenticación deben evitarse por completo ("Do Not Track"). Las biometrías entran en esta categoría de datos altamente sensibles.

**Mixpanel recomienda en cambio:**
- Usar IDs internos no identificables (como user_id)
- Aplicar minimización de datos: solo recopilar lo que impulsa decisiones de producto

Ningún SDK de cliente está diseñado ni recomendado para enviar datos biométricos a Mixpanel.

**Referencias:**
- [Guía de Privacidad y PII](https://docs.mixpanel.com/guides/guides-by-workflow/data-privacy)
- [Protección de datos de usuario](https://docs.mixpanel.com/docs/privacy/protecting-user-data)

### Tabla de eventos del Demo
| #  | Componente / funcionalidad | Evento Mixpanel          | Cuándo se dispara                  | Propiedades principales                     |
| -- | -------------------------- | ------------------------ | ---------------------------------- | ------------------------------------------- |
| 1  | **Login**                  | `Login Started`          | Usuario inicia el proceso de login | `method`                                    |
| 2  | **Login**                  | `Login Completed`        | Login exitoso                      | `method`, `user_id`                         |
| 3  | **Login**                  | `Login Failed`           | Login rechazado                    | `method`, `error_type`                      |
| 4  | **Explorar comidas**       | `Category Selected`      | Usuario selecciona una categoría   | `category`                                  |
| 5  | **Explorar comidas**       | `Food Viewed`            | Usuario abre/detalla una comida    | `food_id`, `food_name`, `category`          |
| 6  | **Búsqueda**               | `Food Searched`          | Usuario realiza una búsqueda       | `search_term`                               |
| 7  | **Búsqueda**               | `Search Filter Applied`  | Usuario aplica filtro              | `filter_type`, `filter_value`               |
| 8  | **Carrito**                | `Product Added`          | Agrega comida al carrito           | `food_id`, `food_name`, `price`, `quantity` |
| 9  | **Carrito**                | `Product Removed`        | Elimina comida del carrito         | `food_id`, `food_name`, `price`             |
| 10 | **Carrito**                | `Cart Viewed`            | Abre el carrito                    | `item_count`, `cart_value`                  |
| 11 | **Checkout**               | `Checkout Started`       | Comienza checkout                  | `item_count`, `cart_value`                  |
| 12 | **Checkout**               | `Checkout Completed`     | Finaliza checkout                  | `item_count`, `total_value`                 |
| 13 | **Dirección**              | `Delivery Address Added` | Guarda/confirma dirección          | `city`, `country`                           |
| 14 | **Historial**              | `Order Viewed`           | Abre un pedido del historial       | `order_id`, `order_status`                  |
| 15 | **Usuario**                | `Profile Updated`        | Modifica información del perfil    | `updated_fields`                            |
