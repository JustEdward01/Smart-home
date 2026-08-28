# Smart Home

A web app for controlling a house: lights, heating, security and energy use.
Built as a student project for the Web Applications course.

Patru Eduard Andrei, Year 1, Group 352B.

## What it does

The page shows a control panel for a house with four rooms. You can switch
lights on and off and dim them, set the thermostat between 15 and 30 degrees,
lock the front door, arm the alarm, and turn the outdoor camera on or off.

Four scene buttons change several things at once. "Away" turns everything off
and arms the alarm, "Movie" dims the living room, and so on.

The energy panel shows how much power the house is drawing right now. It goes
up when you turn lights on and down when you turn them off, because the server
recalculates it from whatever is currently switched on.

Everything you do is saved on the server, so the state is still there after you
close the browser or restart the app.

## Running it

You need Node.js 18 or newer, from https://nodejs.org

Open a terminal in the project folder and run:

```
npm install
npm start
```

Then open http://localhost:3000 in a browser.

Press Ctrl+C in the terminal to stop the server.

Open the app through localhost, not by double-clicking `index.html`. The page
loads its JavaScript as modules and talks to the server, and neither works when
the file is opened directly.

## How it is built

The backend is Node.js with Express. It keeps the state of the house, saves it
to `data/state.json`, and offers a small REST API. The frontend is plain HTML,
CSS and JavaScript with no framework.

The two talk over JSON. When you click something, the browser sends a request,
the server updates the house and sends the whole state back, and the page
redraws from it. That way the browser never keeps its own copy that could drift
out of sync.

```
server.js       starts the server
src/            backend: routes, services, and the state store
public/         frontend: index.html, css/, js/
```

`src/routes/` handles the HTTP side, `src/services/` holds the rules of the
house, and `src/store/` is the only part that reads and writes the file. On the
frontend, `js/ui/` has one file per panel, `js/api/` talks to the server, and
`js/state/` keeps everything in sync.

There is a longer explanation in [ARCHITECTURE.md](ARCHITECTURE.md), and more
about running and testing it in [USAGE.md](USAGE.md).

## API

| Method | Route               | What it does            |
|--------|---------------------|-------------------------|
| GET    | `/api/state`        | The state of the house  |
| PATCH  | `/api/lights/:room` | Switch or dim a light   |
| PATCH  | `/api/climate`      | Temperature and mode    |
| PATCH  | `/api/security`     | Door, alarm, camera     |
| POST   | `/api/scenes/:name` | Apply a scene           |
| POST   | `/api/reset`        | Back to default values  |

Rooms are `living`, `kitchen`, `bedroom` and `hallway`. Scenes are `home`,
`away`, `night` and `movie`.

You can try it without the interface:

```
curl http://localhost:3000/api/state
curl -X POST http://localhost:3000/api/scenes/movie
```
