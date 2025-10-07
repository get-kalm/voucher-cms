# Project Setup Guide

Access production server in [https://voucher-cms.vercel.app/](https://voucher-cms.vercel.app/) <br>
Use this credential for login:
   - **Email:** `admin@example.com`
   - **Password:** `adminpassword`

## Steps to Run the Project on your Local Device

1. Run the following command to install dependencies:
   ```bash
   pnpm install
   ```

2. Copy `.env.example` into a new file called `.env`:
   ```bash
   cp .env.example .env
   ```

3. Set the environment variables in `.env` according to your own configuration.

4. Create a new database either by running:
   ```bash
   pnpm db:create
   ```
   or manually create one in your local PostgreSQL database.

5. Generate migration file:
   ```bash
   pnpm db:generate
   ```

6. Run database migrations:
   ```bash
   pnpm db:migrate
   ```

7. Start the development server:
   ```bash
   pnpm run dev
   ```

8. Seed the admin user by visiting:
   [http://localhost:3000/seed](http://localhost:3000/seed)

   The seeded credentials are:
   - **Email:** `admin@example.com`
   - **Password:** `adminpassword`

9. Access the admin panel at:
   [http://localhost:3000/admin](http://localhost:3000/admin)

   Here you can see the list of vouchers and create/edit vouchers.

10. Access the redeem page at:
    [http://localhost:3000](http://localhost:3000)

    You can search for a voucher code and redeem it from there.

11. You can import postman collection and env variables in /docs