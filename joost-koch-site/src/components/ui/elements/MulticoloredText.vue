<template lang="pug">
span(:class="is_clickable ? 'text-hover' : ''" :style="{'cursor': is_clickable ? 'pointer' : 'default'}")
    span.prevent-select(v-for="(letter, index) in letters" :key="index" :style="{ color: colors[index] }") {{ letter }}
</template>

<script>
// Data

// Components

export default {
    name: 'MulticoloredText',
    components: {

    },
    props: {
        text: {
            type: String,
            required: true,
            default: ''
        },
        is_clickable: {
            type: Boolean,
            default: false
        }
    },
    emits: [],
    setup() {
        return {

        }
    },
    data(){
        return {
            letters: [],
            colors: []
        }
    },
    computed: {

    },
    methods: {
        generateRandomColor() {
            return '#ffffff';
            // const letters = '0123456789ABCDEF';
            // let color = '#';
            // for (let i = 0; i < 6; i++) {
            //     color += letters[Math.floor(Math.random() * 16)];
            // }
            // return color;
        }
    },
    watch: {
        text: {
            immediate: true,
            handler(newText) {
                this.letters = newText.split('');
                this.colors = this.letters.map(() => this.generateRandomColor());
            }
        }
    },
    // created() {

    // },
    mounted() {

    },

}
</script>

<style scoped>
.text-hover{
    transition: 0.2s all;
}
.text-hover:hover{
    text-shadow: 5px 6px 12px  ;
    transform: scale(1.1);
}

.prevent-select {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}
</style>
