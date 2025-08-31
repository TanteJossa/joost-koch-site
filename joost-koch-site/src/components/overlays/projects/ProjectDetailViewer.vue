<template lang="pug">
div.h-100.pa-4.project-detail-scroll(v-if="project")
    div.d-flex.flex-row.align-center.mb-2
        h2.text-grey.mr-2(v-if="project.rank") \#{{project.rank}}
        h2 {{ project.title }}
        v-spacer
        v-btn(v-if="project.url" :href="project.url" target="_blank" variant="tonal" prepend-icon="mdi-open-in-new" color="secondary" ) Demo
            //- v-icon(icon="mdi-open-in-new")
        v-spacer
        v-btn(v-if="project.github" :href="project.github" target="_blank" variant="tonal" prepend-icon="mdi-github" color="secondary") Github
            //- v-icon(icon="mdi-github")
            //-)

    p.text-caption.text-grey-darken-1
        span(v-if="project.date") {{ getPrettyDate(project.date) }}
        span(v-if="project.date && project.status")  |
        span(v-if="project.status") Status: {{ project.status }}

    div.pt-2(v-if="project.team && project.team.length > 0")
        strong Team:
        span  {{ project.team.join(', ') }}

    div.pt-2(v-if="project.tags && project.tags.length > 0")
        strong Tags:
        v-chip.ma-1(v-for="tag in project.tags" :key="tag" small density="compact") {{ tag }}

    div.pt-2(v-if="project.technologies && project.technologies.length > 0")
        strong Technologies:
        v-chip.ma-1(v-for="tech in project.technologies" :key="tech" small density="compact") {{ tech }}
    div.pt-4(v-if="project.pdfs && project.pdfs.length > 0")
        h3.mb-2 Associated Files:
        div.d-flex.flex-wrap.ga-2
            v-card.pa-2.ma-1.project-detail-pdf-card(
                v-for="pdfName in project.pdfs"
                :key="pdfName"
                link
                :href="getProjectPdfUrl(project.id, pdfName)"
                target="_blank"
                hover
            )
                v-row(align="center" no-gutters)
                    v-col(cols="auto")
                        v-icon.mr-2(icon="mdi-file-pdf-box" size="large" color="red-darken-2")
                    v-col
                        div.project-detail-pdf-name {{ pdfName }}

    div.pt-3(v-if="project.description" v-html="processProjectContent(project.description, project.id)")

    div.pt-3(v-if="project.long_description" v-html="processProjectContent(project.long_description, project.id)")

    div.pt-4(v-if="project.images && project.images.length > 0")
        h3.mb-2 Images:
        div.d-flex.flex-wrap.ga-2
            img.ma-1(
                v-for="imageNameInLoop in project.images"
                :key="imageNameInLoop"
                :src="getProjectImageUrl(project.id, imageNameInLoop)"
                :alt="`${project && project.title ? project.title : 'Project Image'} - ${imageNameInLoop || 'image'}`"
                class="project-detail-image"
                @click="$emit('open-image-dialog', getProjectImageUrl(project.id, imageNameInLoop) || '', `${project && project.title ? project.title : 'Project Image'} - ${imageNameInLoop || 'image'}`)"
            )



</template>

<script>
import { marked } from 'marked';

export default {
    name: 'ProjectDetailViewer',
    props: {
        project: {
            type: Object,
            required: true
        }
    },
    emits: {
        // Validator for the 'open-image-dialog' event
        'open-image-dialog': (imageUrl, altText) => {
            // Check if imageUrl and altText are strings
            return typeof imageUrl === 'string' && typeof altText === 'string';
        }
    },
    methods: {
        // Formats a date string into a more readable format
        getPrettyDate(dateString) {
            // Convert dateString to Date object
            const date = new Date(dateString);
            const options = {
                day: 'numeric',
                month: 'short',
                year: '2-digit',
            };
            // Check if date is valid before calling toLocaleDateString
            if (isNaN(date.getTime())) {
                // Handle invalid date string
                return dateString;
            }
            return date.toLocaleDateString('en-US', options);
        },

        handleDirectImageClick(projectId, imageName, projectTitle) {
            const actualImageName = typeof imageName === 'string' && imageName ? imageName : 'N/A';
            const actualTitle = typeof projectTitle === 'string' && projectTitle ? projectTitle : 'Image';

            // Ensure projectId is a string before calling getProjectImageUrl
            const actualProjectId = typeof projectId === 'string' && projectId ? projectId : '';

            const imageUrl = this.getProjectImageUrl(actualProjectId, actualImageName);
            const altText = `${actualTitle} - ${actualImageName}`;

            this.$emit('open-image-dialog', imageUrl, altText);
        },

        // Constructs the URL for a project image
        getProjectImageUrl(projectId, imageFilename) {
            if (!projectId || !imageFilename) {
                // console.warn(`getProjectImageUrl: called with invalid projectId ('${projectId}') or imageFilename ('${imageFilename}'). Returning empty string.`); // Optional: keep console.warn
                return '';
            }
            try {
                // Path relative from this component (src/components/overlays/projects/)
                // to src/assets/projects/
                const url = new URL(`../../../assets/projects/${projectId}/${imageFilename}`, import.meta.url).href;
                return typeof url === 'string' ? url : '';
            } catch (e) {
                // console.error(`Error creating image URL for project '${projectId}', image '${imageFilename}':`, e); // Optional: keep console.error
                return ''; // CRITICAL: Ensure empty string on error
            }
        },

        // Constructs the URL for a project PDF
        getProjectPdfUrl(projectId, pdfFilename) {
            if (!projectId || !pdfFilename) {
                return '';
            }
            try {
                // Path relative from this component (src/components/overlays/projects/)
                // to src/assets/projects/
                return new URL(`../../../assets/projects/${projectId}/${pdfFilename}`, import.meta.url).href;
            } catch (e) {
                console.error(`Error creating PDF URL for project '${projectId}', PDF '${pdfFilename}':`, e);
                return '';
            }
        },

        // Processes markdown content and replaces image placeholders
        processProjectContent(content, projectId) {
            if (!content || typeof content !== 'string') return '';

            let htmlContent = '';
            try {
                // Configure marked for HTML output
                htmlContent = marked(content);
            } catch (e) {
                console.error('Error parsing markdown:', e);
                // Fallback content in case of error
                htmlContent = `<p>Error rendering content.</p>`;
            }

            // Replace {{image_name.ext}} placeholders with img tags
            // These images will also emit 'open-image-dialog' when clicked
            return htmlContent.replace(/\{\{(.*?)\}\}/g, (match, imageNameWithExt) => {
                const imageName = imageNameWithExt.trim();
                // Ensure projectId is valid for getProjectImageUrl
                const currentProjectId = typeof projectId === 'string' && projectId ? projectId : '';

                if (!currentProjectId) {
                    // console.warn(`processProjectContent: Missing projectId for image '${imageName}'`);
                    return `<!-- Image '${imageName}' (missing project ID) -->`;
                }
                if (!imageName) return match; // Return original match if imageName is empty after trim

                try {
                    const rawImageUrl = this.getProjectImageUrl(currentProjectId, imageName); // This should return '' on failure
                    if (!rawImageUrl) return `<!-- Image '${imageName}' could not be resolved -->`;

                    const baseTitle = this.project && this.project.title ? this.project.title : 'Project Image';
                    let imageNameWithoutExt = imageName || 'image';
                    const lastDotIndex = imageName ? imageName.lastIndexOf('.') : -1;
                    if (lastDotIndex !== -1) {
                        imageNameWithoutExt = imageName.substring(0, lastDotIndex);
                    }
                    const rawAltText = `${baseTitle} - ${imageNameWithoutExt.replace(/[_-]/g, ' ')}`;

                    const finalImageUrlForEvent = rawImageUrl || ''; // Ensure string for event
                    const finalAltTextForEvent = rawAltText || 'Image'; // Ensure string for event

                    // Embed an onclick handler that dispatches a custom event for image clicks
                    // This allows handling clicks on dynamically generated HTML content
                    return `<img src="${finalImageUrlForEvent}" alt="${finalAltTextForEvent}" style="max-width: 100%; height: auto; display: block; margin: 10px auto; border-radius: 8px; border: 1px solid #ddd; cursor: pointer;" onclick="this.dispatchEvent(new CustomEvent('image-click-internal', { bubbles: true, detail: { src: '${finalImageUrlForEvent}', alt: '${finalAltTextForEvent}' } }))">`;
                } catch (e) {
                    console.error(`Error processing image placeholder for project ${currentProjectId}: ${imageName}`, e);
                    // Fallback comment in case of error during image processing
                    return `<!-- Error processing image '${imageName}' -->`;
                }
            });
        }
    },
    mounted() {
        // Define the handler and store it on the instance for correct removal
        this.internalImageClickHandler = (event) => {
            const detailSrc = event.detail && event.detail.src !== undefined ? event.detail.src : '';
            const detailAlt = event.detail && event.detail.alt !== undefined ? event.detail.alt : 'Image from description';
            this.$emit('open-image-dialog', detailSrc, detailAlt);
        };
        // Add event listener for 'image-click-internal' custom events
        this.$el.addEventListener('image-click-internal', this.internalImageClickHandler);
    },
    beforeUnmount() {
        // Clean up the event listener when the component is unmounted
        // Ensure the handler exists before trying to remove it
        if (this.internalImageClickHandler) {
            this.$el.removeEventListener('image-click-internal', this.internalImageClickHandler);
            delete this.internalImageClickHandler; // Clean up the instance property
        }
    }
};
</script>

<style scoped>
.project-detail-scroll {
  overflow-y: auto;
  /* Ensure it takes full height of its container if needed */
  height: 100%;
}

.project-detail-image {
  max-width: 200px;
  max-height: 150px;
  height: auto;
  border-radius: 4px;
  object-fit: cover;
  border: 1px solid #eee;
  cursor: pointer;
}

.project-detail-pdf-card {
  min-width: 150px;
  text-decoration: none;
}

.project-detail-pdf-name {
  font-size: 0.9em;
  word-break: break-all;
}

/* Styles for v-html content (e.g., project descriptions) */
:deep(ol) {
  margin-left: 20px !important;
}

:deep(ul) {
  margin-left: 20px !important;
}

/* Style for images within v-html to also be clickable */
:deep(img[onclick*="image-click-internal"]) {
    cursor: pointer;
}
</style>
