# Super-Shop-Management API Documentation

---

## Table of Contents
- [Features](#features)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [Products](#products)
  - [Orders](#orders)
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
#### 1. Login
- **Endpoint:** `POST /api/auth/login`
- **Request Body:** 
    ```json
    { 
      "username": "user", 
      "password": "pass" 
    }
    ```
- **Response:** 
    ```json
    { 
      "token": "jwt_token" 
    }
    ```
- **Description:** Authenticates a user and returns a JWT token for subsequent requests.

#### 2. Register
- **Endpoint:** `POST /api/auth/register`
- **Request Body:** 
    ```json
    { 
      "username": "user", 
      "password": "pass", 
      "email": "user@example.com" 
    }
    ```
- **Response:** 
    ```json
    { 
      "message": "User registered successfully" 
    }
    ```
- **Description:** Registers a new user in the system.

---

### Products
#### 1. Get All Products
- **Endpoint:** `GET /api/products`
- **Response:** 
    ```json
    [{ 
      "id": 1, 
      "name": "Product A", 
      "price": 100 
    }]
    ```
- **Description:** Retrieves a list of all products.

#### 2. Create Product
- **Endpoint:** `POST /api/products`
- **Request Body:** 
    ```json
    { 
      "name": "Product A", 
      "price": 100 
    }
    ```
- **Response:** 
    ```json
    { 
      "message": "Product created successfully" 
    }
    ```
- **Description:** Creates a new product in the inventory.

---

### Orders
#### 1. Place Order
- **Endpoint:** `POST /api/orders`
- **Request Body:** 
    ```json
    { 
      "userId": 1, 
      "productIds": [1, 2] 
    }
    ```
- **Response:** 
    ```json
    { 
      "message": "Order placed successfully" 
    }
    ```
- **Description:** Places a new order for the specified user and products.

---

## Contributing
Feel free to submit issues or pull requests to improve the project. Contributions are welcome!

---

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.