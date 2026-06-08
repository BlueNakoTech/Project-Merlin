# Database Design

## Books

| Field    | Type    |
| -------- | ------- |
| id       | UUID    |
| title    | String  |
| author   | String  |
| isbn     | String  |
| quantity | Integer |

---

## Members

| Field      | Type   |
| ---------- | ------ |
| id         | UUID   |
| name       | String |
| discord_id | String |

---

## Borrow Records

| Field       | Type |
| ----------- | ---- |
| id          | UUID |
| member_id   | UUID |
| book_id     | UUID |
| borrow_date | Date |
| return_date | Date |
