# Super-Shop-Management API Documentation

---

## Table of Contents
- [Features](#features)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [Products](#products)
  - [Stores](#stores)
  - [Ping](#ping)
- [Contributing](#contributing)

---

## Features
- User authentication and authorization
- Product management (CRUD operations)
- Shopping cart functionality
- Order processing
- Admin dashboard for analytics

---

## API Documentation

### Authentication
#### 1. Register
- **Endpoint:** `POST /api/auth/register`
- **Description:** Registers a new store owner.

#### 2. Login
- **Endpoint:** `POST /api/auth/login`
- **Description:** Logs in a store owner and returns an authentication token.

#### 3. Logout
- **Endpoint:** `POST /api/auth/logout`
- **Description:** Logs out a store owner by invalidating the authentication token.

---

### Products
#### 1. Get All Products
- **Endpoint:** `GET /api/products`
- **Description:** Retrieves a list of all products.

#### 2. Get Products by Store
- **Endpoint:** `GET /api/products/store/{storeId}`
- **Description:** Retrieves products associated with a specific store.

#### 3. Get Product by ID
- **Endpoint:** `GET /api/products/{id}`
- **Description:** Retrieves a specific product by its ID.

#### 4. Create Product
- **Endpoint:** `POST /api/products`
- **Description:** Creates a new product.

#### 5. Delete Product
- **Endpoint:** `DELETE /api/products/{id}`
- **Description:** Deletes a specific product by its ID.

---

### Stores
#### 1. Get All Stores
- **Endpoint:** `GET /api/stores`
- **Description:** Retrieves a paginated list of all stores.

#### 2. Create Store
- **Endpoint:** `POST /api/stores`
- **Description:** Creates a new store.

#### 3. Get Store Stats
- **Endpoint:** `GET /api/stores/{storeId}/stats`
- **Description:** Retrieves statistics for a specific store.

#### 4. Get Store Analytics
- **Endpoint:** `GET /api/stores/{storeId}/analytics`
- **Description:** Retrieves analytics for a specific store.

#### 5. Get Store Sales Analytics
- **Endpoint:** `GET /api/stores/{storeId}/analytics/sales`
- **Description:** Retrieves sales analytics for a specific store.

#### 6. Get Store Customers Analytics
- **Endpoint:** `GET /api/stores/{storeId}/analytics/customers`
- **Description:** Retrieves customer analytics for a specific store.

#### 7. Get Store Products Analytics
- **Endpoint:** `GET /api/stores/{storeId}/analytics/products`
- **Description:** Retrieves product analytics for a specific store.

#### 8. Get Store Inventory Analytics
- **Endpoint:** `GET /api/stores/{storeId}/analytics/inventory`
- **Description:** Retrieves inventory analytics for a specific store.

#### 9. Get Store Reviews Analytics
- **Endpoint:** `GET /api/stores/{storeId}/analytics/reviews`
- **Description:** Retrieves review analytics for a specific store.

---

### Ping
#### 1. Ping Service
- **Endpoint:** `GET /api/ping`
- **Description:** Checks the status of the service and database connection.

---

## Contributing
Feel free to submit issues or pull requests to improve the project. Contributions are welcome!

---

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.