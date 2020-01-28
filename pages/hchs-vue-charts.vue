<template>
  <no-ssr>
    <div>
      <h1>Chart Demo</h1>

      <div class="grid">
        <ChartBar />
      </div>
    </div>
  </no-ssr>
</template>

<script>
import ChartBar from '@/components/hchs-vue-charts-bar';

export default {
  components: {
    ChartBar
  }
};
</script>

<style scoped>
.grid {
  display: grid;
  row-gap: 2rem;
}
</style>
