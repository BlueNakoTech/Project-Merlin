# Architecture

## Components

### Merlin Codex

Discord Bot

Description:
📚 Merlin Codex is the Discord interface for Project Merlin, providing access to the Merlin Archive for searching and downloading EPUB

Responsibilities:

- User commands
- Search interface
- Upload workflow
- Download workflow
- Permission checking

### Merlin Archive

Backend Service

Responsibilities:

- Store metadata
- Store file references
- Search indexing
- User management

## System Flow

Merlin Codex
↓
Firestore
↓
Book Metadata

Merlin Codex
↓
Google Drive API
↓
EPUB Storage
