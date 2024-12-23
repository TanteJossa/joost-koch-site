<template lang="pug">
span
  span(v-for="(letter, index) in letters" :key="index" :style="{ color: colors[index] }") {{ letter }}
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
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
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

</style>