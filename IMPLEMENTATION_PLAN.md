# FINAS-TEASES Implementation Plan

## Overview

This document outlines the modules and features that are **NOT YET IMPLEMENTED** based on the mockup document analysis compared to the current codebase. Features are organized into phases, ranked by complexity (easier first).

---

## Current System Status

### Already Implemented
- User authentication (login, register, JWT)
- Role-based access control (Student, Sponsor, Coordinator, System Admin)
- Student profile management (personal, educational, family background)
- Sponsorship/Financial Assistance CRUD
- Multi-stage application workflow (Pooling → Application List → Ranking Selection → FINAS Proper)
- AHP + TOPSIS ranking algorithms
- Announcements with file attachments and location filtering
- Schedules (exam/interview)
- Notifications system
- Academic year management
- School management
- File uploads
- Resources (downloadable forms/templates)
- Dashboard with basic statistics

---

## PHASE 1: Quick Wins (Low Complexity)

### 1.1 Password Recovery/Reset
**Complexity:** Low
**Description:** Add password reset functionality via email
**Files to create/modify:**
- `authentication/routes.ts` - Add reset routes
- `authentication/controller.ts` - Add reset logic
- `authentication/service.ts` - Token generation, email sending
- `prisma/schema.prisma` - Add password reset token table

**Features:**
- POST `/api/v1/auth/forgot-password` - Request reset email
- POST `/api/v1/auth/reset-password` - Reset with token
- Token expiration (e.g., 1 hour)

### 1.2 FAQ Module
**Complexity:** Low
**Description:** CRUD for Frequently Asked Questions
**Files to create:**
- `faq/` - New module folder
  - `routes.ts`
  - `controller.ts`
  - `service.ts`
- `prisma/schema.prisma` - Add FAQ model

**Features:**
- Public GET endpoint (no auth)
- Admin CRUD operations
- Category support
- Sort order

### 1.3 Static Content Endpoints (About Us, Contact Us)
**Complexity:** Low
**Description:** Endpoints for static content management
**Files to create:**
- `staticContent/` - New module folder
- `prisma/schema.prisma` - Add staticContent model

**Features:**
- Content types: ABOUT_US, CONTACT_US
- Admin can update content
- Public read access

---

## PHASE 2: Moderate Complexity

### 2.1 Document Tracking System
**Complexity:** Moderate
**Description:** Track application documents through processing stages
**Files to create:**
- `documentTracking/` - New module
- `prisma/schema.prisma` - Add documentTracking model

**Features:**
- Track document ID, destination, status
- Status history with timestamps
- Link to sponsorship application
- Student can view tracking status

**Fields:**
- `documentId` (auto-generated)
- `financialAssistance`
- `dateCreated`
- `dateSubmitted`
- `destination`
- `status`
- `remarks`

### 2.2 PDF Generation for Schedules
**Complexity:** Moderate
**Description:** Generate PDF notifications for exam/interview schedules
**Dependencies:** `pdfkit` or `puppeteer`
**Files to modify:**
- `schedule/service.ts` - Add PDF generation
- `schedule/controller.ts` - Add download endpoint
- `notification/service.ts` - Attach PDF to notification

**Features:**
- GET `/api/v1/schedules/:id/pdf` - Download schedule PDF
- Auto-send PDF when student is scheduled
- Include: student name, date/time, location, instructions

### 2.3 Calendar Events for Students
**Complexity:** Moderate
**Description:** Calendar view data for student schedules and deadlines
**Files to create:**
- `calendar/` - New module

**Features:**
- Aggregate schedules, deadlines, announcements
- Date-based filtering
- iCal export option (optional)

---

## PHASE 3: Complex Modules

### 3.1 New User Roles Setup
**Complexity:** Moderate-High
**Description:** Add new user roles required by mockup
**Files to modify:**
- `prisma/schema.prisma` - Add roles to enum/seed
- `prisma/seeders/` - Add role seeds
- `roles/` - Update role module

**New Roles:**
- `BUDGET_OFFICE`
- `MAYORS_OFFICE`
- `TREASURERS_OFFICE`
- `CASHIER`
- `ACCOUNTING`

### 3.2 Cashier Module
**Complexity:** High
**Description:** Disbursement management for financial assistance allowances
**Files to create:**
- `cashier/` - New module folder
  - `routes.ts`
  - `controller.ts`
  - `service.ts`
- `prisma/schema.prisma` - Add disbursement, payroll models

**Features:**
- Upload payroll files
- List qualified students for disbursement
- Record disbursements
- Issue digital receipts
- Track unclaimed allowances
- Send notifications for unclaimed funds
- Dashboard statistics

### 3.3 Treasurer's Office Module
**Complexity:** High
**Description:** Fund management and payment tracking
**Files to create:**
- `treasurer/` - New module folder
- `prisma/schema.prisma` - Add fund, payment models

**Features:**
- Fund allocation tracking
- Disbursement approval workflow
- Payment status monitoring
- Financial compliance records
- Collaboration endpoints with Budget Office
- Financial reports generation

### 3.4 Budget Office Module
**Complexity:** High
**Description:** Budget allocation and monitoring
**Files to create:**
- `budget/` - New module folder
- `prisma/schema.prisma` - Add budget, allocation models

**Features:**
- Allocate funding to financial assistance programs
- Monitor budget expenditures
- Budget request review
- Prepare financial reports
- Budget compliance tracking

---

## PHASE 4: Very Complex Modules

### 4.1 Report Generation Module
**Complexity:** Very High
**Description:** Comprehensive report generation with multiple formats
**Dependencies:** `exceljs`, `pdfkit`, chart library
**Files to create:**
- `reports/` - New module folder
- Various report templates

**Features:**
- Excel export
- PDF export
- Chart generation (pie, line, bar)
- Report types:
  - Applications (Qualified, Not Qualified, Terminated, Returned)
  - Grantees per sponsorship
  - Disbursement reports
  - School statistics
- Customizable report builder
- Filter by date range, school, municipality, sponsorship

### 4.2 Accounting Module
**Complexity:** Very High
**Description:** Financial tracking, statements, and audit support
**Files to create:**
- `accounting/` - New module folder
- `prisma/schema.prisma` - Add accounting models

**Features:**
- Billing of allowances
- Liquidation per financial assistance
- Transaction tracking
- Financial statements generation
- Audit trail
- Reconciliation with budget
- Compliance reporting

### 4.3 Mayor's Office Module
**Complexity:** High
**Description:** Policy management and community engagement
**Files to create:**
- `mayorsOffice/` - New module folder
- `prisma/schema.prisma` - Add policy models

**Features:**
- Policy and guidelines management
- Approve/review policies
- Community engagement tracking
- Read-only access to all applications
- Dashboard with high-level statistics

### 4.4 SVM (Support Vector Machine) Algorithm
**Complexity:** Very High
**Description:** Machine learning-based ranking/classification
**Dependencies:** ML library (tensorflow.js or similar)
**Files to modify:**
- `utils/ranking.ts` - Add SVM implementation
- `sponsorship/service.ts` - Integrate SVM option

**Features:**
- Train model on historical data
- Classification of applicants
- Feature extraction from student data
- Model persistence and retraining

**Note:** Requires historical data for training. Consider if this is truly needed vs. AHP/SAW/TOPSIS.

---

## Summary Table

| Phase | Module/Feature | Complexity |
|-------|----------------|------------|
| 1 | Password Recovery | Low |
| 1 | FAQ Module | Low |
| 1 | Static Content (About/Contact) | Low |
| 2 | Document Tracking | Moderate |
| 2 | PDF Generation | Moderate |
| 2 | Calendar Events | Moderate |
| 3 | New User Roles | Moderate-High |
| 3 | Cashier Module | High |
| 3 | Treasurer's Office | High |
| 3 | Budget Office | High |
| 4 | Report Generation | Very High |
| 4 | Accounting Module | Very High |
| 4 | Mayor's Office | High |
| 4 | SVM Algorithm | Very High |

---

## Recommended Implementation Order

1. **Start with Phase 1** - Quick wins that add immediate value
2. **Phase 2** - Moderate features that enhance core functionality
3. **Phase 3** - New roles and financial modules
4. **Phase 4** - Advanced features (reports, accounting, ML)

---

## Verification Plan

After implementing each module:
1. Run existing tests: `npm test`
2. Test new API endpoints with Postman/Insomnia
3. Verify database migrations: `npx prisma migrate dev`
4. Check role-based access restrictions
5. Validate with sample data from seeders

---

## Notes

- All new modules should follow existing patterns in the codebase
- Use existing middleware for authentication and validation
- Follow the established response format from `response/` module
- Add proper TypeScript types for all new entities
- Consider adding unit tests for complex algorithms (SAW, SVM)
