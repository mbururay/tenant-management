# Tenant Management System

A full-stack web application developed for a residential property management business to replace spreadsheet-based tenant administration with a centralized digital platform.

The system streamlines rent management, utility billing, invoice generation, payment tracking, and tenant record management while providing administrators with an efficient workflow for managing day-to-day property operations.

---

## Overview

The Tenant Management System was built to solve the limitations of manual Excel-based record keeping. The application centralizes property management tasks into a single web platform, reducing repetitive administrative work and improving billing accuracy.

The application is currently used to manage:

- 26 active tenants
- Over KES 600,000 (~USD 4,600) in recurring rent and utility transactions
- Automated invoice generation
- Utility billing and payment tracking

---

## Features

### Tenant Management

- Add, edit, and remove tenants
- Manage tenant information
- Assign tenants to properties
- View complete tenant history

### Property Management

- Manage rental properties
- Store rental rates
- Track occupancy

### Billing

- Generate monthly invoices
- Calculate rent charges
- Water billing
- Additional charge management
- Printable invoices

### Payments

- Record tenant payments
- Payment correction workflow
- Maintain payment history
- Outstanding balance tracking

### Database Management

- Normalized PostgreSQL schema
- Relational data model
- Referential integrity
- Transaction-safe updates

---

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- HTML5
- CSS3

### Backend

- Node.js
- Express.js

### Database

- PostgreSQL

### Other Tools

- REST API
- Git
- GitHub

---

## System Architecture

```
React Frontend
        │
        │ HTTP Requests
        ▼
Express REST API
        │
        ▼
PostgreSQL Database
```

---

## Database Design

The application uses a normalized relational database consisting of entities such as:

- Tenants
- Houses
- Invoices
- Payments
- Water Bills
- Invoice Corrections
- Charges

Relationships are enforced through foreign keys to ensure data consistency.

---

## Key Functionalities

- CRUD operations for tenants
- CRUD operations for properties
- Invoice generation
- Utility billing
- Payment processing
- Payment corrections
- Printable invoices
- Reporting

---

## What I Learned

This project significantly strengthened my understanding of:

- Full-stack application development
- RESTful API design
- Database normalization
- PostgreSQL query optimization
- React state management
- Backend architecture
- Production debugging
- Client requirement gathering
- Software maintenance

---

## Future Improvements

- Authentication and role-based access control
- Email invoice delivery
- Dashboard analytics
- Mobile responsiveness
- Automated payment reminders
- Audit logging
- Multi-property support
- File attachment support
- Backup and recovery tools

---

## Screenshots

Screenshots will be added soon.

---

## Installation

### Clone the repository

```bash
git clone https://github.com/mbururay/tenant-management-system.git
```

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

Create a `.env` file in the backend directory.

Example:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=tenant_management
```

---

## License

This project was developed for a private client and is shared for portfolio purposes only.

Commercial use, redistribution, or deployment without permission is not permitted.

---

## Author

**Ray Mburu**

Computer Science Student  
Texas Christian University

GitHub: https://github.com/mbururay

LinkedIn: https://linkedin.com/in/raymburu
