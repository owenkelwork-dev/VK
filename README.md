# VK Home Solutions CRM

A private CRM for Owen and Jack to track seller leads, the acquisitions pipeline, deal numbers, cash buyers and follow-ups.

Built with **Next.js** (the website), **Supabase** (database + logins) and **Tailwind** (styling).

---

## One-time setup

You only do this once. It takes about 15 minutes.

### 1. Install Node.js
Node.js is the program that runs the app on your computer.
Go to <https://nodejs.org>, download the **LTS** version, and install it with the default options.

### 2. Get the code onto your computer
On GitHub, open this repository, switch to the branch `claude/vk-home-solutions-crm-0gvbp1`, click the green **Code** button, then **Download ZIP**. Unzip it somewhere easy, like your Desktop.

(If you use GitHub Desktop, you can "Clone" the repository instead, which makes getting updates easier.)

### 3. Create your Supabase project (free)
1. Go to <https://supabase.com> and sign up.
2. Click **New project**. Name it `vk-crm`, choose a strong database password (save it somewhere), and pick the region closest to you.
3. Wait a minute or two for it to finish setting up.

### 4. Create the database tables
1. In your Supabase project, click **SQL Editor** in the left sidebar.
2. Click **New query**.
3. Open the file `supabase/schema.sql` from the code folder (any text editor works), copy **everything**, and paste it into the editor.
4. Click **Run**. You should see "Success. No rows returned."

### 5. Lock down sign-ups (so only you and Jack can get in)
1. Go to **Authentication → Sign In / Providers** (on older dashboards: **Authentication → Providers**).
2. Turn **off** "Allow new users to sign up" and click **Save**.

### 6. Create logins for Owen and Jack
1. Go to **Authentication → Users**.
2. Click **Add user → Create new user**.
3. Enter the email and a password, and tick **Auto Confirm User**. Click **Create user**.
4. Do the same for the other person.
5. Set your display names: go to **Table Editor → profiles**, double-click the `full_name` cell for each person, and change it to `Owen` or `Jack`.

### 7. Connect the app to Supabase
1. In Supabase, click the **Connect** button at the top of the project (or go to **Project Settings → API Keys**).
2. Find these two values:
   - **Project URL**, which looks like `https://abcdefgh.supabase.co`
   - **Publishable key** (or the **anon public** key on older projects)
3. In the code folder, make a copy of the file `.env.example` and name the copy `.env.local`.
4. Open `.env.local` in a text editor and paste in your two values. Save it.

> `.env.local` stays on your computer and is never uploaded to GitHub.

---

## Running the app

1. Open a terminal in the code folder:
   - **Mac:** open the **Terminal** app, type `cd ` (with a space), drag the folder into the window, and press Enter.
   - **Windows:** open the folder in File Explorer, click the address bar, type `cmd`, and press Enter.
2. The first time (and after each update), install the app's building blocks:
   ```
   npm install
   ```
3. Start the app:
   ```
   npm run dev
   ```
4. Open <http://localhost:3000> in your browser and log in.

To stop the app, go back to the terminal and press **Ctrl + C**.

---

## Build progress

- [x] Step 0: Setup and login
- [x] Step 1: Seller leads
- [ ] Step 2: Activity log
- [ ] Step 3: Pipeline board
- [ ] Step 4: Deal calculator
- [ ] Step 5: Follow-ups
- [ ] Step 6: Cash buyers and matching
- [ ] Step 7: Dashboard
- [ ] Step 8: Put it online
