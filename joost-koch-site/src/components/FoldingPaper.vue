<template lang="pug">
div(
    :style="{'transform': 'rotate('+rotation+'deg)', 'min-width': '200px', 'position': 'relative'}"
)

    img(
        src='@/assets/thumbtack.png'
        style="position: absolute; top: 0; left: 0px; width: 40px; height: 40px; z-index: 3"
    )
    .paper(@mouseenter="isHovered = true", @mouseleave="isHovered = false")
        .color-overlay

            .crumpled-paper(:style="{ filter: `url(#crumpleFilter)` }")
                slot
    svg(style="position: absolute; width: 0; height: 0;")
        filter#crumpleFilter
            feTurbulence(type="fractalNoise", baseFrequency="0.05", numOctaves="3", result="noise")
            feDisplacementMap(in="SourceGraphic", in2="noise", :scale="displacementScale", xChannelSelector="R", yChannelSelector="G", result="displaced")
            //  <feDropShadow in="displaced" dx="3" dy="3" stdDeviation="2" flood-opacity="0.3" /> 
</template>

<script>
import { ref, watch, onMounted } from 'vue';



export default {
    name: 'FoldingPaper',
    props: {
        wrinkliness: {
            type: Number,
            default: 40,
            validator: (value) => value > 0,
        },
    },
    data() {
        return {
            rotation: Math.random() * 20 - 10
        }
    },
    setup(props) {
        const isHovered = ref(false);
        const displacementScale = ref(10);
        const gradient = ref('');

        const generateGradient = () => {
            let gradients = [];
            for (let i = 1; i <= 40; i++) {
                const degrees = Math.floor(Math.random() * (180 - 30 + 1) + 30);
                const start = Math.floor(Math.random() * 101);
                const end = Math.floor(Math.random() * (20) + start + 1);

                gradients.push(
                    `linear-gradient(${degrees}deg, #000 ${start}%, #fff ${end}%)`
                );
            }
            gradient.value = gradients.join(', ');
        };

        const animateValue = (reactiveProp, targetValue, duration) => {
            const startValue = reactiveProp.value;
            const startTime = performance.now();

            const tick = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                if (elapsedTime >= duration) {
                    reactiveProp.value = targetValue;
                } else {
                    const progress = elapsedTime / duration;
                    reactiveProp.value = startValue + (targetValue - startValue) * progress;
                    requestAnimationFrame(tick);
                }
            };

            requestAnimationFrame(tick);
        };

        watch(isHovered, (newValue) => {
            if (newValue) {
                animateValue(displacementScale, 0, 100);
            } else {
                animateValue(displacementScale, 10, 100);
            }
        });

        onMounted(() => {
            generateGradient();
        });

        return {
            isHovered,
            displacementScale,
            gradient,
        };
    },
};
</script>

<style scoped>
.paper {
    position: relative;
    line-height: 1.5;
    padding: 2rem;
    text-align: center;
    z-index: 2;
}

.paper::before,
.paper::after {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-blend-mode: difference;
    opacity: 1;
    transition: opacity 0.3s ease-in-out;
}

.paper::before {
    background: v-bind(gradient);
}

.paper::after {
    background: v-bind(gradient);
    filter: invert(1);
    opacity: 0.5;
    top: 1px;
}

.color-overlay {
    background: hsla(40, 90%, 70%, 0.5);
    mix-blend-mode: overlay;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1;
    transition: background-color 1s ease-in-out;
}

.crumpled-paper {
    padding: 1rem;
    transition: filter 0.3s ease-in-out;
    filter: url(#crumpleFilter);
}

/* Hover state */
.paper:hover::before,
.paper:hover::after {
    opacity: 0;
}

.paper:hover .color-overlay {
    background-color: #bca577;
}

.paper:hover .crumpled-paper {
    filter: none;
}
</style>