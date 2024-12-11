<template lang="pug">
    div.paper-airplane(
        ref="airplane",
        :style="{ left: x + 'px', top: y + 'px' }"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
    )
        div.paper-airplane-container(:class="{ 'paused': isPaused }")
            //- Front Face
            svg.paper-face.front(
                width="24"
                height="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            )
                path(
                   d="M2 12L12 2L22 12L17 14L12 10L7 14L2 12ZM17 15L22 17L17 19V15ZM7 19L2 17L7 15V19Z"
                  fill="gray"
                )

            //- Right Face (visible when rotated)
            svg.paper-face.right(
                width="24"
                height="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            )
                path(
                  d="M2 12L12 2L22 12L17 14L12 10L7 14L2 12ZM17 15L22 17L17 19V15ZM7 19L2 17L7 15V19Z"
                  fill="#ddd"
                )

            //- Left Face
            svg.paper-face.left(
                width="24"
                height="24"
                viewBox="0 0 24 24"
                 xmlns="http://www.w3.org/2000/svg"
            )
                path(
                 d="M2 12L12 2L22 12L17 14L12 10L7 14L2 12ZM17 15L22 17L17 19V15ZM7 19L2 17L7 15V19Z"
                  fill="#eee"
                )
        transition(name="fade")
            card.card-overlay(v-if="showCard")
</template>

<script>
import Card from './AirplaneCard.vue';

export default {
    name: 'PaperAirplane',
    components: {
        Card,
    },
    props: {
        x: {
            type: Number,
            required: true,
        },
        y: {
            type: Number,
            required: true,
        },
        initialAngle: {
            type: Number,
            default: 0
        },
    },
    data() {
        return {
            showCard: false,
            isPaused: false,
            angle: 0,
        };
    },
    mounted() {
        this.angle = this.initialAngle;
        this.animate();
    },
    methods: {
        handleMouseEnter() {
            this.isPaused = true;
            this.showCard = true;
        },
        handleMouseLeave() {
            this.isPaused = false;
            this.showCard = false;
            this.animate();
        },
        animate() {
            if (!this.isPaused) {
                this.angle += 0.01
                this.moveAirplane()
                requestAnimationFrame(this.animate)
            }
        },
        moveAirplane() {
            let amplitude = 10
            let speed = 0.05
            const offsetX = Math.sin(this.angle * speed) * amplitude
            const offsetY = Math.cos(this.angle * speed * 2) * amplitude
            this.$refs.airplane.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${this.angle * 10}deg)`;
        }
    }
}
</script>

<style scoped>
.paper-airplane {
    position: absolute;
    transform-origin: center;
    z-index: 1;
}

.paper-airplane-container {
    width: 40px;
    height: 40px;
    transform: rotate(-45deg);
    transition: transform 0.1s ease-in-out;
    perspective: 500px; /* needed for 3d */
}

.paused {
    transform: rotate(0deg) !important;
}


.paper-face {
    position: absolute;
    width: 40px;
    height: 40px;
    transition: all 0.2s;
}


.paper-face.front {
    transform:  translateZ(2px);
}

.paper-face.right {
    transform: translateX(-5px) rotateY(70deg) translateY(5px)  translateZ(-1px) skewY(5deg);
    opacity: 0.8
}

.paper-face.left {
    transform: translateX(5px) rotateY(-70deg) translateY(5px)  translateZ(-1px) skewY(-5deg);
    opacity: 0.8
}


.card-overlay {
    position: absolute;
    top: -50px;
    left: -50px;
    width: 100px;
    height: 100px;
    z-index: 10;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>