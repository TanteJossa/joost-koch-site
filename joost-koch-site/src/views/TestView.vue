<template lang="pug">
    v-container.fill-height.d-flex.align-center.justify-center
        div.glitch-text(style="text-align: center;")

            h1(style="font-size: calc(100vw / 9); display: inline-block;")
                | J
                Eyes
                | st Koch
            //- paper-airplane(
            //-     v-for="(airplane, index) in airplanes"
            //-     :key="index"
            //-     :x="airplane.x"
            //-     :y="airplane.y"
            //-     :initialAngle="airplane.angle"
            //- )
        Wood
</template>

<script>
import PaperAirplane from '@/components/PaperAirplane.vue';
import Eyes from '@/components/Eyes.vue';
import Wood from '@/components/Wood.vue';
import { PowerGlitch } from 'powerglitch'

export default {
    name: 'TestView',
    components: {
        PaperAirplane,
        Eyes,
        Wood
    },
    setup(){


        return {
            PowerGlitch
        }
    },
    data() {
        return {

             airplanes: [
                { x: 100, y: 50, angle: 0 },
                { x: 200, y: 150, angle: 0.5},
                { x: -50, y: 200, angle: 1.0 },
                { x: 250, y: 100, angle: 1.5},
                { x: -150, y: 0, angle: 2.0},
                { x: 250, y: -100, angle: 2.5 },
            ],

        };
    },
    mounted() {
        this.PowerGlitch.glitch('.glitch-text', {
            glitchTimeSpan: {
                "start": 0,
                "end": 1
            },
            "timing": {
                "duration": 550,
                "easing": "ease-in-out"
            },
            "shake": {
                "amplitudeX": 0.08,
                "amplitudeY": 0.08
            },
            
            playMode: 'hover',
            
        })
    },

    computed: {

    },
    methods: {

    }
};
</script>

<style scoped>
.glitch-text:hover{
    animation: glitch-color 0.4s ease-in-out;
}

@keyframes glitch-color {
    0% {
        background-image: unset;
        color: white;
        background-clip: unset;
    }
    20%{
        background-image: linear-gradient(rgb(13, 255, 0), blue);
        color: transparent;
        background-clip: text;
    }
    80%{
        background-image: linear-gradient(rgb(0, 47, 255), rgb(255, 0, 0));
        color: transparent;
        background-clip: text;
    }
    100%
     {background-image: unset;
        color: white;
        background-clip: unset;
    }
}

</style>