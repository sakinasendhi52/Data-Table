# Project : User Management System

A simple and interactive **User Management System** built using **Next.js, TypeScript, Tailwind CSS, React, and Heroicons**. This project allows users to add, view, search, sort, edit, and delete user records.

User data is stored in the browser using **Local Storage**, so the records remain available even after refreshing the page.

---

## 📌 Project Description

The **User Management System** is a frontend-based application developed using **Next.js and React**.

It provides a complete user registration form where users can enter:

- Profile information
- Personal information
- Contact information
- Address information
- Gender
- Hobbies
- Profile photo
- Cover photo

The application stores the submitted user data in **Local Storage** and displays the records in a responsive table.

Users can:

- Add new users
- View user records
- Search users
- Sort user records
- Edit existing users
- Delete users
- Upload profile and cover photos
- Navigate through users using pagination

This project is designed to strengthen concepts such as **React Hooks, TypeScript, form handling, validation, Local Storage, image processing, and Tailwind CSS**.

---

## 🚀 How This Project is Made

This project is built using **Next.js, React, TypeScript, Tailwind CSS, and Heroicons**.

### 🧱 Next.js & React

- Next.js is used as the main framework.
- React is used to create interactive UI components.
- `"use client"` is used because the application requires client-side features such as:
  - `useState()`
  - `useEffect()`
  - `localStorage`
  - File upload
  - Browser APIs

### 🎨 Tailwind CSS

Tailwind CSS is used for styling the application.

It provides:

- Responsive layouts
- Form styling
- Buttons
- Tables
- Spacing
- Borders
- Colors
- Hover effects
- Responsive design

### 📘 TypeScript

TypeScript is used to define the structure of user data using an interface.

The `UserData` interface contains:

- ID
- Username
- About
- First Name
- Last Name
- Email
- Password
- Gender
- Hobby
- Country
- Street Address
- City
- State
- PIN Code
- Profile Photo
- Cover Photo

### 💾 Local Storage

Browser `localStorage` is used to store user records.

The data is stored using the key:

```text
Users
```

When the page loads, the application retrieves the saved users from Local Storage using `useEffect()`.

---

## ✨ Features

- User Registration Form
- Add User
- View Users
- Edit User
- Delete User
- Search Users
- Sort Users
- Pagination
- Profile Photo Upload
- Cover Photo Upload
- Image Compression
- Form Validation
- Multiple Hobby Selection
- Gender Selection
- Country Selection
- Local Storage Data Management
- Responsive UI
- Tailwind CSS Styling
- Heroicons
- Automatic Page Reset After Search and Sorting

---

## 🔎 Search Functionality

The application provides a **Search Users** field.

Users can be searched by:

- Username
- First Name
- Last Name
- Email
- Gender
- Country
- City
- State

The search is **case-insensitive**.

For example:

```text
Search: sakina
```

The application can find users whose username, first name, last name, email, gender, country, city, or state contains the searched text.

---

## 🔃 Sorting Functionality

The application provides sorting buttons for:

- Username
- Name
- ID

Users can sort the data in:

- Ascending order ↑
- Descending order ↓

When the same sorting button is clicked again, the sorting order changes automatically.

---

## 📄 Pagination

Pagination is implemented to make the users table easier to manage.

The application displays:

```text
5 Users Per Page
```

Users can navigate between pages using:

- Previous
- Page Numbers
- Next

The application also displays the current record range.

Example:

```text
Showing 1 to 5 of 10 Users
```

---

## 📝 Form Validation

The registration form includes validation for different fields.

### Username

- Required
- Minimum 3 characters
- Maximum 20 characters
- Allows letters, numbers, and underscore

### About

- Required
- Minimum 30 characters
- Maximum 200 characters

### First Name

- Required
- Minimum 2 characters
- Allows characters and spaces

### Last Name

- Required
- Minimum 2 characters
- Allows characters and spaces

### Email

- Required
- Must follow a valid email format

### Password

The password must:

- Be at least 8 characters
- Not exceed 16 characters
- Contain an uppercase letter
- Contain a lowercase letter
- Contain a number
- Contain a special character

### Gender

- Required
- Male or Female

### Hobby

At least one hobby must be selected.

Available hobbies include:

- Reading
- Writing
- Surfing
- Travelling
- Music

### Country

A country must be selected.

Available countries include:

- India
- United States
- Canada
- China
- Russia
- Mexico

### Address

The application validates:

- Street Address
- City
- State
- PIN Code

The PIN code must contain exactly **6 digits**.

### Photos

Both profile photo and cover photo are required.

---

## 🖼️ Image Upload & Compression

The application allows users to upload:

- Profile Photo
- Cover Photo

Before storing the images, the application compresses them using the **Canvas API**.

Image compression helps reduce the size of images before saving them in Local Storage.

### Profile Photo

Maximum width:

```text
500px
```

### Cover Photo

Maximum width:

```text
800px
```

The images are converted to JPEG format before being stored.

---

## ✏️ Edit User

The **Edit** button allows an existing user record to be modified.

When the Edit button is clicked:

1. User data is loaded into the form.
2. The form fields are populated with existing values.
3. The user can modify the information.
4. The button changes from **Add User** to **Update User**.
5. Updated information is saved to Local Storage.

---

## 🗑️ Delete User

The **Delete** button allows users to remove a record.

Before deleting a user, the application displays a confirmation message:

```text
Are You sure you want to delete this Record?
```

If the user confirms the deletion:

1. The selected record is removed.
2. The updated user list is saved to Local Storage.
3. The table is updated.
4. A success message is displayed.

---

## 💾 Local Storage

User information is stored in browser Local Storage using:

```javascript
localStorage.setItem(
    "Users",
    JSON.stringify(updatedUsers)
);
```

When the application loads, saved data is retrieved using:

```javascript
localStorage.getItem("Users");
```

This allows the user records to remain available even after refreshing the browser.

> **Note:** Local Storage is used for learning and frontend demonstration purposes. Sensitive information such as passwords should not be stored this way in a production application.

---

## 🛠️ Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Heroicons
- HTML5
- CSS3
- JavaScript
- Browser Local Storage
- Canvas API

---

## 📚 JavaScript & React Concepts Covered

### React

- Components
- `useState()`
- `useEffect()`
- Event Handling
- Controlled Forms
- Conditional Rendering
- List Rendering

### TypeScript

- Interfaces
- Type Annotations
- Union Types
- Generic State Types
- `keyof`
- Type-safe Functions

### JavaScript

- Arrays
- Objects
- Functions
- Arrow Functions
- Spread Operator
- Template Literals
- `map()`
- `filter()`
- `sort()`
- `slice()`
- `includes()`
- `localeCompare()`
- `JSON.stringify()`
- `JSON.parse()`

### Browser APIs

- Local Storage
- FileReader
- Canvas API
- Image API

### Next.js

- Client Components
- `"use client"`
- Next.js App Router

### Tailwind CSS

- Flexbox
- Grid
- Responsive Classes
- Spacing
- Borders
- Typography
- Hover States
- Responsive Tables

---

## ⚙️ How It Works

### 1. Add User

The user fills out the registration form and submits it.

The application:

1. Validates all fields.
2. Creates a new user object.
3. Generates a unique ID using:

```javascript
Date.now()
```

4. Adds the user to the users array.
5. Saves the updated array to Local Storage.
6. Displays a success message.
7. Resets the form.

---

### 2. Display Users

User records are retrieved from Local Storage when the page loads.

The users are displayed inside a responsive table containing:

- ID
- User
- Email
- Gender
- Hobbies
- Address
- Actions

---

### 3. Search Users

The search input filters users dynamically based on the entered text.

The search checks:

```text
Username
First Name
Last Name
Email
Gender
Country
City
State
```

---

### 4. Sort Users

Users can be sorted by:

```text
Username
Name
ID
```

The sorting can be changed between ascending and descending order.

---

### 5. Edit User

Clicking the **Edit** icon loads the selected user's information into the form.

After making changes, clicking **Update User** updates the existing record in Local Storage.

---

### 6. Delete User

Clicking the **Delete** icon asks for confirmation.

After confirmation, the selected user is removed from the users array and Local Storage.

---

### 7. Pagination

The application divides the user records into pages.

```text
Users Per Page = 5
```

The user can navigate using:

```text
Prev | 1 | 2 | 3 | Next
```

---

## 📂 Project Structure

```text
User-Management-System/
│
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
│
├── public/
│   └── ...
│
├── package.json
├── package-lock.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
│
└── README.md
```

> The exact folder structure may vary depending on your Next.js project setup.

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/sakinasendhi52/your-repository-name.git
```

### 2. Open the Project

```bash
cd User-Management-System
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

### 5. Open in Browser

```text
http://localhost:3000
```

---

## 📸 Screenshots

### User Registration Form

Add a screenshot of your user registration form here.

```html
<img src="assets/user-form.png" width="800" alt="User Registration Form">
```

### Users Data Table

Add a screenshot of your users table here.

```html
<img src="assets/users-table.png" width="800" alt="Users Data Table">
```

### Search, Sort & Pagination

Add a screenshot showing the search, sorting, and pagination functionality.

```html
<img src="assets/search-sort-pagination.png" width="800" alt="Search Sort Pagination">
```

---

## 🎥 Project Demo

**Project Demo:** Add your project demonstration video link here.

---

## 🚀 Live Demo

**Live Project:** Add your deployed project link here.

---

## 👩‍💻 Author

**Sakina Sendhi**

GitHub: https://github.com/sakinasendhi52

---

## ⭐ Thank You

Thank you for visiting this repository!

If you found this project useful, feel free to ⭐ the repository.
