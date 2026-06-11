# Store Rating Platform

A full-stack web application where users can browse stores and submit ratings (1–5 stars). Built as a FullStack Intern Coding Challenge.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Backend | Node.js + Express.js | REST API server |
| Database | PostgreSQL | Relational database |
| ORM | Prisma 7 | Type-safe database queries + migrations |
| Authentication | JWT (jsonwebtoken) | Stateless token-based auth |
| Password Security | bcryptjs | One-way password hashing |
| Validation | Zod | Schema-based input validation |
| Frontend | React 19 + Vite | Component-based UI with fast dev server |
| Styling | TailwindCSS v4 | Utility-first CSS framework |
| Forms | react-hook-form | Performant form handling with validation |
| HTTP Client | axios | API calls with JWT interceptor |
| Notifications | react-toastify | Success/error toast messages |

---

## Project Structure

```
Store-Rating/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # Database models (User, Store, Rating, AuditLog)
│   │   ├── prisma.config.ts     # Prisma 7 adapter configuration
│   │   └── seed.js              # Demo data seeder
│   └── src/
│       ├── prisma/
│       │   └── index.js         # Prisma client singleton
│       ├── middleware/
│       │   ├── auth.js          # JWT verification middleware
│       │   ├── roles.js         # Role-based access control middleware
│       │   └── validate.js      # Zod schema validation middleware
│       ├── validations/
│       │   ├── authValidators.js   # Register, login, change password schemas
│       │   ├── userValidators.js   # Admin create user schema
│       │   ├── storeValidators.js  # Create store schema
│       │   └── ratingValidators.js # Submit/update rating schema
│       ├── services/
│       │   ├── authService.js   # Register, login, change password logic
│       │   ├── adminService.js  # Dashboard, users CRUD, stores CRUD
│       │   ├── storeService.js  # Public store listing + detail
│       │   ├── ownerService.js  # Store owner dashboard
│       │   └── ratingService.js # Submit, update, delete ratings
│       ├── controllers/         # HTTP request/response handlers
│       ├── routes/              # URL → controller mapping
│       └── utils/
│           ├── jwt.js           # Sign and verify JWT tokens
│           ├── hashPassword.js  # bcrypt hash and compare
│           └── ApiError.js      # Custom error class with status codes
└── frontend/
    └── src/
        ├── layouts/
        │   ├── Navbar.jsx       # Top navigation bar
        │   ├── Sidebar.jsx      # Role-aware sidebar navigation
        │   └── ProtectedRoute.jsx # Auth + role guard for routes
        ├── context/
        │   └── AuthContext.jsx  # Global auth state (user, token, login, logout)
        ├── hooks/
        │   ├── useAuth.js       # Hook to access AuthContext
        │   └── useDebounce.js   # Delays search input by 300ms
        ├── services/
        │   ├── axiosInstance.js # axios with JWT interceptor + 401 redirect
        │   ├── authApi.js       # Login, register, change password API calls
        │   ├── adminApi.js      # Admin dashboard, users, stores API calls
        │   ├── storeApi.js      # Public store listing API calls
        │   ├── ownerApi.js      # Store owner dashboard API calls
        │   └── ratingApi.js     # Submit, update, delete rating API calls
        ├── pages/
        │   ├── auth/            # LoginPage, RegisterPage
        │   ├── admin/           # AdminDashboard, AdminUsers, AdminUserDetail,
        │   │                    # AdminStores, AdminStoreDetail
        │   ├── user/            # StoreList, StoreDetail
        │   ├── owner/           # OwnerDashboard
        │   └── shared/          # ChangePasswordPage, NotFoundPage
        └── components/
            ├── ui/              # Button, Input, Table, Modal, Spinner, StarRating
            └── forms/           # LoginForm, RegisterForm, UserForm, StoreForm,
                                 # PasswordForm
```

---

## Database Schema

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String                          // min 20, max 60 chars
  email     String   @unique
  password  String                          // bcrypt hashed
  address   String   @default("") @db.VarChar(400)
  role      Role     @default(USER)         // ADMIN | USER | STORE_OWNER
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  stores    Store[]  @relation("OwnerStores")
  ratings   Rating[]
}

model Store {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  address   String   @db.VarChar(400)
  ownerId   Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  owner     User     @relation("OwnerStores", fields: [ownerId], references: [id], onDelete: Cascade)
  ratings   Rating[]
}

model Rating {
  id        Int      @id @default(autoincrement())
  userId    Int
  storeId   Int
  rating    Int      @default(1)            // 1 to 5
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(...)
  store     Store    @relation(...)
  @@unique([userId, storeId])              // one rating per user per store
}
```

---

## API Routes

### Auth (`/api/auth`)
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Create a new USER account |
| POST | `/login` | Public | Login, returns JWT token |
| PUT | `/password` | Any logged-in user | Change own password |

### Admin Dashboard (`/api/admin`)
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/dashboard` | ADMIN | Total users, stores, ratings |

### Users (`/api/users`)
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/` | ADMIN | List users (search + role filter) |
| GET | `/:id` | ADMIN | User detail + rating history |
| POST | `/` | ADMIN | Create new user |

### Stores (`/api/stores`)
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List stores (search, includes user's rating) |
| GET | `/:id` | Public | Store detail + user's rating |
| POST | `/` | ADMIN | Create new store |

### Owner (`/api/owner`)
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/dashboard` | STORE_OWNER | Store stats + reviewer list |

### Ratings (`/api/ratings`)
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/` | USER | Submit a rating (1–5) |
| PUT | `/:id` | USER | Update own rating |
| DELETE | `/:id` | USER | Delete own rating |

---

## User Roles & Permissions

### System Administrator
- View dashboard: total users, stores, ratings
- Add and view all users (with Name, Email, Address, Role)
- Add and view all stores (with Name, Email, Address, Rating)
- Filter all listings by Name, Email, Address, Role
- Sort all tables by any column (ascending/descending)
- View user detail — Store Owners show their store's average rating
- Change own password

### Normal User
- Register and login
- Browse all stores with search by name/address
- See overall store rating and own submitted rating on store cards
- Submit, edit, or delete a rating (1–5 stars) for any store
- Change own password

### Store Owner
- Login
- View own store's average rating
- View list of all customers who rated their store
- Sort reviewer table by any column
- Change own password

---

## Form Validations

| Field | Rule |
|---|---|
| Name | Min 20 characters, Max 60 characters |
| Email | Valid email format |
| Address | Max 400 characters |
| Password | 8–16 characters, at least 1 uppercase letter, at least 1 special character |

Validated on both frontend (react-hook-form) and backend (Zod).

---

## Setup & Installation

### Prerequisites
- Node.js v18+
- PostgreSQL (running locally on port 5432)

### 1. Clone and install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment

Edit `backend/.env`:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/store_rating"
JWT_SECRET="your-secret-key"
PORT=5000
CLIENT_URL="http://localhost:5173"
```

### 3. Create the database

In psql:
```sql
CREATE DATABASE store_rating;
```

### 4. Run migrations and seed

```bash
cd backend
npx prisma migrate dev --name init --config prisma/prisma.config.ts
node prisma/seed.js
```

### 5. Start the application

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open **http://localhost:5173**

---

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@storerating.com` | `Admin@12345` |
| Store Owner | `owner@storerating.com` | `Owner@12345` |
| Normal User | `user@storerating.com` | `User@12345` |

---

## Key Technical Decisions

### Why Prisma 7 with PrismaPg adapter?
Prisma 7 removed the `url` field from the datasource block in `schema.prisma`. Instead, the database URL is provided via a `prisma.config.ts` file using the `PrismaPg` adapter. This separates configuration from the schema definition and enables better environment handling.

### Why JWT over sessions?
JWT tokens are stateless — the server doesn't need to store session data. The token carries the user's `id`, `email`, and `role` so every request is self-contained. This scales well and works cleanly with React's localStorage.

### Why Zod for validation?
Zod schemas are defined once and reused across multiple routes. The `validate.js` middleware automatically returns structured 400 errors with field-level messages when any input fails.

### Why client-side sorting in Table.jsx?
All data for a given list is fetched in one API call. Sorting in the browser avoids extra API roundtrips and feels instant for the data volumes expected in this application.

### Why `@@unique([userId, storeId])` on Rating?
Enforces the business rule that a user can only submit one rating per store at the database level — not just in application code. This prevents duplicates even if there's a bug in the application layer.

---

## Scripts

### Backend
| Command | Description |
|---|---|
| `npm run dev` | Start with nodemon (auto-restart on file changes) |
| `npm start` | Start without nodemon |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed demo data |
| `npm run db:studio` | Open Prisma Studio (visual DB browser) |

### Frontend
| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server on port 5173 |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
