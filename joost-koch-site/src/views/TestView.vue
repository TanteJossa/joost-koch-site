<template lang="pug">
    div.h-100.w-100(style="position: relative")

        
        WoodTexture(style="pointer-events: all;" ref="woodTexture")
        div.fill-height.w-100(
            style="position: absolute; top: 0; left: 0; "
            @mousemove="woodMouseMove"
        )   
            HomeGrid
                template(#name)
                    div.glitch-text.h-100.d-flex.align-center.justify-center(style="text-align: center;")

                        h1(style="font-size: calc(min(100vw, 600px) / 5); display: inline-block;")
                            | J
                            Eyes
                            | st Koch
            //- v-row
                v-col
                    div(style="font-family: 'CreamyChalk'; font-size: calc(min(100vw, 600px) / 10)")
                        MulticoloredText(
                            text="Projecten"
                        )
                    div.d-flex.flex-wrap
                        PostIt()
                            i Hello how are you
                v-col
                    div



                //- paper-airplane(
                //-     v-for="(airplane, index) in airplanes"
                //-     :key="index"
                //-     :x="airplane.x"
                //-     :y="airplane.y"
                //-     :initialAngle="airplane.angle"
                //- )

</template>

<script>
import PaperAirplane from '@/components/PaperAirplane.vue';
import Eyes from '@/components/Eyes.vue';
import WoodTexture from '@/components/WoodTexture.vue';
import { PowerGlitch } from 'powerglitch'
import PostIt from '@/components/PostIt.vue'; // Adjust path as needed
import MulticoloredText from '@/components/MulticoloredText.vue';
import HomeGrid from '@/components/HomeGrid.vue';
export default {
    name: 'TestView',
    components: {
        PaperAirplane,
        Eyes,
        WoodTexture,
        PostIt,
        MulticoloredText,
        HomeGrid
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
        woodMouseMove(event){
            const component = this.$refs.woodTexture;
            if (!component) return;
            component.$el.dispatchEvent(new MouseEvent("mousemove" ,event))

        }
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