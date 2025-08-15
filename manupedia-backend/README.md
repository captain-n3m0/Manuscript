# Manupedia Backend

A Spring Boot REST API backend for the Manupedia application providing user authentication, manual management, and review functionality.

## Features

- **User Authentication**: JWT-based signup and login
- **User Management**: User registration, profile management
- **Manual Management**: Upload and manage product manuals
- **Review System**: Users can review manuals
- **MySQL Database**: Persistent data storage
- **Security**: Spring Security with JWT tokens
- **CORS Support**: Configured for frontend integration

## Technology Stack

- **Framework**: Spring Boot 3.2.5
- **Database**: MySQL 8.0
- **Security**: Spring Security + JWT
- **Build Tool**: Maven
- **Java Version**: 17

## Prerequisites

Before running this application, make sure you have the following installed:

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+

## Database Setup

1. **Install and start MySQL**:
   ```bash
   # On macOS with Homebrew
   brew install mysql
   brew services start mysql

   # Or start manually
   mysql.server start
   ```

2. **Create database and user**:
   ```bash
   # Run the setup script
   cd manupedia-backend
   chmod +x setup-db.sh
   ./setup-db.sh

   # Or manually create database
   mysql -u root -p
   CREATE DATABASE manupedia_db;
   CREATE USER 'manupedia_user'@'localhost' IDENTIFIED BY 'manupedia_password';
   GRANT ALL PRIVILEGES ON manupedia_db.* TO 'manupedia_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Update database credentials** (if different from defaults):
   Edit `src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

## Installation and Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd manupedia-backend
   ```

2. **Build the project**:
   ```bash
   mvn clean package
   ```

3. **Run the application**:
   ```bash
   # Using Maven
   mvn spring-boot:run

   # Or using the JAR file
   java -jar target/manupedia-backend-1.0-SNAPSHOT.jar
   ```

4. **Verify the application is running**:
   - Server starts on: `http://localhost:8080`
   - Test endpoint: `http://localhost:8080/api/auth/test`

## API Endpoints

### Authentication

#### POST `/api/auth/signup`
Register a new user.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "id": 1,
  "email": "john@example.com",
  "name": "John Doe",
  "role": "USER"
}
```

#### POST `/api/auth/login`
Login with existing credentials.

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**: Same as signup response.

### User Management

#### GET `/api/user/profile`
Get current user profile (requires authentication).

**Headers**:
```
Authorization: Bearer <jwt-token>
```

**Response**:
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER",
  "createdAt": "2025-08-15T12:00:00"
}
```

#### GET `/api/user/dashboard`
Get user dashboard information (requires authentication).

## Configuration

### Application Properties

The application can be configured through `src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/manupedia_db
spring.datasource.username=root
spring.datasource.password=password

# JWT Configuration
app.jwt.secret=manupediaSecretKey123456789012345678901234567890
app.jwt.expiration=86400000

# Server Configuration
server.port=8080

# CORS Configuration
spring.web.cors.allowed-origins=http://localhost:3000
```

### Environment Variables

You can override configuration using environment variables:

```bash
export SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/manupedia_db
export SPRING_DATASOURCE_USERNAME=your_username
export SPRING_DATASOURCE_PASSWORD=your_password
export APP_JWT_SECRET=your_secret_key
```

## Frontend Integration

This backend is designed to work with a React frontend. The CORS configuration allows requests from `http://localhost:3000` by default.

### Using with React Frontend

1. **Set the API base URL** in your React app:
   ```javascript
   const API_BASE_URL = 'http://localhost:8080/api';
   ```

2. **Authentication Example**:
   ```javascript
   // Signup
   const signup = async (userData) => {
     const response = await fetch(`${API_BASE_URL}/auth/signup`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(userData),
     });
     return response.json();
   };

   // Login
   const login = async (credentials) => {
     const response = await fetch(`${API_BASE_URL}/auth/login`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(credentials),
     });
     return response.json();
   };

   // Authenticated requests
   const getProfile = async (token) => {
     const response = await fetch(`${API_BASE_URL}/user/profile`, {
       headers: {
         'Authorization': `Bearer ${token}`,
       },
     });
     return response.json();
   };
   ```

## Database Schema

The application automatically creates the following tables:

### Users Table
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Manuals Table
```sql
CREATE TABLE manuals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    brand VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    file_url VARCHAR(500),
    uploaded_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
);
```

### Reviews Table
```sql
CREATE TABLE reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    manual_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (manual_id) REFERENCES manuals(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Development

### Running Tests
```bash
mvn test
```

### Build for Production
```bash
mvn clean package -DskipTests
```

### Code Style
The project follows Spring Boot conventions and uses standard Java formatting.

## Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Verify MySQL is running
   - Check database credentials in `application.properties`
   - Ensure database `manupedia_db` exists

2. **Port Already in Use**:
   - Change the port in `application.properties`: `server.port=8081`
   - Or kill the process using port 8080

3. **JWT Token Errors**:
   - Ensure the JWT secret is at least 32 characters long
   - Check token expiration settings

4. **CORS Issues**:
   - Update `spring.web.cors.allowed-origins` in application.properties
   - Ensure frontend URL matches the CORS configuration

### Logs
Application logs are printed to the console. For debugging:
- Set logging level: `logging.level.com.manupedia=DEBUG`
- Enable SQL logging: `spring.jpa.show-sql=true`

## License

This project is licensed under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Support

For issues and questions, please create an issue in the repository or contact the development team.
