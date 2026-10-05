# Next.js 16 Folder Structure & Architecture Guidelines

**Status:** Critical (Important — Pin to Trello)  
**Last Updated:** April 2026  
**Team:** Migration from Express to Next.js 16 with Prisma & BetterAuth

---

## 📁 Approved Folder Structure

```
src/
├── app/                          # Next.js App Router (Routing & Server Components only)
│   ├── (auth)/                   # Route groups for auth pages
│   ├── (dashboard)/              # Route groups for authenticated pages
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
│
├── components/                   # Truly shared UI primitives
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   └── ...
│
├── features/                     # THE CORE: Domain-specific modules
│   ├── auth/
│   │   ├── components/           # Auth-specific UI (LoginForm, SignupForm)
│   │   ├── hooks/                # Auth-specific hooks (useAuth, useSession)
│   │   ├── state/                # Redux slices for auth state
│   │   ├── schemas/              # Zod schemas (LoginSchema, SignupSchema)
│   │   ├── api.ts                # API calls to Express backend (login, signup, refresh)
│   │   ├── actions.ts            # Server actions for auth (if needed)
│   │   ├── middleware.ts         # Auth middleware logic (optional, if complex)
│   │   ├── types.ts              # Auth-specific TypeScript interfaces
│   │   └── index.ts              # Public API export barrel file
│   │
│   ├── products/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── state/
│   │   ├── schemas/
│   │   ├── api.ts
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   └── [other-domains]/          # Add domains as features grow
│
├── hooks/                        # Global utility hooks ONLY
│   ├── useLocalStorage.ts        # Zero domain knowledge
│   ├── useWindowSize.ts          # Zero domain knowledge
│   ├── useDebounce.ts
│   └── useTheme.ts
│
├── lib/                          # Shared configurations & utilities
│   ├── api-client.ts             # Axios or fetch wrapper (THE SOURCE OF TRUTH)
│   ├── redux-setup.ts            # Redux store configuration
│   ├── betterauth-config.ts      # BetterAuth configuration
│   ├── prisma-client.ts          # Prisma client (if used on frontend)
│   └── constants.ts              # Global constants, enums, config
│
├── types/                        # Global TypeScript interfaces
│   ├── api.ts                    # API response types (User, Product, etc.)
│   ├── domain.ts                 # Core domain types
│   └── index.ts
│
└── Proxy.ts                 # Next.js middleware (auth route protection, etc.)
```

---

## 🎯 Core Architectural Rules

### 1. **`app/` Folder: Routing & Server Components ONLY**

**What belongs here:**

- Page components and layouts (routing)
- Server-side data fetching (if using getServerSideProps equivalent)
- Route handlers (`route.ts`)

**What DOES NOT belong here:**

- Business logic
- Complex state management
- API integrations
- Domain-specific components

**Rule Enforcement:**

- **Page files must be < 30 lines of code.** If longer, logic is leaking.
- A page should only:
  1. Call a server action or fetch from `features/*/api.ts`
  2. Pass data to a feature component
  3. Handle layout/routing concerns

**Example (GOOD):**

```tsx
// app/dashboard/page.tsx
import { ProductList } from "@/features/products";

export default async function DashboardPage() {
	const products = await fetchProducts(); // From features/products/api.ts
	return <ProductList data={products} />;
}
```

**Example (BAD):**

```tsx
// app/dashboard/page.tsx — WRONG!
import { useState, useEffect } from "react";

export default function DashboardPage() {
	const [products, setProducts] = useState([]);
	const [filter, setFilter] = useState("");

	useEffect(() => {
		const res = await fetch("/api/products?search=" + filter);
		setProducts(await res.json());
	}, [filter]);

	return <div>{/* 60 lines of rendering logic */}</div>;
}
```

❌ **Why:** State management, data fetching, and rendering logic are all mixed in `app/`. This violates the separation of concerns.

---

### 2. **`features/` Folder: Domain-Specific Modules (The Core)**

**Principles:**

- Each feature is self-contained with its own components, hooks, state, and API calls.
- A feature knows about its own domain; it does NOT know about other features' internals.
- Exports a public API via `index.ts` barrel file.

**Structure per Feature:**

```
features/auth/
├── components/          # Auth UI (LoginForm, SignupForm, LogoutButton)
├── hooks/               # Auth hooks (useAuth, useSession, useAuthGuard)
├── state/               # Redux slices (authSlice)
├── schemas/             # Zod validation (loginSchema, signupSchema)
├── api.ts               # API calls (login, signup, logout, refreshToken)
├── actions.ts           # Server actions (if needed for form handling)
├── types.ts             # Auth-specific types (User, Session, AuthError)
├── middleware.ts        # Auth logic (optional, only if complex)
└── index.ts             # Barrel: export public API
```

**Barrel File Pattern (`features/auth/index.ts`):**

```typescript
// Public API — only export what other features should use
export { useAuth } from "./hooks";
export { LoginForm, SignupForm } from "./components";
export type { User, Session } from "./types";
export { authSlice } from "./state";

// NOT exported — internal only:
// - loginAPI (use via useAuth hook)
// - AuthError types (internal)
// - loginSchema (internal validation)
```

**Why:** Other features import from `features/auth/index.ts`, not from internals. This prevents tight coupling and makes refactoring safe.

---

### 3. **`services/` is REMOVED — API Calls Go Inside `features/`**

**Problem:** Having both `services/` and `features/*/api.ts` creates confusion about where API calls belong.

**Solution:** Kill the top-level `services/` folder entirely.

**Where API calls live:**

- `features/auth/api.ts` — login, signup, logout, refresh token
- `features/products/api.ts` — fetch products, create product, delete product

**The only shared piece: `lib/api-client.ts`**

```typescript
// lib/api-client.ts — THE SOURCE OF TRUTH
import axios from "axios";

const apiClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
	headers: {
		"Content-Type": "application/json",
	},
});

// Add request interceptor for auth token
apiClient.interceptors.request.use((config) => {
	const token = localStorage.getItem("auth_token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export default apiClient;
```

**Feature API file example:**

```typescript
// features/auth/api.ts
import apiClient from "@/lib/api-client";
import { loginSchema, signupSchema } from "./schemas";

export async function loginAPI(email: string, password: string) {
	const { data } = await apiClient.post("/auth/login", { email, password });
	return data;
}

export async function signupAPI(payload: unknown) {
	const validated = signupSchema.parse(payload);
	const { data } = await apiClient.post("/auth/signup", validated);
	return data;
}

export async function refreshTokenAPI() {
	const { data } = await apiClient.post("/auth/refresh");
	return data;
}
```

---

### 4. **`components/` Folder: UI Primitives ONLY**

**What belongs here:**

- Reusable UI components with zero domain knowledge.
- Examples: `Button`, `Input`, `Modal`, `Card`, `Badge`, `Checkbox`.

**What does NOT belong here:**

- `LoginForm` (auth domain) → goes in `features/auth/components/`
- `ProductCard` (product domain) → goes in `features/products/components/`
- `UserProfile` (user domain) → goes in `features/user/components/`

**Test:** If a component's props reference a domain concept (User, Product, Auth), it's a feature component, not a primitive.

---

### 5. **`hooks/` Folder: Global Utility Hooks ONLY**

**What belongs here:**

- `useLocalStorage` — zero domain knowledge
- `useWindowSize` — zero domain knowledge
- `useDebounce` — zero domain knowledge
- `useTheme` — zero domain knowledge
- `useClickOutside` — zero domain knowledge

**What does NOT belong here:**

- `useAuth` (auth domain) → goes in `features/auth/hooks/`
- `useProducts` (product domain) → goes in `features/products/hooks/`
- `useProductFilter` (product domain) → goes in `features/products/hooks/`

**Enforcement Rule:**
If a hook's logic touches ANY domain concept (auth state, product data, user context), it must live inside `features/`. The global `hooks/` folder is a graveyard otherwise — enforce this hard in code review.

---

### 6. **`state/` vs `store/` Naming (Minor)**

Currently using `features/auth/store/` for Redux slices.

**Choice:** Rename to `features/auth/state/` for consistency. `store/` implies it's Redux-specific; `state/` is framework-agnostic (could be Redux, Zustand, Jotai, etc. tomorrow).

**Not a breaking change**, but document it: Redux is the current choice, but the folder name leaves room to migrate state management without restructuring.

---

### 7. **`middleware.ts` Placement & Thin Logic**

Next.js requires `middleware.ts` at the root for route protection.

**Location:** `src/middleware.ts`

**Rule:** Middleware stays THIN. Auth logic lives in `features/auth/`, middleware just calls into it.

**Good Example:**

```typescript
// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAPI } from "@/features/auth/middleware";

export async function middleware(request: NextRequest) {
	const isAuthenticated = await isAuthenticatedAPI(request);

	if (!isAuthenticated && request.nextUrl.pathname.startsWith("/dashboard")) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard/:path*", "/admin/:path*"],
};
```

**Bad Example (DON'T):**

```typescript
// src/middleware.ts — WRONG!
export async function middleware(request: NextRequest) {
	const token = request.cookies.get("auth_token")?.value;

	if (!token) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	// 50 lines of JWT validation logic...
	// This should be in features/auth/, not here!
}
```

---

### 8. **Redux Setup & Store Configuration**

Keep Redux store setup in `lib/redux-setup.ts` (or `lib/store.ts`).

**Store structure (inside Redux):**

```typescript
// lib/redux-setup.ts
import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "@/features/auth/state";
import { productSlice } from "@/features/products/state";

export const store = configureStore({
	reducer: {
		auth: authSlice.reducer,
		products: productSlice.reducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

**Why here and not in `features/`:** The store is a singleton. Each feature contributes a slice, but the store itself is global infrastructure.

---

### 9. **BetterAuth Configuration**

BetterAuth config belongs in `lib/betterauth-config.ts`.

**Why:** It's infrastructure setup, not a feature. All features consuming auth use the same config.

```typescript
// lib/betterauth-config.ts
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
	database: {
		type: "postgres",
		url: process.env.DATABASE_URL,
	},
	plugins: [nextCookies()],
	// ... rest of config
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.User;
```

Features can import and use `auth` from `lib/betterauth-config.ts`, but config logic stays centralized.

---

## ✅ Code Review Checklist

Before merging any code, enforce these rules:

- [ ] **`app/` pages are < 30 lines.** Logic is delegated to features.
- [ ] **No API calls in `app/`** — all API logic is in `features/*/api.ts`.
- [ ] **No business logic in `components/`.** Primitives are dumb.
- [ ] **No domain concepts in global `hooks/`.** If a hook mentions "auth," "product," or any domain, it's misplaced.
- [ ] **Feature components exported via `index.ts` barrel.** Not imported from subfolders.
- [ ] **Redux slices live in `features/*/state/`.** Not scattered elsewhere.
- [ ] **`middleware.ts` is thin.** Auth logic delegated to `features/auth/middleware.ts`.
- [ ] **API calls use `lib/api-client.ts`.** Centralized, consistent headers/interceptors.
- [ ] **Zod schemas in `features/*/schemas/`.** Not in components or hooks.

---

## 📋 Import Pattern Examples

### ✅ CORRECT Import Patterns

```typescript
// Page imports from feature barrel
import { LoginForm } from "@/features/auth";

// Feature imports from other features (via barrel only)
import { useAuth } from "@/features/auth";
import { ProductList } from "@/features/products";

// Global utilities
import { useLocalStorage } from "@/hooks";
import apiClient from "@/lib/api-client";

// Primitives
import { Button } from "@/components";
```

### ❌ INCORRECT Import Patterns

```typescript
// DON'T: Import internal details
import { loginAPI } from "@/features/auth/api"; // Use hook instead
import { authSlice } from "@/features/auth/state"; // Via barrel only

// DON'T: Mix concerns
import { ProductCard } from "@/components"; // Should be in features/products/components
import { useAuth } from "@/hooks"; // Should be in features/auth/hooks

// DON'T: Skip the barrel
import { LoginForm } from "@/features/auth/components/LoginForm";
// Use: import { LoginForm } from "@/features/auth";
```

---

## 🚀 When to Refactor

### Sign #1: Feature Getting Too Big

If `features/auth/` has 20+ files, split into sub-domains:

```
features/
├── auth/
│   ├── login/
│   ├── signup/
│   ├── session/
│   └── shared/ # Types, utils shared across auth sub-domains
```

### Sign #2: Cross-Feature Logic

If `features/products/` needs auth logic, don't duplicate — import from `features/auth/` barrel.

### Sign #3: Global Hooks Getting Misused

If global `hooks/` has 15+ files and half are domain-specific, move them to features and enforce the rule harder.

---

## 📚 Resources & Further Reading

- **Feature-Sliced Design (FSD):** We're using a simplified version. Full FSD is overkill for most teams.
- **Redux Style Guide:** https://redux.js.org/style-guide/style-guide
- **Next.js App Router Best Practices:** https://nextjs.org/docs/app
- **Barrel Exports:** https://basarat.gitbook.io/typescript/main-1/barrel

---

## Questions?

If this doc is unclear or you have edge cases not covered, raise an issue in Trello or discuss in the team sync. **Architecture is a team agreement, not a law** — but enforce consistency once agreed.

**Last Updated By:** Marwan Mamdouh
**Next Review:** End of Q2 2026
