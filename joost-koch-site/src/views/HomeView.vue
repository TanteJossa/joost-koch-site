<template lang="pug">
div.w-100.home-view-wrapper

    WoodTextureBackground.wood-texture-background(ref="woodTexture" :canvasHeight="homegrid_height" )
    div.w-100.home-grid-container(
        @mousemove="woodMouseMove"
    )
        HomeGrid#home-grid
            template(#name)
                NameSection(
                    v-model="is_moving_wood"
                )
            template(#div1)
                ProjectsSection(
                    :projects="projects"
                    @open-projects-view="handleOpenProjectsView"
                    @open-project-details="handleOpenProjectDetails"
                )
            template(#div2 )
                PhotosSection(@show-polaroid-dialog="openPolaroidDialog")
            template(#div3)
                MediaSection
            template(#div4)
                LinksSection
            template(#div5)

                    MulticoloredText.pl-6.links-title-text(
                        text="CV"
                        target="_blank"
                        @click="openCv()"
                    )

RouteDrivenOverlay(
        :richRouteHistory="richRouteHistory"
        :projects="projects"
        :projectSearch="project_search"
        :projectSort="project_sort"
        @go-back="goBack"
        @close-all-dialogs="closeDialogs"
        @update:projectSearch="project_search = $event"
        @update:projectSort="project_sort = $event"
        @open-project="handleOpenProjectDetails"
        @open-image-dialog="handleOpenImageDialogFromOverlay"
    )
    ImageLightBox(
        v-model:modelValue="imageDialogVisible"
        :dialogContentType="dialogContentType"
        :selectedImageUrl="selectedImageUrl"
        :selectedImageAlt="selectedImageAlt"
        :selectedPolaroidData="selectedPolaroidData"
    )




</template>

<script>
import NameSection from '@/components/home_page/name_section/NameSection.vue';
import WoodTextureBackground from '@/components/home_page/background/WoodTextureBackground.vue';
import { PowerGlitch } from 'powerglitch'
// Adjust path as needed
import HomeGrid from '@/components/home_page/layout/HomeGrid.vue';
import RouteDrivenOverlay from '@/components/overlays/RouteDrivenOverlay.vue';
import ImageLightBox from '@/components/overlays/ImageLightBox.vue';
import ProjectsSection from '@/components/home_page/projects_section/ProjectsSection.vue';
import PhotosSection from '@/components/home_page/photos_section/PhotosSection.vue';
import MediaSection from '@/components/home_page/media_section/MediaSection.vue';
import LinksSection from '@/components/home_page/links_section/LinksSection.vue';
import { v4 as uuidv4 } from 'uuid';
import { getUniqueIntegers, extractDateFromFilename } from '../helpers';
import projectsData from '../assets/projects.json';
import { marked } from 'marked';
import cv from '@/assets/pdfs/cv.pdf'

export default {
    name: 'TestView',
    components: {
        NameSection,
        WoodTextureBackground,
        HomeGrid,
        ProjectsSection,
        PhotosSection,
        MediaSection,
        LinksSection,
        RouteDrivenOverlay,
        ImageLightBox
    },
    setup(){

        return {
            PowerGlitch,
            cv
        }
    },
    data() {
        return {
            update_homegrid: 0,
            route_history: [],

            projects: [], // Initialize projects as an empty array

            project_search: "",
            project_sort: "Rank",


            // projects_text_rotation removed
            imageDialogVisible: false,
            selectedImageUrl: null,
            selectedImageAlt: '',
            selectedPolaroidData: null,
            dialogContentType: null,

            is_moving_wood: false,

            projectsResizeObserver: null

        }
    },


    computed: {
        currentRouteData(){
            const data = this.getRouteData(this.$route.fullPath)
            if (data){
                return data
            }
            return {type: 'home', id: ''}
        },
        richRouteHistory(){
            return this.route_history.map(path => { // path is the full path string
                const route_data = this.getRouteData(path);
                if (!route_data) return { path: path, title: 'Unknown', type: 'unknown' }; // Handle invalid route_data

                var rich_route_data = {
                    path: path, // Store the original path for keying
                    type: route_data.type,
                    id: route_data.id,
                    imageUrl: route_data.imageUrl,
                    altText: route_data.altText,
                    isPolaroid: route_data.isPolaroid,
                    polaroidDate: route_data.polaroidDate, // Pass as is (ISO string or null)
                };

                rich_route_data.is_item_page = ![undefined, null, ''].includes(route_data.id) || (route_data.type === 'image');

                if (route_data.type === 'projects') {
                    rich_route_data.title = route_data.id ? 'Project' : 'Projects';
                } else if (route_data.type === 'image') {
                    rich_route_data.title = route_data.isPolaroid ? 'Polaroid' : (route_data.altText || 'Image');
                } else {
                    rich_route_data.title = 'Detail'; // Default title
                }

                return rich_route_data;
            });
        },
        homegrid_height(){
            this.update_homegrid-=1
            const el = document.getElementById('home-grid')
            // console.log(el)
            if (el){
                return el.scrollHeight + 'px'
            }
            return '100dvh'
        },
        cv_url(){
          return window.location.origin + cv
        }

    },
    methods: {
            handleOpenImageDialogFromOverlay(imageUrl, altText) {
                const finalImageUrl = (imageUrl === undefined || imageUrl === null || imageUrl === 'undefined') ? '' : imageUrl;
                const finalAltText = (altText === undefined || altText === null || altText === 'undefined') ? 'Image' : altText;

                const imageData = {
                    imageUrl: finalImageUrl,
                    altText: finalAltText,
                    isPolaroid: false,
                    polaroidDate: null
                };
                const new_url = this.routeDataToUrl('image', imageData);
                if (new_url) {
                    this.route_history.push(new_url);
                }
            },
            openPolaroidDialog(polaroidData) {
                const rawImageUrl = polaroidData && polaroidData.image;
                const finalImageUrl = (rawImageUrl === undefined || rawImageUrl === null || rawImageUrl === 'undefined') ? '' : rawImageUrl;

                let rawAltText;
                if (polaroidData && polaroidData.date) {
                    const dateObj = new Date(polaroidData.date);
                    rawAltText = !isNaN(dateObj.getTime()) ? `Polaroid from ${dateObj.toLocaleDateString()}` : 'Polaroid Photo';
                } else {
                    rawAltText = 'Polaroid Photo';
                }
                const finalAltText = (rawAltText === undefined || rawAltText === null || rawAltText === 'undefined') ? 'Polaroid Photo' : rawAltText;

                let rawPolaroidDate = polaroidData && polaroidData.date ?
                    (polaroidData.date instanceof Date ? polaroidData.date.toISOString() : new Date(polaroidData.date).toISOString())
                    : null;
                // Ensure rawPolaroidDate is not the string "undefined" if it resulted from an invalid date conversion that stringified to "undefined"
                if (rawPolaroidDate === 'Invalid Date' || typeof rawPolaroidDate !== 'string' && rawPolaroidDate !== null) { // Check for "Invalid Date" string from bad toISOString() or if not string/null
                     rawPolaroidDate = null;
                }

                const finalPolaroidDate = (rawPolaroidDate === undefined || rawPolaroidDate === null || rawPolaroidDate === 'undefined') ? null : rawPolaroidDate;

                const imageData = {
                    imageUrl: finalImageUrl,
                    altText: finalAltText,
                    isPolaroid: true,
                    polaroidDate: finalPolaroidDate
                };
                const new_url = this.routeDataToUrl('image', imageData);
                if (new_url) {
                    this.route_history.push(new_url);
                }
            },
        woodMouseMove(event){
            const component = this.$refs.woodTexture;
            if (!component) return;
            if (this.is_moving_wood){

            component.$el.dispatchEvent(new MouseEvent("mousemove" ,event))
            }

        },
        // shownProjects method removed as it's now in ProjectsSection.vue
        handleOpenProjectsView() {
            this.route_history.push(this.routeDataToUrl('projects'));
        },
        handleOpenProjectDetails(id) {
            this.route_history.push(this.routeDataToUrl('projects', { id: id }));
        },
        overlayGoBack(){
            this.overlay_type = {
                "projects": "",
                "project": this.overlay_came_from,
            }[this.overlay_type]
            this.overlay_came_from = ""
        },
        getRouteData(routePath) {
            var route_data = {
                type: '',
                id: null, // Ensure id is explicitly handled, null for image routes
                imageUrl: null,
                altText: null,
                isPolaroid: false,
                polaroidDate: null,
            };
            const parts = routePath.split('?');
            const path = parts[0];
            const queryParams = new URLSearchParams(parts[1] || '');

            const route_array = path.split('/');
            if (route_array[1] === 'projects') {
                route_data.type = 'projects';
                if (route_array.length > 2) {
                    route_data.id = route_array[2];
                }
            } else if (route_array[1] === 'image-viewer') {
                route_data.type = 'image';
                route_data.imageUrl = queryParams.get('src');
                route_data.altText = queryParams.get('alt');
                route_data.isPolaroid = queryParams.get('isPolaroid') === 'true';
                route_data.polaroidDate = queryParams.get('date'); // Will be an ISO string or null
            } else {
                return false; // Or handle as 'home' or invalid
            }
            return route_data;
        },
        routeDataToUrl(type, dataObject) {
            if (type === 'projects') {
                return '/projects' + (dataObject && dataObject.id ? '/' + dataObject.id : '');
            } else if (type === 'image' && dataObject) {
                const imageUrlInput = dataObject.imageUrl;
                const altTextInput = dataObject.altText;
                const dateInput = dataObject.polaroidDate; // This should be an ISO string or null from imageData

                // Critical: Ensure these checks handle the string "undefined"
                const safeImageUrl = (imageUrlInput === undefined || imageUrlInput === null || imageUrlInput === 'undefined')
                                    ? ''
                                    : imageUrlInput;
                const safeAltText = (altTextInput === undefined || altTextInput === null || altTextInput === 'undefined')
                                   ? 'Image'
                                   : altTextInput;
                // For date, null is a valid state meaning "no date". The string "undefined" should become null.
                const safeDate = (dateInput === undefined || dateInput === 'undefined')
                                 ? null
                                 : dateInput; // Allows null to pass through

                let url = `/image-viewer?src=${encodeURIComponent(safeImageUrl)}&alt=${encodeURIComponent(safeAltText)}`;

                if (dataObject.isPolaroid) {
                    url += '&isPolaroid=true';
                    if (safeDate) { // Only add date param if safeDate is a truthy string (not null)
                        url += `&date=${encodeURIComponent(safeDate)}`;
                    }
                }
                return url;
            }
            return '/';
        },
        loadPage(type, id) {
            const new_url = this.routeDataToUrl(type, id)
            if (new_url) {
                this.route_history.push(new_url)

            }
        },
        goBack() {
            if (this.route_history.length === 0) {
                return;
            // Nothing to go back to
            }

            const currentRoutePath = this.route_history[this.route_history.length - 1];
            const routeData = this.getRouteData(currentRoutePath);

            // Check if the current view is a single project detail page
            if (routeData && routeData.type === 'projects' && routeData.id) {
                const projectBrowserUrl = this.routeDataToUrl('projects');

                // Remove the current project detail page from history
                this.route_history.pop();

                // Check if the project browser URL is already the last item or if history is empty
                if (this.route_history.length === 0 || this.route_history[this.route_history.length - 1] !== projectBrowserUrl) {
                    // Find the project browser URL in the history
                    const browserUrlIndex = this.route_history.lastIndexOf(projectBrowserUrl);

                    if (browserUrlIndex !== -1) {
                        // If found, remove all entries after it
                        this.route_history.splice(browserUrlIndex + 1);
                    } else {
                        // If not found (e.g., deep-linked), set history to just the project browser
                        this.route_history = [projectBrowserUrl];
                    }
                }
                // If projectBrowserUrl is already the last item, do nothing extra, watcher will handle it.

            } else {
                // Standard behavior: pop the last entry
                this.route_history.pop();
            }
        },
        closeDialogs(){
            this.route_history = []
        },


        // openProjects method removed, handled by handleOpenProjectsView
        // openProject method removed, handled by handleOpenProjectDetails
        getProjectFromId(id){
            if (!this.projects || this.projects.length === 0) {
                return {};
            }
            return this.projects.find(e => e.id == id) || {}
        },


            openImageDialog(imageUrl, altText) {
                const finalImageUrl = (imageUrl === undefined || imageUrl === null || imageUrl === 'undefined') ? '' : imageUrl;
                const finalAltText = (altText === undefined || altText === null || altText === 'undefined') ? 'Image' : altText;

                const imageData = {
                    imageUrl: finalImageUrl,
                    altText: finalAltText,
                    isPolaroid: false,
                    polaroidDate: null
                };
                const new_url = this.routeDataToUrl('image', imageData);
                if (new_url) {
                    this.route_history.push(new_url);
                }
            },
            openCv(){
                window.open(this.cv_url, '_blank');
            },


    },
    watch:{
        route_history: {
            handler(){
                if (this.route_history.length >= 1) {
                    this.$router.push(this.route_history[this.route_history.length - 1])
                } else {
                    this.$router.push('/')
                }
                console.log(this.route_history)
            },
            deep: true
        },
    },
    async mounted() {
        // projectsData is now directly imported and mapped
        this.projects = projectsData.map(p => ({
            ...p,
            date: p.date ? new Date(p.date) : null
        }));

        this.PowerGlitch.glitch('.glitch-text', {
            glitchTimeSpan: {
                "start": 0,
                "end": 1
            },
            "timing": {
                "duration": 550,
                "easing": "ease-in-out"
            },
            "shake": {
                "amplitudeX": 0.08,
                "amplitudeY": 0.08
            },

            playMode: 'hover',

        })


        const route_data = this.getRouteData(this.$route.fullPath)
        if(route_data) {
            const new_url = this.routeDataToUrl(route_data.type, route_data)
            this.route_history.push(new_url)
        } else {
            this.route_history = []
        }


        // ResizeObserver for projects_container removed, handled in ProjectsSection.vue

        // Fetch all data first
        await Promise.all([]);

      const container = document.getElementById('home-grid');
        if (container && typeof ResizeObserver !== 'undefined') {
            this.projectsResizeObserver = new ResizeObserver(() => {
                this.update_homegrid++
            });
            this.projectsResizeObserver.observe(container);
        } else if (typeof ResizeObserver === 'undefined') {
            // Fallback for environments without ResizeObserver or if needed
            window.addEventListener('resize', this.update_homegrid++);
        }
    },
    beforeUnmount() {
        if (this.projectsResizeObserver) {
      const container = document.getElementById('home-grid');
            if (container) {
                 this.projectsResizeObserver.unobserve(container);
            }
            this.projectsResizeObserver.disconnect();
        } else if (typeof ResizeObserver === 'undefined') {
             window.removeEventListener('resize', this.update_homegrid++);
        }
    },
};
</script>

<style scoped>
.links-title-text {
  font-family: 'CreamyChalk';
  font-size: calc(min(100vw, 600px) / 10);
}

.home-view-wrapper {
  position: relative;
}

.wood-texture-background {
  position: absolute;
  pointer-events: all;
}

.home-grid-container {
  position: absolute;
  min-height: 100dvh;
}




/* Styles for PowerGlitch */
.glitch-text:hover{
    animation: glitch-color 0.4s ease-in-out;
}

@keyframes glitch-color {
    0% {
        background-image: unset;
        color: white;
        background-clip: unset;
    }
    20%{
        background-image: linear-gradient(rgb(13, 255, 0), blue);
        color: transparent;
        background-clip: text;
    }
    80%{
        background-image: linear-gradient(rgb(0, 47, 255), rgb(255, 0, 0));
        color: transparent;
        background-clip: text;
    }
    100% {
        background-image: unset;
        color: white;
        background-clip: unset;
    }
}


/* Styles for v-html content (e.g., project descriptions) */
:deep(ol) {
  margin-left: 20px !important;
}

:deep(ul) {
  margin-left: 20px !important;
}
</style>
