# Backend Documentation

---

## Table of Contents
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [Products](#products)
  - [Stores](#stores)
  - [Ping](#ping)
- [Getting Started](#getting-started)
- [Setup Instructions](#setup-instructions)
- [Reference Documentation](#reference-documentation)
- [Guides](#guides)

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

## Getting Started
To get started with the backend, ensure you have the following prerequisites installed:
- **Java 17 or higher**
- **Maven**
- **MongoDB**
- **Docker** (for local development)
- **Kafka** (for high availability)
- **ZooKeeper** (for high availability)
- **Redis** (for caching)

---

## Setup Instructions
Follow these steps to set up the backend:

1. **Clone the repository:**
   ```bash
   cd super-shop-management/backend
   ```

2. **Install dependencies:**
   ```bash
   mvn install
   ```

3. **Run the application:**
   ```bash
   mvn spring-boot:run
   ```

4. **Access the API:**
   Open your browser or API client and navigate to `http://localhost:8080/api`.

---

## Reference Documentation
For further reference, please consider the following sections:

* [Official Apache Maven documentation](https://maven.apache.org/guides/index.html)
* [Spring Boot Maven Plugin Reference Guide](https://docs.spring.io/spring-boot/3.3.5/maven-plugin)
* [Create an OCI image](https://docs.spring.io/spring-boot/3.3.5/maven-plugin/build-image.html)
* [Spring Web](https://docs.spring.io/spring-boot/3.3.5/reference/web/servlet.html)
* [Spring Data MongoDB](https://docs.spring.io/spring-boot/3.3.5/reference/data/nosql.html#data.nosql.mongodb)
* [Spring Security](https://docs.spring.io/spring-boot/3.3.5/reference/web/spring-security.html)
* [Spring Boot DevTools](https://docs.spring.io/spring-boot/3.3.5/reference/using/devtools.html)
* [Validation](https://docs.spring.io/spring-boot/3.3.5/reference/io/validation.html)

---

## Guides
The following guides illustrate how to use some features concretely:

* [Building a RESTful Web Service](https://spring.io/guides/gs/rest-service/)
* [Serving Web Content with Spring MVC](https://spring.io/guides/gs/serving-web-content/)
* [Building REST services with Spring](https://spring.io/guides/tutorials/rest/)
* [Accessing Data with MongoDB](https://spring.io/guides/gs/accessing-data-mongodb/)
* [Securing a Web Application](https://spring.io/guides/gs/securing-web/)
* [Spring Boot and OAuth2](https://spring.io/guides/tutorials/spring-boot-oauth2/)
* [Authenticating a User with LDAP](https://spring.io/guides/gs/authenticating-ldap/)
* [Validation](https://spring.io/guides/gs/validating-form-input/)

---

### Maven Parent Overrides
Due to Maven's design, elements are inherited from the parent POM to the project POM. While most of the inheritance is fine, it also inherits unwanted elements like `<license>` and `<developers>` from the parent. To prevent this, the project POM contains empty overrides for these elements. If you manually switch to a different parent and actually want the inheritance, you need to remove those overrides.

