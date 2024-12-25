<template lang="pug">
.paper.pa-2.pt-6(:style="{'transform': 'rotate('+deg+'deg)','z-index': 3}" :class="shadow")
    img(
        src='@/assets/thumbtack.png'
        style="position: absolute; top: 0; left: 0px; width: 40px; height: 40px; z-index: 3"
    )
    div(style="position: absolute; top: 0: left: 0; z-index: 3")
        slot
    slot
    .color-overlay
</template>

<script>
// Data

// Components

export default {
    name: 'PostIt',
    components: {

    },
    props: {
        is_clickable: {
            type: Boolean,
            default: false
        },
    },
    emits: [],
    setup() {

        return {

        }
    },
    data(){
        return {
            gradient: '',
            deg: Math.random() * 20 - 10
        }
    },
    computed: {
        shadow(){
            if (this.is_clickable){
                return 'hover-shadow'
            } else {
                return 'shadow'
            }
        }
    },
    methods: {

    },
    watch: {

    },
    // created() {

    // },
    mounted() {
        let gradientString = '';
        for (let i = 1; i <= 40; i++) {
            const degrees = Math.floor(Math.random() * (180 - 30 + 1)) + 30;
            const start = Math.floor(Math.random() * 100);
            const end = Math.floor(Math.random() * (20 - 1 + 1)) + start + 1;

            gradientString += `linear-gradient(${degrees}deg, #000 ${start}%, #fff ${end}%), `;
        }
        this.gradient = gradientString.slice(0, -2); // Remove the trailing comma and space
    },

}
</script>

<style scoped>
.paper {
  position: relative;
  display: inline-block; /* Make the component size to fit content */
}

.paper::before,
.paper::after {
  /* Apply gradients with a blend mode */
  content: '';
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-blend-mode: difference;
  background-image: v-bind(gradient);
}

.paper::after {
  /* Invert the second layer and offset */
  filter: invert(1);
  opacity: 0.5;
  top: 1px;
}

/* Add a subtle color overlay. This can be any color */
.color-overlay {
  background: hsla(40, 69%, 42%, 0.608);
  mix-blend-mode: overlay;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1;
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
}
</style>