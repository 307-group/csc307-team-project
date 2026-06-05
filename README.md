# CSC 307 Team Project — Markr — Notes & Todos App

A full-stack productivity app built with React, Express, and MongoDB. Sign up, log in, and manage your personal notes (with images and labels) and todos — everything is scoped to your account.

**Live App:** https://gray-grass-078797010.7.azurestaticapps.net/

**UI Prototype:** https://www.figma.com/make/JgY0HgYEdnu3v1RJZGnBTW/Notes-app---team-6---307?t=2BxbfZZ1zbLz19NE-20&fullscreen=1

---

## Team

| Name                | GitHub          |
| ------------------- | --------------- |
| _Erick Guerrero_    | _bobboyyy_      |
| _Haixin Huang_      | _haiixin_       |
| _Antonio Munoz_     | _antoniomunoz2_ |
| _Yun Waddy Oo_      | _Yun2828_       |
| _Dasha Baitazarova_ | _evilmeowie_    |

---

## Features

- JWT-based sign up / sign in (passwords hashed with bcrypt)
- Create, edit, and delete notes — with optional image uploads (Cloudinary) and label tagging
- Create, delete, and toggle completion on todos
- Create and delete labels to organize notes
- Export notes as a PDF

---

## Repo Structure

```
packages/
├── express-backend/   # Node.js + Express REST API + MongoDB/Mongoose
└── react-frontend/    # React SPA (Vite)
```

---

## Dev Environment Setup

### Prerequisites

- Node.js v18+
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (or local MongoDB)
- A [Cloudinary](https://cloudinary.com/) account (for image uploads)

### Steps

1. **Clone the repo**

   ```bash
   git clone https://github.com/307-group/csc307-team-project.git
   cd csc307-team-project
   ```

2. **Install dependencies**

   ```bash
   npm install
   cd packages/express-backend && npm install
   cd ../react-frontend && npm install
   ```

3. **Set up environment variables** — create a `.env` file in `packages/express-backend/`:

   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

   > Never commit this file — it's already in `.gitignore`.

4. **Run the backend**

   ```bash
   cd packages/express-backend
   npm run dev   # runs on http://localhost:3000
   ```

5. **Run the frontend**
   ```bash
   cd packages/react-frontend
   npm run dev   # runs on http://localhost:5173
   ```

---

## Code Style

Uses **Prettier** for formatting and **ESLint** for linting. Format your code before committing.

**VS Code:** Install the Prettier extension and enable Format On Save.

```bash
npm run lint   # check formatting + linting
```

---

## Running Tests

```bash
cd packages/express-backend
npm test
```

---

## Diagrams

### UML Class Diagram

![APP UML Diagram](APP%20UML%20Diagram.jpg)

---

## Access Control Sequence Diagrams

<img width="631" height="452" alt="Sign_up" src="https://github.com/user-attachments/assets/1ea3c3a3-7072-4682-8f00-9617c8ed7965" />

---

<img width="631" height="482" alt="sign_in_flow" src="https://github.com/user-attachments/assets/f72e0dc0-3ac7-489b-9aac-a83c16e7acf9" />

---

<img width="631" height="483" alt="Protected_Api" src="https://github.com/user-attachments/assets/f8e60577-62da-4c0f-9598-77979bc294eb" />
