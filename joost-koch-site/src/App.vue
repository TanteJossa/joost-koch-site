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
    overflow: 'hidden'
}
h1, h2, h3, h4, p{
    white-space: pre-wrap;
    word-wrap: break-word;
    -webkit-hyphens: auto;
    -moz-hyphens: auto;
    -ms-hyphens: auto;
    hyphens: auto;
}

::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    border-radius: 6px;
    background: #5a5a5a47;

}
 
/* Track */
/* ::-webkit-scrollbar-track {
} */

/* Handle */
::-webkit-scrollbar-thumb {
    opacity: 0.6;
    /* border: solid 1px #13163b; */
    background: #646464;
    border-radius: 6px;
}





.hover-shadow, .shadow {
    -webkit-box-shadow: 2px 3px 3px 1px rgba(0,0,0,0.75);
    -moz-box-shadow: 2px 3px 3px 1px rgba(0,0,0,0.75);
    box-shadow: 2px 3px 3px 1px rgba(0,0,0,0.75);
    transition: all 0.2s;
}

.hover-shadow:hover {
    -webkit-box-shadow: 7px 8px 18px 4px rgba(0,0,0,0.48);
    -moz-box-shadow: 7px 8px 18px 4px rgba(0,0,0,0.48);
    box-shadow: 7px 8px 18px 4px rgba(0,0,0,0.48);
    transform: scale(1.1);
    z-index: 3;
}

</style>
