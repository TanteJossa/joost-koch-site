<template lang="pug">
span(style="display: inline-flex; align-items: center")
    div.eye-container
        div.eye-background
        div.eye-white(ref="eyeLeft")
            //- svg(width="35px" height="20%" fill="currentColor" viewBox="0 0 24 24")
            //- ellipse(fill="#E1E8ED" cx="8.828" cy="18" rx="7.953" ry="13.281" )
            //- path(d="M8.828 32.031C3.948 32.031.125 25.868.125 18S3.948 3.969 8.828 3.969 17.531 10.132 17.531 18s-3.823 14.031-8.703 14.031zm0-26.562C4.856 5.469 1.625 11.09 1.625 18s3.231 12.531 7.203 12.531S16.031 24.91 16.031 18 12.8 5.469 8.828 5.469z")
            div.pupil(:style="{ 'left': pupilLeftX + '%', 'top': pupilLeftY + '%' }")
                svg.pupil-svg
                    circle.pupil-iris(cx="50%" cy="50%" r="25%")
                    circle.pupil-center(cx="50%" cy="50%" r="20%")
                    circle.pupil-highlight(cx="70%" cy="40%" r="8%")

    div.eye-container.eye-right-offset
        div.eye-background
        div.eye-white(ref="eyeRight")
            //- svg(width="35px" height="20%" fill="currentColor" viewBox="0 0 24 24")
            //- ellipse(fill="#E1E8ED" cx="8.828" cy="18" rx="7.953" ry="13.281" )
            //- path(d="M8.828 32.031C3.948 32.031.125 25.868.125 18S3.948 3.969 8.828 3.969 17.531 10.132 17.531 18s-3.823 14.031-8.703 14.031zm0-26.562C4.856 5.469 1.625 11.09 1.625 18s3.231 12.531 7.203 12.531S16.031 24.91 16.031 18 12.8 5.469 8.828 5.469z")
            div.pupil(:style="{ 'left': pupilRightX + '%', 'top': pupilRightY + '%' }")
                svg.pupil-svg
                    circle.pupil-iris(cx="50%" cy="50%" r="25%")
                    circle.pupil-center(cx="50%" cy="50%" r="20%")
                    circle.pupil-highlight(cx="70%" cy="40%" r="8%")
</template>

<script>
export default {
    name: 'AnimatedEyes',
    components: {
    
    },
    props: {
    
    },
    emits: [],
    setup() {
        
    },
    data(){
        return {
            mouse: {
                x: 0,
                y: 0
            },
            pupilLeftX: 0,
            pupilLeftY: 0,
            pupilRightX: 0,
            pupilRightY: 0,
        }
    },
    computed: {
        eyesCenter(){
            const left = this.$refs.eyeLeft.getBoundingClientRect()
            const right = this.$refs.eyeRight.getBoundingClientRect()


            return {x:(left.left + right.right) / 2, y: (left.top + right.bottom) / 2}
        }
    },
    methods: {
        handleMouseMove(event) {
            this.mouse.x = event.clientX;
            this.mouse.y = event.clientY;
        },
        updatePupilPositions() {
            this.updatePupilPosition(this.$refs.eyeLeft, 'pupilLeftX', 'pupilLeftY');
            this.updatePupilPosition(this.$refs.eyeRight, 'pupilRightX', 'pupilRightY');
        },
        updatePupilPosition(eyeRef, xProp, yProp) {
            if(!eyeRef){
                return
            }
            const eyeRect = eyeRef.getBoundingClientRect();

            const eyeCenter = {
                x: eyeRect.width / 2,
                y: eyeRect.height / 2
            };



            const deltaX = this.mouse.x - (eyeRect.left + eyeCenter.x);
            const deltaY = this.mouse.y - (eyeRect.top + eyeCenter.y);
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const maxPupilDistance = 25;
            const normalizedX = (deltaX / distance) * Math.min(distance, maxPupilDistance);
            const normalizedY = (deltaY / distance) * Math.min(distance, maxPupilDistance);
            this[xProp] = normalizedX ;
            this[yProp] = normalizedY;

        },
    },
    watch: {
    
    },
    mounted() {
        window.addEventListener('mousemove', this.handleMouseMove);
        this.updatePupilPositions();
        this.updatePupilPositionsInterval = setInterval(this.updatePupilPositions, 100);
    },
    beforeUnmount() {
        window.removeEventListener('mousemove', this.handleMouseMove);
        clearInterval(this.updatePupilPositionsInterval);
    },
}
</script>

<style scoped>
.eye-container {
    position: relative;
    width: 0.3em;
    height: 0.6em;
}

.eye-right-offset {
    margin-left: 0.05em;
}

.eye-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: grey;
    clip-path: ellipse(50% 50%);
}

.eye-white {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: white;
    clip-path: ellipse(43% 45%);
}

.pupil {
    width: 100%;
    height: 100%;
    position: absolute;
    pointer-events: none;
    transition: all 0.1s ease-out; /* Added ease-out for smoother transition */
}

.pupil-svg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
}

.pupil-iris {
    fill: #8899A6;
}

.pupil-center {
    fill: #292F33;
}

.pupil-highlight {
    fill: #F5F8FA;
}
</style>