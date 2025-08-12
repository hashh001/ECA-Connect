# My Project
Version: 1.0.1  
Last Updated: 2025-08-12 10:46:23

# ECA Connect – Phase 1A

## Description
**ECA Connect** is a community-focused web application that helps users discover and join local activity groups based on shared extracurricular interests such as sports, arts, fitness, and hobbies.  

This repository contains **Phase 1A** of the project, focusing on **onboarding and authentication**. Users can sign up, log in, verify their email, and complete an initial profile setup with interests, availability, and location radius.

---

## Features (Phase 1A)
- **User Authentication**  
  - Sign up with Email/Password (with inline validation)  
  - Google Sign-In (OAuth 2.0 via Google Identity Services)  
  - Forgot password flow  
  - Email verification for email-based sign-ups  
- **Profile Setup**  
  - Multi-select interests from a searchable list  
  - Day-of-week and time-range availability picker  
  - Location radius selection via slider or numeric input  
- **UI Framework**  
  - Tailwind CSS for responsive, utility-first styling  
  - Predefined typography scale, color palette, and button styles  
- **App Shell & Navigation**  
  - Header with logo, profile, and logout options  
  - Placeholder tabs for Home, Create Group, Messages, and Profile  
- **Hello API Screen**  
  - Simple backend connectivity test

---

## Tech Stack
- **Frontend**: HTML5, Tailwind CSS, JavaScript (Vanilla)
- **Authentication**: Google Identity Services API
- **AI Integration (Planned)**: Gemini API
- **Icons**: Font Awesome
- **Fonts**: Inter (Google Fonts)

---

## Folder Structure
eca-connect/
│
├── index.html # Main HTML file
├── css/ # Tailwind + custom styles
├── js/ # JavaScript logic
├── images/ # Assets (logos, placeholders)
└── README.md

---

## How to Run Locally
1. **Clone the repository**  
   ```bash
   git clone https://github.com/yourusername/eca-connect.git
   cd eca-connect
Install dependencies (if any)
(Phase 1A is mostly static, so dependencies are minimal)

Run using a local development server

If using VS Code, install the “Live Server” extension

Right-click index.html → Open with Live Server
OR run with Python’s built-in HTTP server:

bash
Copy
Edit
python -m http.server 5500
Visit: http://localhost:5500

2. **Open in Browser**  
   Open `index.html` in your web browser or use a local server as described below.

Credits
Development: Harsh Garg

UI/UX Design: Harsh garg

APIs: Google Identity Services, Gemini API 

CSS Framework: Tailwind CSS
