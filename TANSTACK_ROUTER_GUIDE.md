# TanStack Router Setup with File-Based Routing

TanStack Router has been successfully integrated into your frontend application with **file-based routing**. This means routes are organized by the file structure in the `src/routes/` directory.

## File-Based Routing Structure

Routes are automatically mapped based on their file names and locations:

```
src/routes/
├── __root.tsx          # Root layout (/ parent route)
├── index.tsx           # Home page (/ route)
├── about.tsx           # /about route
├── form/
│   ├── index.tsx       # /form route
│   └── $id.tsx         # /form/:id dynamic route
└── -layout.tsx         # Layouts (prefixed with -)
```

## File Naming Conventions

- `__root.tsx` - Root layout wrapping all routes
- `index.tsx` - Index route for the parent directory
- `about.tsx` - Route at `/about`
- `form/index.tsx` - Route at `/form`
- `form/create.tsx` - Route at `/form/create`
- `$id.tsx` - Dynamic route parameter (`:id`)
- `$` - Catch-all segments
- `-filename.tsx` - Layout files (with hyphen prefix)

## Current Routes

- `/` - Home page with landing hero section (via `index.tsx`)
- Root layout with navbar (via `__root.tsx`)

## How to Navigate

### Using Links

Use the `Link` component from `@tanstack/react-router` for navigation:

```tsx
import { Link } from "@tanstack/react-router";

export function MyComponent() {
  return <Link to="/about">About</Link>;
}
```

### Using useNavigate Hook

Programmatically navigate using the `useNavigate` hook:

```tsx
import { useNavigate } from "@tanstack/react-router";

export function MyComponent() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({ to: "/dashboard" });
  };

  return <button onClick={handleClick}>Go to Dashboard</button>;
}
```

## Adding New Routes

### Step 1: Create a New Route File

Create a new file in `src/routes/` following the naming convention:

```tsx
// src/routes/about.tsx
export function AboutPage() {
  return (
    <div>
      <h1>About Us</h1>
      <p>Learn more about our company</p>
    </div>
  );
}
```

### Step 2: Export the Route Definition

Add the route export to the same file:

```tsx
import { Route as RouterRoute } from "@tanstack/react-router";
import { Route as RootRoute } from "./__root";

function AboutPage() {
  return (
    <div>
      <h1>About Us</h1>
    </div>
  );
}

export const Route = new RouterRoute({
  getParentRoute: () => RootRoute,
  path: "/about",
  component: AboutPage,
});
```

### Step 3: Register the Route in router.tsx

Update `src/router.tsx` to include the new route:

```tsx
import { Route as AboutRoute } from "./routes/about";

// Add to route tree
const routeTree = RootRoute.addChildren([
  IndexRoute,
  AboutRoute, // Add new route
]);
```

## Dynamic Routes (Route Parameters)

For routes with parameters like `/form/:id`:

```tsx
// src/routes/form.$id.tsx
import { Route as RouterRoute, useParams } from "@tanstack/react-router";
import { Route as RootRoute } from "./__root";

function FormDetailPage() {
  const { id } = useParams({ from: "/form/$id" });

  return <div>Form ID: {id}</div>;
}

export const Route = new RouterRoute({
  getParentRoute: () => RootRoute,
  path: "/form/$id",
  component: FormDetailPage,
});
```

Then register in `router.tsx`:

```tsx
import { Route as FormDetailRoute } from "./routes/form.$id";

const routeTree = RootRoute.addChildren([IndexRoute, FormDetailRoute]);
```

## Useful Hooks

### useRouter

Access the router instance:

```tsx
import { useRouter } from "@tanstack/react-router";

const router = useRouter();
```

### useRouterState

Get current route state:

```tsx
import { useRouterState } from "@tanstack/react-router";

const location = useRouterState({ select: (s) => s.location });
```

## Type Safety

TanStack Router is fully typed. The type registration in `router.tsx` enables:

```tsx
// Fully typed navigation
navigate({ to: "/dashboard" }); // ✓ Works
navigate({ to: "/invalid" }); // ✗ TypeScript error
```

## Integration with tRPC

Your tRPC client is already set up and works with TanStack Router. Use it in any page component:

```tsx
import { trpc } from "../trpc/client";

export default function MyPage() {
  const { data } = trpc.myRoute.query.useQuery();
  return <div>{data}</div>;
}
```

## Resources

- [TanStack Router Documentation](https://tanstack.com/router/latest)
- [TanStack Router API Reference](https://tanstack.com/router/latest/docs/framework/react/api)
