<template lang="pug">
div.h-100.d-flex.align-center.justify-center(style="text-align: center;")

    h1(
        style="font-size: calc(min(100vw, 600px) / 5); display: inline-block;"
        @click="is_moving_wood = !is_moving_wood"
    )
        | J
        AnimatedEyes
        | st K{{is_moving_wood ? '●' : 'o' }}ch
</template>

<script>
import AnimatedEyes from './AnimatedEyes.vue';

export default {
  name: 'NameSection',
  components: {
    AnimatedEyes,
  },
  props:{
    modelValue:Boolean
  },
  data() {
    return {
    }
  },
  emit: ['update:modelValue'],
  computed: {
    is_moving_wood: {
        get(){return this.modelValue},
        set(val){
            this.$emit('update:modelValue', val)
        }
    }
  }
};
</script>

<style scoped>
/* Add any specific styles for this section if needed, or copy from HomeView if they were specific to this part */
</style>