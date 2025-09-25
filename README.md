# plancake

## what is plancake?

plancake is a simple, lightweight, and free schedule builder designed for content creators, streamers, and anyone who needs to share their weekly schedule with an audience.

### key features

- **public schedule sharing** - get a unique URL like `yoursite.com/yourname`
- **extensive customisation** - colors, fonts, layouts, images, and more
- **timezone handling** - automatic timezone conversion for global audiences
- **clean interface** - no clutter, just what you need

## tech stack

- **frontend**: sveltekit + typescript
- **styling**: tailwind css
- **database**: postgresql + drizzle orm
- **auth**: oauth (google, twitch) + traditional auth
- **deployment**: docker

## getting started

### prerequisites

- node.js 18+
- pnpm
- postgresql

### development setup

1. clone the repo
```bash
git clone <repo-url>
cd plancake
```

2. install dependencies
```bash
pnpm install
```

3. set up environment variables
```bash
cp .env.example .env
# edit .env with your database and oauth credentials
```

4. start the database
```bash
pnpm db:start
```

5. run migrations
```bash
pnpm db:push
```

6. start the dev server
```bash
pnpm dev
```

visit `http://localhost:5173` to see the app.

## project structure

```
src/
├── routes/
│   ├── (app)/          # authenticated user pages
│   ├── (auth)/         # login/signup pages
│   └── (public)/       # public pages and user schedules
├── lib/
│   ├── components/     # reusable svelte components
│   ├── server/         # server-side code
│   └── utils/          # utility functions
└── static/             # static assets
```

## features to come

### eventually...
- event countdown timers
- notifications
- analytics
- custom domains
- calendar integrations
- API access
- team schedules

## contributing

open to contributions. feel free to open issues or submit pull requests.
