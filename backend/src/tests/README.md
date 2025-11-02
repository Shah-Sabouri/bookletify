# 🧪 Test Suite Overview — Bookletify Backend

This document describes the automated tests implemented for the Bookletify backend.  
All tests use **Jest** with an **in-memory MongoDB** (via `mongodb-memory-server`) to ensure fast and isolated test runs.

---

## 📁 Test Structure
```css
src/
└── tests/
├── discogs-tests/
│ └── discogs.test.ts
├── favorite-tests/
│ └── favorite.test.ts
├── review-tests/
│ └── review.test.ts
├── auth-tests/
│ └── auth.test.ts
└── README.md ← (this file)
```

---

## Discogs API Tests

**File:** `src/tests/discogs-tests/discogs.test.ts`
**Purpose:** Ensures that the external Discogs API connection works and that album data can be fetched successfully.

**Run this test:**
```bash
npm run test:discogs
```

## Favorite Service Tests
**File:** `src/tests/favorite-tests/favorite.test.ts`
**Purpose:** Tests CRUD logic for user favorites (add, remove, and fetch albums by user).

**Test Cases:**
- Add a favorite successfully
- Prevent duplicate favorites
- Retrieve all favorites for a user
- Remove a favorite successfully
- Return null when trying to remove a non-existent favorite

**Run this test:**
```bash
npm run test:favorites
```

## Review Service Tests
**File:** `src/tests/review-tests/review.test.ts`
**Purpose:** Validates creation, fetching, rating average calculation and deletion of reviews

**Test Cases:**
- Create a new review
- Fetch reviews for a specific album
- Calculate average rating correctly
- Delete a review and confirm it's deletion

**Run this test:**
```bash
npm run test:reviews
```

## Auth Service Tests
**File:** `src/tests/auth-tests/auth.test.ts`
**Purpose:** Tests registration/login flow for users, including password hashing and token generation.

**Test Cases:**
- Register a new user successfully
- Prevent duplicate registrations (unique email)
- Login with valid credentials
- Reject login with invalid email
- Reject login with wrong password

**Run this test:**
```bash
npm run test:auth
```

## Tech Used in Tests
- **Node/Jest:** test runner
- **mongodb-memory-server:** ephemeral MongoDB instance for isolated testing
- **Mongoose:** database ORM
- **TypeScript:** strong typing and better error detection

## Notes
- **No real database connection is required;** everything runs in-memory.
- Tests clean up data between runs automatically.
- Each test suite can be run **independently**.
