<template lang="pug">
div
    div.ml-6.pt-9(
        :style="{'transform': 'rotate('+(projects_text_rotation)+'deg)', 'display': 'inline-block'}"
    )
        div(style="font-family: 'CreamyChalk'; font-size: calc(min(100vw, 600px) / 10)")
            MulticoloredText(
                text="Projecten"
                is_clickable
                @click="$emit('open-projects-view')"
            )
    div.ml-3.d-flex.flex-row#projects(ref="projectsContainerRef" @update="updateShownProjects")
        PostItNote.ml-3.post-it(
            v-for="(project, index) in shown_projects"
            :key="project.id"
            @mouseover="project_hover_index = index"
            @mouseleave="project_hover_index = -1"
            is_clickable
            @click="$emit('open-project-details', project.id)"
            :style="{'z-index': project_hover_index == index ? '10 !important' : 0}"
        )
            h2 {{project.title}}
            div.truncate-multi-line {{ truncateDescription(project.description) }}
</template>

<script>
import MulticoloredText from '@/components/ui/elements/MulticoloredText.vue';
import PostItNote from '@/components/ui/elements/PostItNote.vue';

export default {
    name: 'ProjectsSection',
    components: {
        MulticoloredText,
        PostItNote,
    },
    props: {
        projects: {
            type: Array,
            required: true,
            default: () => []
        }
    },
    emits: ['open-projects-view', 'open-project-details'],
    data() {
        return {
            projects_text_rotation: (Math.random() * 15 - 7.5) * 0,
            shown_projects: [],
            project_hover_index: -1,
            projectsResizeObserver: null,
        };
    },
    methods: {
        calculateShownProjects() {
            if (!this.projects || this.projects.length === 0) {
                return [];
            }
            const container = this.$refs.projectsContainerRef;
            if (!container) {
                return this.projects.slice(0,1); // Fallback if ref not ready
            }
            const box = container.getBoundingClientRect();
            // Ensure $vuetify and display are available, provide fallback if not
            const lgAndUp = this.$vuetify && this.$vuetify.display ? this.$vuetify.display.lgAndUp : true;
            const itemsPerWidth = Math.floor(box.width / 180);
            if (itemsPerWidth <= 0 && this.projects.length > 0) return this.projects.slice(0,1); // show at least one if space is very small
            return this.projects.slice(0, itemsPerWidth * (lgAndUp ? 1 : 1));
        },
        updateShownProjects() {
            this.shown_projects = this.calculateShownProjects();
        },
        truncateDescription(description, maxLength = 50) {
            if (!description || typeof description !== 'string') {
                return '';
            }
            // Basic stripping of markdown for length calculation
            let plainText = description
                .replace(/\{\{.*?\}\}/g, '') // Remove image placeholders
                .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Replace links with their text
                .replace(/[*_`~#\-+\.!]/g, ''); // Remove other markdown chars
            plainText = plainText.replace(/\s+/g, ' ').trim(); // Normalize whitespace

            if (plainText.length <= maxLength) {
                return plainText;
            }
            let truncated = plainText.substring(0, maxLength);
            const lastSpace = truncated.lastIndexOf(' ');
            if (lastSpace > 0) {
                truncated = truncated.substring(0, lastSpace);
            }
            return truncated + '...';
        }
    },
    watch: {
        projects: {
            handler() {
                this.$nextTick(() => {
                    this.updateShownProjects();
                });
            },
            deep: true,
            immediate: true
        }
    },
    mounted() {
        // Initial calculation
        this.$nextTick(() => {
             this.updateShownProjects();
        });

        const container = this.$refs.projectsContainerRef;
        if (container && typeof ResizeObserver !== 'undefined') {
            this.projectsResizeObserver = new ResizeObserver(() => {
                this.updateShownProjects();
            });
            this.projectsResizeObserver.observe(container);
        } else if (typeof ResizeObserver === 'undefined') {
            // Fallback for environments without ResizeObserver or if needed
            window.addEventListener('resize', this.updateShownProjects);
        }
    },
    beforeUnmount() {
        if (this.projectsResizeObserver) {
            const container = this.$refs.projectsContainerRef;
            if (container) {
                 this.projectsResizeObserver.unobserve(container);
            }
            this.projectsResizeObserver.disconnect();
        } else if (typeof ResizeObserver === 'undefined') {
             window.removeEventListener('resize', this.updateShownProjects);
        }
    },
};
</script>

<style scoped>
/* Styles from HomeView.vue relevant to .post-it and .truncate-multi-line */
.post-it {
    max-height: 200px;
    /* Fixed height */
    max-width: 200px;
    font-size: clamp(0.8rem, 0.5vw, 2rem);
    padding: 10px;
    /* Added padding for content */
    overflow: hidden;
    /* Hide overflowing content */
    display: flex;
    /* Using flex to help with content alignment */
    flex-direction: column;
    /* Stack title and description vertically */
}

.truncate-multi-line {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    /* Fallback for non-webkit */
    line-clamp: 3;
    /* Adjust number of lines for post-it note */
    -webkit-line-clamp: 3;
    /* Adjust number of lines for post-it note */
    -webkit-box-orient: vertical;
    /* Fallback for max-height */
    max-height: calc(1.2em * 3);
    /* line-height * line-clamp */
    line-height: 1.2em;
    /* Ensure consistent line height */

}

.post-it h2 {
    margin-bottom: 5px;
    /* Space between title and description */
    flex-shrink: 0;
    /* Prevent title from shrinking */
}

/* Ensure #projects div itself can be a flex container if needed by children, though PostItNote handles its own layout */
#projects {
    /* Add any necessary styling for the container itself, e.g., to ensure it has width */
    width: 100%;
    /* Or other appropriate width management */
    /* min-height: 180px; */
    /* Ensure it has some height for observer */
  justify-content: space-around;
  display: flex
}
</style>
