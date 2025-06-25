<template lang="pug">
v-container
    v-row
        v-col(cols="12")
            h1.text-h4.mb-4 Motie Viewer
    v-row(align="center")
        v-col(cols="12" md="4")
            v-text-field(
                v-model="titelFilter"
                label="Filter op Titel"
                placeholder="Filter op titel..."
                variant="outlined"
                density="compact"
                hide-details
            )
        v-col(cols="12" md="4")
            v-text-field(
                v-model="onderwerpFilter"
                label="Filter op Onderwerp"
                placeholder="Filter op onderwerp..."
                variant="outlined"
                density="compact"
                hide-details
            )
        v-col(cols="12" md="3")
            v-select(
                v-model="sortOrder"
                :items="sortOptions"
                item-title="text"
                item-value="value"
                label="Sorteer op"
                variant="outlined"
                density="compact"
                hide-details
            )

    v-row.mt-4(v-if="isLoading")
        v-col.text-center
            v-progress-circular(indeterminate color="primary" size="64")
            p.mt-4 Moties worden geladen...

    v-row(v-if="!isLoading && moties.length")
        v-col(
            v-for="motie in moties"
            :key="motie.Id"
            cols="12" sm="6" md="4"
        )
            v-card.motie-card(@click="showMotieDetail(motie.Id)" hover)
                v-card-title {{ motie.Titel }}
                v-card-subtitle.pb-2 {{ motie.Nummer }}
                v-card-text
                    p.mb-2 {{ motie.Onderwerp }}
                    div.text-caption Laatst gewijzigd: {{ new Date(motie.GewijzigdOp).toLocaleDateString('nl-NL') }}
                    div(v-if="motie.Document && motie.Document.length")
                        p.font-weight-bold.mt-4 Documenten:
                        ul.pl-5.mb-0
                            li(v-for="doc in motie.Document" :key="doc.Id") {{ doc.Titel }}

    v-row(v-if="!isLoading && !moties.length")
        v-col
            v-alert(type="info" variant="tonal") Geen moties gevonden die voldoen aan de criteria.

    v-row(v-if="!isLoading && totalCount > 0")
        v-col
            v-pagination(
                v-model="currentPage"
                :length="pageCount"
                :total-visible="7"
            )

    v-dialog(v-model="isDialogOpen" max-width="900px" scrollable)
        v-card(:loading="isDialogLoading")
            template(v-if="isDialogLoading")
                v-progress-linear(indeterminate color="primary" absolute)

            v-card-title.d-flex.justify-space-between.align-center
                span.text-h5 Motie Details
                v-btn(icon="mdi-close" variant="text" @click="closeDialog")

            v-divider

            v-card-text(v-if="selectedMotie")
                h2.text-h6.mb-2 {{ selectedMotie.Titel }}
                p.font-weight-bold Onderwerp:
                p.mb-4 {{ selectedMotie.Onderwerp }}

                p.font-weight-bold Nummer:
                p.mb-4 {{ selectedMotie.Nummer }}

                p.font-weight-bold Laatst gewijzigd:
                p.mb-4 {{ new Date(selectedMotie.GewijzigdOp).toLocaleDateString('nl-NL') }}

                p.font-weight-bold Indieners:
                p.mb-4 {{ getIndieners(selectedMotie.Zaakactor) }}

                p.font-weight-bold Document:
                p.mb-4
                    a(v-if="getDocumentUrl(selectedMotie.Document)" :href="getDocumentUrl(selectedMotie.Document)" target="_blank" rel="noopener noreferrer") Bekijk officieel document
                    span(v-else) Geen document beschikbaar.

                div(v-if="stemmingen.length")
                    h3.text-subtitle-1.mt-4.mb-2 Stemmingen per fractie
                    v-table(density="compact")
                        thead
                            tr
                                th.text-left Fractie
                                th.text-left Stem
                        tbody
                            tr(v-for="stemming in stemmingen" :key="stemming.Id")
                                td {{ stemming.ActorNaam }}
                                td
                                    v-chip(:color="getStemmingColor(stemming.Soort)" size="small") {{ stemming.Soort }}
                div(v-else-if="!isDialogLoading")
                    p.mt-6 Geen stemmingsgegevens beschikbaar voor deze motie.

            v-divider
            v-card-actions
                v-spacer
                v-btn(color="blue-darken-1" variant="text" @click="closeDialog") Sluiten
</template>

<script>
import ODataService from '@/services/ODataService';

export default {
    name: 'MotieView',
    data() {
        return {
            moties: [],
            selectedMotie: null,
            stemmingen: [],
            isLoading: false,
            isDialogLoading: false,
            isDialogOpen: false,
            titelFilter: '',
            onderwerpFilter: '',
            sortOrder: 'GewijzigdOp desc',
            pageSize: 21,
            currentPage: 1,
            totalCount: 0,
            sortOptions: [
                { text: 'Nieuwste eerst', value: 'GewijzigdOp desc' },
                { text: 'Oudste eerst', value: 'GewijzigdOp asc' },
            ],
        };
    },
    computed: {
        pageCount() {
            return Math.ceil(this.totalCount / this.pageSize);
        },
    },
    watch: {
        titelFilter() {
            this.currentPage = 1;
            this.fetchMoties();
        },
        onderwerpFilter() {
            this.currentPage = 1;
            this.fetchMoties();
        },
        sortOrder() {
            this.currentPage = 1;
            this.fetchMoties();
        },
        currentPage() {
            this.fetchMoties();
        },
    },
    mounted() {
        this.fetchMoties();
    },
    methods: {
        async fetchMoties() {
            this.isLoading = true;

            try {
                const filterClauses = ["Soort eq 'Motie'"];
                if (this.titelFilter) {
                    filterClauses.push(`contains(Titel, '${this.titelFilter}')`);
                }
                if (this.onderwerpFilter) {
                    filterClauses.push(`contains(Onderwerp, '${this.onderwerpFilter}')`);
                }

                const options = {
                    filter: filterClauses.join(' and '),
                    orderby: this.sortOrder,
                    expand: 'Document',
                    top: this.pageSize,
                    skip: (this.currentPage - 1) * this.pageSize,
                    count: true,
                };

                const response = await ODataService.getMotions(options);
                this.moties = response.data.value;
                this.totalCount = response.data['@odata.count'] || 0;

            } catch (error) {
                console.error('Fout bij het ophalen van moties:', error);
                this.moties = [];
                this.totalCount = 0;
            } finally {
                this.isLoading = false;
            }
        },
        async showMotieDetail(motieId) {
            this.isDialogOpen = true;
            this.isDialogLoading = true;
            this.selectedMotie = null;
            this.stemmingen = [];

            try {
                const response = await ODataService.getMotions({
                    filter: `Id eq ${motieId}`,
                    expand: 'Besluit,Document,Zaakactor'
                });

                if (response.data.value.length > 0) {
                    this.selectedMotie = response.data.value[0];

                    if (this.selectedMotie.Besluit.length > 0) {
                        const besluitId = this.selectedMotie.Besluit[0].Id;
                        const stemmingResponse = await ODataService.getStemmingen({
                            filter: `Besluit_Id eq ${besluitId}`
                        });
                        this.stemmingen = stemmingResponse.data.value;
                    }
                }
            } catch (error) {
                console.error('Fout bij het ophalen van motiedetails:', error);
            } finally {
                this.isDialogLoading = false;
            }
        },
        closeDialog() {
            this.isDialogOpen = false;
        },
        getIndieners(zaakactors) {
            if (!zaakactors || zaakactors.length === 0) return 'Onbekend';
            return zaakactors
                .filter(actor => actor.Relatie === 'Indiener')
                .map(actor => actor.ActorNaam)
                .join(', ');
        },
        getDocumentUrl(documents) {
            if (!documents || documents.length === 0) return null;
            const doc = documents[0];
            return `https://gegevensmagazijn.tweedekamer.nl/OData/v4/2.0/Document/${doc.Id}/resource`;
        },
        getStemmingColor(soort) {
            switch (soort) {
                case 'Voor': return 'green';
                case 'Tegen': return 'red';
                case 'Geen mening': return 'grey';
                case 'Verworpen': return 'orange';
                default: return 'blue-grey';
            }
        },
    },
};
</script>

<style scoped>
.motie-card {
    cursor: pointer;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.motie-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}
</style>
