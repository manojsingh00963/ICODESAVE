* * *

markdown

CopyEdit

`# **iNotebook - Cloud-Based Notebook App**   iNotebook is a cloud-based notebook application built using the MERN stack. It allows users to create, update, and delete notes securely with JWT-based authentication.  ---  ## **Installation and Setup**    ### **1. Clone the repository** ```bash git clone https://github.com/your-username/inotebook.git cd inotebook`

### 2\. Install dependencies

Run the following command to install all required dependencies:

bash

CopyEdit

`npm install express mongoose jsonwebtoken bcryptjs cors express-validator nodemon`

### 3\. Required Dependencies

| Package | Version | Description |
| --- | --- | --- |
| express | ^4.21.1 | Fast, unopinionated, minimalist web framework for Node.js |
| mongoose | ^8.7.1 | MongoDB object modeling tool designed to work in an asynchronous environment |
| jsonwebtoken | ^9.0.2 | JSON Web Token implementation |
| bcryptjs | ^2.4.3 | Library to hash passwords securely |
| cors | ^2.8.5 | Middleware to enable Cross-Origin Resource Sharing |
| express-validator | ^7.2.0 | Middleware to validate and sanitize user input |
| nodemon | ^3.1.7 | Tool to automatically restart the server during development |

* * *

### 4\. Create `.env` file

Create a `.env` file in the root directory:

bash

CopyEdit

`MONGO_URI=your-mongodb-connection-string JWT_SECRET=your-jwt-secret`

* * *

### 5\. Start the Server

To start the development server, run:

bash

CopyEdit

`npm run start`

* * *

## API Routes

### 1\. Create User

**Route:** `/api/auth/createUser`  
**Method:** `POST`  
**Description:** Create a new user  
**Request Body:**

json

CopyEdit

`{   "name": "John Doe",   "email": "john@example.com",   "password": "password123" }`

**Response:**

json

CopyEdit

`{   "success": true,   "authtoken": "your-jwt-token" }`

* * *

### 2\. Login User

**Route:** `/api/auth/login`  
**Method:** `POST`  
**Description:** Login user and return JWT token  
**Request Body:**

json

CopyEdit

`{   "email": "john@example.com",   "password": "password123" }`

**Response:**

json

CopyEdit

`{   "success": true,   "authtoken": "your-jwt-token" }`

* * *

### 3\. Get Logged-In User Details

**Route:** `/api/auth/getuser`  
**Method:** `POST`  
**Description:** Get logged-in user details  
**Headers:**

json

CopyEdit

`{   "auth-token": "your-jwt-token" }`

**Response:**

json

CopyEdit

`{   "_id": "12345",   "name": "John Doe",   "email": "john@example.com" }`

* * *

### 4\. Fetch All Notes

**Route:** `/api/notes/fetchnotes`  
**Method:** `GET`  
**Description:** Get all notes for the logged-in user  
**Headers:**

json

CopyEdit

`{   "auth-token": "your-jwt-token" }`

**Response:**

json

CopyEdit

`[   {     "_id": "1",     "title": "Sample Note",     "description": "This is a sample note",     "tag": "General"   } ]`

* * *

### 5\. Add New Note

**Route:** `/api/notes/addnote`  
**Method:** `POST`  
**Description:** Add a new note  
**Headers:**

json

CopyEdit

`{   "auth-token": "your-jwt-token" }`

**Request Body:**

json

CopyEdit

`{   "title": "New Note",   "description": "This is a new note",   "tag": "Work" }`

**Response:**

json

CopyEdit

`{   "_id": "1",   "title": "New Note",   "description": "This is a new note",   "tag": "Work" }`

* * *

### 6\. Update Note

**Route:** `/api/notes/updatenote/:id`  
**Method:** `PUT`  
**Description:** Update an existing note  
**Headers:**

json

CopyEdit

`{   "auth-token": "your-jwt-token" }`

**Request Body:**

json

CopyEdit

`{   "title": "Updated Note",   "description": "This is an updated note",   "tag": "Personal" }`

**Response:**

json

CopyEdit

`{   "_id": "1",   "title": "Updated Note",   "description": "This is an updated note",   "tag": "Personal" }`

* * *

### 7\. Delete Note

**Route:** `/api/notes/deletenote/:id`  
**Method:** `DELETE`  
**Description:** Delete an existing note  
**Headers:**

json

CopyEdit

`{   "auth-token": "your-jwt-token" }`

**Response:**

json

CopyEdit

`{   "success": "Note has been deleted" }`

* * *

## Folder Structure

plaintext

CopyEdit

`📂 inotebook ├── 📂 config │   └── db.js ├── 📂 middleware │   └── fetchuser.js ├── 📂 models │   └── Note.js │   └── User.js ├── 📂 routes │   └── auth.js │   └── notes.js ├── .env ├── .gitignore ├── package.json ├── README.md └── server.js`

* * *

## Environment Variables

Make sure to add the following environment variables in `.env`:

plaintext

CopyEdit

`MONGO_URI=your-mongodb-connection-string JWT_SECRET=your-jwt-secret`

* * *

## Available Scripts

### Start Development Server

bash

CopyEdit

`npm run start`

### Run Server in Watch Mode (using nodemon)

bash

CopyEdit

`nodemon server.js`

* * *

## Best Practices and Notes

*   Store `JWT_SECRET` securely in `.env` file
*   Ensure proper validation in all routes
*   Use HTTPS for production deployment

* * *

## ✅ Project Setup Complete!

You’re now ready to build and extend the app! 😎

* * *

yaml

CopyEdit

``--- ### ✅ **How to Save It:**   1. Create a new file named `README.md`   2. Copy and paste the content above into the file    --- This looks professional and well-organized! 😎``