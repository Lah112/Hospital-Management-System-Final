#Y3S2-WE-30

# Hospital Management System - Backend-CSSE

This is the **Backend API** for the **Life Care Hospital** Management System. The backend handles patient and doctor registrations, authentication, appointment management, and communication between patients and the admin. It is built using **Node.js** and **Express.js**, with MongoDB as the database. This project also includes features like validation, error handling, token generation, and password encryption.

## Features

- **User Authentication**: Secure login and registration for patients, doctors, and admins using JWT (JSON Web Tokens).
- **Password Encryption**: Uses bcrypt to securely hash and store passwords in the database.
- **Appointment Management**: Manage doctor-patient appointments via the backend API.
- **Cloudinary Integration**: Store doctor profile images in Cloudinary.
- **Error Handling**: Centralized error handling mechanism for better API management.
- **Validation**: Input validation using Mongoose and validator.js.
- **Role-Based Access**: Access control for different user roles (Admin, Patient, Doctor).


## Installation

### Prerequisites

- Node.js and npm (Node Package Manager)
- MongoDB installed and running
- Cloudinary account for image storage
- `.env` file with the following environment variables:

```
MONGO_URI=<Your MongoDB URI>
JWT_SECRET_KEY=<Your JWT Secret Key>
JWT_EXPIRES=7d
CLOUDINARY_CLOUD_NAME=<Your Cloudinary Cloud Name>
CLOUDINARY_API_KEY=<Your Cloudinary API Key>
CLOUDINARY_API_SECRET=<Your Cloudinary API Secret>
```

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/Fairooz2150/Hospital-Management-System.git
    ```

2. Navigate to the **Backend** folder:

   ```bash
   cd Backend
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

4. Start the server:

   ```bash
   npm run dev
   ```

5. The backend will be running at **http://localhost:4000**.


=======
>>>>>>> 3f32e164b5a920bf0f791ce52730b0d957f90dfd



