<template>
  <div class="container">
    <Weather :weather="weather" />

    <div v-for="student in students" :key="student.id" class="students">
      <div class="classwork">
        <div>
          <h3>{{ student.name.split(' ')[0] }}</h3>
          <p>Current grading period</p>
          <horiz-chart :data="student.course.classwork" />
        </div>

        <div v-if="student.course.alerts[0]" class="alerts">
          <h4>Alerts</h4>
          <ul class="no-bullets">
            <li v-for="comm in student.course.alerts" :key="comm" class="comment-item">
              <p>
                <strong>{{ comm.date }}</strong> &rarr;
                <strong>{{ comm.course }}</strong>
              </p>
              <p class="comment-comment">{{ comm.comment }}</p>
              <p><strong>assignment:</strong> {{ comm.assignment }}</p>
              <p><strong>score:</strong> {{ comm.score }}</p>
            </li>
          </ul>
        </div>
      </div>

      <div v-if="student.meals" class="meals">
        <h3>Lunch menu</h3>
        <ul class="meals-days no-bullets">
          <li v-for="menu in student.meals.menus" :key="menu.date" class="meals-day">
            <h4>{{ menu.day }}</h4>
            <ul v-for="item in menu.menu_items" :key="item" class="meals-items no-bullets">
              <li class="meals-item">
                {{ item }}
              </li>
            </ul>
          </li>
        </ul>
        <p class="meals-digest-link">
          More: <a :href="student.meals.url">{{ student.school }} weekly digest</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import HorizChart from '~/components/vue-chart-horiz';
import Weather from '~/components/weather';

const option = {
  gradeLowerLimit: 70, // activates alerts on dashboard for grades that drop below
  menuMeal: 'lunch' // choose 'lunch' or 'breakfast'
};

// Verify lower limit amount.
const alertQuery =
  option.gradeLowerLimit > 0 && option.gradeLowerLimit < 100
    ? `?alertsScore=${option.gradeLowerLimit}`
    : '';

// If your school menu doesn't show up on the dashboard, check if school name at nutrislice
// (https://roundrockisd.nutrislice.com/menu/) matches the one on Home Access.
// If it doesn't, you can manually map the RRISD school name to the nutrislice slug in `slugMap`.
const slugMap = {
  'Patsy Sommer Elementary School': 'sommer-elementary-school'
};

const makeSchoolSlug = (schoolName) => {
  if (slugMap[schoolName]) {
    return slugMap[schoolName];
  }
  return schoolName
    .toLowerCase()
    .split(' ')
    .join('-');
};

export default {
  components: {
    HorizChart,
    Weather
  },
  async asyncData({ $axios }) {
    try {
      // STUDENTS
      const students = await $axios.$get('http://localhost:3001/api/v1/students');

      for (let idx = 0; idx < students.length; idx += 1) {
        const student = students[idx];

        // STUDENT GRADES
        try {
          const courseData = await $axios.$get(
            `http://localhost:3001/api/v1/students/${student.id}/grades/average${alertQuery}`
          );

          student.course = {};
          student.course.alerts = courseData.alerts || [];
          student.course.classwork = {
            labels: courseData.grades.map((course) => course.courseName),
            datasets: [
              {
                backgroundColor: 'hsla(200,10%,60%,0.6)',
                borderColor: 'hsla(0,100%,100%,0.9)',
                borderWidth: 1,
                data: courseData.grades.map((course) => course.average)
              }
            ]
          };
        } catch (courseErr) {
          // eslint-disable-next-line no-console
          console.error(`Unable to load grades for "${student.name}" (${student.id}).`, courseErr);
        }

        // SCHOOL MENU
        const baseUrl = 'https://roundrockisd.nutrislice.com/menu';
        const menuOption = {
          school: student.school,
          schoolSlug: makeSchoolSlug(student.school),
          meal: option.menuMeal
        };
        const getCurrentDateString = () => {
          const now = new Date();

          return `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;
        };
        const today = getCurrentDateString();
        const todayMs = new Date(today).getTime();
        const apiUrl =
          `${baseUrl}/api/weeks/digest/` +
          `school/${menuOption.schoolSlug}/` +
          `menu-type/${menuOption.meal}/` +
          `date/${today}`;

        try {
          const menuData = await $axios.$get(apiUrl);

          student.meals = {
            url: `${baseUrl}/${menuOption.schoolSlug}/${menuOption.meal}/${today}`,
            menus: menuData.reduce((accumulator, menu) => {
              if (
                // Show 2 menus max
                accumulator.length < 2 &&
                // Show menus from today forward
                new Date(menu.date.replace('-', '/')).getTime() >= todayMs
              ) {
                const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

                accumulator.push({
                  date: menu.date,
                  day: days[new Date(menu.date).getDay()],
                  menu_items: menu.menu_items
                });
              }

              return accumulator;
            }, [])
          };
        } catch (menuErr) {
          // eslint-disable-next-line no-console
          console.error(`Unable to load menu for "${student.school}".`, menuErr);
        }
      }

      // WEATHER
      const weather = {};

      // Get Dark Sky API key at https://darksky.net/dev and
      // then add to `.env` file on project root directory like so:
      // DARKSKY_KEY=my_dark_sky_api_key
      const darkskyKey = process.env.DARKSKY_KEY;

      if (darkskyKey) {
        try {
          const weatherUrl = `https://api.darksky.net/forecast/${darkskyKey}/30.5047,-97.7521?exclude=minutely,flags`;
          const weatherData = await $axios.$get(weatherUrl);

          weather.currently = weatherData.currently;
          weather.currently.windBearingStyle = `transform:rotate(${weatherData.currently.windBearing}deg)`;
          weather.forecast = {
            today: {
              summary: weatherData.hourly.summary,
              data: weatherData.daily.data[0]
            },
            tomorrow: {
              summary: weatherData.daily.data[1].summary,
              data: weatherData.daily.data[1]
            }
          };
        } catch (weatherErr) {
          // eslint-disable-next-line no-console
          console.error('Unable to load weather.', weatherErr);
        }
      }

      // SEND TO TEMPLATE
      return {
        students,
        weather
      };
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
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
  /* Tried to use 'fr' units (20rem 1fr 1fr), but they acted sticky.
  Switched to calc:
  (screen - (weather col + (gap * no. of gaps)) / no. or student cols */
  grid-template-columns: 20rem repeat(2, calc((100% - (20rem + 2%)) / 2));
  grid-template-rows: auto;
  grid-gap: 1%;
}

.container > * {
  background: hsla(0, 0%, 0%, 0.25);
  border-radius: 2px;
  padding: 1em;
}

.comment-item {
  color: #c0bb78;
  font-size: 0.875rem;
  margin-bottom: 1em;
}
.comment-item > p:not(:first-child) {
  margin-left: 1em;
  margin-top: 0.5em;
}
.comment-comment {
  font-style: italic;
}

.alerts,
.meals {
  margin-top: 2em;
}

.meals-digest-link,
.meals-day {
  margin-bottom: 1em;
}

.meals-item {
  color: #6786a5;
  margin-bottom: 0.5em;
}
</style>
