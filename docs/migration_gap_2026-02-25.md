# Migration Gap Analysis: Legacy Laravel to Vue 3 SPA

This document tracks the features present in the original Laravel 10 application (`legacy_backend`) that have not yet been implemented in the new Vue 3 / Supabase architecture.

## 🔑 Authentication & User Management
- [x] **Google OAuth Login**: Implemented via Supabase Auth.
- [ ] **User Management (CRUD)**:
    - [ ] List all users (`/users`).
    - [ ] View user details.
    - [ ] Deactivate/Reactivate users.
    - [ ] Edit user profile, password, role, and metadata.
    - [ ] Create new users.
- [ ] **Role & Permission Management**:
    - [ ] List/View/Edit Roles.
    - [ ] Assign/Remove Permissions from Roles.
    - [ ] Search Permissions.
- [ ] **Profile Settings**:
    - [ ] Edit Profile.
    - [ ] Account Deletion (Destroy).

## 📅 Attendance & HR Logic
- [ ] **Attendance Dashboard**:
    - [ ] Present Employees list view.
    - [ ] Employees on duty view.
- [ ] **Leave Management**:
    - [ ] Calendar view with leaves and special dates.
    - [ ] Employee-specific leave records.
    - [ ] Leave reports.
- [ ] **Department Management**:
    - [ ] "My Department" view.
- [ ] **Gallery**:
    - [ ] Gallery index and lazy loading.

## 🕵️ Background Checks (Core Domain)
- [ ] **Search & Suggestions**:
    - [ ] Keyword search for background checks.
    - [ ] Search suggestions/auto-complete.
- [ ] **Pending & Ongoing Checks**:
    - [ ] Pending background check queue.
    - [ ] Ongoing checks list.
- [ ] **Financial Auditing**:
    - [ ] Check loans and loan statistics.
    - [ ] Pending/Ongoing loans.
    - [ ] Payroll history checks.
- [ ] **Comments & Audits**:
    - [ ] View comments on a background check.
    - [ ] Submit/Add new comments.

## 🏗️ Technical Gaps
- **Middleware Equivalents**:
    - [ ] `prevent.stampede` (Throttling logic).
    - [ ] Role/Permission checks on every route.
- **Data Persistence**:
    - [ ] Migrating existing data from Laravel's MySQL/PostgreSQL to Supabase (Postgres).
    - [ ] Setting up matching RLS (Row Level Security) policies in Supabase.

## 🗄️ Database Architecture & Integration

All tables created locally in the Supabase instance MUST be prefixed with `hrutils_`.

### 1. Local Project Tables (Supabase Migration Required)
These tables manage the application's specific state, auth-extension, and configuration.

- [ ] **`hrutils_profiles`**: Extends `auth.users` with local app fields.
    - Columns: `id` (uuid), `first_name`, `last_name`, `is_active` (bool), `meta` (jsonb).
- [ ] **`hrutils_roles`**: Application-level RBAC roles.
- [ ] **`hrutils_user_roles`**: Junction for mapping users to roles.
- [ ] **`hrutils_app_options`**: Dynamic configuration (e.g., target database connection strings, features toggles).
    - Columns: `option_name` (text, unique), `option_value` (jsonb).
- [ ] **`hrutils_background_check_comments`**: Local audit trail for BG checks.
    - Columns: `author_id`, `email`, `comment`, `created_at`.

### 2. External Target Database (Accessed via App Options)
These tables **do not** require migration/creation in the local Supabase instance as they exist in a separate production database. Their connection details will be retrieved from `hrutils_app_options`.

- **Domain: HR Data**
    - `users` (Employee master), `job_titles`, `departments`, `groups`.
- **Domain: Attendance**
    - `attendance`, `attendance_leaves`, `attendance_schedules`, `attendance_rosters`.
- **Domain: Finance**
    - `finance_loans`, `finance_loan_type`, `finance_payroll_summary`.
- **Domain: Metadata**
    - `status_classifications` (Global status reference).
