Findly – Lost & Found Web Application

A modern, responsive Lost & Found web application built specifically for college campuses. Findly helps students report lost items, upload found items, search & filter posts, claim items, and manage their listings in a clean, fast and secure interface.

🚀 Features
👤 User Features
📌 Post Lost & Found Items with images
🔍 Search & Filter items quickly
📨 Claim Items with details
🌙 Dark Mode Toggle
🔔 Toast Notifications for actions
📱 Responsive UI (mobile + desktop)
🔐 Login & Signup using college email
📧 OTP-Based Email Authentication
👤 My Posts for all user uploads
🛠️ Admin Features
🗂️ View all posts (Lost, Found, View All, My Posts)
❌ Delete Inappropriate Posts (Admin only)
🛡️ Role-based access using Admin Guards
⚙️ Dashboard for management
🧱 Tech Stack

Frontend
Angular 16
Tailwind CSS
TypeScript
Angular Router
Reactive & Template-driven Forms
Storage / Backend
LocalStorage for temporary storage
API integration ready

🖥️ Setup Instructions
Prerequisites
Node.js (v16+ recommended)
Angular CLI installed globally
Modern web browser

Installation
1️⃣ Clone the repository
git clone https://github.com/rishith-tellies/Findly---a-lost-and-found-app-for-campus.git

2️⃣ Navigate to project folder
cd findly

3️⃣ Install dependencies
npm install

🚀 Running the Application
Development Server
ng serve

Open in browser:
http://localhost:4200/

The app automatically reloads on file changes.

📦 Production Build
ng build

Output goes to:
dist/findly/

You can deploy this folder to any static hosting like:
Netlify
Vercel
GitHub Pages

Firebase Hosting

🧪 Testing
Unit Tests (Karma)
ng test
E2E Tests
ng e2e
(Ensure e2e packages are installed.)

📚 How to Use
For Students (Users)
🔍 Finding Items
Navigate to Lost/Found Items
Search or apply filters
Click an item to see full details
📌 Reporting Lost Items
Go to Post Item
Upload image + details
Submit
Your item is now visible to everyone.
📥 Claiming Found Items
Open item
Click Claim
Fill form and submit

For Admins
🗂 View All Items
Admins see all posts across categories.
❌ Delete Inappropriate Content
Click Delete on any post card.
🔐 Protected Routes
Admin pages require Admin Guard access.

🛠️ Project Architecture
src/
 ├── app/
 │   ├── components/
 │   ├── services/
 │   ├── pages/
 │   ├── guards/
 │   ├── models/
 │   └── app-routing.module.ts
 ├── assets/
 └── index.html

❗ Troubleshooting
Authentication not working?
Ensure email format is correct
OTP delivery may take a few seconds
UI errors?
Restart Angular dev server
Ensure all modules (FormsModule, ReactiveFormsModule) are imported
Admin functions not visible?
Check your isAdmin flag in code or API

📄 License
MIT License – feel free to use, modify, and contribute.

🤝 Contributing
Pull requests are welcome!
Open an issue for bugs, improvements, or new feature ideas.
