# Net Worth Display

## Run the project

```
npm i
npm dev
```

To respect the 4 hour time constraint, I've harvested a lot of components and styling from a previous projects.

The chart comes from https://ui.shadcn.com/charts.

Because I ran into CORS errors when fetching data, I use test data (`test-data.ts`) that I return in `api.ts`.

I use Typescript to ensure strong typing, but again, due to time constraints, I use `any` through places in the project.

For the display, I've chosen to group by account type and use an accordion for this.

For the components:

- I tried to make sure I followed Atomic Design principles and group them into related folders as appropriate
- I use Tailwind v4 for styling and define my design tokens in `globals.css` (see https://tailwindcss.com/docs/theme)
- I implement a theme switcher using `dark:` and React Context

If I had more time:

- I'd create stronger interfaces
- Add filters for account type and subtype
- Ensure performance testing, accessibility, unit tests and security
- Add i18n support
- Add time scale options to the net worth chart
