# crystals-krystals
Repository for the SEVA project for Crystal's Krystals through the CPP club GDG

## How to Set Up the Repository 
    -navigate to the repository, and click on the green button called "Code" 

### If Github Desktop Is Downloaded:
    -select the Open with Github Desktop option
    -choose a folder to clone the repository in 

### If you do NOT have Github Desktop Downloaded 
    -install Git if you do not have it 
    -open the terminal in your preferred IDE (VS Code, Intellijay, etc)
    -run this command in the terminal: 
        gh repo clone SayumiAmarasinghe/crystals-krystals

---  

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)  

---  

## Repo Structure

```
crystals-krystals/
  backend/    ← Strapi CMS
  frontend/   ← React app 
```

---  


## Backend

### First Time Setup
```bash
cd backend
npm install
cp .env.example .env
```
Generate a random secret for each value and replace the placeholders in `.env`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Run that multiple times, paste a different value into each field in `.env`.

Then start it:

```bash
npm run develop
```

Go to `http://localhost:1337/admin` and create your admin account.

### Every Time After

```bash
cd backend
npm run develop
```

