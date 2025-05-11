<template>
  <!-- Content from HomeView.vue's #name slot -->
  <div class="h-100 d-flex align-center justify-center" style="text-align: center;">
    <h1
      style="font-size: calc(min(100vw, 600px) / 5); display: inline-block;"
      @click="is_moving_wood = !is_moving_wood"
    >
      J
      <AnimatedEyes />
      st K{{ is_moving_wood ? '●' : 'o' }}ch
    </h1>
  </div>
</template>

<script>
import AnimatedEyes from './AnimatedEyes.vue';

export default {
  name: 'NameSection',
  components: {
    AnimatedEyes,
  },
  data() {
    return {
      is_moving_wood: false,
    };
  },
};
</script>

<style scoped>
/* Add any specific styles for this section if needed, or copy from HomeView if they were specific to this part */
</style>