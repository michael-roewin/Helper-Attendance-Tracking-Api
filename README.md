
# Helper Attendance Tracker Api

A restful Api used on the Helper Attendance Tracker App.


## Tech Stack

**Server:** Node, Express, Typescript

**Database:** Postgres

**Orm:** MikroOORM


## Run Locally

Clone the project

```bash
  git clone https://link-to-project
```

Go to the project directory

```bash
  cd {project-directory}
```

Install dependencies

```bash
  npm install
```

Create a `.env` file based on the `.env.example` file and populate your DB Credentials

```bash
  nano .env
```

Create the database, schema and tables.

```bash
  npx mikro-orm schema:fresh --run
```

Edit Seeder File based on your preference.

```bash
  nano {project-directory}/seeder/DatabaseSeeder.ts
```

Run Seeder.

```bash
  npx mikro-orm seeder:run
```

Run the app

```bash
  npm run dev
```

