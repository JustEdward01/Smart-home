# Smart Home

A Smart House web application with a modular frontend and backend: control
lights per room, a thermostat, security, energy monitoring and quick scenes.

Project by **Patru Eduard Andrei**, Year 1, Group 352B.

---

## Tech

- **Backend:** Node.js + Express, split into routes, services and a data store
- **Frontend:** HTML, CSS and native ES modules (no frameworks, no build step)
- **Communication:** a REST API over `fetch`, JSON both ways
- **Persistence:** the home state is saved to `data/state.json` and survives a restart

## How to run it

You need **Node.js** installed, version 18 or newer: https://nodejs.org

```
npm install
npm start
```

Then open **http://localhost:3000**

`npm run dev` starts the same server with automatic restart on file changes.

## Project structure

```
smart-home/
├── server.js                    starts the HTTP server, nothing else
├── package.json
├── README.md
├── ARCHITECTURE.md              why the structure looks like this
│
├── data/
│   └── state.json               saved home state (created on first run)
│
├── src/                         BACKEND
│   ├── app.js                   assembles the Express app
│   ├── config.js                port, paths, limits
│   │
│   ├── store/                   the data layer
│   │   ├── defaultState.js      the shape of the home
│   │   ├── stateStore.js        the only module that touches the disk
│   │   └── eventLog.js          recent actions, in memory
│   │
│   ├── services/                the rules (no HTTP in here)
│   │   ├── lightsService.js
│   │   ├── climateService.js
│   │   ├── securityService.js
│   │   ├── sceneService.js
│   │   ├── energyService.js     computes consumption from the state
│   │   └── homeService.js       assembles what the frontend receives
│   │
│   ├── routes/                  HTTP only (no rules in here)
│   │   ├── index.js             mounts everything under /api
│   │   ├── homeRoutes.js        /state, /events, /reset
│   │   ├── lightsRoutes.js
│   │   ├── climateRoutes.js
│   │   ├── securityRoutes.js
│   │   └── sceneRoutes.js
│   │
│   ├── middleware/
│   │   ├── requestLogger.js     one line per API call
│   │   ├── notFound.js          unknown /api paths as JSON
│   │   └── errorHandler.js      the single place errors become responses
│   │
│   └── utils/
│       ├── clamp.js
│       └── ApiError.js          an error that carries a status code
│
└── public/                      FRONTEND (served by the backend)
    ├── index.html               structure only
    │
    ├── css/
    │   ├── main.css             imports everything below, in order
    │   ├── tokens.css           the design system
    │   ├── base.css
    │   ├── motion.css
    │   ├── layout.css
    │   └── components/          one file per component (11 files)
    │
    └── js/
        ├── main.js              wires the panels to the store
        ├── api/
        │   ├── httpClient.js    the only module that calls fetch
        │   └── homeApi.js       one function per endpoint
        ├── state/
        │   ├── store.js         state + subscribers
        │   └── actions.js       everything the user can do
        ├── ui/                  one module per panel (11 files)
        └── utils/
            ├── dom.js
            └── format.js
```

## API

Every write returns the full home state, so one request is enough to refresh
the whole interface.

| Method | Route                | Body                        | What it does              |
|--------|----------------------|-----------------------------|---------------------------|
| GET    | `/api/state`         | –                           | The whole home            |
| PATCH  | `/api/lights/:id`    | `{ on }` or `{ level }`     | Update one light          |
| PATCH  | `/api/climate`       | `{ target }`, `{ mode }`    | Set temperature or mode   |
| PATCH  | `/api/security`      | `{ door }`, `{ alarm }`, `{ camera }` | Update security |
| GET    | `/api/scenes`        | –                           | List the available scenes  |
| POST   | `/api/scenes/:name`  | –                           | Apply a scene             |
| GET    | `/api/events`        | –                           | The full activity log     |
| POST   | `/api/reset`         | –                           | Back to defaults          |

**Rooms** (`:id`): `living`, `kitchen`, `bedroom`, `hallway`
**Scenes** (`:name`): `home`, `away`, `night`, `movie`
**Values:** `mode` is `heating` or `cooling`; `door` is `locked` or `unlocked`;
`alarm` is `armed` or `disarmed`; `level` is 0–100; `target` is 15–30 °C.

`PATCH` routes also accept `POST`, so older clients keep working.

### Trying the API without the browser

```
curl http://localhost:3000/api/state

curl -X PATCH http://localhost:3000/api/lights/living \
     -H "Content-Type: application/json" -d '{"level":35}'

curl -X POST http://localhost:3000/api/scenes/movie
```

Invalid input gets a clear error instead of a crash:

```
curl -X PATCH http://localhost:3000/api/climate \
     -H "Content-Type: application/json" -d '{"mode":"turbo"}'
# 400  {"error":"mode must be one of: heating, cooling"}
```

Out-of-range numbers are clamped rather than rejected: asking for 99 °C sets
the thermostat to its 30 °C maximum.

## Features

- **Lights** in four rooms: on/off and a brightness slider each
- **Climate:** thermostat from 15 to 30 °C, heating or cooling, humidity reading
- **Security:** door lock, alarm, camera, with the state shown by colour
- **Energy:** live draw computed by the server from what is on, plus a 7-day chart
- **Scenes:** Home, Away, Night and Movie, each changing several devices at once
- **Activity log:** the server records recent actions and the panel displays them
- **Loading states:** skeleton placeholders on first load, a spinner on any
  control waiting for the server
- **Accessibility:** keyboard focus outlines, `aria-pressed` on every toggle,
  and animations disabled when the system asks for reduced motion

## Ideas to extend it

- Replace the JSON file with SQLite (only `store/stateStore.js` changes)
- Add authentication before the controls become usable
- More device types: blinds, air conditioning, a robot vacuum
- Schedules: apply the Night scene automatically at a set time
