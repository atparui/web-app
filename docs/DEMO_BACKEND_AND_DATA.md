# Demo Backend and Demo Data (Finos Web App)

The Finos Web App does **not** store dummy data itself. All clients, loans, savings, and users come from the **Fineract backend**. For a proper demo you need a backend that has (or you create) that data.

## Connecting to a demo backend

Default configuration (`src/environments/environment.ts`) allows connecting to:

- **https://sandbox.mifos.community**
- **https://demo.mifos.community**
- **https://localhost:8443** (your local Fineract)

Typical login for community demos and for a fresh local Fineract install:

- **Username:** `mifos`
- **Password:** `password`
- **Tenant:** `default`

Use the in-app server switcher (if enabled) to choose which backend to use.

## Getting demo data (users, customers, savings, loans)

- **Hosted demo:** Use sandbox.mifos.community or demo.mifos.community — they may already have demo clients/loans/savings.
- **Local Fineract:** A new install only has one office and the `mifos` user; there are no clients, loans, or savings until you create them (via UI or API).

For a full guide on **how to get dummy/demo data** (options: hosted server, local UI, API script, or SQL restore), see the Fineract documentation:

- In the **Fineract** repo: `docs/DEMO_DATA_SETUP.md`

That document covers:

- What initial data Fineract creates on first run
- Using hosted demo servers
- Creating a full demo locally via the UI
- Restoring a backup or scripting data via the API
