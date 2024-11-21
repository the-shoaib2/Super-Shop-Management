# Super-Shop-Management API Documentation

## Table of Contents
- [Authentication](#authentication)
- [Products](#products)
- [Orders](#orders)

---

## Authentication
### Login
- **Endpoint:** `POST /api/auth/login`
  - **Request:** 
    ```json
    { "username": "user", "password": "pass" }
    ```
  - **Response:** 
    ```json
    { "token": "jwt_token" }
    ```
  - **Description:** Authenticates a user and returns a JWT token for subsequent requests.

### Register
- **Endpoint:** `POST /api/auth/register`
  - **Request:** 
    ```json
    { "username": "user", "password": "pass", "email": "user@example.com" }
    ```
  - **Response:** 
    ```json
    { "message": "User registered successfully" }
    ```
  - **Description:** Registers a new user in the system.

---

## Products
### Get All Products
- **Endpoint:** `GET /api/products`
  - **Response:** 
    ```json
    [{ "id": 1, "name": "Product A", "price": 100 }]
    ```
  - **Description:** Retrieves a list of all products.

### Create Product
- **Endpoint:** `POST /api/products`
  - **Request:** 
    ```json
    { "name": "Product A", "price": 100 }
    ```
  - **Response:** 
    ```json
    { "message": "Product created successfully" }
    ```
  - **Description:** Creates a new product in the inventory.

---

## Orders
### Place Order
- **Endpoint:** `POST /api/orders`
  - **Request:** 
    ```json
    { "userId": 1, "productIds": [1, 2] }
    ```
  - **Response:** 
    ```json
    { "message": "Order placed successfully" }
    ```
  - **Description:** Places a new order for the specified user and products.

---

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.