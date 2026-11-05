
# StudioSpace 🏢

StudioSpace is a modern studio booking platform that allows users to discover, explore, and book creative workspaces. Studio hosts can list their spaces, manage listings, and handle customer bookings through an easy-to-use dashboard.

## 🌐 Live Website

https://assignment-8-seven-gamma.vercel.app/

## ✨ Key Features

- **Explore Studios:** Browse available studios and discover different creative spaces.
- **Studio Details:** View studio images, descriptions, pricing, location, ratings, and host information.
- **User Authentication:** Register and log in using email and password.
- **Google Login:** Sign in using Google authentication.
- **Add New Studio:** Hosts can publish their own studio listings.
- **My Listings:** Manage personal studio listings.
- **Update Studio:** Edit existing studio information.
- **Delete Studio:** Remove studio listings.
- **Booking System:** Book studios by selecting a date, time, and duration.
- **My Bookings:** View and manage personal bookings.
- **Booking Management:** Hosts can confirm, complete, or cancel bookings.
- **Double Booking Prevention:** Prevent overlapping confirmed bookings.
- **Protected Routes:** Restrict private pages to authenticated users.
- **Responsive Design:** Optimized for desktop, tablet, and mobile devices.

## 🛠️ Technologies Used

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB
- Better Auth
- JWT Authentication

## 📂 Project Structure

```text
StudioSpace/
├── public/
│   └── images/
├── src/
│   ├── app/
│   │   ├── add-newstudio/
│   │   ├── api/
│   │   │   └── auth/
│   │   ├── dashboard/
│   │   ├── login/
│   │   ├── my-booking/
│   │   ├── my-listings/
│   │   ├── register/
│   │   ├── studios/
│   │   ├── lib/
│   │   ├── shared/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── components/
├── package.json
├── next.config.ts
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the Project Folder

```bash
cd YOUR_PROJECT_FOLDER
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the frontend root and add the required environment variables:

```env
NEXT_PUBLIC_API_URL=YOUR_BACKEND_API_URL
BETTER_AUTH_URL=YOUR_FRONTEND_URL
NEXT_PUBLIC_BETTER_AUTH_URL=YOUR_FRONTEND_URL
BETTER_AUTH_SECRET=YOUR_SECRET
MONGODB_URL=YOUR_MONGODB_CONNECTION_STRING
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
```

Configure the backend environment variables separately in the backend project.

### 5. Run the Development Server

```bash
npm run dev
```

### 6. Open in Browser

Visit:

```text
http://localhost:3000
```

## 🔐 Authentication & Security

- Email and password authentication.
- Google social authentication.
- Protected frontend routes.
- Backend authentication verification.
- HTTPOnly cookie-based session security.
- Protected studio and booking operations.

## 🚀 Deployment

The frontend is deployed using Vercel.

The backend API and MongoDB database are configured separately.

## 👨‍💻 Author

**Tasmia Chy**

GitHub: https://github.com/tasmiachowdhury1/assignment-8

---

⭐ Thank you for visiting StudioSpace!
