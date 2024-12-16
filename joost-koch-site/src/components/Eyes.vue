<template lang="pug">
span(style="display: inline-flex; align-items: center")
    div(style="position: relative; width:0.3em; height:0.6em")
        div.w-100.h-100(style="position: absolute; top: 0; left: 0; background-color: grey; clip-path: ellipse(50% 50%)")
        div.w-100.h-100(style="position: absolute; top: 0; left: 0; background-color: white; clip-path: ellipse(43% 45%)" ref="eyeLeft")
            //- svg(width="35px" height="20%" fill="currentColor" viewBox="0 0 24 24")
            //-     ellipse(fill="#E1E8ED" cx="8.828" cy="18" rx="7.953" ry="13.281" )
            //-     path(d="M8.828 32.031C3.948 32.031.125 25.868.125 18S3.948 3.969 8.828 3.969 17.531 10.132 17.531 18s-3.823 14.031-8.703 14.031zm0-26.562C4.856 5.469 1.625 11.09 1.625 18s3.231 12.531 7.203 12.531S16.031 24.91 16.031 18 12.8 5.469 8.828 5.469z")


            div.pupil.w-100.h-100(:style="{ 'left': pupilLeftX + '%', 'top': pupilLeftY + '%' }")
                svg(width="100%" height="100%" style="position: absolute; top: 0; left: 0;")
                    circle(xmlns="http://www.w3.org/2000/svg" fill="#8899A6" cx="50%" cy="50%" r="25%")
                    circle(xmlns="http://www.w3.org/2000/svg" fill="#292F33" cx="50%" cy="50%" r="20%")
                    circle(xmlns="http://www.w3.org/2000/svg" fill="#F5F8FA" cx="70%" cy="40%" r="8%")

    div(style="position: relative; width:0.3em; height:0.6em; margin-left: 0.05em")
        div.w-100.h-100(style="position: absolute; top: 0; left: 0; background-color: grey; clip-path: ellipse(50% 50%)")

        div.w-100.h-100(style="position: absolute; top: 0; left: 0; background-color: white; clip-path: ellipse(43% 45%)" ref="eyeRight")
            //- svg(width="35px" height="20%" fill="currentColor" viewBox="0 0 24 24")
            //-     ellipse(fill="#E1E8ED" cx="8.828" cy="18" rx="7.953" ry="13.281" )
            //-     path(d="M8.828 32.031C3.948 32.031.125 25.868.125 18S3.948 3.969 8.828 3.969 17.531 10.132 17.531 18s-3.823 14.031-8.703 14.031zm0-26.562C4.856 5.469 1.625 11.09 1.625 18s3.231 12.531 7.203 12.531S16.031 24.91 16.031 18 12.8 5.469 8.828 5.469z")


            div.pupil.w-100.h-100(:style="{ 'left': pupilRightX + '%', 'top': pupilRightY + '%' }")
                svg(width="100%" height="100%" style="position: absolute; top: 0; left: 0;")
                    circle(xmlns="http://www.w3.org/2000/svg" fill="#8899A6" cx="50%" cy="50%" r="25%")
                    circle(xmlns="http://www.w3.org/2000/svg" fill="#292F33" cx="50%" cy="50%" r="20%")
                    circle(xmlns="http://www.w3.org/2000/svg" fill="#F5F8FA" cx="70%" cy="40%" r="8%")
</template>

<script>
// Data 


// Components


export default {
    name: 'Eyes',
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
    // created() {
    
    // },
    mounted() {
        window.addEventListener('mousemove', this.handleMouseMove);
        this.updatePupilPositions()
        this.updatePupilPositionsInterval = setInterval(this.updatePupilPositions, 100);
    },
    beforeUnmount(){
        window.removeEventListener('mousemove', this.handleMouseMove);
        clearInterval(this.updatePupilPositionsInterval);
    },
    
}
</script>
    
<style scoped>
.pupil {
    pointer-events: none;
    transition: all 0.1s;
    position: absolute;
}
</style>
