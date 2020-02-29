# Student Dashboard

This is the presentation application for viewing RRISD Home Access data coming from the [student-data API](https://github.com/stedman/student-data). There is more information about this project at that site.

> **WIP**: As this is a work in progress, there may be some unexpected bugs. Use at your own peril.

## Use

### Install dependencies

```sh
npm run install
```

If you want to use the fancy weather feature, get a Dark Sky API key at https://darksky.net/dev . Save your key to a `.env` file (on the root directory) like so:

```
DARKSKY_KEY=my_dark_sky_api_key
```

### Run in developer mode

Serve with hot reload at [localhost:3000](http://localhost:3000).

```sh
npm run dev
```

Configurable options for the [Dashboard](http://localhost:3000) can be found in the `./pages/index.vue` file. Look for the following section.

```js
/* ------ BEGIN USER SETTINGS ------ */
const option = {
  gradeLowerLimit: 70, // activates alerts on dashboard for grades that drop below
  menuDaysMax: 2, // shows max number of daily menus from today; use '0' to hide menus
  menuMeal: 'lunch', // choose 'lunch' or 'breakfast'
  chartBarColor: 'hsla(200,10%,60%,0.6)',
  chartBarBorderColor: 'hsla(0,100%,100%,0.9)',
  chartBarBorderWidth: 1
};

// If your school menu doesn't show up on the dashboard, check if school name at nutrislice
// (https://roundrockisd.nutrislice.com/menu/) matches the one on Home Access.
// If it doesn't, you can manually map the RRISD school name to the nutrislice slug in `slugMap`.
const menuSlugMap = {
  'Patsy Sommer Elementary School': 'sommer-elementary-school'
};
/* ------ END USER SETTINGS ------ */
```

### Advanced Nuxt

```sh
# build for production and launch server
npm run build
npm run start

# generate static project
npm run generate
```
