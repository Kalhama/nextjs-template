# Nextjs template

## Tech

- framework: [Next.js](https://nextjs.org/docs)
- orm: [Prisma](https://www.prisma.io/docs/orm) + postgres
- forms: [react-hook-form](https://react-hook-form.com/)
- validation: [zod](https://github.com/colinhacks/zod)
- styles: [tailwindcss](https://tailwindcss.com/), sass, normalize.css
- UI libraries: [shadcn](https://ui.shadcn.com/)
- icons: [lucide-react](https://lucide.dev/icons/)
- linter: ESLint
- formatter: Prettier
- misc:
  - axios
  - [react-datepicker](https://reactdatepicker.com/)
  - [@tanstack/react-table](https://tanstack.com/table/latest)
  - package.json
- authorization: [lucia-auth](https://lucia-auth.com/)

## TODO documentation

- [ ] `@/utils/db.ts`
- [ ] `@/utils/server-action-error.ts`
- [ ] `@/utils/wrap-server-action.ts`

- [ ] `@/components/button-loading.tsx`
- [ ] `@/components/google-login.tsx`
- [ ] `@/components/github-login.tsx`

- [ ] How to start developing

  - [ ] `.env`, OAuth2, db etc...

- [ ] Short description of the package for the start of readme outlining key features

## How to add additional OAuth methods

Familiarize yourself with how the existing OAuth methods work. On high level process goes like this.

1. Redirect user to `GET /login/:provider`
2. This use OAuth provider adapter (preferably from `arctic`) to redirect user to Oauth2 provder consent screen. Remember to add email to scope.
3. Provider should redirect user back to our service into `GET /login/:provider/callback`

4. Validate input parameters and possible additional cookies set in `GET /login/:provider`
5. Validate authorization code with provider adapter (preferably from `arctic`)
6. Get user data from OAuth provider
7. Check if user email already exists in users table. If it does add new OAuth provider into existing account. If not, create a new user account
8. Finally create a new session
9. Redirect user back to `/`

## Adding new env variables

The `config.mjs` file serves as a configuration module for your server environment. It utilizes the `zod` library to enforce a schema for the environment variables, ensuring their correctness and type safety.

### Step 1: Define the Schema

Open the `config.mjs`. Within the `z.object({...})` block, add a new key-value pair for your new environment variable. The key should be the name of the variable, and the value should be the validation type from `zod`. For example, if you want to add a variable named `NEW_VARIABLE`, and it's expected to be a string, you would add:

```typescript
const schema = z.object({
  NODE_ENV: z.string(),
  DATABASE_URL: z.string(),
  GITHUB_ID: z.string(),
  GITHUB_SECRET: z.string(),
  GOOGLE_ID: z.string(),
  GOOGLE_SECRET: z.string(),
  HOST: z.string(),
})
```

```typescript
NEW_VARIABLE: z.string(),
```

### Step 2: Access the New Variable in Your Application

After adding the variable to the schema, save the changes to `config.mjs`. You can now access this new environment variable within your application code using the `config` object exported from `config.mjs`.

```typescript
import config from './config.mjs'

const newVariableValue = config.NEW_VARIABLE
```

### Step 3: Set the Variable in Your `.env` File

Open your `.env` file and add a new line for the variable you've just added. Assign it an appropriate value according to its purpose. For example:

```
NEW_VARIABLE=my_value
```

## Protecting routes

To protect routes using the `getCurrentUser` method, you can utilize it app / api routes. This ensures that only authenticated users can access certain routes. Here's how you can implement it:

```typescript
import { getCurrentUser } from '@/lib/auth.ts'

// Example route / template
const routeOrPage = () => {
  try {
    const { user } = await getCurrentUser()

    if (!user) {
      // Redirect or throw
    }

    // Proceed with authenticated user
}
```

## `handlePrismaError` for 404 errors

```typescript
import { db } from '@/lib/db.ts'
import { getCurrentUser } from '@/lib/auth.ts'
import { handlePrismaError } from '@/lib/handle-prisma-error.ts'

const getUserSettings = async (userId: string) => {
  return db.userSettings.findFirstOrThrow({ where: { id: userId } })
}

export default function UserData() {
  const { user } = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const settings = await getUserSettings(user.id).catch(handlePrismaError) // returns 404 if entity was not found

  return (
    <div>...</div>
  )
}

```
