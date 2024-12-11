<template lang="pug">
    v-container.fill-height.d-flex.align-center.justify-center
        div(style="text-align: center;")
            p x: {{ pupilLeftX}}, y: {{ pupilLeftY }}

            h1(style="font-size: 3em; display: inline-block;")
                | J
                span(style="display: inline-flex; align-items: center; ")
                    div(style="position: relative; background-color: white; width:14px; height:30px; clip-path: ellipse(50% 50%); border:3px solid #E1E8ED" ref="eyeLeft")
                        //- svg(width="35px" height="20%" fill="currentColor" viewBox="0 0 24 24")
                        //-     ellipse(fill="#E1E8ED" cx="8.828" cy="18" rx="7.953" ry="13.281" )
                        //-     path(d="M8.828 32.031C3.948 32.031.125 25.868.125 18S3.948 3.969 8.828 3.969 17.531 10.132 17.531 18s-3.823 14.031-8.703 14.031zm0-26.562C4.856 5.469 1.625 11.09 1.625 18s3.231 12.531 7.203 12.531S16.031 24.91 16.031 18 12.8 5.469 8.828 5.469z")


                        div.pupil(:style="{ 'left': pupilLeftX + 'px', 'top': pupilLeftY + 'px' }")
                            svg(width="25" height="25")
                                circle(xmlns="http://www.w3.org/2000/svg" fill="#8899A6" cx="6.594" cy="18" r="4.96")
                                circle(xmlns="http://www.w3.org/2000/svg" fill="#292F33" cx="6.594" cy="18" r="3.565")
                                circle(xmlns="http://www.w3.org/2000/svg" fill="#F5F8FA" cx="7.911" cy="15.443" r="1.426")

                    div.ml-1(style="position: relative; background-color: white; width:14px; height:30px; clip-path: ellipse(50% 50%); border:3px solid #E1E8ED"  ref="eyeRight")
                        svg(width="17" height="38" viewBox="0 0 24 24" fill="currentColor")
                            ellipse(fill="#E1E8ED" cx="8.828" cy="18" rx="7.953" ry="13.281")
                            path(d="M8.828 32.031C3.948 32.031.125 25.868.125 18S3.948 3.969 8.828 3.969 17.531 10.132 17.531 18s-3.823 14.031-8.703 14.031zm0-26.562C4.856 5.469 1.625 11.09 1.625 18s3.231 12.531 7.203 12.531S16.031 24.91 16.031 18 12.8 5.469 8.828 5.469z")


                        div.pupil(:style="{ 'left': pupilRightX + 'px', 'top': pupilRightY + 'px' }")
                            svg(width="25" height="25" viewBox="0 0 24 24")
                                circle(xmlns="http://www.w3.org/2000/svg" fill="#8899A6" cx="6.594" cy="18" r="4.96")
                                circle(xmlns="http://www.w3.org/2000/svg" fill="#292F33" cx="6.594" cy="18" r="3.565")
                                circle(xmlns="http://www.w3.org/2000/svg" fill="#F5F8FA" cx="7.911" cy="15.443" r="1.426")
                                
                    
                | st Koch
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
export default {
    name: 'TestView',
    components: {
        PaperAirplane,
    },
    data() {
        return {
            mouse: {
                x: 0,
                y: 0
            },
             airplanes: [
                { x: 100, y: 50, angle: 0 },
                { x: 200, y: 150, angle: 0.5},
                { x: -50, y: 200, angle: 1.0 },
                { x: 250, y: 100, angle: 1.5},
                { x: -150, y: 0, angle: 2.0},
                { x: 250, y: -100, angle: 2.5 },
            ],
            pupilLeftX: 0,
            pupilLeftY: 0,
            pupilRightX: 0,
            pupilRightY: 0,
        };
    },
    mounted() {
        window.addEventListener('mousemove', this.handleMouseMove);
        this.updatePupilPositions()
        this.updatePupilPositionsInterval = setInterval(this.updatePupilPositions, 100);
    },
    beforeUnmount(){
        window.removeEventListener('mousemove', this.handleMouseMove);
        clearInterval(this.updatePupilPositionsInterval);
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
            const maxPupilDistance = 5;
            const normalizedX = (deltaX / distance) * Math.min(distance, maxPupilDistance);
            const normalizedY = (deltaY / distance) * Math.min(distance, maxPupilDistance);
            this[xProp] = normalizedX + eyeCenter.x - 10;
            this[yProp] = normalizedY - eyeCenter.y - 18;

        },
    }
};
</script>

<style scoped>
.pupil {
    pointer-events: none;
    transition: all 0.1s;
    position: absolute;
}
</style>