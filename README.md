# Field Operations Management System

A Capstone Project made for the San Juan CDRRMO, in compliance with the academic requirements for the BS Information Technology program in Jose Rizal University.

> Contains information from OpenStreetMap, which is made available under the Open Database License (ODbL).

## Table of Contents

- [About the Project](#about-the-project)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Building for Production](#building-for-production)
- [Project Structure](#project-structure)
- [Team Members](#team-members)
- [License](#license)

## About the Project

The Field Operations Management System (FOMS) is a web-based application designed to assist the San Juan City Disaster Risk Reduction and Management Office (CDRRMO) in managing field operations, personnel, inventory, and task assignments.

### Key Features

- **Personnel Management** - Track personnel status, activities, and assignments
- **Task Management** - Create, assign, and monitor field operation tasks
- **Inventory Management** - Manage equipment and consumable items
- **Activity Logging** - Track personnel activities and generate reports
- **Real-time Mapping** - Visualize task locations using interactive maps
- **Report Generation** - Generate PDF reports for various data
- **Real-time Updates** - Live updates using WebSockets (Laravel Reverb)

## Tech Stack

### Backend
- **PHP 8.2+**
- **Laravel 11** - PHP Framework
- **MySQL** - Database
- **Sanctum** - API Authentication
- **Laravel Reverb** - WebSocket Server

### Frontend
- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Inertia.js** - SPA Bridge
- **Tailwind CSS** - Styling
- **Shadcn/UI** - UI Components
- **React Leaflet** - Maps
- **React PDF** - PDF Generation
- **Laravel Echo** - WebSocket Client

### External Services
- **Geoapify** - Geocoding and Maps API
- **Python Flask** - Analytics Microservice

### Development Tools
- **Vite** - Build Tool
- **Composer** - PHP Dependency Manager
- **npm** - Node Package Manager

## Prerequisites

Before you begin, ensure you have the following installed:

- **PHP** >= 8.2
- **Composer** >= 2.0
- **Node.js** >= 18.0
- **npm** >= 9.0
- **MySQL** >= 8.0
- **Python** >= 3.10 (for Analytics Service)

### Optional
- **Laravel Herd** or **XAMPP** for local development environment

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/foms.git
cd foms
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Install Node Dependencies

```bash
npm install
```

### 4. Environment Setup

Copy the example environment file and generate an application key:

```bash
cp .env.example .env
php artisan key:generate
```

### 5. Database Setup

Create a MySQL database for the project, then update your `.env` file:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=foms
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### 6. Run Migrations and Seeders

```bash
php artisan migrate --seed
```

### 7. Storage Link

Create a symbolic link for file storage:

```bash
php artisan storage:link
```

## Configuration

### Environment Variables

Key environment variables to configure in `.env`:

#### Application Settings

| Variable | Description |
|----------|-------------|
| `APP_NAME` | Application name |
| `APP_ENV` | Environment (`local`, `production`) |
| `APP_URL` | Application URL (e.g., `http://localhost:8000`) |

#### Database Configuration

| Variable | Description |
|----------|-------------|
| `DB_CONNECTION` | Database driver (`mysql`) |
| `DB_HOST` | Database host |
| `DB_PORT` | Database port (default: `3306`) |
| `DB_DATABASE` | Database name |
| `DB_USERNAME` | Database username |
| `DB_PASSWORD` | Database password |

#### API Keys

| Variable | Description |
|----------|-------------|
| `GEOAPIFY_KEY` | Geoapify API key for geocoding and maps. Get one at [geoapify.com](https://www.geoapify.com/) |

#### Laravel Reverb (WebSocket Server)

| Variable | Description |
|----------|-------------|
| `REVERB_APP_ID` | Reverb application ID |
| `REVERB_APP_KEY` | Reverb application key |
| `REVERB_APP_SECRET` | Reverb application secret |
| `REVERB_HOST` | Reverb server host (default: `localhost`) |
| `REVERB_PORT` | Reverb server port (default: `8080`) |
| `REVERB_SCHEME` | Reverb scheme (`http` or `https`) |

#### Laravel Echo (WebSocket Client)

| Variable | Description |
|----------|-------------|
| `VITE_REVERB_APP_KEY` | Reverb app key for frontend |
| `VITE_REVERB_HOST` | Reverb host for frontend |
| `VITE_REVERB_PORT` | Reverb port for frontend |
| `VITE_REVERB_SCHEME` | Reverb scheme for frontend |

#### Analytics Service

| Variable | Description |
|----------|-------------|
| `ANALYTICS_SERVICE_URL` | Python Flask analytics service URL (default: `http://localhost:5000`) |

#### Mail Configuration

| Variable | Description |
|----------|-------------|
| `MAIL_MAILER` | Mail driver (`smtp`, `mailgun`, etc.) |
| `MAIL_HOST` | Mail server host |
| `MAIL_PORT` | Mail server port |
| `MAIL_USERNAME` | Mail username |
| `MAIL_PASSWORD` | Mail password |
| `MAIL_FROM_ADDRESS` | Default sender email address |
| `MAIL_FROM_NAME` | Default sender name |

### Example `.env` Configuration

```env
# Application
APP_NAME=FOMS
APP_ENV=local
APP_URL=http://localhost:8000

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=foms
DB_USERNAME=root
DB_PASSWORD=secret

# API Keys
GEOAPIFY_KEY=your_geoapify_api_key_here

# Laravel Reverb
REVERB_APP_ID=132219
REVERB_APP_KEY=define_app_key_here
REVERB_APP_SECRET=define_app_secret_here
REVERB_HOST=localhost
REVERB_PORT=8080
REVERB_SCHEME=http

# Laravel Echo (Frontend)
VITE_REVERB_APP_KEY="${REVERB_APP_KEY}"
VITE_REVERB_HOST="${REVERB_HOST}"
VITE_REVERB_PORT="${REVERB_PORT}"
VITE_REVERB_SCHEME="${REVERB_SCHEME}"

# Analytics Service
ANALYTICS_SERVICE_URL=http://localhost:5000
```

## Running the Application

### Development Mode

You need to run multiple services for full functionality:

#### 1. Start the Laravel Development Server

```bash
php artisan serve
```

#### 2. Start the Vite Development Server

In a separate terminal:

```bash
npm run dev
```

#### 3. Start the Laravel Reverb WebSocket Server

In a separate terminal:

```bash
php artisan reverb:start
```

#### 4. Start the Queue Worker (for background jobs)

In a separate terminal:

```bash
php artisan queue:work
```

#### 5. Start the Analytics Service (Optional)

If you need analytics functionality, start the Python Flask service:

```bash
cd analytics-service
python app.py
```

The application will be available at `http://localhost:8000`.

### Using Laravel Herd

If you're using Laravel Herd, the application will be available at `http://foms.test`.

## Building for Production

### 1. Build Frontend Assets

```bash
npm run build
```

### 2. Optimize Laravel

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

### 3. Run Reverb in Production

For production, run Reverb as a daemon:

```bash
php artisan reverb:start --host=0.0.0.0 --port=8080
```

Consider using a process manager like Supervisor to keep the services running.

## Project Structure

```
foms/
├── app/                    # Laravel application code
│   ├── Events/             # Broadcast events
│   ├── Http/Controllers/   # Controllers
│   ├── Models/             # Eloquent models
│   ├── Notifications/      # Notification classes
│   └── ...
├── database/
│   ├── migrations/         # Database migrations
│   └── seeders/            # Database seeders
├── resources/
│   ├── js/                 # React components and pages
│   │   ├── components/     # Reusable components
│   │   ├── Documents/      # PDF document templates
│   │   ├── Layouts/        # Page layouts
│   │   ├── Pages/          # Inertia pages
│   │   └── types/          # TypeScript type definitions
│   └── views/              # Blade templates
├── routes/
│   ├── api.php             # API routes
│   ├── channels.php        # Broadcast channels
│   └── web.php             # Web routes
└── ...
```

## Team Members

| Name | Role |
|------|------|
| Victor L. Chipe | Project Manager |
| Kirvin Josh C. Castro | UI/UX Designer |
| Alexis G. Laniosa | Data Analyst & UI/UX Designer  |
| Charles Aaron Y. Sarmiento | Software Developer |

## Acknowledgements

- San Juan CDRRMO for their cooperation and guidance
- Jose Rizal University - IT Department
- OpenStreetMap contributors

## License

This project is developed for academic purposes as part of a capstone project. All rights reserved.

---

**Jose Rizal University**  
BS Information Technology  
Academic Year 2024-2025