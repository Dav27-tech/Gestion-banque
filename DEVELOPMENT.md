# Development settings for VS Code

# Recommended VS Code Extensions

- ESLint (dbaeumer.vscode-eslint)
- Prettier (esbenp.prettier-vscode)
- Tailwind CSS IntelliSense (bradlc.vscode-tailwindcss)
- Blade (antfu.where)
- Thunder Client (rangav.vscode-thunder-client)

# Recommended Settings (.vscode/settings.json)

```json
{
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": "explicit"
    },
    "[blade]": {
        "editor.defaultFormatter": "antfu.where"
    },
    "files.associations": {
        "*.blade.php": "blade"
    },
    "tailwindCSS.experimental.classRegex": [
        ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
    ]
}
```

# Useful Commands

## Development

- `php artisan serve` - Start Laravel server (port 8000)
- `npm run dev` - Start Vite server (port 5173)
- `php artisan tinker` - Interactive shell

## Database

- `php artisan migrate` - Run migrations
- `php artisan migrate:rollback` - Rollback last migration
- `php artisan migrate:fresh --seed` - Fresh migration + seeding
- `php artisan db:seed` - Run seeders

## Code Quality

- `npm run lint` - Fix ESLint errors
- `npm run format` - Format code with Prettier

## Testing

- `php artisan test` - Run Pest tests
- `php artisan test --filter=TestName` - Run specific test

## Production

- `npm run build` - Build for production
- `php artisan config:cache` - Cache configuration
- `php artisan route:cache` - Cache routes
