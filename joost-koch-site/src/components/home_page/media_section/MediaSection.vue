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
        async getSheetData(n, sheetName, startIndex = 1, isSorted = false) {
            const apiUrl = 'https://joost-koch-film-api-234817865209.europe-west4.run.app/get-sheet-data';
            const params = new URLSearchParams({
                sheetName,
                n,
                startIndex,
                isSorted,
            });

            try {
                const response = await fetch(`${apiUrl}?${params}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Unknown API error');
                }
                const data = await response.json();
                if (data.message) {
                    console.log(data.message);
                    return [];
                }
                return data;
            } catch (error) {
                console.error('Failed to fetch data:', error);
                return [];
            }
        },
        async loadMedia() {
            this.loading_media = true;
            this.series = [];
            this.movies = [];

            const n = 5;
            const startIndex = 1;
            const isSorted = this.media_is_sorted;

            const [serie_result, movie_result] = await Promise.all([
                this.getSheetData(n, "Series", startIndex, isSorted),
                this.getSheetData(n, "Films", startIndex, isSorted)
            ]);

            this.series = serie_result;
            this.movies = movie_result;
            this.loading_media = false;
        },
        async loadExtraMedia() {
            this.loading_media = true;
            const n = 10;
            const isSorted = this.media_is_sorted;

            if (this.media_type === 'movies') {
                const startIndex = this.movies.length + 1;
                const extraMovies = await this.getSheetData(n, "Films", startIndex, isSorted);
                this.movies = this.movies.concat(extraMovies);
            } else {
                const startIndex = this.series.length + 1;
                const extraSeries = await this.getSheetData(n, "Series", startIndex, isSorted);
                this.series = this.series.concat(extraSeries);
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
