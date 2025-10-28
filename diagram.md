# Blood Bank System - Visual Diagrams & Flowcharts

## 📊 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         USER LAYER                          │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │  Donor   │    │ Hospital │    │  Admin   │              │
│  │  🩸      │    │    🏥    │    │   👨‍💼   │              │
│  └────┬─────┘    └────┬─────┘    └────┬─────┘              │
└───────┼──────────────┼──────────────┼────────────────────────┘
        │              │              │
        └──────────────┴──────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                           │
│                   (React/Vue/etc)                           │
│                                                              │
│   - Login Forms         - Blood Request Forms               │
│   - Donor Dashboards   - Inventory Views                    │
│   - Admin Panel        - Reports & Analytics                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP Requests (JSON)
                         │ + JWT Token in Headers
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND LAYER (Node.js + Express)        │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              server.js (Entry Point)                  │  │
│  │  - CORS Setup                                         │  │
│  │  - JSON Parser                                        │  │
│  │  - Route Registration                                 │  │
│  └───────┬──────────────────────────────────────────────┘  │
│          │                                                   │
│          ▼                                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           MIDDLEWARE LAYER (Security)                │  │
│  │                                                       │  │
│  │  ┌──────────┐    ┌──────────┐   ┌──────────┐       │  │
│  │  │   auth   │ →  │ roleCheck│ → │ Business │       │  │
│  │  │  (JWT)   │    │ (Perms)  │   │  Logic   │       │  │
│  │  └──────────┘    └──────────┘   └──────────┘       │  │
│  └───────┬──────────────────────────────────────────────┘  │
│          │                                                   │
│          ▼                                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              ROUTES (URL Mapping)                     │  │
│  │  /api/auth/*     - Authentication                     │  │
│  │  /api/donors/*   - Donor Management                   │  │
│  │  /api/requests/* - Blood Requests                     │  │
│  │  /api/admin/*    - Admin Functions                    │  │
│  └───────┬──────────────────────────────────────────────┘  │
│          │                                                   │
│          ▼                                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           CONTROLLERS (Business Logic)               │  │
│  │  - Validate Input                                     │  │
│  │  - Process Data                                       │  │
│  │  - Call Models                                        │  │
│  │  - Return Responses                                   │  │
│  └───────┬──────────────────────────────────────────────┘  │
│          │                                                   │
│          ▼                                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              MODELS (Data Layer)                      │  │
│  │  - BloodRequest Model                                 │  │
│  │  - Donor Model                                        │  │
│  │  - Inventory Model                                    │  │
│  │  - User Model                                         │  │
│  └───────┬──────────────────────────────────────────────┘  │
└──────────┼──────────────────────────────────────────────────┘
           │
           │ SQL Queries
           ▼
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE LAYER (MySQL)                    │
│                                                              │
│  Tables:                     Views:                          │
│  ┌─────────────────┐        ┌──────────────────┐           │
│  │ users           │        │ inventory_       │           │
│  │ blood_inventory │        │ expiring_soon    │           │
│  │ blood_requests  │        └──────────────────┘           │
│  │ donors          │                                        │
│  │ donations       │                                        │
│  └─────────────────┘                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 2. Authentication Flow Diagram

```
┌──────────┐
│  User    │
│ (Browser)│
└────┬─────┘
     │
     │ 1. POST /api/auth/login
     │    { email: "user@example.com", password: "12345" }
     │
     ▼
┌──────────────────────────────────────────────┐
│         BACKEND: authController.js           │
│                                              │
│  Step 1: Receive login request               │
│  ┌──────────────────────────────────────┐   │
│  │ const { email, password } = req.body │   │
│  └──────────────────────────────────────┘   │
│           │                                   │
│           ▼                                   │
│  Step 2: Query database for user             │
│  ┌──────────────────────────────────────┐   │
│  │ SELECT * FROM users                  │   │
│  │ WHERE email = ?                      │   │
│  └──────────────────────────────────────┘   │
│           │                                   │
│           ▼                                   │
│  Step 3: Check if user exists                │
│  ┌──────────────────────────────────────┐   │
│  │ if (users.length === 0)              │   │
│  │   return 404 "User not found"        │   │
│  └──────────────────────────────────────┘   │
│           │                                   │
│           ▼                                   │
│  Step 4: Verify password                     │
│  ┌──────────────────────────────────────┐   │
│  │ const isMatch = await bcrypt.compare │   │
│  │   (password, user.password)          │   │
│  │ if (!isMatch)                        │   │
│  │   return 401 "Invalid credentials"   │   │
│  └──────────────────────────────────────┘   │
│           │                                   │
│           ▼                                   │
│  Step 5: Check if account is active          │
│  ┌──────────────────────────────────────┐   │
│  │ if (!user.is_active)                 │   │
│  │   return 401 "Account deactivated"   │   │
│  └──────────────────────────────────────┘   │
│           │                                   │
│           ▼                                   │
│  Step 6: Generate JWT Token                  │
│  ┌──────────────────────────────────────┐   │
│  │ const token = jwt.sign(              │   │
│  │   { userId: user.user_id },          │   │
│  │   JWT_SECRET,                        │   │
│  │   { expiresIn: '7d' }                │   │
│  │ )                                    │   │
│  └──────────────────────────────────────┘   │
│           │                                   │
│           ▼                                   │
│  Step 7: Return token to user                │
│  ┌──────────────────────────────────────┐   │
│  │ return {                             │   │
│  │   success: true,                     │   │
│  │   token: "eyJhbGciOiJIUz...",        │   │
│  │   user: { id, name, role }           │   │
│  │ }                                    │   │
│  └──────────────────────────────────────┘   │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│  User stores token                │
│  (in localStorage or cookie)      │
└──────────────┬───────────────────┘
               │
               │ 2. Every subsequent request includes token
               │
               ▼
     ┌─────────────────────────┐
     │ Authorization: Bearer   │
     │ eyJhbGciOiJIUz...       │
     └─────────────────────────┘
```

---

## 🩸 3. Blood Request Creation Flow

```
                    CREATE BLOOD REQUEST FLOW

┌─────────────┐
│  Hospital   │ 1. Fills out blood request form
│  User       │    - Patient name: John Doe
│   🏥        │    - Blood type: A+
└──────┬──────┘    - Units: 2
       │           - Urgency: High
       │
       │ 2. Submits form
       │
       ▼
┌────────────────────────────────────────────────────────────┐
│  POST /api/requests                                        │
│  Headers: { Authorization: Bearer eyJhbGc... }             │
│  Body: {                                                   │
│    patient_name: "John Doe",                               │
│    blood_group: "A+",                                      │
│    units_required: 2,                                      │
│    urgency: "High",                                        │
│    ...                                                     │
│  }                                                         │
└────────┬───────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│  MIDDLEWARE: auth (Authentication Check)                    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ 1. Extract token from header                       │    │
│  │    const token = req.header('Authorization')       │    │
│  │                    .replace('Bearer ', '')         │    │
│  │                                                     │    │
│  │ 2. Verify token                                    │    │
│  │    const decoded = jwt.verify(token, JWT_SECRET)   │    │
│  │                                                     │    │
│  │ 3. Get user from database                          │    │
│  │    SELECT * FROM users WHERE user_id = ?           │    │
│  │                                                     │    │
│  │ 4. Check if user is active                         │    │
│  │                                                     │    │
│  │ 5. Attach user to request object                   │    │
│  │    req.user = user                                 │    │
│  └────────────────────────────────────────────────────┘    │
│         │                                                    │
│         ▼                                                    │
│    ✅ Token Valid → Continue                                │
│    ❌ Token Invalid → Return 401 Unauthorized               │
└─────────┬───────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│  MIDDLEWARE: checkRole (Authorization Check)                │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ 1. Check if user exists (from auth middleware)    │    │
│  │    if (!req.user) → 401 Unauthorized              │    │
│  │                                                     │    │
│  │ 2. Check user's role                               │    │
│  │    if (req.user.role !== 'hospital')              │    │
│  │       → 403 Forbidden                              │    │
│  └────────────────────────────────────────────────────┘    │
│         │                                                    │
│         ▼                                                    │
│    ✅ User is Hospital → Continue                           │
│    ❌ User is not Hospital → Return 403 Forbidden           │
└─────────┬───────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│  CONTROLLER: createRequest                                  │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Step 1: Extract data from request body            │    │
│  │ const { patient_name, blood_group, ... } = req.body│   │
│  │                                                     │    │
│  │ Step 2: Validate required fields                   │    │
│  │ if (!patient_name || !blood_group || ...)          │    │
│  │    return 400 "Missing required fields"            │    │
│  │                                                     │    │
│  │ Step 3: Validate data types and formats            │    │
│  │ if (units_required < 1 || units_required > 10)     │    │
│  │    return 400 "Invalid units"                      │    │
│  │                                                     │    │
│  │ Step 4: Insert into database                       │    │
│  │ INSERT INTO blood_requests                         │    │
│  │ (hospital_id, patient_name, blood_group, ...)      │    │
│  │ VALUES (?, ?, ?, ...)                              │    │
│  │                                                     │    │
│  │ Step 5: Get the new request ID                     │    │
│  │ const request_id = result.insertId                 │    │
│  │                                                     │    │
│  │ Step 6: Return success response                    │    │
│  │ return {                                           │    │
│  │   success: true,                                   │    │
│  │   message: "Request created",                      │    │
│  │   request_id: 789                                  │    │
│  │ }                                                  │    │
│  └────────────────────────────────────────────────────┘    │
└─────────┬───────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│  DATABASE: blood_requests table                             │
│                                                              │
│  ┌────────┬──────────┬────────┬──────────┬──────────┐      │
│  │ req_id │hospital_id│patient │blood_grp │ units    │      │
│  ├────────┼──────────┼────────┼──────────┼──────────┤      │
│  │ 789    │ 123      │John Doe│   A+     │    2     │      │
│  └────────┴──────────┴────────┴──────────┴──────────┘      │
│         ✅ NEW RECORD SAVED                                  │
└─────────┬───────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│  Response sent back to frontend                             │
│  {                                                           │
│    success: true,                                            │
│    message: "Blood request created successfully",            │
│    request_id: 789                                           │
│  }                                                           │
└─────────┬───────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────┐
│  Frontend shows         │
│  success message:       │
│  "Request submitted!" ✅ │
└─────────────────────────┘
```

---

## 🛡️ 4. Middleware Chain Visualization

```
         REQUEST COMES IN
              │
              ▼
    ┌─────────────────┐
    │   server.js     │  Entry point
    │                 │
    │ app.use(cors()) │  Enable CORS
    │ app.use(json()) │  Parse JSON
    └────────┬────────┘
             │
             ▼
    ┌─────────────────────────┐
    │  Route Matching         │
    │  /api/requests          │
    └────────┬────────────────┘
             │
             ▼
    ┌─────────────────────────┐
    │  MIDDLEWARE #1: auth    │ ← Security Checkpoint 1
    │                         │
    │  ✓ Check token exists   │
    │  ✓ Verify token valid   │
    │  ✓ Get user from DB     │
    │  ✓ Check user active    │
    │  ✓ Attach user to req   │
    └────────┬────────────────┘
             │
             │ req.user = { id: 123, role: 'hospital', ... }
             │
             ▼
    ┌─────────────────────────┐
    │ MIDDLEWARE #2:          │ ← Security Checkpoint 2
    │ checkRole('hospital')   │
    │                         │
    │  ✓ Check req.user exists│
    │  ✓ Check role = hospital│
    └────────┬────────────────┘
             │
             ▼
    ┌─────────────────────────┐
    │  CONTROLLER FUNCTION    │ ← Business Logic
    │  createRequest()        │
    │                         │
    │  ✓ Validate input       │
    │  ✓ Process data         │
    │  ✓ Save to DB           │
    │  ✓ Return response      │
    └────────┬────────────────┘
             │
             ▼
         RESPONSE SENT
         TO CLIENT


If any middleware fails:
┌─────────────────────────┐
│  auth fails             │
│  ↓                      │
│  Return 401 immediately │
│  STOP - Don't continue  │
└─────────────────────────┘
```

---

## 📊 5. Database View Logic: inventory_expiring_soon

```
                    HOW THE VIEW WORKS

┌──────────────────────────────────────────────────────────┐
│  TABLE: blood_inventory                                  │
│                                                           │
│  ┌─────┬────────┬─────────┬──────────┬────────┬─────┐  │
│  │ ID  │ Blood  │ Volume  │ Donation │Expiry  │Status│ │
│  │     │ Group  │  (ml)   │   Date   │ Date   │      │  │
│  ├─────┼────────┼─────────┼──────────┼────────┼─────┤  │
│  │ 101 │  A+    │  450    │2025-10-01│2025-11-15│Avail│ │
│  │ 102 │  O-    │  450    │2025-10-20│2025-10-30│Avail│ │ ← Expires in 3 days!
│  │ 103 │  B+    │  450    │2025-09-15│2025-10-28│Avail│ │ ← Expires in 1 day!
│  │ 104 │  AB-   │  450    │2025-10-25│2025-12-01│Avail│ │
│  │ 105 │  A-    │  450    │2025-08-10│2025-10-15│Used │ │ ← Already used
│  └─────┴────────┴─────────┴──────────┴────────┴─────┘  │
└──────────────────────────────────────────────────────────┘
                       │
                       │ VIEW FILTERS:
                       │
                       ▼
            ┌──────────────────────┐
            │  Filter Conditions:  │
            │                      │
            │  1. status='Available'
            │     (exclude Used)   │
            │                      │
            │  2. expiration_date  │
            │     <= today + 7 days│
            │     (expires soon)   │
            │                      │
            │  3. expiration_date  │
            │     >= today         │
            │     (not expired yet)│
            └──────┬───────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────┐
│  VIEW: inventory_expiring_soon                           │
│                                                           │
│  ┌─────┬────────┬─────────┬──────────┬────────┬───────┐ │
│  │ ID  │ Blood  │ Volume  │ Expiry   │Status  │ Days  │ │
│  │     │ Group  │  (ml)   │ Date     │        │ Left  │ │
│  ├─────┼────────┼─────────┼──────────┼────────┼───────┤ │
│  │ 103 │  B+    │  450    │2025-10-28│Available│  1   │ │ ← Most urgent!
│  │ 102 │  O-    │  450    │2025-10-30│Available│  3   │ │
│  └─────┴────────┴─────────┴──────────┴────────┴───────┘ │
│                                                           │
│  Sorted by: expiration_date ASC (oldest first)           │
└──────────────────────────────────────────────────────────┘

Today = 2025-10-27

Decision Tree:
ID 101: Expires 2025-11-15 → 19 days away → NOT included (>7 days)
ID 102: Expires 2025-10-30 → 3 days away  → ✅ INCLUDED
ID 103: Expires 2025-10-28 → 1 day away   → ✅ INCLUDED (most urgent)
ID 104: Expires 2025-12-01 → 35 days away → NOT included (>7 days)
ID 105: Status = 'Used'    → NOT included (not available)


┌──────────────────────────────────────────────────────────┐
│  BUSINESS USE CASE                                       │
│                                                           │
│  Hospital Dashboard:                                     │
│  "⚠️ 2 blood units expiring soon!"                       │
│                                                           │
│  Alert Notification:                                     │
│  "B+ blood expires in 1 day - use urgently!"            │
│                                                           │
│  Automated Actions:                                      │
│  - Email hospitals with urgent requests for B+ blood    │
│  - Prioritize matching with pending B+ requests          │
│  - Mark as "critical" in inventory system                │
└──────────────────────────────────────────────────────────┘
```

---

## 🔄 6. Update Request Flow with Ownership Check

```
                UPDATE BLOOD REQUEST FLOW

Hospital User (ID: 123) wants to update request (ID: 789)

┌────────────────────────────────────────────────────┐
│  PUT /api/requests/789                             │
│  Headers: { Authorization: Bearer token... }       │
│  Body: {                                           │
│    patient_name: "Jane Doe",  ← Update this       │
│    units_required: 3          ← Update this       │
│  }                                                 │
└────────────┬───────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────┐
│  MIDDLEWARE: auth                                    │
│  ✓ Verifies token                                    │
│  ✓ Sets req.user = { user_id: 123, role: 'hospital' }│
└────────────┬─────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────┐
│  CONTROLLER: updateRequest                           │
│                                                       │
│  Step 1: Get request ID from URL                     │
│  const { id } = req.params // 789                    │
│                                                       │
│  Step 2: Get current user info                       │
│  const userId = req.user.user_id // 123              │
│  const userRole = req.user.role   // 'hospital'      │
└────────────┬─────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────┐
│  Step 3: OWNERSHIP CHECK - Query database            │
│                                                       │
│  SELECT hospital_id FROM blood_requests              │
│  WHERE request_id = 789                              │
│                                                       │
│  Result: { hospital_id: 123 }                        │
└────────────┬─────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────┐
│  Step 4: AUTHORIZATION CHECK                         │
│                                                       │
│  if (request.hospital_id !== userId                  │
│      && userRole !== 'admin') {                      │
│    return 403 Forbidden                              │
│  }                                                   │
│                                                       │
│  Check: Does hospital_id (123) = userId (123)?       │
│  ✅ YES → User owns this request                     │
│  OR                                                   │
│  Is userRole = 'admin'?                              │
│  → Admin can edit any request                        │
└────────────┬─────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────┐
│  Step 5: DYNAMIC UPDATE BUILDER                      │
│                                                       │
│  updates = []                                        │
│  params = []                                         │
│                                                       │
│  IF patient_name provided:                           │
│    updates.push('patient_name = ?')                  │
│    params.push('Jane Doe')                           │
│                                                       │
│  IF units_required provided:                         │
│    updates.push('units_required = ?')                │
│    params.push(3)                                    │
│                                                       │
│  Final SQL:                                          │
│  UPDATE blood_requests                               │
│  SET patient_name = ?, units_required = ?            │
│  WHERE request_id = ?                                │
│  VALUES: ['Jane Doe', 3, 789]                        │
└────────────┬─────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────┐
│  DATABASE UPDATE                                     │
│                                                       │
│  BEFORE:                                             │
│  ┌────────┬──────────┬────────┬──────┐             │
│  │req_id  │hospital_id│patient │units │             │
│  ├────────┼──────────┼────────┼──────┤             │
│  │ 789    │ 123      │John Doe│  2   │             │
│  └────────┴──────────┴────────┴──────┘             │
│                                                       │
│  AFTER:                                              │
│  ┌────────┬──────────┬────────┬──────┐             │
│  │req_id  │hospital_id│patient │units │             │
│  ├────────┼──────────┼────────┼──────┤             │
│  │ 789    │ 123      │Jane Doe│  3   │ ← Updated!  │
│  └────────┴──────────┴────────┴──────┘             │
└────────────┬─────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────┐
│  Response: { success: true, message: "Updated" }     │
└──────────────────────────────────────────────────────┘


SECURITY SCENARIOS:

Scenario 1: Hospital tries to edit their own request
User ID: 123, Request hospital_id: 123
✅ ALLOWED - Ownership match

Scenario 2: Hospital tries to edit another hospital's request
User ID: 123, Request hospital_id: 456
❌ FORBIDDEN - No ownership

Scenario 3: Admin edits any request
User Role: 'admin', Request hospital_id: 456
✅ ALLOWED - Admin privilege

Scenario 4: Request doesn't exist
Request ID: 999 (not in database)
❌ NOT FOUND - 404 error
```

---

## 🎭 7. Role-Based Access Control Matrix

```
                PERMISSION MATRIX

┌────────────────────┬─────────┬──────────┬─────────┐
│      Action        │  Admin  │ Hospital │  Donor  │
├────────────────────┼─────────┼──────────┼─────────┤
│ View all users     │    ✅   │    ❌    │    ❌   │
├────────────────────┼─────────┼──────────┼─────────┤
│ Create blood       │    ❌   │    ✅    │    ❌   │
│ request            │         │          │         │
├────────────────────┼─────────┼──────────┼─────────┤
│ View own           │    ✅   │    ✅    │    ❌   │
│ requests           │         │          │         │
├────────────────────┼─────────┼──────────┼─────────┤
│ Update own         │    ✅   │    ✅    │    ❌   │
│ request            │         │          │         │
├────────────────────┼─────────┼──────────┼─────────┤
│ Update ANY         │    ✅   │    ❌    │    ❌   │
│ request            │         │          │         │
├────────────────────┼─────────┼──────────┼─────────┤
│ Delete own         │    ✅   │    ✅    │    ❌   │
│ request            │         │          │         │
├────────────────────┼─────────┼──────────┼─────────┤
│ Delete ANY         │    ✅   │    ❌    │    ❌   │
│ request            │         │          │         │
├────────────────────┼─────────┼──────────┼─────────┤
│ Register as        │    ✅   │    ❌    │    ✅   │
│ donor              │         │          │         │
├────────────────────┼─────────┼──────────┼─────────┤
│ View donor         │    ✅   │    ✅    │    ✅   │
│ list (public)      │         │          │    (own)│
├────────────────────┼─────────┼──────────┼─────────┤
│ View expiring      │    ✅   │    ✅    │    ❌   │
│ inventory          │         │          │         │
├────────────────────┼─────────┼──────────┼─────────┤
│ Manage             │    ✅   │    ❌    │    ❌   │
│ inventory          │         │          │         │
├────────────────────┼─────────┼──────────┼─────────┤
│ Deactivate         │    ✅   │    ❌    │    ❌   │
│ users              │         │          │         │
└────────────────────┴─────────┴──────────┴─────────┘

Legend:
✅ = Allowed
❌ = Denied (403 Forbidden)
```

---

## 🔒 8. JWT Token Structure

```
            JWT TOKEN ANATOMY

┌─────────────────────────────────────────────────┐
│  Complete Token (sent in Authorization header) │
│                                                  │
│  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.          │
│  eyJ1c2VySWQiOjEyMywidXNlcm5hbWUiOiJob3NwaX      │
│  RhbDEyMyIsInJvbGUiOiJob3NwaXRhbCIsImlhdCI6MT      │
│  Y5ODc2NTQzMiwiZXhwIjoxNjk5MzcwMDMyfQ.          │
│  SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c    │
└─────────────────────────────────────────────────┘
              │           │              │
              │           │              │
       ┌──────┘           │              └────────┐
       │                  │                       │
       ▼                  ▼                       ▼
┌────────────┐   ┌─────────────────┐   ┌──────────────┐
│  HEADER    │   │    PAYLOAD      │   │  SIGNATURE   │
│            │   │                 │   │              │
│ Algorithm: │   │ userId: 123     │   │ Encrypted    │
│ HS256      │   │ role: hospital  │   │ signature to │
│            │   │ iat: 1698765432 │   │ verify token │
│ Type: JWT  │   │ exp: 1699370032 │   │ is not fake  │
└────────────┘   └─────────────────┘   └──────────────┘
                          │
                          │ DECODES TO:
                          ▼
                 ┌─────────────────────┐
                 │ {                   │
                 │   userId: 123,      │
                 │   username: "...",  │
                 │   role: "hospital", │
                 │   iat: 1698765432,  │ ← Issued at
                 │   exp: 1699370032   │ ← Expires at
                 │ }                   │
                 └─────────────────────┘

HOW IT'S USED:

1. Login → Server creates token
   ↓
2. Client stores token (localStorage)
   ↓
3. Every request includes token in header:
   Authorization: Bearer eyJhbGci...
   ↓
4. Server verifies signature
   ↓
5. If valid → Decode and use payload data
   If invalid → Return 401 Unauthorized


WHY JWT?

✅ Stateless - Server doesn't store sessions
✅ Self-contained - All info is in the token
✅ Secure - Signature prevents tampering
✅ Scalable - Works across multiple servers
```

---

## 📱 9. Complete API Endpoints Map

```
                    API ROUTES STRUCTURE

📁 /api
│
├─ 🔐 /auth (Authentication)
│   ├─ POST /register         → Register new user
│   ├─ POST /login            → Login and get token
│   ├─ GET  /profile          → Get current user profile (needs auth)
│   └─ PUT  /profile          → Update profile (needs auth)
│
├─ 🩸 /donors (Donor Management)
│   ├─ GET  /                 → List all donors (public)
│   ├─ GET  /:id              → Get specific donor
│   ├─ POST /                 → Register as donor (needs auth: donor)
│   ├─ PUT  /:id              → Update donor info (needs auth: owner/admin)
│   └─ DELETE /:id            → Delete donor (needs auth: owner/admin)
│
├─ 🏥 /requests (Blood Requests)
│   ├─ GET  /                 → List all requests
│   ├─ GET  /my-requests      → Get my requests (needs auth)
│   ├─ GET  /:id              → Get specific request
│   ├─ POST /                 → Create request (needs auth: hospital)
│   ├─ PUT  /:id              → Update request (needs auth: owner/admin)
│   └─ DELETE /:id            → Delete request (needs auth: owner/admin)
│
└─ 👨‍💼 /admin (Admin Functions)
    ├─ GET  /users            → List all users (needs auth: admin)
    ├─ GET  /users/:id        → Get specific user (needs auth: admin)
    ├─ PUT  /users/:id        → Update user (needs auth: admin)
    ├─ DELETE /users/:id      → Delete user (needs auth: admin)
    ├─ GET  /inventory        → View blood inventory (needs auth: admin)
    ├─ GET  /expiring         → View expiring inventory (needs auth: admin)
    ├─ GET  /stats            → Get system statistics (needs auth: admin)
    └─ POST /inventory        → Add blood unit (needs auth: admin)


MIDDLEWARE APPLIED:

Route Pattern             │ Middleware Chain
─────────────────────────┼──────────────────────────────────
/auth/register, /login   │ No auth required (public)
/auth/profile            │ auth
/donors (GET all)        │ No auth (public viewing)
/donors (POST)           │ auth + isDonor
/donors/:id (PUT/DELETE) │ auth + isOwnerOrAdmin
/requests (GET all)      │ No auth (public viewing)
/requests (POST)         │ auth + isHospital
/requests/:id (PUT/DEL)  │ auth + owner check
/admin/*                 │ auth + isAdmin
```

---

## ⚡ 10. Error Handling Flow

```
                ERROR HANDLING HIERARCHY

Request enters system
        │
        ▼
┌──────────────────────┐
│  Try-Catch Block     │
└──────┬───────────────┘
       │
       ├─ Success? ──→ Return 200 OK with data
       │
       ├─ Validation Error? ──→ Return 400 Bad Request
       │   Examples:
       │   • Missing required fields
       │   • Invalid data format
       │   • Out of range values
       │
       ├─ Authentication Error? ──→ Return 401 Unauthorized
       │   Examples:
       │   • No token provided
       │   • Invalid token
       │   • Expired token
       │   • Inactive user account
       │
       ├─ Authorization Error? ──→ Return 403 Forbidden
       │   Examples:
       │   • Wrong role (donor trying hospital action)
       │   • Not owner of resource
       │   • Missing permissions
       │
       ├─ Not Found Error? ──→ Return 404 Not Found
       │   Examples:
       │   • Request ID doesn't exist
       │   • User not found
       │   • Resource deleted
       │
       └─ Server Error? ──→ Return 500 Internal Server Error
           Examples:
           • Database connection failed
           • Unexpected exception
           • Third-party service down


ERROR RESPONSE FORMAT:

{
  "success": false,
  "message": "Human-readable error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Technical details (dev mode only)"
  }
}


EXAMPLE ERROR RESPONSES:

❌ 400 Bad Request:
{
  "success": false,
  "message": "Blood group is required"
}

❌ 401 Unauthorized:
{
  "success": false,
  "message": "Invalid token. Please login again."
}

❌ 403 Forbidden:
{
  "success": false,
  "message": "Access denied. Hospital access required",
  "requiredRoles": ["hospital"],
  "yourRole": "donor"
}

❌ 404 Not Found:
{
  "success": false,
  "message": "Blood request not found"
}

❌ 500 Internal Server Error:
{
  "success": false,
  "message": "Failed to create blood request",
  "error": "Database connection timeout"
}
```

---

## 🎯 Summary: Key Takeaways

1. **Layered Architecture**: Requests flow through multiple layers (auth → authorization → business logic → database)

2. **Security First**: Every protected route checks both authentication (who you are) and authorization (what you can do)

3. **Separation of Concerns**: Routes, middleware, controllers, and models each have a specific job

4. **Dynamic Queries**: Update functions only modify fields that are provided

5. **Error Handling**: Comprehensive error responses guide users and developers

6. **Role-Based Access**: Different user types have different permissions

7. **Database Views**: Smart filters that act like saved searches

8. **JWT Tokens**: Stateless authentication that scales well

9. **RESTful Design**: Standard HTTP methods for predictable API behavior

10. **Real-World Application**: Solves actual blood bank management challenges

---

This visual guide should help you explain the system architecture and data flow to your student in a clear, step-by-step manner!
