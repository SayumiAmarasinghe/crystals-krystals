# crystals-krystals

Repository for the SEVA project for Crystal's Krystals through the CPP club GDG.

A portfolio site for a jewelry artist. **Strapi** (backend) gives Crystal an admin panel to manage her pieces and serves them through an API; **React** (frontend) displays them.

---

## Prerequisites

- [Node.js](https://nodejs.org/) **v22**
- [Git](https://git-scm.com/)

---

## How to Set Up the Repository

On GitHub, click the green **Code** button.

### If you have GitHub Desktop

- Select **Open with GitHub Desktop**
- Choose a folder to clone the repository into

### If you don't have GitHub Desktop

- Install [Git](https://git-scm.com/) if you don't have it
- Open the terminal in your preferred IDE (VS Code, IntelliJ, etc.)
- Run:

```bash
git clone https://github.com/SayumiAmarasinghe/crystals-krystals.git
```

---

## Repo Structure

```
crystals-krystals/
  backend/    ← Strapi CMS (admin panel + API)
  frontend/   ← React app (Vite)
```

---

## ⚠️ Always pull before starting the backend

Everyone's backend connects to the **same shared database**. When Strapi starts, it updates that database to match the files on _your_ computer. If your files are out of date, it can delete data for everyone.

So every time:

```bash
git pull
```

The backend checks this for you — if you're missing changes, `npm run develop` will stop and tell you to pull.

---

## Backend

### First Time Setup

```bash
cd backend
npm install
cp .env.example .env
```

**1. Generate secrets.** Run this once for each value in `.env` that says `tobemodified`, and paste a different result into each one:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

`APP_KEYS` needs **two** values separated by a comma.

**2. Don't change the `DATABASE_` lines.** They're already set to the shared database.

**3. Add the Cloudinary values** (ask Lindsay — they're shared privately, never committed):

```
CLOUDINARY_NAME=
CLOUDINARY_KEY=
CLOUDINARY_SECRET=
```

**4. Start it:**

```bash
npm run develop
```

**5. Log in** at `http://localhost:1337/admin`. The shared database already has admin users, so you'll see a login screen instead of sign-up. Ask Lindsay for an invite link, or create your account from the terminal:

```bash
npm run strapi admin:create-user -- --firstname=YourName --email=you@example.com --password=YourPassword1
```

(The password needs 8+ characters with an uppercase letter, a lowercase letter, and a number.)

### Every Time After

```bash
git pull
cd backend
npm install
npm run develop
```

`npm install` is only needed when someone added a package, but it's quick and safe to run every time.

**First request slow?** The free database goes to sleep when nobody's using it. The first request after a while can take a few seconds while it wakes up.

---

## Frontend

### First Time Setup

```bash
cd frontend
npm install
```

### Every Time

```bash
cd frontend
npm run dev
```

App runs at `http://localhost:5173`.

**The backend needs to be running at the same time** — use two terminal tabs, one for `backend` and one for `frontend`.

---

## More docs

- `backend/docs/api.md` — API endpoints and data shapes
- `frontend/src/utils-guide.md` — how to use the frontend helper functions
