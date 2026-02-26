# Task 5: Shopping List App (React + Vite + TS + Redux Toolkit)

A complete implementation for the "ReactTS - Task 5 - Shopping List App" brief. This project helps users manage shopping lists.
Uses `json-server` for persistence, `redux-toolkit` for state, `react-router-dom@6`,
and AES encryption via `crypto-js` for demo-only credential protection.

## Quick start

```bash
# 1) Install deps
npm i

# 2) Start the JSON server (port 3001)
npm run server

# 3) In a new terminal, start the Vite dev server (port 5173)
npm run dev
```

App runs at http://localhost:5173 and proxies API requests from `/api/*` to `http://localhost:3001/*`.

## Default data

On first run, `db.json` contains one demo user:
- Email: `demo@example.com`
- Password: `Demo@123`

## Build
```bash
npm run build
npm run preview
```

## Notes

- Auth uses AES encryption (for assignment purposes only, not production-grade).
- Protected routes: `/`, `/profile` require login; `/login` and `/register` are hidden if already signed-in.
- Search & Sort are reflected in the URL and the UI reacts to manual URL edits.
- At least three class components are implemented (`Login`, `Register`, `Profile`).

## Share
Each list has a public, read-only share URL: `/share/:listId` that anyone can open.

## Accessibility & UX
Focus styles, aria labels, tab order, and hover cues are included. Responsive breakpoints cover 320/480/768/1024/1200.


## URL-driven search & sort
- `?q=milk` filters items by name
- `?sort=name|category|date` and `?dir=asc|desc` control sorting. Editing the URL updates the view.

## JSON Server data model
- `users`: `{ id, email, password, name, surname, cell }`
- `lists`: `{ id, ownerId, name, createdAt, items: [{ id, name, quantity, notes, category, imageUrl }] }`

## Branching (as per brief)
- Use `main` for planning (moodboard, steps, pseudocode) and `development` for active code commits.
