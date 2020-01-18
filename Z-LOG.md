# Install/setup log

1. Install NuxtJS: `npx create-nuxt-app grade-vue`

    Options:
    * package manager: `npm`
    * UI framework: `none`
    * server framework: `Express`
    * linting: `ESLint, prettier`
    * test framework: `Jest`
    * rendering mode: `Universal (SSR)`
    * dev tools: `jsconfig.json`

    Then get into the app directory: `cd grade-vue`
2. Configure settings
    * To `.eslintrc.js` add:

      ```json
      "rules": { "vue/html-self-closing": "off" }
      ```

    * Make VSCode play nice with `.vue` files (especially `<template>` code). Create `.vscode/settings.json` and add:

      ```json
      {
        "editor.formatOnSave": false,
        "javascript.format.enable": false,
        "eslint.alwaysShowStatus": true,
        "eslint.options": {
          "extensions": [ ".html", ".js", ".vue", ".jsx" ]
        },
        "eslint.validate": [
          { "language": "html", "autoFix": true },
          { "language": "vue", "autoFix": true },
          { "language": "javascript", "autoFix": true },
          { "language": "javascriptreact", "autoFix": true }
        ],
        "editor.codeActionsOnSave": {
          "source.fixAll.eslint": true
        }
      }
      ```

      Source: https://stackoverflow.com/a/52259752

    * Fix issue with Jest tests failing because Babel isn't running. This seems to be because Jest isn't setting `NODE_ENV` properly. Choose one of the following solutions: 
        * Set the env variable every time we run Jest. 

          Change the test script in `package.json` to:

          ```json
          "scripts": {
            "test": "env NODE_ENV=test jest"
          }
          ```

        * When Nuxt pre-configures Babel, it nests the `presets` in `env.test`. If Jest doesn't set `NODE_ENV` to `test`, then Babel never runs `preset`. Fix that by running `presets` all the time. 

          Replace the contents of `.babelrc` with:

          ```json
          {
            "presets": [
              [
                "@babel/preset-env",
                {
                  "targets": {
                    "node": "current"
                  }
                }
              ]
            ]
          }
          ```

3. Add [axios](https://github.com/axios/axios): `npm i --save axios`
