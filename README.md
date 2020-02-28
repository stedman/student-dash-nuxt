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

### Additional

```sh
# build for production and launch server
npm run build
npm run start

# generate static project
npm run generate
```
