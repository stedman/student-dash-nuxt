<template>
  <div class="container">
    <div>
      <h1 class="title">
        Student Portal
      </h1>
      <h2 class="subtitle">
        A Nuxt.js data view
      </h2>
      <div>
        <h3>Recent Grades for {{ studentName }}</h3>
        <ul>
          <li v-for="snap in snapshot">
            <em>{{ snap.course }}:</em> {{ snap.average }}
          </li>
        </ul>
        <horiz-chart :data="chartData" />
      </div>
    </div>
  </div>
</template>

<script>
import HorizChart from '~/components/vue-chart-horiz';

export default {
  components: { HorizChart },
  async asyncData({ $axios }) {
    try {
      const data = await $axios.$get(
        'http://localhost:3001/api/v1/students/109683/grades/snapshot/3'
      );
      const snapshot = data.course_grade_average.map((course) => {
        return {
          course: course.courseName,
          average: course.average
        };
      });

      const chartData = {
        labels: data.course_grade_average.map((course) => course.courseName),
        datasets: [
          {
            backgroundColor: 'hsla(200,10%,60%,0.6)',
            borderColor: 'hsla(0,100%,100%,0.9)',
            borderWidth: 1,
            data: data.course_grade_average.map((course) => course.average)
          }
        ]
      };

      return { studentName: data.name, snapshot, chartData };
    } catch (err) {
      throw new Error(err.message);
    }
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
