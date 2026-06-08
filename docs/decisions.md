# Decision Log

## 2026-06-08

### Decision

Project name and component naming.

### Result

Project Merlin

- Merlin Codex (Discord Bot)
- Merlin Archive (Backend Service)
- Merlin Portal (Future Web Dashboard)

### Reason

Provide a consistent product identity and allow future expansion.

### Status

Accepted

---

## 2026-06-08

### Decision

Discord-first architecture.

### Result

Users interact with the library primarily through Discord via Merlin Codex.

### Reason

Target users already use Discord, reducing the need for a separate frontend during MVP development.

### Status

Accepted

---

## 2026-06-08

### Decision

Project scope reduced from bookstore/library management to digital EPUB library.

### Result

Project Merlin will focus on:

- Uploading EPUB files
- Storing metadata
- Searching books
- Downloading books

### Out of Scope

- Book sales
- Payments
- Borrowing systems
- Physical inventory tracking
- Mobile applications
- Recommendation engines

### Reason

Reduce complexity and increase likelihood of completing the MVP.

### Status

Accepted

---

## 2026-06-08

### Decision

Backend technology stack.

### Result

- Discord.js for Merlin Codex
- Firebase Firestore for metadata storage
- Firebase Storage for EPUB file storage

### Reason

Provides a fully managed backend with minimal operational overhead and good support for document-based data structures.

### Status

Accepted

---

## 2026-06-08

### Decision

Use Firestore instead of Firebase Realtime Database.

### Result

Firestore selected as the primary database.

### Reason

Project Merlin stores structured document data such as books, users, categories, and tags.

Firestore provides:

- Better querying
- Better indexing
- More natural document modeling
- Easier future expansion

Realtime Database advantages are not required for the current use case.

### Alternatives Considered

- Firebase Realtime Database

### Status

Accepted

---

## 2026-06-08

### Decision

EPUB files will not be stored in Firestore.

### Result

EPUB files stored in Firebase Storage.

Firestore stores only metadata and file references.

### Reason

Firestore is optimized for document data, not large binary files.

### Status

Accepted

---

## 2026-06-08

### Decision

MVP scope definition.

### Result

Version 0.1 includes:

- Upload EPUB
- Store metadata
- Search books
- Download books
- Discord role permissions

### Success Criteria

A user can upload a book, find it through Discord, and download it.

### Status

Accepted

## 2026-06-08

### Decision

EPUB storage strategy for MVP.

### Result

Store EPUB files as Discord attachments.

Firestore stores metadata and attachment URLs.

### Reason

Avoid Firebase Storage billing requirements and keep MVP infrastructure free.

### Status

Accepted

## 2026-06-08

### Decision

Book upload permissions.

### Result

Only administrators may:

- Upload books
- Edit metadata
- Delete books

Regular users may:

- Search books
- View metadata
- Download books

### Reason

Project Merlin is intended to be a curated digital library rather than an open file-sharing platform.

Restricting uploads prevents spam, duplicate entries, and copyright issues from uncontrolled user submissions.

### Status

Accepted
