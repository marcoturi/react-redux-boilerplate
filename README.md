![React Redux Boilerplate](https://github.com/marcoturi/react-redux-boilerplate/blob/main/doc/images/react_redux_boilerplate.jpg?raw=true)

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![MIT License](https://img.shields.io/github/license/marcoturi/react-redux-boilerplate)](https://github.com/alan2207/bulletproof-react/blob/master/LICENCE) ![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/marcoturi/react-redux-boilerplate/codeql-analysis.yml) ![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/marcoturi/react-redux-boilerplate/release.yml)

A meticulously crafted, extensible, and robust architecture for constructing production-grade React applications.
The project aim to provide guidelines on the development key points of a long term React project:

- A well-defined **folder structure and code organization** for enhanced maintainability and scalability, with particular attention to the possibility of splitting and sharing components across projects.
- A robust **state management** approach to effectively manage data and maintain application code SOLID
- An automated **release system** to streamline the deployment process and ensure seamless updates with automatic changelog, version bump and tags
- Consistent **code formatting and styling** to enhance code readability, maintain consistency, and promote adherence to best practices
- A **headless theme**, with few dependencies and focus on accessibility
- **Powerful E2E tests** with Cucumber and Playwright

## ⚡ Features

- Blazing fast build system: [Vite](https://vitejs.dev/) + [React SWC](https://github.com/vitejs/vite-plugin-react-swc) + [Yarn 4](https://yarnpkg.com/getting-started/install) + [TypeScript](https://www.typescriptlang.org) with [absolute imports](https://github.com/aleclarson/vite-tsconfig-paths)
- App State: [Redux Toolkit 2](https://redux-toolkit.js.org/)
- Theme: [Radix](https://www.radix-ui.com/) + [Shadcn/ui](https://ui.shadcn.com/) + [Tailwind 3](https://tailwindcss.com/)
- Format and Style: [Eslint](https://eslint.org/) + [Prettier](https://prettier.io/) with a [prettier plugin](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) that automatically sorts tailwind classes.
- Release flow: [Husky](https://github.com/typicode/husky) + [Commitlint](https://commitlint.js.org/) + [Semantic-release](https://github.com/semantic-release/semantic-release)
- Mocked server for fast development: [MSW](https://mswjs.io/)
- Tests: E2E tests with [Cucumber](https://cucumber.io/docs/installation/javascript/) + [Playwright](https://playwright.dev/), and unit and integration tests with [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/).

## 👉 Table of Contents

- [Getting Started](#start)
- [Folder Structure and Code Organization](#folder)
- [State management: Why redux?](#state)
- [UI Components and Style system](#ui)
- [Release system](#release)
- [Format and style](#style)
- [Error Handling and Analytics](#error)
- [Additional libraries](#additional-libraries)

## <a name="start"></a>✨ Getting Started

```bash
npx degit marcoturi/react-redux-boilerplate my-app
cd my-app

# To enable yarn 4 follow the instruction here: https://yarnpkg.com/getting-started/install
yarn #Install dependencies.
yarn create:env #Create a .env file
```

### Common Commands

- `yarn start` - start a development server with hot reload.
- `yarn build` - build for production. The generated files will be on the `dist` folder.
- `yarn preview` - locally preview the production build.
- `yarn test` - run unit and integration tests.
- `yarn test:coverage` - run unit and integration tests with coverage.
- `yarn e2e:local` - run E2E test locally. Make sure to run yarn start before in a separate shell.
- `yarn type-check` - check for typescript errors.
- `yarn outdated` - update dependencies interactively.
- `yarn format` - format all files with Prettier.
- `yarn lint` - runs ESLint.
- `yarn create:env` - creates default envs.

## <a name="folder"></a>🗄️ Folder Structure and Code Organization

TLDR; Embrace the [vertical slice architecture](https://www.jimmybogard.com/vertical-slice-architecture/)

The vertical slice architecture is the recommended structure. Each feature encapsulates components, state management (redux), API interactions, and hooks. This architecture offers several compelling advantages:

1. Reduced Coupling: By isolating each feature within its own slice, dependencies between different parts of the codebase are minimized. This foster improved code comprehension, facilitates code modifications, and mitigates the risk of introducing bugs during changes.
2. Enhanced Maintainability: by simplifying the process of locating code pertaining to specific features. This stems from the organization of feature-specific code within a single slice, rather than scattering it across multiple layers or components.
3. Accelerated Development: by enabling parallel work on different features. Each feature can be developed and tested independently, fostering a more streamlined development process.
4. Streamlined Testing: Testing becomes more manageable due to the ability to isolate each feature for testing purposes.
5. Improved Onboarding: facilitates a smoother onboarding experience for new developers. The organization of code around user features, rather than technical layers or components, aligns with developers' familiarity.
6. Packetization: Features can be effortlessly moved and shared across projects.

Over the years, different structures were born based on different layers of features, including [Atomic design](https://atomicdesign.bradfrost.com/chapter-2/#:~:text=Molecules%20are%20groups%20of%20two,functioning%20together%20as%20a%20unit.) or [Feature slice](https://feature-sliced.design/). However, dividing code into numerous layers of features reduce the developer experience by the constant navigation between multiple folders. Also, the moment you want to move the logic to another package the refactor is also more invasive.

If you need to re-use features across projects, within the following structure is very easy to move the folders in a monorepo package without much re-factoring (thanks also to the usage of alias in imports).

```
.
└── src/
    ├── assets                   → Assets folder can contain all the static files such as images, fonts, etc.
    ├── pages                    → Routes and pages
    ├── shared/
    │   ├── config               → All the global configuration, env variables etc. get exported from here and used in the app
    │   ├── helpers              → Any helper function that do not belong to a feature i.e. logging, generic storage (localstorage), etc.
    │   └── store                → Redux configuration
    ├── UI/
    │   ├── elements             → Basic and complex UI elements
    │   └── layout               → Page layouts used across the app
    └── features/                → Features used across the entire application
        └── Feature X/           → Optional: a folder container for a group of features
            ├── Feature A/
            │   ├── store        → Redux slice
            │   ├── hooks        → React hooks
            │   ├── components   → React components
            │   └── services     → Services consumed by redux
            ├── Feature B
            └── Feature C
```

### FAQ

Q: What to do if features folder start multiplying ?
A: Try to avoid more than 6 folders in the same folder, group them inside "scope" folders.

Q: I have only a redux slice, where should I put it?
A: Put it in the features folder. You don't know if you will have to create components around it in the future.

## <a name="state"></a>🗃️ State management: Why redux?

TLDR; Embrace Redux for keep changes in your app more predictable and traceable.

Why should Redux reign supreme over the multitude of state management solutions? His strength lies in enforcing codebase consistency and facilitating effortless debugging through the ability to visualize, store, and potentially rehydrate application state in the event of errors (see error section).

Within a Redux-powered application, responsibilities are meticulously defined:

- Components: Solely responsible for dispatching actions and displaying data through selectors. No business or domain logic inside.
- Selectors and Reducers: Encapsulate the application's business and domain logic. Their pure function nature renders them highly testable, reusable through composition, and exceptionally maintainable.
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview), [thunks](https://redux-toolkit.js.org/api/createAsyncThunk) and [Listener middleware](https://redux-toolkit.js.org/api/createListenerMiddleware): Orchestrates the management of all side effects.

![Redux flow](https://github.com/marcoturi/react-redux-boilerplate/blob/main/doc/images/redux_architecture.gif?raw=true)

While some may argue that newer state management solutions offer less boilerplate, these often lack a designated location for business code placement. In the React ecosystem, custom hooks provide the cleanest approach for addressing this issue. However, the reliance on custom hooks to encapsulate domain logic in a large team, can quickly lead to an unwieldy codebase, with components ballooning to over 200-300 lines. In my experience, without a clear project-defined location for application domain logic, it inevitably gravitates towards react/ui components, rendering them unmaintainable.

## <a name="ui"></a>🧱 UI Components and Style system

TLDR; Chose UI Components with few dependencies

Choosing a UI library can be a complex decision, and it is often influenced by both the requirements of the project and the capabilities of the team. To ensure that a project is long-lived and maintainable, I recommend choosing a UI library that does not tie you with many dependencies and exposing the APIs of UI components to a minimum by encapsulating them.

### Why Radix + Shadcn as UI component library?

- Minimal dependencies
- Shadcn embraces the philosophy of "The design of your components should be separate from their implementation."
- [Components are fully accessible and adhere to Web Content Accessibility Guidelines (WCAG) standards](https://www.youtube.com/watch?v=pcMYcjtWwVI).

### Why Tailwind?

- Consistency and Maintainability: Tailwind's utility-first approach promotes consistent styling across the entire codebase. Developers can easily reuse predefined classes and components, ensuring a unified look and feel throughout the project. This consistency makes it easier for new team members to onboard and maintain the codebase, reducing the risk of inconsistencies and maintainability issues.

- Rapid Prototyping and Development: Tailwind's declarative syntax allows developers to quickly prototype and develop features without the overhead of writing complex CSS rules. The prebuilt utility classes provide a quick and straightforward way to style elements, accelerating the development process and enabling developers to focus on functionality rather than styling intricacies.

- Reduced Code Bloat and Complexity: Tailwind eliminates the need for writing repetitive CSS rules, which can often lead to code bloat and complexity. The utility-first approach encourages developers to utilize predefined classes, reducing the amount of code they need to write and maintain. This simplification enhances code readability, maintainability, and overall project health.

- Collaboration and Efficiency: Tailwind's consistency and component-based approach facilitate efficient collaboration among team members. Developers can easily share and reuse styled components, ensuring consistency and reducing duplication of effort. This collaboration promotes efficiency and productivity, particularly in large teams where multiple developers are working on the same codebase.

- Responsive Design and Accessibility: Tailwind CSS provides a comprehensive set of utility classes for responsive design, enabling developers to easily create responsive layouts that adapt to different screen sizes and devices. Additionally, Tailwind's accessibility features make it easier to build websites that are inclusive and usable by people with disabilities.

- Modular and Customizable: Tailwind's utility classes can be organized into custom components and modules, allowing developers to tailor the framework to the specific needs of their project. This modularity provides flexibility and customization, ensuring that Tailwind fits seamlessly into the project's architecture and design principles.

In summary, Tailwind CSS offers a plethora of benefits for long-term projects and large teams, including consistency, maintainability, rapid prototyping, reduced code bloat, collaboration efficiency, responsive design, accessibility, modularity, and a great developer experience. Its utility-first approach, prebuilt components, and focus on code quality make it an excellent choice for building complex and maintainable web applications.

## <a name="release"></a>🌐 Release system

TLDR; Automate Versioning and Changelog Generation via a standalone Pipeline

Over the years there have been different release systems: [git flow](https://datasift.github.io/gitflow/IntroducingGitFlow.html), [github flow](https://docs.github.com/en/get-started/quickstart/github-flow), [gitlab flow](https://about.gitlab.com/topics/version-control/what-is-gitlab-flow/) and [truck-based delivery](https://www.atlassian.com/continuous-delivery/continuous-integration/trunk-based-development).

Beyond the choice of the release system, this project suggests automating this process within the pipeline, in order to avoid discrepancies and inefficiencies with [semantic-release](https://semantic-release.gitbook.io/semantic-release/usage/installation).

**Streamlined Release Process**

To initiate a new release, developers simply need to merge a branch into main. The system seamlessly handles versioning and changelog generation based on commit history. Naturally, this process is contingent upon successful test and build executions.

**Adaptability to diverse Environments**

This method seamlessly adapts to various deployment scenarios:

- Real-time environment updates with every commit: Implement a job that triggers releases on the "environment" branch (e.g., develop).
- Multiple environments: Duplicate the deployment logic for additional environments or centralize deployment using a baseline repository. Alternatively, [leverage semantic-release's capability to generate context-specific tags](https://semantic-release.gitbook.io/semantic-release/recipes/release-workflow/pre-releases) (e.g., beta/alpha).

**The complete toolkit:**

- Commitlint: Enhances commit consistency for automated versioning and changelog generation
- Husky: Mandates commitlint execution for every commit
- Semantic-release: Automates release/tag/changelog creation within the pipeline

This comprehensive toolkit streamlines the release process, ensuring efficiency, consistency, and reproducibility.

**Why is important to have standard commits?**

1. Automated Changelog Generation and Semantic Versioning: Standardized commits enable the seamless generation of comprehensive changelogs and facilitate the accurate determination of semantic version increments.
2. Enhanced Change Identification: By employing fundamental keywords such as "feat," "chore," and "revert," teams can effortlessly discern the nature of the modifications, fostering clarity and collaboration.
3. Streamlined Onboarding for New Contributors: Standardized commits significantly reduce the onboarding effort for developers, enabling them to swiftly integrate into the team and contribute meaningfully.

## <a name="style"></a>👁️ Format and style

TLDR; Embrace a consistent style guide, avoid Eslint's flat format, and leverage Prettier for formatting

- Postpone utilizing the new flat format until these issues are resolved: [eslint](https://github.com/eslint/eslint/issues/13481) and [eslint-typescript](https://github.com/typescript-eslint/typescript-eslint/issues/7694)
- [Forgo the use of eslint-plugin-prettier](https://stackoverflow.com/questions/44690308/whats-the-difference-between-prettier-eslint-eslint-plugin-prettier-and-eslint) opt for eslint-config-prettier. In general, delegate formatting responsibilities to Prettier, not Eslint as they also suggest in their official docs.
- Consider the available style guide options: standard, airbnb, google. For a comprehensive comparison, you can check [here](https://github.com/gajus/eslint-config-canonical/blob/main/COMPARISON_TABLE.md). Our preference is the airbnb style guide due to its widespread adoption and comprehensive coverage of React-specific guidelines.

List of rules:

- [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) - Deactivate formatting rules because we use prettier for them
- [eslint-config-airbnb](https://github.com/airbnb/javascript) - Airbnb set of rules
- [eslint-config-airbnb-typescript](https://github.com/iamturns/eslint-config-airbnb-typescript) - Airbnb rules for typescript
  - [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) - Rules for react
  - [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks) - Rules of React hooks
  - [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y) - accessibility rules on JSX elements.
  - [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint) - ESLint support TypeScript
  - [eslint-plugin-import](https://github.com/import-js/eslint-plugin-import) - Rules that help validate proper imports.
- [eslint-plugin-promise](https://github.com/eslint-community/eslint-plugin-promise) - Enforce best practices for JavaScript promises.
- [eslint-plugin-vitest](https://github.com/veritem/eslint-plugin-vitest) - Rules for Vitest
- [eslint-plugin-react-refresh](https://github.com/ArnaudBarre/eslint-plugin-react-refresh) - Validate that your components can safely be updated with fast refresh
- [eslint-plugin-unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn) - More than 100 other rules

## <a name="error"></a>⚠️ Error Handling and Analytics

TLDR; If you use redux correctly, you achieve exceptional developer experience during debugging.

One of the compelling advantages of the architecture presented in this project is its remarkable ability to facilitate debugging and error handling, fostering an exceptional developer experience.

Throughout the development process, the Redux Dev Tools extension for the browser provides real-time insights into the application's state transitions triggered by user interactions. In a production environment, when utilized appropriately (i.e., components dispatch Redux actions without encapsulating any business logic within themselves), we gain the capability to meticulously trace every user action preceding the occurrence of an error or in case we want to track them for analytics purposes:

![Sentry redux actions](https://github.com/marcoturi/react-redux-boilerplate/blob/main/doc/images/redux%20actions.png?raw=true)

Additionally, we can easily track and potentially rehydrate the user's state at the precise moment of the error (screenshot from [sentry](https://github.com/getsentry/sentry-javascript/tree/master/packages/react)):

![Sentry redux state](https://github.com/marcoturi/react-redux-boilerplate/blob/main/doc/images/redux%20state.png?raw=true)

## <a name="additional-libraries"></a>📚 Additional libraries

- Time and dates: [date-fns](https://github.com/date-fns/date-fns) - [Moment is dead](https://momentjs.com/docs/#/-project-status/). Date-fns is a maintained, fast, functional and modular alternative.
- Forms: [react-hook-form](https://github.com/react-hook-form/react-hook-form) - Small size with no dependencies, good performance and DX and UX experience.
- Data manipulation: [ramda](https://github.com/ramda/ramda) - Alternative for lodash that promotes functional programming
- Logging and monitoring: [Sentry](https://github.com/getsentry/sentry-javascript/tree/master/packages/react)

## Contributing

Contributions are always welcome! If you have any ideas, suggestions, fixes, feel free to contribute. You can do that by going through the following steps:

1. Clone this repo
2. Create a branch: `git checkout -b your-feature`
3. Make some changes
4. Test your changes
5. Push your branch and open a Pull Request

## License

[MIT](https://choosealicense.com/licenses/mit/)
