# Development environment

- Editor: `vscode`
- Extensions:
  - Tailwind CSS IntelliSense
  - SonarLint
  - Prettier
- Tools
  - NodeJS 18
  - Yarn 1.22.19
  - Next 13.2.4

_All the listed extensions must be installed._

# Rules

- Fix all the Prettier errors and warnings.
- Fix all the SonarLint errors and warnings.
- The code must be in typescript and strongly typed.
- Allow only `console.error` in case of the error reporting.

_If there are errors or warnings that cannot be fixed, please discuss them with the team._

# Development

```sh
yarn install
cp .env.example .env.local
yarn dev
```

## Commands

### Run the develop server

```sh
yarn dev
```

### Starts the application in production mode

```sh
yarn start
```

### Run the lint and prettier check

```sh
yarn lint
yarn prettier
```

### Fix the lint and prettier errors

```sh
yarn fix
```
