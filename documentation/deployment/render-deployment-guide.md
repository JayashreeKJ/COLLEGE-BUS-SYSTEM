# Render Deployment Guide: SmartBus Backend & Vercel Integration

This guide provides the complete walkthrough for deploying the **SmartBus Spring Boot Backend** to [Render](https://render.com) and linking it with your live frontend hosted at [`college-bus-system.vercel.app`](https://college-bus-system.vercel.app/).

---

## Architecture Overview

```mermaid
flowchart LR
    subgraph Vercel ["Frontend (Vercel)"]
        FE["React + Vite Single Page App<br/><b>college-bus-system.vercel.app</b>"]
    end

    subgraph Render ["Render Cloud Platform"]
        API["Spring Boot Backend API (Java 21)<br/><b>smartbus-backend.onrender.com</b>"]
        DB[("PostgreSQL Database<br/>(Render Free Tier) or MySQL")]
    end

    FE -- "HTTPS API Requests (JWT)<br/>VITE_API_BASE_URL" --> API
    API -- "JPA / Hibernate" --> DB
```

---

## Method 1: 1-Click Blueprint Deployment (Recommended)

Render provides Infrastructure-as-Code via [render.yaml](file:///c:/COLLEGE-BUS-SYSTEM/render.yaml) located at the root of the project.

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "feat: configure backend Dockerfile and render.yaml for Render deployment"
   git push origin main
   ```
2. Go to your **[Render Dashboard](https://dashboard.render.com/)**.
3. Click the **"New +"** button in the top right, and select **"Blueprint"**.
4. Connect your **`COLLEGE-BUS-SYSTEM`** GitHub repository.
5. Render will automatically detect [render.yaml](file:///c:/COLLEGE-BUS-SYSTEM/render.yaml) and configure:
   - **Web Service**: `smartbus-backend` (Docker runtime, health check at `/api/health`)
   - **Database**: `smartbus-db` (Free PostgreSQL instance)
   - Connection link: `DATABASE_URL` is automatically wired between database and backend.
6. Click **"Apply"**.
7. Render will build the Docker container and start your backend service. Once deployed, note down your backend URL (e.g. `https://smartbus-backend.onrender.com`).

---

## Method 2: Manual Web Service Setup (Step-by-Step)

If you prefer configuring services manually via the Render UI:

### Step 2.1: Create the Database

You can use either **Render Free PostgreSQL** or a free cloud **MySQL** (Aiven, Clever Cloud, Railway, TiDB):

#### Option A: Free PostgreSQL on Render (Easiest)
1. On Render Dashboard, click **New +** > **PostgreSQL**.
2. Set Name: `smartbus-db`.
3. Set Database: `smartbus_db`.
4. Set User: `smartbus_user`.
5. Select the **Free** plan.
6. Click **Create Database**.
7. In the database page, copy the **Internal Database URL** (e.g. `postgresql://smartbus_user:...@dpg-.../smartbus_db`).

#### Option B: Cloud MySQL (Aiven / Clever Cloud / Railway)
- Copy your MySQL JDBC connection URL, username, and password.

---

### Step 2.2: Create the Backend Web Service

1. On Render Dashboard, click **New +** > **Web Service**.
2. Select your connected Git repository (`COLLEGE-BUS-SYSTEM`).
3. Fill in the following settings:
   - **Name**: `smartbus-backend`
   - **Region**: Oregon (or Ohio / closest to you)
   - **Language / Runtime**: **`Docker`**
   - **Branch**: `main`
   - **Root Directory**: leave blank (or `backend` if using `backend/Dockerfile`)
   - **Dockerfile Path**: `./backend/Dockerfile`
   - **Instance Type**: **Free**
4. Expand **Advanced Settings**:
   - **Health Check Path**: `/api/health`
5. Add the following **Environment Variables**:

| Environment Variable | Value | Notes |
| :--- | :--- | :--- |
| `PORT` | `8080` | Render's web port |
| `CORS_ALLOWED_ORIGINS` | `https://college-bus-system.vercel.app,http://localhost:5173` | Allows frontend requests without CORS errors |
| `JWT_SECRET` | *(Random 32+ character string)* | e.g. `smartbusSuperSecretKeyForCollegeProjectTransitSystemTracking2026Secure` |
| `HIBERNATE_DDL_AUTO` | `update` | Auto-creates tables and updates schema |
| `DATABASE_URL` | *(Paste Internal Database URL from Step 2.1)* | Automatically parsed into JDBC format |

*(Note: If using cloud MySQL instead of PostgreSQL, set `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` instead of `DATABASE_URL`).*

6. Click **Create Web Service**.
7. Wait 2-3 minutes for the build to finish.
8. Test that the backend is alive:
   ```bash
   curl https://<your-service-name>.onrender.com/api/health
   ```
   You should see:
   ```json
   {
     "status": "UP",
     "message": "SmartBus Backend API is running successfully",
     "version": "1.0.0-SNAPSHOT",
     "environment": "development"
   }
   ```

---

## Step 3: Link Your Vercel Frontend to Render Backend

Now update your frontend at `https://college-bus-system.vercel.app` so it sends API requests to your live Render backend:

1. Go to your **[Vercel Dashboard](https://vercel.com/)**.
2. Select the **`college-bus-system`** project.
3. Go to **Settings** > **Environment Variables**.
4. Add or update the variable:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://<your-service-name>.onrender.com/api`  *(Ensure it ends with `/api` and has no trailing slash)*
   - **Environments**: Check `Production`, `Preview`, and `Development`.
5. Click **Save**.
6. Trigger a **Redeploy**:
   - Go to the **Deployments** tab.
   - Click the three dots `...` on the latest deployment and click **Redeploy**.
   *(Vite bundles environment variables at build time, so a redeploy is required for changes to take effect).*

---

## Step 4: Verify Full-Stack Functionality

Open [college-bus-system.vercel.app](https://college-bus-system.vercel.app/) in your browser:

1. **Health Banner**: The top system connection pill should display **"Backend: Online"**.
2. **Demo Accounts**: You can log in immediately with the pre-seeded accounts:
   - **Admin**: `admin@college.edu` / `password123`
   - **Driver**: `driver@college.edu` / `password123`
   - **Student**: `student@college.edu` / `password123`
3. **Live GPS Tracking**: The simulation engine and active trip endpoints will communicate directly with your Render API!

---

## Important Render Free Tier Tips

> [!NOTE]
> **Free Tier Spin-down (Cold Starts)**: Free instances on Render spin down after 15 minutes of inactivity. When a new request arrives, it can take 30–50 seconds to wake up. This is normal on the free tier. Once awake, response times return to sub-second speeds.
