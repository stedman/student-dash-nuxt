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
import ChartBar from '@/components/chart-bar';

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
