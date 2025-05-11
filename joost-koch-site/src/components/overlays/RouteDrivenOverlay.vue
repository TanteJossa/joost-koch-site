<template lang="pug">
div(
    v-for="route in richRouteHistory"
    :key="route.path"
)
    // v-overlay to display content based on the route
    v-overlay.d-flex.justify-center.align-center(
        :modelValue="true"
        @update:modelValue="$emit('go-back')" 
        :style="{'padding-top': $vuetify.display.mdAndUp && !(route.type === 'image' && route.isPolaroid) ? '50px' : ''}" 
    )
        // Case 1: Display PolaroidPhoto directly
        div.w-100.h-100(
            v-if="route.type === 'image' && route.isPolaroid"
        )
            PolaroidPhoto.overlay-image(
                :image="route.imageUrl"
                :date="route.polaroidDate ? new Date(route.polaroidDate) : null"
                style="transform: scale(1.2);" 
                @click="$emit('go-back')"
            )
            // Consider adding a close button here if overlay's default close isn't prominent enough for this case
            // e.g., v-btn(icon @click="$emit('go-back')" style="position: absolute; top: 10px; right: 10px; z-index: 10;")
            //          v-icon mdi-close

        // Case 2: Display content within a v-card (existing structure)
        v-card(
            v-else
            :style="{'width': '100vw', 'max-width': '800px', 'height': 'calc(100vh - '+($vuetify.display.mdAndUp ? 100 : 0)+'px)'}"
        )
            // v-card-title with back button, title, and close button
            v-card-title.d-flex.flex-row.align-center
                // Back icon
                v-icon(
                    icon="mdi-arrow-left"
                    @click="$emit('go-back')"
                )
                // Route title
                h2 {{ route.type === 'image' ? (route.altText || 'Image') : (route.title || 'Detail') }}
                // Close icon
                v-icon.ml-auto(
                    icon="mdi-close"
                    @click="$emit('close-all-dialogs')"
                )
            // Divider below the card title
            v-divider
            // v-card-text to hold the main content
            v-card-text.overlay-card-text.pa-0.pb-3
                // Conditional rendering for projects
                div.h-100(v-if="route.type === 'projects'")
                    // ProjectBrowser for listing projects
                    ProjectBrowser(
                        v-if="!route.id"
                        :projects="projects"
                        :projectSearch="projectSearch"
                        :projectSort="projectSort"
                        @update:projectSearch="$emit('update:projectSearch', $event)"
                        @update:projectSort="$emit('update:projectSort', $event)"
                        @open-project="$emit('open-project', $event)"
                    )
                    // ProjectDetailViewer for displaying a single project's details
                    ProjectDetailViewer(
                        v-else-if="route.id && getProjectById(route.id)"
                        :project="getProjectById(route.id)"
                        @open-image-dialog="(url, alt) => $emit('open-image-dialog', url, alt)"
                    )
                // Conditional rendering for regular images (non-Polaroid)
                div.h-100.d-flex.flex-column(v-else-if="route.type === 'image' && !route.isPolaroid") 
                    div.d-flex.justify-center.align-center.flex-grow-1(
                        style="overflow: auto; background-color: #212121; padding: 16px;" 
                    )
                        v-img(
                            :src="route.imageUrl"
                            :alt="route.altText"
                            contain
                            @click="$emit('go-back')"

                        )
                //- Add other route types here if necessary
</template>

<script>
// Import necessary components
import ProjectBrowser from './projects/ProjectBrowser.vue';
import ProjectDetailViewer from './projects/ProjectDetailViewer.vue';
import PolaroidPhoto from '@/components/ui/media/PolaroidPhoto.vue';

export default {
    name: 'RouteDrivenOverlay',
    components: {
        // Register imported components
        ProjectBrowser,
        ProjectDetailViewer,
        PolaroidPhoto, // Add this
    },
    props: {
        // Array representing the navigation history with rich route objects
        richRouteHistory: {
            type: Array,
            required: true,
        },
        // Array of project objects
        projects: {
            type: Array,
            required: true,
        },
        // Current search term for projects
        projectSearch: {
            type: String,
            default: '',
        },
        // Current sort criteria for projects
        projectSort: {
            type: String,
            default: 'Rank',
        },
    },
    emits: {
        // Emitted when the back action is triggered
        'go-back': null,
        // Emitted when the close all dialogs action is triggered
        'close-all-dialogs': null,
        // Re-emitted from ProjectBrowser when project search term is updated
        'update:projectSearch': (payload) => typeof payload === 'string',
        // Re-emitted from ProjectBrowser when project sort criteria is updated
        'update:projectSort': (payload) => typeof payload === 'string',
        // Re-emitted from ProjectBrowser when a project is to be opened
        'open-project': (projectId) => typeof projectId === 'string' || typeof projectId === 'number',
        // Re-emitted from ProjectDetailViewer when an image dialog is to be opened
        'open-image-dialog': (imageUrl, altText) => typeof imageUrl === 'string' && typeof altText === 'string',
    },
    methods: {
        // Finds and returns a project by its ID from the projects prop
        getProjectById(id) {
            if (!this.projects || this.projects.length === 0) {
                return null;
            }
            return this.projects.find(p => p.id == id) || null;
        },
    },
};
</script>

<style scoped>
/* Scoped styles for the component */
.overlay-card-text {
    height: calc(100% - 50px);
}
.overlay-image {
    max-height: min(700px, 80vh);
    max-width: min(700px, 90vw);
}
</style>