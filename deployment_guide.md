# Deployment Guide - B Team App

Ready to take your app online? Follow these steps to deploy to **Vercel** (the creators of Next.js).

## 1. Prerequisites (Checklist)
- [ ] **Logo File**: I noticed `public/logo.jpeg` is currently **MISSING**.
    > **ACTION REQUIRED**: Please save your official Bullows logo as `logo.jpeg` inside the `public/` folder before deploying.
- [ ] **GitHub Account**: You need a GitHub account to push your code.
- [ ] **Vercel Account**: Sign up at [vercel.com](https://vercel.com) using your GitHub account.

## 2. Push Code to GitHub
Open your terminal in the project folder and run:

```bash
# Initialize Git (if not done)
git init
git add .
git commit -m "Initial commit - B Team App"

# Create a repo on GitHub.com called 'b-team-app'
# Then link it (replace YOUR_USERNAME):
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/b-team-app.git
git push -u origin main
```

## 3. Deploy to Vercel
1.  Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Import the `b-team-app` repository you just created.
4.  **Configure Project**:
    -   **Framework Preset**: Next.js (Auto-detected)
    -   **Environment Variables**:
        -   `NEXTAUTH_SECRET`: Generate a random string (e.g., use `openssl rand -base64 32`).
        -   `NEXTAUTH_URL`: Your Vercel URL (e.g., `https://b-team-app.vercel.app`) - *Add this after the first deployment*.
        -   `DATABASE_URL`: Your PostgreSQL connection string (Supabase/Neon).
5.  Click **Deploy**.

## 4. Final Polish
-   **Favicon**: Update `app/favicon.ico` if needed.
-   **PWA**: Your app is already configured as a PWA! Users can install it from the browser menu.

## Support
The `admin@bullows.com` email alerts for Support Tickets will appear in your **Vercel Function Logs** since we set them to simulate via console.log.
