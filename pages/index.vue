<template>
  <div class="container">
    <div>
      <h1 class="title">
        grade-vue
      </h1>
      <h2 class="subtitle">
        Zee Nuxt.js data view
      </h2>
      <div class="links">
        <a href="https://nuxtjs.org/" target="_blank" class="button--green">
          Documentation
        </a>
        <a
          href="https://github.com/nuxt/nuxt.js"
          target="_blank"
          class="button--grey"
        >
          GitHub
        </a>
      </div>
      <div>
        <p class="showtime">
          And now it's time for a show!
        </p>
        <h3>
          {{ studentName }}
        </h3>
        <ul>
          <li v-for="(grade, course) in snapshot">{{ course }}: {{ grade }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  async asyncData({ params }) {
    const { data } = await axios.get(
      'http://localhost:3001/api/v1/students/109683/grades/snapshot/3'
    );
    return { studentName: data.name, snapshot: data.course_grade_average };
  }
};
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}

.showtime {
  color: red;
  margin: 1em;
}
</style>