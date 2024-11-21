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
- **POST /api/auth/login**
  - **Request:** 
    ```json
    { "username": "user", "password": "pass" }
    ```
  - **Response:** 
    ```json
    { "token": "jwt_token" }
    ```

- **POST /api/auth/register**
  - **Request:** 
    ```json
    { "username": "user", "password": "pass", "email": "user@example.com" }
    ```
  - **Response:** 
    ```json
    { "message": "User registered successfully" }
    ```

### Products
- **GET /api/products**
  - **Response:** 
    ```json
    [{ "id": 1, "name": "Product A", "price": 100 }]
    ```

- **POST /api/products**
  - **Request:** 
    ```json
    { "name": "Product A", "price": 100 }
    ```
  - **Response:** 
    ```json
    { "message": "Product created successfully" }
    ```

### Stores
- **GET /api/stores**
  - **Response:** 
    ```json
    [{ "id": 1, "name": "Store A" }]
    ```

- **POST /api/stores**
  - **Request:** 
    ```json
    { "name": "Store A", "location": "Location A" }
    ```
  - **Response:** 
    ```json
    { "message": "Store created successfully" }
    ```

### Ping
- **GET /api/ping**
  - **Response:** 
    ```json
    { "status": "active", "service": "SUPERSHOP SERVICE IS RUNNING...", "database": true }
    ```

---

## Getting Started
To get started with the backend, ensure you have the following prerequisites installed:
- **Java 17 or higher**
- **Maven**
- **MongoDB**

---

## Setup Instructions
Follow these steps to set up the backend:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/super-shop-management.git
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

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### API Testing Tools
- Postman
- cURL
- Thunder Client (VS Code extension)
- REST Client (VS Code extension)

---

## Security Configuration
The application uses Spring Security with the following configuration:
- JWT-based authentication
- Stateless session management
- CORS enabled for all origins (configurable)
- Public endpoints:
  - /api/ping
  - /api/auth/register
  - /api/auth/login
  - /api/stores/**
- Protected endpoints require authentication
- Admin endpoints require ADMIN role

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

