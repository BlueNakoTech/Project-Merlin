# Architecture

## Components

### Merlin Codex

Discord Bot

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

User
↓
Merlin Codex
↓
Merlin Archive
↓
Database

EPUB Files
↑
Merlin Archive
