<template>
  <div class="container">
    <div>
      <h3>Weather Today</h3>
      <div>
        <div class="weather-temp-group">
          <skycon :condition="weather.icon" width="90" height="90" />
          <span class="weather-temp">{{ weather.temp }}&deg;</span>
          <em class="weather-feel">feels like {{ weather.feelslike }}&deg;</em>
        </div>

        <div class="weather-forecast">
          <h4>Forecast</h4>
          <p class="weather-summary">
            {{ weather.forecast.today.summary }}
          </p>
          <p class="weather-hilo">
            High: {{ weather.forecast.today.data.temperatureHigh }}&deg;, Low:
            {{ weather.forecast.today.data.temperatureLow }}&deg;
          </p>
        </div>
      </div>
    </div>

    <div>
      <h3>{{ studentName }}'s Current Average</h3>
      <horiz-chart :data="chartData" />
    </div>

    <div>
      <h3>Cafeteria</h3>
      <ul class="lunch-days no-bullets">
        <li v-for="menu in menus" :key="menu.date" class="lunch-day">
          <h4>{{ menu.day }}'s lunch menu</h4>
          <ul
            v-for="item in menu.menu_items"
            :key="item"
            class="lunch-items no-bullets"
          >
            <li class="lunch-item">
              {{ item }}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import secret from '~/.secret.json';
import HorizChart from '~/components/vue-chart-horiz';

export default {
  components: { HorizChart },
  async asyncData({ $axios }) {
    try {
      // Get studentId from .secret.json
      // TODO: this is hard-coded now to grab 1st student
      const studentId = Object.keys(secret.student)[0];

      // STUDENT GRADES
      const studentData = await $axios.$get(
        `http://localhost:3001/api/v1/students/${studentId}/grades/snapshot/4`
      );
      const chartData = {
        labels: studentData.course_grade_average.map(
          (course) => course.courseName
        ),
        datasets: [
          {
            backgroundColor: 'hsla(200,10%,60%,0.6)',
            borderColor: 'hsla(0,100%,100%,0.9)',
            borderWidth: 1,
            data: studentData.course_grade_average.map(
              (course) => course.average
            )
          }
        ]
      };

      // SCHOOL MENU
      const meal = 'lunch'; // alt: 'breakfast'
      const getCurrentDateString = () => {
        const now = new Date();

        return `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;
      };
      const today = getCurrentDateString();
      const school = secret.student[studentId].school_slug;
      const menuData = await $axios.$get(
        `https://roundrockisd.nutrislice.com/menu/api/weeks/digest/` +
          `school/${school}/` +
          `menu-type/${meal}/` +
          `date/${today}`
      );
      const todayMs = new Date(today).getTime();
      const menus = menuData
        .filter((menu) => {
          // Instantiating a Date object with Nutrislice's date string format (YYYY-MM-DD) results in
          // a date offset by one day. So replace the dashes with slashes before creating a new Date.
          return new Date(menu.date.replace('-', '/')).getTime() >= todayMs;
        })
        .map((menu) => {
          const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

          return {
            date: menu.date,
            day: days[new Date(menu.date).getDay()],
            menu_items: menu.menu_items
          };
        });

      // WEATHER
      const weatherData = await $axios.$get(secret.weather.darksky.url);
      const weather = {
        icon: weatherData.currently.icon,
        temp: Math.round(weatherData.currently.temperature),
        humidity: Math.round(weatherData.currently.humidity),
        feelslike: Math.round(weatherData.currently.apparentTemperature),
        summary: weatherData.currently.summary,
        forecast: {
          today: {
            summary: weatherData.hourly.summary,
            data: weatherData.daily.data[0]
          },
          tomorrow: {
            summary: weatherData.daily.data[1].summary,
            data: weatherData.daily.data[1]
          }
        }
      };

      // SEND TO TEMPLATE
      return {
        studentName: studentData.name,
        chartData,
        menus,
        weather
      };
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      // TODO: Add real error handling.
      throw new Error(err);
    }
  }
};
</script>

<style>
h3,
h4 {
  margin-bottom: 1em;
}

.base-font-size {
  font-size: 1rem;
}

.no-bullets {
  list-style: none;
  padding: 0;
}

.container {
  display: grid;
  grid-template-columns: 29% 40% 29%;
  grid-template-rows: auto;
  grid-gap: 1%;
}

.container > * {
  background: hsla(0, 0%, 0%, 0.25);
  border-radius: 2px;
  padding: 1em;
}

.weather-temp-group {
  color: #6786a5;
}
.weather-temp {
  font-size: 6em;
  letter-spacing: 1px;
  margin-left: -10px;
}
.weather-feel {
  margin-left: -2em;
}

.weather-forecast {
  font-weight: 300;
  font-size: 2em;
  color: #526488;
  word-spacing: 5px;
  padding: 1em 0;
}

.weather-forecast h4 {
  margin-bottom: 0;
}
.weather-summary {
  font-style: italic;
}
.weather-hilo {
  font-size: 1rem;
  margin-top: 1em;
}

.lunch-day {
  margin-bottom: 1em;
}

.lunch-item {
  color: #6786a5;
  margin-bottom: 0.5em;
}
</style>
