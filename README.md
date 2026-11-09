# Web Development Final Project - *Soccer-Hub*

Submitted by: **Selehadin Abebe**

This web app: **A soccer community platform where users sign up, log in, and share soccer posts. Users can create, browse, search, sort, filter, upvote, comment on, edit, delete, and repost posts. Each post can have a category, a flag (Question or Opinion), and an uploaded image. Only the author of a post can edit or delete it.**

## Tech Stack

- **Frontend:** React, React Router, Vite
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Authentication:** JSON Web Tokens (JWT) with bcrypt password hashing
- **Image uploads:** Multer and Cloudinary

## Required Features

The following **required** functionality is completed:

- [x] **Web app includes a create form that allows the user to create posts**
  - Form requires users to add a post title
  - Forms have the *option* for users to add:
    - additional textual content
    - an image (uploaded from the user's device on Create; set by image URL on Edit)
- [x] **Web app includes a home feed displaying previously created posts**
  - Each post on the feed shows its creation time, title, and upvotes count
  - Clicking on a post directs the user to a new page for the selected post
- [x] **Users can view posts in different ways**
  - Users can sort posts by creation time (newest or oldest) or upvotes count
  - Users can search for posts by title
- [x] **Users can interact with each post in different ways**
  - Each post has its own page showing its content, image, and comments
  - Users can leave comments underneath a post on the post page
  - Each post includes an upvote button on the post page
    - Each click increases the post's upvotes count by one
    - Users can upvote any post any number of times
- [x] **A post that a user previously created can be edited or deleted from its post page**
  - After a user creates a new post, they can go back and edit it
  - A previously created post can be deleted

The following **optional** features are implemented:

- [x] Web app implements authentication
  - Users sign up and log in with a username, email, and password
  - Every post and comment is linked to its author, and the author's username is shown on it
  - Only the original author of a post can update or delete it (checked on the server)
- [x] Users can repost a previous post
  - The repost button creates a new post that references the original
  - On the new post's page, the original post is displayed and linked, creating a thread
- [ ] Users can customize the interface
- [x] Users can add more characteristics to their posts
  - Users can set flags such as "Question" or "Opinion" while creating a post
  - Users can filter posts by flags on the home feed
- [x] Web app displays a loading animation whenever data is being fetched

The following **additional** features are implemented:

- [x] Real user accounts: sign up, log in, log out, and pages that require login
- [x] Images are uploaded to Cloudinary (image files only, up to 5 MB)
- [x] Category filtering (News, Transfer, Match, Discussion, Other) with filter buttons
- [x] Search, category, and flag filters work together
- [x] Home feed cards show the post's image thumbnail, the author's username with an avatar, a short content preview, and the comment count
- [x] Responsive interface with a dark green and yellow theme and the Inter font

## Getting Started

### 1. Set up the database

Create a PostgreSQL database and run the schema to create the `users`, `posts`, and `comments` tables:

```bash
psql -d <your-database> -f server/db/schema.sql
```

### 2. Start the server

```bash
cd server
npm install
npm run dev
```

The server needs a `server/.env` file with these variables:

| Variable | Purpose |
|---|---|
| `PORT` | Port for the Express server (default `3000`) |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | PostgreSQL connection |
| `JWT_SECRET` | Secret used to sign login tokens |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Cloudinary image uploads |

### 3. Start the client

```bash
cd client
npm install
npm run dev
```

The client reads `VITE_API_URL` from `client/.env` (see `client/.env.example`). If it is not set, it uses `http://localhost:3000`.

## API Endpoints

Routes marked 🔒 require a logged-in user (`Authorization: Bearer <token>`).

| Method | Route | Description |
|---|---|---|
| POST | `/auth/register` | Create an account |
| POST | `/auth/login` | Log in and receive a token |
| GET | `/posts` | All posts, with author username and comment count |
| GET | `/posts/:id` | One post |
| POST | `/posts` 🔒 | Create a post |
| PUT | `/posts/:id` 🔒 | Edit a post (author only) |
| DELETE | `/posts/:id` 🔒 | Delete a post (author only) |
| PUT | `/posts/:id/upvote` 🔒 | Add one upvote |
| POST | `/posts/:id/repost` 🔒 | Repost a post |
| GET | `/posts/:id/comments` | Comments on a post |
| POST | `/posts/:id/comments` 🔒 | Add a comment |
| POST | `/upload` 🔒 | Upload an image and get its URL |

## 🔗 Live Demo
👉 soccerHubS.netlify.app

## Video Walkthrough

Here's a walkthrough of implemented user stories:

<div>
    <a href="https://www.loom.com/share/dd852e4b293d4b23846e1a89ffb0dee2">
      <p>soccer-hub - 4 August 2026 - Watch Video</p>
    </a>
    <a href="https://www.loom.com/share/dd852e4b293d4b23846e1a89ffb0dee2">
      <img style="max-width:300px;" src="https://cdn.loom.com/sessions/thumbnails/dd852e4b293d4b23846e1a89ffb0dee2-1140c7eb6926f5cb-full-play.gif#t=0.1">
    </a>
  </div>

## Notes

The app started on Supabase and was later moved to its own Express and PostgreSQL backend. The biggest challenges were rebuilding every create, read, update, and delete operation as an API route, replacing the secret-key system with real accounts and JWT login, and making sure only a post's author can edit or delete it. Keeping the React UI in sync with the server while handling loading states, image uploads, and repost threads also required careful state management.

## License

    Copyright 2026 Selehadin Abebe
