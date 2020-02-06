<template>
  <div class="weather">
    <h3>Current Weather</h3>
    <div class="weather-temp-group">
      <span class="weather-icon"><skycon :condition="weather.icon" width="90" height="90"/></span>
      <span class="weather-temp">{{ Math.floor(weather.currently.temperature) }}&deg;</span>
      <span class="weather-feel"
        >feels like
        <span class="weather-feel-temp weather-value"
          >{{ Math.floor(weather.currently.apparentTemperature) }}&deg;</span
        ></span
      >
    </div>
    <div class="weather-current">
      <span title="humidity" class="weather-humidity"
        >humidity:
        <span class="weather-value">{{ Math.floor(weather.currently.humidity * 100) }}%</span></span
      >
      <span title="wind speed (mph)" class="weather-wind"
        >wind:
        <span
          :style="weather.currently.windBearingStyle"
          title="wind direction"
          class="weather-wind-dir"
        ></span>
        <span class="weather-value">{{ Math.floor(weather.currently.windSpeed) }}mph</span></span
      >
    </div>

    <div class="weather-forecast">
      <h4>
        Forecast
        <div class="weather-hilo">
          <span title="forecast high"
            >&uarr;{{ Math.floor(weather.forecast.today.data.temperatureHigh) }}&deg;</span
          >
          <span title="forecast low"
            >&darr;{{ Math.floor(weather.forecast.today.data.temperatureLow) }}&deg;</span
          >
        </div>
      </h4>
      <p class="weather-summary">
        {{ weather.forecast.today.summary }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    weather: {
      type: Object,
      default: null
    }
  }
};
</script>

<style scoped>
.weather-temp-group,
.weather-current,
.weather-forecast {
  color: hsl(220, 30%, 60%);
}

.weather-icon {
  display: inline-block;
  height: 90px;
  width: 90px;
}
.weather-temp {
  font-size: 6em;
  display: inline-block;
  letter-spacing: 1px;
  margin-left: -7px;
}
.weather-feel {
  display: inline-block;
  font-size: 0.875em;
  font-style: italic;
  margin-left: -2.4rem;
}
.weather-feel-temp {
  display: block;
}

.weather-value {
  color: hsl(220, 25%, 75%);
  font-size: 1rem;
}

.weather-wind {
  margin-left: 2em;
}
.weather-wind-dir {
  border: 1px solid hsl(220, 25%, 30%);
  border-radius: 1em;
  display: inline-block;
  height: 1em;
  line-height: 0.9;
  margin-right: -0.2em;
  width: 1em;
}
.weather-wind-dir:before {
  color: hsl(220, 25%, 75%);
  content: '\2193';
}

.weather-forecast {
  border-top: 1px solid hsl(220, 40%, 20%);
  font-weight: 300;
  font-size: 1.5em;
  margin-top: 1em;
  padding: 0.5em 0;
  word-spacing: 5px;
}

.weather-forecast h4 {
  margin-bottom: 0;
}
.weather-hilo {
  font-size: 0.875em;
  font-weight: 300;
  display: inline;
}
.weather-summary {
  color: hsl(220, 25%, 75%);
  font-style: italic;
}
</style>
