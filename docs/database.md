# Database Design

## books

| Field       | Type      |
| ----------- | --------- |
| id          | UUID      |
| title       | String    |
| author      | String    |
| description | Text      |
| category    | String    |
| tags        | Array     |
| cover_url   | String    |
| epub_url    | String    |
| uploader_id | UUID      |
| created_at  | Timestamp |

## users

| Field      | Type      |
| ---------- | --------- |
| id         | UUID      |
| discord_id | String    |
| username   | String    |
| role       | String    |
| created_at | Timestamp |
