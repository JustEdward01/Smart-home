# Architecture

This document explains how the project is put together and why. It is meant to
be read alongside the code when presenting the project.

---

## The one rule

Every file has a single job, and dependencies point in one direction only.
Nothing calls "sideways" or "upwards".

```
BACKEND                              FRONTEND

routes/      HTTP in, HTTP out       ui/         draws, listens for clicks
   |                                    |
   v                                    v
services/    the rules              state/       store + actions
   |                                    |
   v                                    v
store/       reads and writes         api/       talks to the backend
```

A service never sees `req` or `res`. A route never opens a file. A UI panel
never calls `fetch`. Each of those is somebody else's job.

---

## Backend

### Layers

| Folder        | Job                                        | Knows about       |
|---------------|--------------------------------------------|-------------------|
| `routes/`     | Turn a URL and a body into a service call  | HTTP, services    |
| `services/`   | The rules of the house                     | store, other services |
| `store/`      | Hold the state, read and write the disk    | the file system   |
| `middleware/` | Logging, unknown routes, error to JSON     | HTTP              |
| `utils/`      | Small helpers with no dependencies         | nothing           |

### Why this split pays off

**Swapping the database is a one-file change.** `store/stateStore.js` is the
only module that touches the disk. Replacing the JSON file with SQLite means
rewriting that file; routes and services stay exactly as they are.

**Errors are handled in one place.** Services throw an `ApiError` carrying a
status code. `middleware/errorHandler.js` is the single place that turns an
error into a response. That is why no route contains a `res.status(400)`.

**Every route answers with the whole state.** `services/homeService.js`
assembles it. One click therefore leaves the entire interface consistent after
a single request, with no second call needed to refresh the summary or the
energy figure.

**Energy is computed, never stored.** `services/energyService.js` derives it
from the current devices, so the number can never disagree with what is on.

**Scenes are data, not code.** `services/sceneService.js` holds them in a
`SCENES` object. Adding a scene means adding an entry, and the `GET /api/scenes`
endpoint lists them automatically.

### Request path

A click on a light travels:

```
PATCH /api/lights/living  { level: 35 }
  -> routes/lightsRoutes.js     reads req.params.id and req.body
  -> services/lightsService.js  validates, clamps to 0..100, logs the event
  -> store/stateStore.js        save() writes data/state.json
  -> services/homeService.js    publicState() adds energy + activity log
  <- 200 with the whole home state
```

If the room does not exist, the service throws `ApiError.notFound`, the route
passes it to `next(err)`, and the error middleware answers `404` with JSON.

---

## Frontend

### Layers

| Folder      | Job                                              |
|-------------|--------------------------------------------------|
| `api/`      | One function per endpoint; the only place using `fetch` |
| `state/`    | The store (data + subscribers) and the actions   |
| `ui/`       | One module per panel: draws it, handles its clicks |
| `utils/`    | DOM and formatting helpers                       |

### Data flow

One direction, always:

```
click -> action -> API -> store -> every panel redraws
```

`state/store.js` is a small observer: panels subscribe, and when the state
changes each one redraws itself. **No panel calls another panel.** That is what
makes them independent, and why adding a panel means importing it in `main.js`
and adding it to one list.

`main.js` does nothing but wiring: attach the interactive panels, subscribe the
drawable ones, show skeletons, request the state.

### Decisions worth pointing out

**The slider sends one request, not fifty.** Dragging fires `input`, which only
updates the local visuals. Releasing fires `change`, which sends the value. A
naive version sends a request per pixel moved.

**Light rows are built once, then updated.** Rebuilding them on every state
change would tear the slider out from under a user who is dragging it.

**Controls read the state, not a local copy.** The `+`/`-` buttons take the
target from the store, so the displayed value can never drift away from the
server's.

**A failed request shows a banner instead of throwing.** `state/actions.js`
catches the error and sets `online: false`; the banner is subscribed to that.

**Log entries use `textContent`.** The activity panel builds elements instead of
concatenating HTML, so a log entry can never be interpreted as markup.

### Module systems

The backend uses CommonJS (`require`), which is the Node default. The frontend
uses native ES modules (`import`), loaded by the browser through
`<script type="module">`. No build step, no bundler: the browser fetches each
module itself, which is visible in the network tab.

---

## CSS

`css/main.css` is the only stylesheet the page links; it imports everything in
order:

```
tokens.css     the design system: every colour, space, radius, duration
base.css       reset, page background, focus styles
motion.css     keyframes and the reduced-motion preference
layout.css     page shell and the card grid
components/*   one file per component
```

**Tokens come first because everything after them depends on them.** No
component hard-codes a colour or a spacing value; each one references a
variable. That is what keeps a growing interface consistent, and it is why
adjusting the spacing scale in one file re-spaces the whole application.

Components are split so that finding the styles for a panel means opening the
file named after it.
