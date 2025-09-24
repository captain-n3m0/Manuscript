# Manupedia - Digital Manuscript Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)

## 📖 Project Overview

Manupedia is a comprehensive digital manuscript management system designed to facilitate the upload, browsing, and management of digital manuscripts and manuals. The platform provides a user-friendly interface for both administrators and regular users to manage document collections efficiently.

## 🏗️ System Architecture

### Frontend (React Application)
- **Framework**: React 19.1.1
- **Styling**: CSS3 with custom components
- **Icons**: Heroicons React
- **HTTP Client**: Axios
- **Routing**: React Router DOM 7.8.0
- **Testing**: React Testing Library

### Backend (Spring Boot Application)
- **Framework**: Spring Boot 3.2.5
- **Language**: Java 17
- **Database**: H2 (Development), MySQL (Production)
- **Security**: Spring Security with JWT Authentication
- **Data Layer**: Spring Data JPA
- **Validation**: Spring Boot Validation
- **Build Tool**: Maven

## 🌟 Core Features

### User Management
- **User Registration & Authentication**: Secure signup and login system
- **Role-Based Access Control**: Differentiated access for users and administrators
- **Profile Management**: User profile creation and management

### Manuscript Management
- **Upload Manuscripts**: Support for multiple file formats with metadata
- **Browse & Search**: Advanced search and filtering capabilities
- **Categorization**: Organize manuscripts by brand, model, and category
- **Image Support**: Optional image uploads for manuscripts
- **Detailed View**: Comprehensive manuscript details with download options

### Administrative Features
- **Admin Dashboard**: Comprehensive control panel for system management
- **User Management**: Admin tools for user oversight
- **Content Moderation**: Manuscript approval and management workflows
- **Statistics**: System analytics and reporting

### Additional Features
- **Review System**: User reviews and ratings for manuscripts
- **Help & Guidelines**: Built-in help system for users
- **Responsive Design**: Mobile-friendly interface
- **File Management**: Secure file upload and storage

## 🛠️ Technology Stack

### Backend Technologies
```
├── Spring Boot 3.2.5
├── Spring Security (JWT Authentication)
├── Spring Data JPA (Database Operations)
├── Spring Validation (Input Validation)
├── H2 Database (Development)
├── MySQL (Production)
├── Maven (Build Management)
└── Java 17
```

### Frontend Technologies
```
├── React 19.1.1
├── React Router DOM 7.8.0
├── Axios (HTTP Client)
├── Heroicons React (Icons)
├── CSS3 (Styling)
├── React Testing Library (Testing)
└── Web Vitals (Performance Monitoring)
```

## 📁 Project Structure

```
Manuscript/
├── basic-frontend/                 # Frontend React application
│   ├── public/                    # Static assets
│   ├── src/
│   │   ├── components/            # React components
│   │   │   ├── HomePage.js        # Landing page
│   │   │   ├── BrowseManuscripts.js # Manuscript browsing
│   │   │   ├── UploadManuscript.js # Upload functionality
│   │   │   ├── ManuscriptDetails.js # Detailed view
│   │   │   ├── AdminPage.js       # Admin dashboard
│   │   │   ├── LoginPage.js       # Authentication
│   │   │   ├── SignupPage.js      # User registration
│   │   │   └── ...               # Other components
│   │   ├── contexts/              # React contexts
│   │   ├── services/              # API services
│   │   └── hooks/                 # Custom hooks
│   └── package.json
├── manupedia-backend/             # Backend Spring Boot application
│   ├── src/main/java/com/manupedia/
│   │   ├── controller/            # REST Controllers
│   │   │   ├── ManuscriptController.java
│   │   │   ├── AuthController.java
│   │   │   ├── UserController.java
│   │   │   └── AdminController.java
│   │   ├── service/               # Business logic
│   │   ├── repository/            # Data access layer
│   │   ├── entity/                # JPA entities
│   │   ├── dto/                   # Data transfer objects
│   │   ├── config/                # Configuration classes
│   │   └── security/              # Security configuration
│   ├── src/main/resources/
│   │   ├── application.properties # Configuration
│   │   └── schema.sql            # Database schema
│   └── pom.xml                   # Maven configuration
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 18+ and npm
- MySQL (for production) or H2 (for development)
- Maven 3.6+

### Backend Setup
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Manuscript/manupedia-backend
   ```

2. **Configure database**
   ```bash
   # For development (H2 - no setup required)
   # For production (MySQL)
   chmod +x setup-db.sh
   ./setup-db.sh
   ```

3. **Build and run**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

   The backend will start on `http://localhost:8080`

### Frontend Setup
1. **Navigate to frontend directory**
   ```bash
   cd Manuscript/basic-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

   The frontend will start on `http://localhost:3000`

## 🧪 Testing

### Backend Testing
```bash
cd manupedia-backend
mvn test
```

### Frontend Testing
```bash
cd basic-frontend
npm test
```

## 📊 Database Schema

### Core Entities
- **Users**: User account information and roles
- **Manuals/Manuscripts**: Document metadata and file references
- **Reviews**: User reviews and ratings for manuscripts

### Key Relationships
- Users can upload multiple manuscripts
- Manuscripts can have multiple reviews
- Role-based access control for different user types

## 🔧 Configuration

### Backend Configuration
Key configuration files:
- `application.properties`: Main configuration
- `application-h2.properties`: H2 database configuration
- `application-test.properties`: Test environment configuration

### Environment Variables
Set the following environment variables for production:
- `SPRING_PROFILES_ACTIVE`: Production profile
- `DATABASE_URL`: MySQL connection string
- `JWT_SECRET`: JWT signing secret

## 🚀 Deployment

### Docker Support
The project includes Docker configuration files:
- `docker-mysql.sh`: MySQL Docker setup
- Various setup scripts for different environments

### Production Deployment
1. Configure production database
2. Set environment variables
3. Build frontend: `npm run build`
4. Package backend: `mvn clean package`
5. Deploy using your preferred method

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the built-in Help & Guidelines section
- Review the project documentation

## 🔄 Version History

- **v1.0-SNAPSHOT**: Initial release with core functionality
  - User authentication and authorization
  - Manuscript upload and management
  - Admin dashboard
  - Review system
  - Responsive web interface

## 🎯 Future Enhancements

- Advanced search with full-text indexing
- Mobile application
- Integration with external document management systems
- Enhanced analytics and reporting
- Multi-language support
- Cloud storage integration

---

**Manupedia** - Making manuscript management simple and efficient.
