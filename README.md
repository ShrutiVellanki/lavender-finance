# Net Worth Display

## Run the project

```
npm i
npm dev
```

## A Note to the Evaluators

![alt text](image.png)

To respect the 4-hour time constraint, I've reused several components and styles from previous projects.

The chart comes from [ShadCN's UI library](https://ui.shadcn.com/charts).

I ran into CORS errors while fetching data, so I used test data (from `test-data.ts`) that I return in `api.ts`.

I’m using TypeScript to ensure strong typing, but due to time constraints, I had to use `any` in a few places within the project.

For the display, I've grouped data by account type and used an accordion for this layout.

### Regarding the components:
- I aimed to follow Atomic Design principles and organized components into related folders accordingly.
- I use Tailwind CSS (v4) for styling, with design tokens defined in `globals.css` (see [Tailwind Docs](https://tailwindcss.com/docs/theme)).
- I’ve implemented a theme switcher using `dark:` mode and React Context for state management.

### If I had more time, I would:
- Create stronger interfaces and types.
- Add filters for account types and subtypes.
- Ensure performance testing, accessibility, unit tests, and security.
- Add internationalization (i18n) support.
- Add time scale options to the net worth chart.
