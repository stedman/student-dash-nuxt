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
            <h4>{{ menu.day }}, {{ menu.dateLabel }}</h4>
            <ul v-for="item in menu.menu_items" :key="item" class="meals-items no-bullets">
              <li class="meals-item">
                {{ item }}
              </li>
            </ul>
          </li>
        </ul>
        <p class="meals-digest-link">
          <span v-if="student.meals.menus.length">More: </span
          ><a :href="student.meals.url" target="_blank">{{ student.school }} weekly digest</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import HorizChart from '~/components/vue-chart-horiz';
import Weather from '~/components/weather';

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

// Get Dark Sky API key at https://darksky.net/dev and
// then add to `.env` file on project root directory, like so:
// DARKSKY_KEY=my_dark_sky_api_key
const darkskyKey = process.env.DARKSKY_KEY;

// Modifiy the following as `student-data` app hostname or port changes.
const studentApiUrl = 'http://localhost:3001/api/v1/students';

// Verify lower limit amount for student grade request query.
const alertQuery =
  option.gradeLowerLimit > 0 && option.gradeLowerLimit < 100
    ? `?alertsScore=${option.gradeLowerLimit}`
    : '';

// Build school slug for menu request.
const getSchoolSlug = (schoolName) => {
  // Use override if available.
  if (menuSlugMap[schoolName]) {
    return menuSlugMap[schoolName];
  }
  // Turn title-case school name into kebab slug.
  return schoolName
    .toLowerCase()
    .split(' ')
    .join('-');
};

// Menu date stuff.
const dateNow = new Date();
const dateNowMs = dateNow.getTime();
const dateNowString = `${dateNow.getFullYear()}-${dateNow.getMonth() + 1}-${dateNow.getDate()}`;
const changeDashToSlash = (str) => str.replace(/-/g, '/');

export default {
  components: {
    HorizChart,
    Weather
  },
  async asyncData({ $axios }) {
    try {
      // REQUEST ALL STUDENTS
      const students = await $axios.$get(studentApiUrl);

      for (let idx = 0; idx < students.length; idx += 1) {
        const student = students[idx];

        // REQUEST STUDENT GRADES
        try {
          const gradesData = await $axios.$get(
            `${studentApiUrl}/${student.id}/grades/average${alertQuery}`
          );

          student.course = {
            alerts: gradesData.alerts || []
          };
          student.course.classwork = {
            labels: gradesData.grades.map((course) => course.courseName),
            datasets: [
              {
                backgroundColor: option.chartBarColor,
                borderColor: option.chartBarBorderColor,
                borderWidth: option.chartBarBorderWidth,
                data: gradesData.grades.map((course) => course.average)
              }
            ]
          };
        } catch (courseErr) {
          // eslint-disable-next-line no-console
          console.error(`Unable to load grades for "${student.name}" (${student.id}).`, courseErr);
        }

        // REQUEST SCHOOL MENU
        if (option.menuDaysMax > 0) {
          const menuBaseUrl = 'https://roundrockisd.nutrislice.com/menu';
          const menuOption = {
            school: student.school,
            schoolSlug: getSchoolSlug(student.school),
            meal: option.menuMeal
          };
          const apiUrl =
            `${menuBaseUrl}/api/weeks/digest/` +
            `school/${menuOption.schoolSlug}/` +
            `menu-type/${menuOption.meal}/` +
            `date/${changeDashToSlash(dateNowString)}`;
          const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

          try {
            const menuData = await $axios.$get(apiUrl);

            student.meals = {
              url: `${menuBaseUrl}/${menuOption.schoolSlug}/${menuOption.meal}/${dateNowString}`,
              menus: menuData.reduce((accumulator, menu) => {
                // Replace menu date dashes with slashes to generate correct date.
                const menuDate = new Date(changeDashToSlash(menu.date));
                if (
                  // Show a max number of daily menus.
                  accumulator.length < option.menuDaysMax &&
                  // Show menus from today forward.
                  menuDate.getTime() >= dateNowMs
                ) {
                  accumulator.push({
                    date: menu.date,
                    dateLabel: menuDate
                      .toString()
                      .substring(4, 10)
                      .trim(),
                    day: days[menuDate.getDay() - 1],
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
      }

      // REQUEST WEATHER
      const weather = {};

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
