<template lang="pug">
div
    div.mx-auto.my-auto
        canvas.w-100.h-100(
            ref='home-canvas'
            width="2000"
            height="2000"
        )
</template>

<script>
// Data 
import { getFontSizeToFit } from '@/helpers'

// Components


export default {
    name: 'HomeView',
    components: {
    
    },
    props: {
    
    },
    emits: [],
    setup() {
        
    },
    data(){
        return {
            cards: [
                {
                    title: 'hi',
                    emoji: ''
                }
            ],
            emojis: [
                '😂',
                '😎',
                '🎬🎬'
            ]
        }
    },
    computed: {
    
    },
    methods: {

        clock(index){
            index = index
            const now = new Date();

            const canvas  = this.$refs['home-canvas']
            const ctx = canvas.getContext('2d')

            ctx.save();
            ctx.clearRect(0, 0, 1000, 1000);
            ctx.translate(0, 500);
            // ctx.scale(0.4, 0.4);
            // ctx.strokeStyle = "white";
            // ctx.fillStyle = "white";
            // ctx.lineWidth = 8;
            // ctx.lineCap = "round";
            const fontface = 'serif'
            ctx.font = "400px "+fontface ;
            ctx.fillText("J     "+"st Koch", 50, 50)

            const emoji = this.emojis[index]
            const text = ctx.measureText(emoji); // TextMetrics object
            
            ctx.font = `1px ${fontface}`;
            const max_width  = ctx.measureText("     ").width 
            
            const width = max_width / ctx.measureText(text).width;
            console.log({
                max_width,
                width
            })
            ctx.font = ( width * 400)+"px "+fontface;

            ctx.fillText(emoji, 80, 75)

            ctx.restore();


            console.log(index, ctx)
            setTimeout(() => {
                this.clock((index % (this.emojis.length - 1)) + 1)
            }, 2000);
        }
    },
    watch: {
    
    },
    // created() {
    
    // },
    mounted() {
        this.clock(1)


    },
    
    
}
</script>
    
<style scoped>
    
</style>
