<template lang="pug">
div.pl-6.w-100(
    :style="{'transform': 'rotate('+(media_text_rotation)+'deg)', 'display': 'inline-block'}"
)
    div(style="font-family: 'CreamyChalk'; font-size: calc(min(100vw, 600px) / 10)")
        MulticoloredText(
            text="Media"
            is_clickable
            @click="loadMedia"
        )
    v-radio-group(
        v-model="media_type"
        inline
    )
        v-radio(
            value="movies"
            label="Films"
        )
        v-radio(
            value="series"
            label="Series"
        )
    v-checkbox(
        v-model="media_is_sorted"
        label="Sorteer"
        @update:modelValue="loadMedia"
        :disabled="loading_media"
    )
    div.w-100(style="overflow-y: scroll; color: white; font-family: 'CreamyChalk'")
        table.w-100(v-if="media_type == 'movies' && movies.length > 0")
            thead
                tr
                    th Naam
                    th.text-right Score
            tbody
                tr(v-for="movie in movies")
                    td {{ movie.B }}
                    td.text-right {{ movie.C }}
        table.w-100(v-if="media_type == 'series' && series.length > 0")
            thead
                tr
                    th Naam
                    th Seizoen
                    th.text-right Score
            tbody
                tr(v-for="serie in series")
                    td {{ serie.B }}
                    td.text-center {{ serie.C }}
                    td.text-right {{ serie.D }}
        v-btn.mt-2(
            text="Meer"
            color="secondary"  
            @click="loadExtraMedia"
            :loading="loading_media"
            variant="outlined"
        )
</template>

<script>
import MulticoloredText from '@/components/ui/elements/MulticoloredText.vue';

export default {
    name: 'MediaSection',
    components: {
        MulticoloredText
    },
    data() {
        return {
            media_text_rotation: (Math.random() * 10 - 5) * 0,
            media_type: Math.random() > 0.5 ? 'series' : 'movies',
            media_is_sorted: false,
            series: [],
            movies: [],
            loading_media: false,
        }
    },
    methods: {
        async getSheetData(n, sheet='Series', start_index=0, is_sorted=false) {
            // n: number of rows
            // sheet: name of sheet
            // start_index: index of first row to load
            // is_sorted: boolean, if true, sort by score
            this.loading_media = true;
            const response = await fetch(`https://script.google.com/macros/s/AKfycbxP5ds0tN2h3H43nL7Nl_wzY7Y_4Y2Qy2g2g2tY5F6H4Q0K7s8c9j8L/exec?sheet=${sheet}&n=${n}&start_index=${start_index}&is_sorted=${is_sorted}`);
            const data = await response.json();
            this.loading_media = false;
            return data;
        },
        async loadMedia() {
            this.loading_media = true;
            if (this.media_type === 'series') {
                this.series = []; // Clear existing series
                const data = await this.getSheetData(10, 'Series', 0, this.media_is_sorted);
                this.series = data;
            } else {
                this.movies = []; // Clear existing movies
                const data = await this.getSheetData(10, 'Movies', 0, this.media_is_sorted);
                this.movies = data;
            }
            this.loading_media = false;
        },
        async loadExtraMedia() {
            this.loading_media = true;
            if (this.media_type === 'series') {
                const data = await this.getSheetData(10, 'Series', this.series.length, this.media_is_sorted);
                this.series = this.series.concat(data);
            } else {
                const data = await this.getSheetData(10, 'Movies', this.movies.length, this.media_is_sorted);
                this.movies = this.movies.concat(data);
            }
            this.loading_media = false;
        }
    },
    mounted() {
        this.loadMedia();
    }
}
</script>

<style scoped>
/* Add any specific styles for MediaSection here if needed */
</style>