# Project Setup Guide

This guide will help you set up and run the project from scratch on a new machine.

---

## Prerequisites

Before starting, make sure you have the following installed:

- Node.js (v16 or above recommended)
- npm (comes with Node.js)
- Angular CLI
- Git

Check versions:

```bash
node -v
npm -v
ng version
git --version
```

---

## Clone Project

```bash
git clone https://github.com/your-username/your-project.git
cd your-project
```

---

## Install Dependencies

```bash
npm install
```

---

## Run Project (Development)

Run this project by usinmg this custom script:

Run:

```bash
npm run start:all
```

This will:
- Start Angular (http://localhost:4200)
- Start Electron app

---

## Manual Run (Optional)

Angular only:

```bash
ng serve
```

Electron only:

```bash
npm run electron
```

---

## Build Angular

```bash
ng build
```

Output:

```
dist/
```

---

## Production Electron Build

```bash
npm run electron:build
```

Or:

```bash
npm run dist
```

---

## Project Structure

```
src/
  app/
    components/
    pages/
    services/
    models/

electron/
  main.ts
  preload.ts

dist/
```

---

## Scripts

```json
{
  "scripts": {
    "start": "ng serve",
    "electron": "electron .",
    "start:all": "concurrently \"ng serve\" \"npm run electron\"",
    "build": "ng build",
    "electron:build": "npm run build && electron .",
    "dist": "electron-builder"
  }
}
```

---

## Workflow

Clone Project → NPM Install → npm run start:all → develop → ng build → electron build → package