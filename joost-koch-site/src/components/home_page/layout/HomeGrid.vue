<template lang="pug">
.parent-grid(:class="{'md-up': $vuetify.display.lgAndUp}")
    .grid-area-one
        slot(name="div1")
            p div1
    .name-area.mx-auto
        slot(name="name")
            p name
    .grid-area-two
        slot(name="div2")
            p div2
    .grid-area-three
        slot(name="div3")
            p div3
    .grid-area-four
        slot(name="div4")
            p div4
    //- .grid-area-five
        //- slot(name="div5")
            //- p div5
</template>

<script>
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
    mounted() {

    },

}
</script>

<style scoped>
.parent-grid {
  gap: 0;
}

.md-up {
  display: grid;
  grid-template-columns: 1fr min(700px, 100vw) 1fr;
  grid-template-rows: 1fr 160px 1fr;
}

.md-up .grid-area-one { grid-area: 1 / 1 / 1 / 3; }
.md-up .name-area { grid-area: 2 / 2 / 2 / 2; }
.md-up .grid-area-two { grid-area: 3 / 1 / 3 / 3; }
.md-up .grid-area-three { grid-area: 1 / 3 / 3 / 3; }
.md-up .grid-area-four { grid-area: 3 / 3 / 3 / 3; }
/* .md-up .grid-area-five { grid-area: 3 / 2 / 4 / 3; } */

</style>