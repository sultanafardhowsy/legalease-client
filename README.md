LegalEase – Online Lawyer Hiring Platform
LegalEase is a modern, full-stack digital marketplace designed to connect clients and businesses with verified legal experts seamlessly. The platform democratizes access to legal aid, allowing users to browse, discover, and hire specialized lawyers while providing a secure, streamlined management system for legal professionals and administrators.

🔗 Live URL & Credentials
Live Site: https://leagalease-client.vercel.app

Client Repository:https://github.com/sultanafardhowsy/legalease-client

Server Repository: https://github.com/sultanafardhowsy/legalease_server

🚀 Key Features
👤 Authentication & Roles
Dual Authentication: Secure login/registration via Email/Password or Google OAuth (integrated using better-auth).

Role-Based Access Control (RBAC): Distinct interfaces and capabilities for Clients (Users), Lawyers, and Admins enforced by JWT tokens.

🔍 Client (User) Features
Browse & Search: Explore lawyers with global search (by name/specialization), filtering (fee range, availability), and pagination.

Hiring Workflow: Send hiring requests, track real-time status (Pending, Accepted, Rejected), and securely complete payments via Stripe.

Interactive Comments: Leave reviews and feedback on lawyer profiles (restricted exclusively to users with completed hiring records).

Profile Management: Update personal details and manage past/active comments directly from the dashboard.

⚖️ Lawyer Features
Professional Profile Management: Upload high-resolution avatars via imgBB, define areas of expertise, set hourly consultation fees, and detail professional bios.

Hiring Management: View incoming client requests, update request statuses (Accept/Reject), and maintain a transparent case history.

Publishing Control: Manage legal service listings with full CRUD capabilities.

🛡️ Admin Features
User Oversight: Monitor system-wide users, dynamically modify user roles, and remove accounts if necessary.

Listing Moderation: Review and moderate all lawyer profiles/listings in the marketplace.

Financial Transparency & Analytics: Oversee aggregated transaction ledgers alongside dynamic analytics dashboards displaying total revenue, users, lawyers, and hires.

🛠️ Tech Stack & Packages Used
Frontend (Next.js 16 / React 19)
Framework: next (App Router)

UI Components & Styling: @heroui/react, tailwindcss, @tailwindcss/postcss

Icons: lucide-react, @gravity-ui/icons

Animations & Layout: framer-motion, swiper

Forms & Validation: react-hook-form

Authentication: better-auth

Data Fetching & State: Native React hooks

Charts & Tables: recharts

Notifications: react-toastify, @heroui/toast

Stripe Integration: @stripe/react-stripe-js, @stripe/stripe-js

Backend (Node.js / Express)
Database: mongodb (Native MongoDB Driver)

Authentication/Security: jsonwebtoken

Payments: stripe

File/Image Handling: Direct integration with imgBB API for profile/service photos.

⚙️ Environment Variables Configuration
To run this project locally, make sure to set up your environment files properly.

📥 Local Setup & Installation
Clone the repositories:

Bash
git clone https://github.com/sultanafardhowsy/legalease-client.git
git clone https://github.com/sultanafardhowsy/legalease_server.git

Install dependencies for both folders:
npm i
Bash
npm install
