# 🚀 Deployment Guide: B Team App

You are deploying to **Vercel** (The best place for Next.js apps).

## Phase 1: Push Code (In Progress)
You are currently pushing your code to GitHub.
*   Repository: `https://github.com/bullowsprw/b-team-app`
*   Status: You should see your code there before proceeding.

## Phase 2: Deploy to Vercel

1.  **Log in to Vercel**:
    *   Go to [vercel.com](https://vercel.com) and log in (use your GitHub account).

2.  **Add New Project**:
    *   Click the **"Add New..."** button (top right) -> **"Project"**.
    *   You will see a list of your GitHub repositories.
    *   Find `b-team-app` and click **"Import"**.

3.  **Configure Project**:
    *   **Project Name**: Leave as `b-team-app` (or change if you want).
    *   **Framework Preset**: It should auto-detect `Next.js`.
    *   **Root Directory**: Leave as `./`.

4.  **⛔️ CRITICAL STEP: Environment Variables ⛔️**:
    *   Click to expand the **"Environment Variables"** section.
    *   You MUST add these 3 variables (copy them exactly):

| Name | Value |
| :--- | :--- |
| `DATABASE_URL` | `postgresql://postgres.vybllgzogctkbkixclbk:Bullows%241963@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres` |
| `NEXTAUTH_SECRET` | `dev-123` |
| `NEXTAUTH_URL` | (Leave this one empty for now, Vercel sets a default one automatically) |

    *   *Note: I have pasted your specific Database URL above so you can just copy it.*

5.  **Click Deploy**:
    *   Hit the big **"Deploy"** button.
    *   Wait ~1 minute. You will see confetti! 🎉

## Phase 3: Final Verification
1.  Click the **Screenshot** of your deployed app to open it.
2.  **Test Login**: Try logging in with your test account.
3.  **Test Admin**: Go to `/admin` and check if the Database light is Green.

---
**Need Help?**
If the build fails, copy the error logs and paste them in our chat!
