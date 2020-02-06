<template>
  <div>
    <header class="site-head">
      <div class="site-brand">
        <a href="/">Student Dashboard</a>
      </div>

      <nav class="site-nav">
        <a href="/">Home</a>
        • <a href="/chart">Marking Periods</a>
      </nav>
    </header>

    <main class="site-main">
      <nuxt />
    </main>

    <footer class="site-foot">
      (footer)
    </footer>
  </div>
</template>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, sans-serif;
  font-size: 1rem;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

body {
  background-color: hsl(220, 15%, 15%);
  color: hsl(220, 15%, 75%);
}

a {
  color: hsl(150, 45%, 45%);
  text-decoration: none;
}
a:hover {
  color: hsl(150, 45%, 70%);
  text-decoration: underline;
}

.site-head,
.site-main,
.site-foot {
  padding: 1em;
}

.site-head {
  background-color: hsla(0, 0%, 0%, 0.4);
}

.site-brand,
.site-nav {
  display: inline-block;
  margin-right: 1em;
}

.site-nav {
  text-align: center;
}

.site-foot {
  display: none;
}
</style>
