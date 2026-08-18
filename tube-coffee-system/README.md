# TUBE Coffee Online Business System

A beginner-friendly React + Tailwind CSS + Firebase coffee shop system built from the supplied TUBE Coffee website assets.

## Included

- Public Home, About, Menu, Services, Contact pages
- Firebase Email/Password authentication
- Firestore user profiles with `Customer` / `Admin` roles
- Protected customer dashboard, profile, cart, checkout, and order history
- Protected admin dashboard
- Product CRUD with Firebase Storage image upload
- Category CRUD
- Order search, filtering, status updates, and deletion
- Customer search and role management
- Firestore and Storage security rules
- Optional Cloud Functions for securely deleting Authentication accounts
- Responsive Tailwind design using the supplied TUBE Coffee images

## 1. Install

```bash
npm install
```

## 2. Firebase setup

Create a Firebase project and enable:

1. Authentication → Sign-in method → Email/Password
2. Firestore Database
3. Storage

Copy `.env.example` to `.env` and add your Firebase web-app configuration.

Deploy the rules:

```bash
firebase login
firebase use YOUR_PROJECT_ID
firebase deploy --only firestore:rules,firestore:indexes,storage
```

If you want the optional secure Auth-account deletion/role Cloud Functions:

```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

## 3. Start the website

```bash
npm run dev
```

## 4. Create the first admin

Register a normal account from the website. Then, in Firestore, open:

`users/{the registered user's uid}`

Change:

```text
role: "Customer"
```

to:

```text
role: "Admin"
```

Sign out and sign in again. The account will be routed to `/admin`.

## 5. Add starter menu data

The optional `scripts/seed.js` uses Firebase Admin credentials and should be run only from a trusted machine/server.

The sample product images reference the supplied files in `public/assets`. For production, use the admin Product screen to upload images to Firebase Storage.

## Important security note

The browser must never contain a Firebase Admin SDK service-account key. The included Cloud Functions use the Admin SDK server-side for operations that should not be performed directly by a browser, such as deleting a Firebase Authentication account.

## Main routes

### Public
- `/`
- `/about`
- `/menu`
- `/services`
- `/contact`
- `/cart`
- `/login`
- `/register`
- `/forgot-password`

### Customer
- `/dashboard`
- `/orders`
- `/profile`
- `/checkout`

### Admin
- `/admin`
- `/admin/products`
- `/admin/orders`
- `/admin/users`
- `/admin/categories`

## Updated admin features

- Admin login now correctly checks the user's Firestore role after Firebase sign-in and redirects Admin users to `/admin` and Customer users to `/dashboard`.
- Customers must be signed in to access checkout and create orders. Guests can browse the menu and add items to the cart.
- Admin > Products provides full menu CRUD, including product image upload, price, category, availability, and descriptions.
- Admin > Services provides full CRUD for the public Services page. Admins can add, edit, hide/show, and delete services.
- The public Services page loads services from Firestore and falls back to the default TUBE Coffee services when none have been created.
- Admin dashboard now shows total customers, total products, total orders, pending orders, completed orders, and completed revenue.
