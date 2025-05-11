<template lang="pug">
div.pl-6.w-100.media-section-main
    div.media-title-text
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
    div.w-100.media-list-content.d-flex.justify-center.flex-column
        table.media-table(v-if="media_type == 'movies' && movies.length > 0")
            thead
                tr
                    th Naam
                    th Score
            tbody
                tr(v-for="movie in movies")
                    td {{ movie.B }}
                    td.text-center {{ movie.C }}
        table.media-table(v-if="media_type == 'series' && series.length > 0"  )
            thead
                tr
                    th Naam
                    th.px-10 Seizoen
                    th Score
            tbody
                tr(v-for="serie in series")
                    td {{ serie.B }}
                    td.text-center {{ serie.C }}
                    td.text-center {{ serie.D }}
        div
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
            const scriptURL = 'https://script.google.com/macros/s/AKfycbznFPhD1jfyaPYukVEd8dMjcOW6oDUlM7rq4mf2Zer1KsC0txHwh7XuAGGx3NPKTsMG/exec'; // Replace with your deployed App Script URL
            const params = new URLSearchParams({
                n: n,
                sheetName: sheet,
                startIndex: is_sorted ? 3 + start_index : 3,
                isSorted: is_sorted
            });

            try {
                const response = await fetch(`${scriptURL}?${params}`);
                const data = await response.json();
                console.log(data)
                return data;
            } catch (error) {
                console.error('Error fetching data:', error);
                return null;
            }
        },
        async loadMedia(){
            this.loading_media = true


            const [serie_result, movie_result] = await Promise.all([this.getSheetData(5, "Series", 0, this.media_is_sorted), this.getSheetData(5, "Films", 0, this.media_is_sorted)])
            this.series = serie_result
            this.movies = movie_result
            console.log(this.series, this.movies)
            this.loading_media = false
        
            

        },
        async loadExtraMedia(){
            this.loading_media = true
            if (this.media_type == 'movies'){
                this.movies = this.movies.concat(await this.getSheetData(10, "Films", this.movies.length, this.media_is_sorted))
            } else {
                this.series = this.series.concat(await this.getSheetData(10, "Series", this.series.length, this.media_is_sorted))
            }
            this.loading_media = false
        
        }
    },
    mounted() {
        this.loadMedia();
    }
}
</script>

<style scoped>
.media-section-main {
  display: inline-block;
  /* The transform: rotate(...) was removed as data property media_text_rotation is always 0. */
}

.media-title-text {
  font-family: 'CreamyChalk';
  font-size: calc(min(100vw, 600px) / 10);
}

.media-list-content {
  color: white;
  font-family: 'CreamyChalk';
}
.media-table {
      overflow-y: scroll;
        max-width: 700px;
        max-height: 250px;
        display: block;
}
</style>