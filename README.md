# Super-Shop-Management

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

### Orders
- **POST /api/orders**
  - **Request:** 
    ```json
    { "userId": 1, "productIds": [1, 2] }
    ```
  - **Response:** 
    ```json
    { "message": "Order placed successfully" }
    ```

### Setup Instructions
1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/super-shop-management.git
   cd super-shop-management/backend
   ```

2. **Install dependencies:**
   - For Maven:
     ```bash
     mvn install
     ```
   - For Gradle:
     ```bash
     gradle build
     ```

3. **Run the application:**
   ```bash
   mvn spring-boot:run
   ```
   or
   ```bash
   gradle bootRun
   ```

4. **Access the API:**
   - The API will be available at `http://localhost:8080/api`.

---

## Frontend Documentation

### Setup Instructions
1. **Navigate to the frontend directory:**
   ```bash
   cd super-shop-management/frontend
   ```

2. **Install dependencies:**
   - For npm:
     ```bash
     npm install
     ```
   - For yarn:
     ```bash
     yarn install
     ```

3. **Run the application:**
   ```bash
   npm start
   ```
   or
   ```bash
   yarn start
   ```

4. **Access the frontend:**
   - The application will be available at `http://localhost:3000`.

---

## Contributing
Feel free to submit issues or pull requests to improve the project. Contributions are welcome!

---

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.