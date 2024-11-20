# CRUD-USING-NODEJS
##  RestFull API Based On Node Js
# To-Do App with User Authentication & File Upload API

This project includes a REST API for managing tasks, user authentication, and file upload functionality. It is built with Node.js and demonstrates basic CRUD operations, user authentication with JWT, and handling file uploads.

## Table of Contents
- [Overview](#overview)

- [Tasks API](#tasks-api)
  - [POST /tasks](#post-tasks)
  - [GET /tasks](#get-tasks)
  - [GET /tasks/:id](#get-tasks)
  - [PUT /tasks/:id](#put-tasksid)
  - [DELETE /tasks/:id](#delete-tasksid)
- [User Authentication API](#user-authentication-api)
  - [POST /register](#post-register)
  - [POST /login](#post-login)
  - [GET /profile](#get-profile)
- [File Upload API](#file-upload-api)
  - [POST /upload](#post-upload)
- [Technologies Used](#technologies-used)
- [How to Run the Project](#how-to-run-the-project)



---

## Overview

This project is a simple REST API with three main components:
1. **Tasks API**: For managing tasks (CRUD operations).
2. **User Authentication API**: For registering and logging in users with JWT authentication.
3. **File Upload API**: For uploading files, with validation on file type and size.

---

## Tasks API

### POST /tasks
Create a new task with the following required fields:
- `title`: The title of the task (string).
- `description`: The description of the task (string).
- `priority`: Priority of the task (integer).
- `due_date`: The due date for the task (ISO date string).

**Request Example**:
```json
{
  "title": "Finish homework",
  "description": "Complete the math homework.",
  "priority": 2,
  "due_date": "2024-11-30T23:59:59Z"
}
```
### GET /tasks OR GET /tasks/{id}
this is to fetch all the tasks or specific tasks based on id

**Request Example:**
```json
{
  "title": "Finish homework",
  "description": "Complete the math homework.",
  "priority": 2,
  "due_date": "2024-11-30T23:59:59Z"
}
```

### PUT /tasks/{id}
this is to edit  specific tasks based on id.

**Request Example:**
```json
{
  "title": "Complete homework",
  "description": "Complete the math homework before the deadline.",
  "priority": 1,
  "due_date": "2024-11-29T23:59:59Z"
}
```
**Response Example: **
```json
Tasks Updated Successfully
{
  "id": 1,
  "title": "Complete homework",
  "description": "Complete the math homework before the deadline.",
  "priority": 1,
  "due_date": "2024-11-29T23:59:59Z"
}
```
### DELETE /tasks/{id}

** Response Example **
```json
{
  "message": "Task with ID 1 has been deleted."
}
```
## User Authentication API
### POST /register
Register a new user with a username and password. The password will be hashed using bcrypt.

**Request Example:**
```json
{
  "username": "john_doe",
  "password": "securepassword123"
}
```
**Response Example:**
```json
{
  "message": "User registered successfully."
}
```
### POST /login
Authenticate a user and return a JWT token if successful. The user needs to provide the username and password.

**Request Example:**
```json
{
  "username": "john_doe",
  "password": "securepassword123"
}
```
**Response Example:**
```json
{
  "token": "your-jwt-token-here"
}
```
### GET /profile
This endpoint is protected and can only be accessed by authenticated users. The user must provide a valid JWT token in the Authorization header.

**Request Example:**
```Http
GET /profile
Authorization: Bearer your-jwt-token-here
```
**Response Example:**
```json
{
  "username": "john_doe",
  "message": "Welcome to your profile!"
}
```
## File Upload API
### POST /upload
Allow users to upload files (images only, e.g., .jpg and .png). The file is saved to the local filesystem, and the metadata is returned in the response.

**Request Example:**
``` Http
Set the Content-Type to multipart/form-data.
Select the file to upload.
```
**Response Example:**
```json
{
  "originalName": "image.jpg",
  "size": 5425,
  "type": "image/jpeg",
  "message": "File uploaded successfully!"
}
```
## Technologies Used
1. **Node.js:**  JavaScript runtime for building the API.
2. **JWT (jsonwebtoken):** For user authentication via JSON Web Tokens.
3. **Bcrypt.js:** For hashing user passwords.
4. **Multer:** Middleware for handling file uploads.

## How to run the project

clone the project 
```
git clone https://github.com/Sky607/CRUD-USING-NODEJS.git
```
To install all dependicies run the below command.It will install all the required pacakeges from the pacakage.json
```
npm install
```
To start the project run the below command and open the shown localhost url in the browser
```npm start ``` or ```nodemon <file name> ```






