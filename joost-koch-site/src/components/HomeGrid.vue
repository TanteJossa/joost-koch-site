<template lang="pug">
.parent(:class="{'md-up': $vuetify.display.lgAndUp}")
    .div1
        slot(name="div1")
            p div1 
    .div2.mx-auto
        slot(name="name")
            p name   
    .div3
        slot(name="div2")
            p div2 
    .div4
        slot(name="div3")
            p div3
    .div5
        slot(name="div4")
            p div4
    //- .div6
        slot(name="div5")
            p div5
</template>

<script>
// Data

// Components

export default {
    name: 'HomeGrid',
    components: {

    },
    props: {

    },
    emits: [],
    setup() {

    },
    data(){
        return {

        }
    },
    computed: {

    },
    methods: {

    },
    watch: {

    },
    // created() {

    // },
    mounted() {

    },

}
</script>

<style scoped>
.parent {
  gap: 0; 
  max-height: 100vh; 
  max-width: 100vw;
  /* overflow: hidden; */
}

.md-up { 
  display: grid;
  grid-template-columns: 1fr min(700px, 100vw) 1fr;
  grid-template-rows: 1fr 0.5fr 1fr;
}

.md-up .div1 { grid-area: 1 / 1 / 1 / 3; }
.md-up .div2 { grid-area: 2 / 2 / 2 / 2; }
.md-up .div3 { grid-area: 3 / 1 / 3 / 3; }
.md-up .div4 { grid-area: 1 / 3 / 3 / 3; }
.md-up .div5 { grid-area: 3 / 3 / 3 / 3; }
/* .md-up .div6 { grid-area: 3 / 2 / 4 / 3; } */


</style>