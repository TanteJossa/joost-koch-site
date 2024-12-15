<template lang="pug">
.v-container
  canvas#woodCanvas(ref="woodCanvas")
</template>

<script>
// Data
export default {
    name: 'Wood',
    components: {},
    props: {},
    emits: [],
    setup() { },
    data() {
        return {
            animationFrame: null,
            woodConfig: {
                width: 600,
                height: 400,
                dowelCount: 3,
                grainThickness: 10,
                yearLineVariation: 5,
                animationSpeed: 0.5,
            },
            timeOffset: 0,
            dowels: [],
        };
    },
    computed: {},
    methods: {
        initializeDowels() {
            const { dowelCount, width, height } = this.woodConfig;
            this.dowels = Array.from({ length: dowelCount }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
            }));
        },
        drawWoodTexture(ctx) {
            const { width, height, grainThickness, yearLineVariation } = this.woodConfig;
            ctx.clearRect(0, 0, width, height);

            // Draw background
            ctx.fillStyle = '#D2B48C'; // Light brown
            ctx.fillRect(0, 0, width, height);

            // Draw dowels
            ctx.strokeStyle = '#A0522D'; // Dark brown
            ctx.lineWidth = 2;
            this.dowels.forEach(({ x, y }) => {
                ctx.fillRect(x,y,10,10)
            });

            // Draw grain lines
            ctx.strokeStyle = '#8B4513'; // Medium brown
            ctx.lineWidth = 1;
            for (let y = 0; y < height; y += grainThickness) {
                ctx.beginPath();

                // Create lines that curve around dowels
                this.dowels.forEach(({ x, y: dy, radius }) => {
                    const controlX = x;
                    const controlY = dy + radius * Math.sin((y - dy) / radius);
                    ctx.quadraticCurveTo(controlX, controlY, x, y );
                });

                ctx.lineTo(width, y );
                ctx.stroke();
            }

        },
        animate() {
            const canvas = this.$refs.woodCanvas;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            canvas.width = this.woodConfig.width;
            canvas.height = this.woodConfig.height;

            this.timeOffset += this.woodConfig.animationSpeed;
            this.drawWoodTexture(ctx);
            this.animationFrame = requestAnimationFrame(() => this.animate());
        },
    },
    mounted() {
        const canvas = this.$refs.woodCanvas;
        if (canvas) {
            this.initializeDowels();
            console.log('Canvas element is ready:', canvas);
            this.animate();
        } else {
            console.error('Canvas element not found.');
        }
    },
    beforeUnmount() {
        cancelAnimationFrame(this.animationFrame);
    },
};
</script>

<style scoped>
canvas {
    display: block;
    margin: 0 auto;
    border: 1px solid #ccc;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
}
</style>
