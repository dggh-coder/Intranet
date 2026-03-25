# Intranet Platform MVP (SharePoint-inspired)

A practical MVP intranet platform built with **Next.js + TypeScript + Tailwind + Prisma + MySQL** that supports:

- Admin-managed pages
- Structured section/page-builder model
- Reusable web part system with schema validation
- Theme and navigation management
- Public runtime rendering from page definitions in DB

## Architecture proposal

### App layers

1. **Presentation layer (Next.js App Router)**
   - Public routes: `app/(site)/[slug]/page.tsx`
   - Admin routes: `app/admin/*`
2. **API layer (Next.js route handlers)**
   - CRUD-like endpoints for page updates and settings
   - Validation of web part configs before persistence
3. **Domain layer (`lib/`)**
   - Typed models, web part registry, zod schemas
   - Shared auth/prisma helpers
4. **Data layer (MySQL + Prisma)**
   - `Page`, `ThemeSettings`, `NavigationItem`, `AdminUser`

### Content model

`Page` stores `title`, `slug`, `status`, SEO fields, and `pageLayout` JSON.

`pageLayout` shape:

- `sections[]`
  - `id`
  - `columns` (1/2/3)
  - `webParts[]`
    - `id`
    - `type`
    - `config`

Theme and navigation are separate tables for clean separation of concerns.

## Core workflows implemented

### Admin page builder

- Create pages from dashboard
- Edit metadata: title/slug/status/SEO title
- Add/remove sections
- Set per-section columns (1/2/3)
- Add/remove web parts from registry
- Drag-and-drop reorder web parts inside section (dnd-kit)
- Edit web part config as JSON in MVP editor panel
- Save page to DB via API with schema validation

### Theme controls

`/admin/theme` allows updates for:

- Site name
- Brand color
- Header style
- Footer style
- Spacing scale
- Typography token
- Default page layout mode

### Navigation controls

`/admin/navigation` edits nav labels/URLs/sort order.

### Authentication

- NextAuth credentials provider
- MVP seeded admin user:
  - email: `admin@intranet.local`
  - password: `admin1234`

## Web part architecture

Each web part has:

1. **Type identifier** (string union)
2. **Schema** (`zod` in `lib/webparts/schemas.ts`)
3. **Default config** (registry in `lib/webparts/registry.ts`)
4. **Admin edit representation** (JSON editor block in page editor)
5. **Frontend renderer** (`components/site/WebPartRenderer.tsx`)

### Included web parts

- Hero banner
- News / announcements
- Quick links
- Rich text content
- Image / media block
- Document list
- Embed block

## How to add a new web part

1. Add a type to `WebPartType` in `lib/types.ts`.
2. Add zod schema in `lib/webparts/schemas.ts` and map entry.
3. Add registry metadata/default config in `lib/webparts/registry.ts`.
4. Add render branch in `components/site/WebPartRenderer.tsx`.
5. (Optional) Add custom admin form UI in `PageEditor`.

## Setup

1. Install dependencies
   ```bash
   npm install
   ```
2. Configure `.env`
   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/intranet_db"
   NEXTAUTH_SECRET="replace-with-secure-random-value"
   NEXTAUTH_URL="http://localhost:3000"
   ```
3. Run migration + generate client
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```
4. Seed demo data
   ```bash
   npm run db:seed
   ```
5. Start app
   ```bash
   npm run dev
   ```

Open:
- Public sample homepage: `/home`
- Admin dashboard: `/admin`

## Tradeoffs and next steps

### MVP tradeoffs

- Web part admin editing currently JSON-based for speed and extensibility.
- No version history/publishing workflow yet.
- Rich text uses HTML field now; should migrate to robust editor storage model.
- Basic credentials auth is suitable only for MVP/internal dev.

### Next steps

1. Custom per-web-part form builders (non-JSON editing UX)
2. Page versioning and scheduled publishing
3. Media/document integration with storage providers
4. Role-based access control (admin/editor/reviewer)
5. Search, analytics, audit trails
6. Visual section drag-and-drop and live preview mode
