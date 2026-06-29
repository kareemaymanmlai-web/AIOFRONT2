# AIOFRONT React

React implementation for the AIOFRONT prototype, prepared for backend integration.

## Run locally

```bash
npm install
npm run dev
```

## Production

```bash
npm install
npm run build
npm start
```

The current data source is mocked in `src/data/mockData.js`. Replace the functions in `src/services/api.js` with backend endpoints when APIs are ready.

## Backend integration

Copy `.env.example` to `.env` and set:

```bash
VITE_API_BASE_URL=https://your-api-domain.com
VITE_USE_MOCK_API=false
```

Main integration files:

- `src/services/httpClient.js`: base URL, token headers, and request errors.
- `src/services/authService.js`: `/auth/login` and local session handling.
- `src/services/api.js`: rooms, files, members, tenants, analytics, and subscription endpoints.

Production routes:

- `/login`
- `/end-user/home`
- `/end-user/files`
- `/tenant-admin/dashboard`
- `/tenant-admin/rooms`
- `/tenant-admin/files`
- `/tenant-admin/members`
- `/super-admin/dashboard`
- `/super-admin/tenants`
- `/super-admin/subscriptions`
