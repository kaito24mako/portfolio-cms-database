# Converting `projects` From Express to Next.js App Router

This guide shows how to move only the `projects` part of this database API into a Next.js project that uses the App Router.

The goal is to keep:

- `sqlite`
- `sequelize`
- CRUD endpoints for `projects`

The part that changes is the API layer. In Express, you use `router.get`, `router.post`, `router.put`, and `router.delete`. In Next.js App Router, you create route files and export functions named after the HTTP methods: `GET`, `POST`, `PUT`, and `DELETE`.

## 1. What You Have Now

Your current Express structure is split like this:

- `routes/projects.js`: maps URLs to controller methods
- `controllers/projects.js`: contains the request handlers
- `models/projects.js`: defines the Sequelize model
- `utils/connection.js`: creates the Sequelize SQLite connection

In practice, these files currently do this:

- `GET /projects` returns all projects
- `GET /projects/:id` returns one project
- `POST /projects/new` creates a project
- `PUT /projects/edit/:id` updates a project
- `DELETE /projects/edit/:id` deletes a project

That works in Express because Express needs a router layer.

## 2. What Changes In Next.js

In Next.js App Router, you do not use Express routers.

Instead, you create files inside `app/api/...`:

- `app/api/projects/route.js`
- `app/api/projects/[id]/route.js`

Each file exports functions for the methods it supports. For example:

```js
export async function GET() {}
export async function POST() {}
```

and:

```js
export async function GET(request, context) {}
export async function PUT(request, context) {}
export async function DELETE(request, context) {}
```

So the Express router layer disappears, and the controller logic usually moves directly into the route handler or into small reusable service functions.

## 3. Recommended File Structure In Your Next.js Project

This is a simple structure that stays close to what you already understand:

```text
app/
  api/
    projects/
      route.js
      [id]/
        route.js
lib/
  db.js
  init-db.js
models/
  Project.js
```

Why this structure:

- `app/api/...`: Next.js API route handlers
- `lib/db.js`: creates and reuses the Sequelize connection
- `lib/init-db.js`: makes sure the model/table is available
- `models/Project.js`: keeps your Sequelize model separate from route code

## 4. Install The Same Database Packages In Next.js

Inside your Next.js project:

```bash
npm install sequelize sqlite3
```

You do not need Express for this API layer because Next.js provides the request handling.

## 5. Create The Sequelize Connection

Create `lib/db.js`:

```js
import { Sequelize } from "sequelize";

const globalForSequelize = globalThis;

export const sequelize =
  globalForSequelize.sequelize ??
  new Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite",
    logging: false,
  });

if (process.env.NODE_ENV !== "production") {
  globalForSequelize.sequelize = sequelize;
}
```

### Why this is different from your current `utils/connection.js`

Your current Express app starts once, so a simple `new Sequelize(...)` is usually enough.

Next.js development mode reloads modules often. If you create a brand new Sequelize instance every time a file reloads, you can run into repeated connections or noisy behavior. Caching it on `globalThis` avoids that in development.

## 6. Move The `Project` Model

Create `models/Project.js`:

```js
import { DataTypes } from "sequelize";
import { sequelize } from "@/lib/db";

export const Project =
  sequelize.models.Project ||
  sequelize.define("Project", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    siteUrl: {
      type: DataTypes.STRING,
    },
    githubUrl: {
      type: DataTypes.STRING,
    },
    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    draft: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    archived: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
```

### Notes

- I changed `title` from `DataTypes.CHAR` to `DataTypes.STRING`.
- `STRING` is usually the better fit for titles.
- `sequelize.models.Project || ...` prevents model redefinition during hot reloads.

If you want to stay as close as possible to your current code, you can keep the field names exactly as they already are.

## 7. Initialize The Database Safely

In Express, you currently call:

```js
sequelize.sync()
```

in `index.js` when the server starts.

In Next.js, there is no single custom Express server in the same way, so you should move that setup into a reusable initializer.

Create `lib/init-db.js`:

```js
import { sequelize } from "@/lib/db";
import "@/models/Project";

let initialized = false;

export async function initDb() {
  if (initialized) return;

  await sequelize.sync();
  initialized = true;
}
```

### Why this exists

Every API route may be loaded independently. This helper makes sure:

- the `Project` model is registered
- the table is synced
- the sync is not repeated unnecessarily in the same runtime

## 8. Convert `GET /projects` And `POST /projects/new`

In Next.js, it is cleaner to use one endpoint for the collection:

- `GET /api/projects`
- `POST /api/projects`

Create `app/api/projects/route.js`:

```js
import { NextResponse } from "next/server";
import { initDb } from "@/lib/init-db";
import { Project } from "@/models/Project";

export const runtime = "nodejs";

export async function GET() {
  await initDb();

  const projects = await Project.findAll();
  return NextResponse.json(projects);
}

export async function POST(request) {
  await initDb();

  const body = await request.json();
  const project = await Project.create(body);

  return NextResponse.json(
    {
      message: `Project ${project.title} created successfully`,
      project,
    },
    { status: 201 },
  );
}
```

### What changed from Express

Express version:

- `router.get("/")`
- `router.post("/new")`

Next.js version:

- `GET /api/projects`
- `POST /api/projects`

This is more REST-like and usually easier to maintain.

Also note:

- `res.json(...)` becomes `NextResponse.json(...)`
- `req.body` becomes `await request.json()`

## 9. Convert `GET /projects/:id`, `PUT /edit/:id`, And `DELETE /edit/:id`

In Next.js, use one dynamic route:

- `GET /api/projects/:id`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`

Create `app/api/projects/[id]/route.js`:

```js
import { NextResponse } from "next/server";
import { initDb } from "@/lib/init-db";
import { Project } from "@/models/Project";

export const runtime = "nodejs";

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) ? id : null;
}

export async function GET(_request, { params }) {
  await initDb();

  const id = parseId(params.id);
  if (id === null) {
    return NextResponse.json({ message: "Invalid project id" }, { status: 400 });
  }

  const project = await Project.findByPk(id);

  if (!project) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  return NextResponse.json(project);
}

export async function PUT(request, { params }) {
  await initDb();

  const id = parseId(params.id);
  if (id === null) {
    return NextResponse.json({ message: "Invalid project id" }, { status: 400 });
  }

  const project = await Project.findByPk(id);

  if (!project) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  const body = await request.json();

  await project.update({
    title: body.title ?? project.title,
    description: body.description ?? project.description,
    siteUrl: body.siteUrl ?? project.siteUrl,
    githubUrl: body.githubUrl ?? project.githubUrl,
    published: body.published ?? project.published,
    draft: body.draft ?? project.draft,
    archived: body.archived ?? project.archived,
  });

  return NextResponse.json({
    message: `Project ${project.title} updated successfully`,
    project,
  });
}

export async function DELETE(_request, { params }) {
  await initDb();

  const id = parseId(params.id);
  if (id === null) {
    return NextResponse.json({ message: "Invalid project id" }, { status: 400 });
  }

  const project = await Project.findByPk(id);

  if (!project) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  await project.destroy();

  return NextResponse.json({
    message: `Project ${project.title} deleted successfully`,
  });
}
```

### Why this route shape is better

Your current Express routes use:

- `/projects/:id`
- `/projects/edit/:id`

In Next.js, it is simpler and more standard to put all single-project operations on:

- `/api/projects/:id`

The HTTP method itself tells the server what action to perform.

## 10. Mapping Your Current Code To The New Next.js Version

This is the direct mental conversion:

| Current Express file | Purpose now | Next.js replacement |
|---|---|---|
| `routes/projects.js` | URL to handler mapping | `app/api/projects/route.js` and `app/api/projects/[id]/route.js` |
| `controllers/projects.js` | request logic | exported `GET`, `POST`, `PUT`, `DELETE` functions |
| `models/projects.js` | Sequelize model | `models/Project.js` |
| `utils/connection.js` | Sequelize SQLite connection | `lib/db.js` |
| `index.js` | app boot + `sequelize.sync()` | handled by Next.js + `initDb()` |

## 11. How To Call These Routes From Next.js

If you fetch from a client component:

```js
const response = await fetch("/api/projects");
const projects = await response.json();
```

To create a project:

```js
await fetch("/api/projects", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    title: "Portfolio CMS",
    description: "Admin dashboard project",
    siteUrl: "https://example.com",
    githubUrl: "https://github.com/example/repo",
    published: true,
    draft: false,
    archived: false,
  }),
});
```

To update a project:

```js
await fetch("/api/projects/1", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    title: "Updated title",
  }),
});
```

To delete a project:

```js
await fetch("/api/projects/1", {
  method: "DELETE",
});
```

## 12. Important Next.js-Specific Notes

### SQLite requires Node.js runtime

`sqlite3` is a Node package. It does not run on the Edge runtime.

That is why the route handlers above include:

```js
export const runtime = "nodejs";
```

Keep that in any route that uses Sequelize with SQLite.

### Path alias

The examples use imports like:

```js
import { sequelize } from "@/lib/db";
```

That assumes your Next.js project already supports the `@/` alias. Many Next.js projects do, but if yours does not, either:

- configure the alias, or
- switch to relative imports

### `sequelize.sync()` in production

For learning and small personal projects, `sequelize.sync()` is acceptable.

For more serious production work, migrations are usually safer than syncing models automatically at runtime. But for your current conversion, keeping `sync()` is the simplest path and matches what you already have.

## 13. Suggested Migration Order

Follow this order so you do not fight multiple problems at once:

1. Install `sequelize` and `sqlite3` in the Next.js project.
2. Create `lib/db.js`.
3. Create `models/Project.js`.
4. Create `lib/init-db.js`.
5. Create `app/api/projects/route.js`.
6. Create `app/api/projects/[id]/route.js`.
7. Test `GET /api/projects`.
8. Test `POST /api/projects`.
9. Test `GET /api/projects/:id`, `PUT /api/projects/:id`, and `DELETE /api/projects/:id`.

## 14. The Simplest Conceptual Shift

The main thing to understand is this:

- In Express, you build one server and attach routers to it.
- In Next.js App Router, each route file is the API entry point.

So instead of writing this:

```js
router.get("/", handler);
router.post("/new", handler);
```

you write this:

```js
export async function GET() {}
export async function POST() {}
```

inside the correct file path.

That is the biggest framework change. Your Sequelize model logic remains very similar.

## 15. Recommended Clean-Up Compared To Your Current API

While converting, I recommend these small improvements:

- change `title` from `CHAR` to `STRING`
- use `/api/projects` instead of `/projects/new`
- use `/api/projects/:id` instead of `/projects/edit/:id`
- return JSON consistently for both success and errors
- add `allowNull` and `defaultValue` where appropriate

These changes are not required, but they make the Next.js version cleaner.

## 16. If You Want A Very Close 1:1 Port

If you prefer, you can also keep the logic split into separate files such as:

- `lib/projects-controller.js`
- `app/api/projects/route.js`
- `app/api/projects/[id]/route.js`

That would look more like your current Express setup.

However, for a small Next.js API, keeping the logic directly in the route files is usually easier to follow.

## 17. Final Summary

Yes, you can use `sqlite` and `sequelize` in a Next.js App Router project.

The database/model part stays mostly the same.

The part you replace is the Express server pattern:

- no `express()`
- no `router.get(...)`
- no `router.post(...)`

Instead, you use:

- `app/api/projects/route.js`
- `app/api/projects/[id]/route.js`
- exported `GET`, `POST`, `PUT`, and `DELETE` functions

If you want, the next step can be to generate the actual Next.js versions of these `projects` files for you so you can paste them directly into your other project.
