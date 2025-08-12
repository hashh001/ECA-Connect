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


1. **Open in Browser**  
   Open `index.html` in your web browser or use a local server as described below.


APIs: Google Identity Services, Gemini API 

CSS Framework: Tailwind CSS
