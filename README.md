# 🚀 ConnectAll– Full-Stack Social Networking App

A modern LinkedIn-style social network built with **Next.js App Router**, **MongoDB**, **Clerk Authentication**, and **Tailwind CSS**.  
This project allows users to create posts, comment, like, manage profiles, and interact with others — designed to mimic core LinkedIn functionality with a clean UI.

---

## ⭐ Features

### 🔐 Authentication
- Secure login/signup with **Clerk**
- Protect API routes
- Access logged-in user with `currentUser()`

### 📝 Posts
- Create posts  
- Display feed in real-time  
- Like / Unlike posts  
- Fetch all posts or single post

### 💬 Comments
- Add comments on posts  
- Fetch comments by post ID  
- MongoDB schema linking post → comment

### 👤 User Profiles
- Auto-generated profile from Clerk  
- Stores users in MongoDB

### ⚙️ Tech Stack
- **Next.js 14 (App Router)**
- **TypeScript**
- **MongoDB + Mongoose**
- **Clerk Authentication**
- **Tailwind CSS + shadcn/ui**
- **Next.js Server Actions & Route Handlers**

---

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
git clone https://github.com/YOUR_USERNAME/linkedIn-clone.git

cd linkedIn-clone


### 2️⃣ Install dependencies
npm i


### 3️⃣ Environment Variables  
Create a `.env.local` file with:

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=

CLERK_SECRET_KEY=

MONGO_DB_USERNAME=

MONGO_DB_PASSWORD=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=


### 4️⃣ Run the development server

npm run dev



