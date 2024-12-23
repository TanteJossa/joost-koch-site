<template lang="pug">
v-app
    v-main
        router-view
</template>

<script>
// Data 


// Components


export default {
    name: 'App',
    components: {
    
    },
    props: {
    
    },
    emits: [],
    setup() {
        
    },
    data(){
        return {
             
        }
    },
    computed: {
    
    },
    methods: {
    
    },
    watch: {
    
    },
    // created() {
    
    // },
    mounted() {
    
    },
    
    
}
</script>
    
<style>
@font-face {
  font-family: 'DankMono'; /* Choose a name for your font */
  src: url('@/assets/fonts/DankMono-Regular.otf') format('opentype'); /* Path to your font file */
  font-weight: normal; /* Optional: Define font weight (e.g., bold, normal, 400, 700) */
  font-style: normal; /* Optional: Define font style (e.g., italic, normal) */
  font-display: swap; /* Optional: Control font loading behavior */
}
/* @font-face {
  font-family: 'DankMono';
  src: url('@/assets/fonts/DankMono-Italic.otf') format('opentype');
  font-weight: normal;
  font-style: italic;
  font-display: swap;
} */
@font-face {
  font-family: 'DankMono';
  src: url('@/assets/fonts/AmazoneBt-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: italic;
  font-display: swap;
}
@font-face {
  font-family: 'CreamyChalk';
  src: url('@/assets/fonts/CreamyChalk-regular.otf') format('opentype');
  font-weight: normal;
  font-style: italic;
  font-display: swap;
}

body {
    margin: 0;
    font-family: 'DankMono';
}

</style>
