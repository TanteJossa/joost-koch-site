<template lang="pug">
    div.w-100(style="position: relative; ")
        
        WoodTextureBackground(style="position:absolute; pointer-events: all;" ref="woodTexture" :canvasHeight="homegrid_height")
        div.w-100#home-grid(
            style="position: absolute; min-height: 100vh"
            @mousemove="woodMouseMove"
        )   
            HomeGrid
                template(#name)
                    NameSection
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
                    div


    div(
        v-for="route in richRouteHistory"
    )
        v-overlay.d-flex.justify-center(
            :modelValue="true"
            @update:modelValue="goBack"
            :style="{'padding-top': $vuetify.display.mdAndUp ? '50px' : ''}"
        )
            v-card(:style="{'width': '100vw', 'max-width': '800px', 'height': 'calc(100vh - '+($vuetify.display.mdAndUp ? 100 : 0)+'px)'}")
                v-card-title.d-flex.flex-row.align-center
                    v-icon(
                        icon="mdi-arrow-left"
                        @click="goBack"
                    )
                    h2 {{ route.title }}
                    v-icon.ml-auto(
                        icon="mdi-close"
                        @click="closeDialogs"
                    )
                v-divider
                v-card-text(style="height: calc(100% - 50px)")
                    div.h-100(v-if="route.type == 'projects' && !route.id")
                        div.d-flex.flex-row
                            v-text-field(
                                v-model="project_search"
                                label="Search Project"
                                style="width: calc(100% - 200px)"
                            )
                            v-select(
                                :items="['Date', 'Title', 'Rank']"
                                v-model="project_sort"
                                label="Sort"
                            )
                        div.d-flex.flex-wrap(style="overflow-y: scroll; height: calc(100% - 60px)")
                            v-card.ma-1.project-card(
                                color="light-grey"
                                v-ripple
                                v-for="project in sorted_projects"
                                :key="project.id"
                                :style="{'width': $vuetify.display.mdAndUp ? 'calc(50% - 8px)' : '100%'}"
                                @click="openProject(project.id)"
                            )
                                v-card-title {{project.title}}
                                v-card-text
                                    v-row(no-gutters)
                                        v-col(v-if="project.images && project.images.length > 0 && project.images[0]", cols="auto", style="min-width: 92px;")
                                            img(
                                                :src="getProjectImageUrl(project.id, project.images[0])"
                                                :alt="project.title + ' thumbnail'"
                                                style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px; margin-right: 12px;"
                                            )
                                        v-col
                                            div(style="font-size: 0.9em;") {{ getTruncatedDescription(project.description) }}
                    div.h-100(
                        v-if="route.type == 'projects' && route.id"
                        :set="project = getProjectFromId(route.id)"
                        style="overflow-y: auto;"
                    )
                        div.d-flex.flex-row.align-center.mb-2
                            h2.text-grey.mr-2 \#{{project.rank}}
                            h2 {{ project.title }}
                            v-spacer
                            v-btn(v-if="project.url" :href="project.url" target="_blank" icon variant="text" density="compact")
                                v-icon(icon="mdi-open-in-new")
                            v-btn(v-if="project.github" :href="project.github" target="_blank" icon variant="text" density="compact")
                                v-icon(icon="mdi-github")
                        
                        p.text-caption.text-grey-darken-1 {{ getPrettyDate(project.date) }} | Status: {{ project.status }}

                        div.mt-2(v-if="project.team && project.team.length > 0")
                            strong Team:
                            span {{ project.team.join(', ') }}
                        
                        div.mt-2(v-if="project.tags && project.tags.length > 0")
                            strong Tags:
                            v-chip.ma-1(v-for="tag in project.tags" :key="tag" small density="compact") {{ tag }}
                        
                        div.mt-2(v-if="project.technologies && project.technologies.length > 0")
                            strong Technologies:
                            v-chip.ma-1(v-for="tech in project.technologies" :key="tech" small density="compact") {{ tech }}

                        div.mt-3(v-html="processProjectContent(project.description, project.id)")
                        
                        div.mt-3(v-if="project.long_description" v-html="processProjectContent(project.long_description, project.id)")

                        div.mt-4(v-if="project.images && project.images.length > 0")
                            h3.mb-2 Images:
                            div.d-flex.flex-wrap.ga-2
                                img.ma-1(
                                    v-for="imageName in project.images"
                                    :key="imageName"
                                    :src="getProjectImageUrl(project.id, imageName)"
                                    :alt="project.title + ' - ' + imageName"
                                    style="max-width: 200px; max-height: 150px; height: auto; border-radius: 4px; object-fit: cover; border: 1px solid #eee; cursor: pointer;"
                                    @click="openImageDialog(getProjectImageUrl(project.id, imageName), project.title + ' - ' + imageName)"
                                )
                        
                        div.mt-4(v-if="project.pdfs && project.pdfs.length > 0")
                            h3.mb-2 Associated Files:
                            div.d-flex.flex-wrap.ga-2
                                v-card.pa-2.ma-1(
                                    v-for="pdfName in project.pdfs"
                                    :key="pdfName"
                                    link
                                    :href="getProjectPdfUrl(project.id, pdfName)"
                                    target="_blank"
                                    style="min-width: 150px; text-decoration: none;"
                                    hover
                                )
                                    v-row(align="center" no-gutters)
                                        v-col(cols="auto")
                                            v-icon.mr-2(icon="mdi-file-pdf-box" size="large" color="red-darken-2")
                                        v-col
                                            div(style="font-size: 0.9em; word-break: break-all;") {{ pdfName }}

    v-dialog(
        v-model="imageDialogVisible"
        transition="dialog-bottom-transition"
        overlay-opacity="0.7"
        max-width="90vw"
        width="auto"
    )
        v-card(v-if="dialogContentType === 'image'" style="display: flex; flex-direction: column; max-height: 90vh;")
            v-toolbar(
                dark
                color="primary"
                density="compact"
            )
                v-toolbar-title {{ dialogContentType === 'polaroid' ? 'Polaroid' : selectedImageAlt }}
                v-spacer
                v-btn(
                    icon
                    dark
                    @click="imageDialogVisible = false"
                )
                    v-icon mdi-close
            v-card-text.d-flex.justify-center.align-center.flex-grow-1(
                style="overflow: auto; background-color: #212121;"
            )
                div()
                    v-img(
                        :src="selectedImageUrl"
                        :alt="selectedImageAlt"
                        contain
                        style="max-height: 100%; max-width: 100%;"
                    )
        div(v-else-if="dialogContentType === 'polaroid'" style="height:  min(1000px, 80vh);width: min(800px, 90vw);")
            PolaroidPhoto(
                v-if="selectedPolaroidData"
                :image="selectedPolaroidData.image"
                :date="selectedPolaroidData.date"
                
            )

</template>

<script>
import NameSection from '@/components/home_page/name_section/NameSection.vue';
import WoodTextureBackground from '@/components/home_page/background/WoodTextureBackground.vue';
import { PowerGlitch } from 'powerglitch'
// Adjust path as needed
import HomeGrid from '@/components/home_page/layout/HomeGrid.vue';
import ProjectsSection from '@/components/home_page/projects_section/ProjectsSection.vue';
import PhotosSection from '@/components/home_page/photos_section/PhotosSection.vue';
import MediaSection from '@/components/home_page/media_section/MediaSection.vue';
import LinksSection from '@/components/home_page/links_section/LinksSection.vue';
import { v4 as uuidv4 } from 'uuid';
import { getUniqueIntegers, extractDateFromFilename } from '../helpers';
import projectsData from '../assets/projects.json';
import { marked } from 'marked';


export default {
    name: 'TestView',
    components: {
        NameSection,
        WoodTextureBackground,
        HomeGrid,
        ProjectsSection,
        PhotosSection,
        MediaSection,
        LinksSection
    },
    setup(){

        return {
            PowerGlitch
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
            return this.route_history.map(e => {
                const route_data = this.getRouteData(e)
                var rich_route_data = {}
                rich_route_data.is_item_page = ![undefined, ''].includes(route_data.id)
                rich_route_data.type = route_data.type
                rich_route_data.id = route_data.id

                rich_route_data.title = {
                    "projects": rich_route_data.id ? 'Project' : 'Projects'
                }[route_data.type]
                
                return rich_route_data

            })
        },
        sorted_projects(){
            if (!this.projects || this.projects.length === 0) {
                return [];
            }
            const sort_method = {
                "Date": (a,b) => a.date.getTime() - b.date.getTime(),
                "Title": (a,b) => a.title > b.title ? 1 : -1,
                "Rank": (a,b) => a.rank - b.rank,
            }[this.project_sort]

            return this.projects.filter(e => e.title.toLowerCase().includes(this.project_search.toLowerCase())).sort((a,b) => sort_method(a,b))
        },
        homegrid_height(){
            this.update_homegrid-=1
            const el = document.getElementById('home-grid')
            console.log(el)
            if (el){
                return el.clientHeight + 'px'
            }
            return '100vh'
        }
        
    },
    methods: {
        openPolaroidDialog(polaroidData) {
            this.selectedPolaroidData = polaroidData;
            this.selectedImageUrl = polaroidData.image;
            this.selectedImageAlt = polaroidData.date ? `Polaroid from ${polaroidData.date}` : 'Polaroid Photo';
            this.dialogContentType = 'polaroid';
            this.imageDialogVisible = true;
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
            this.route_history.push(this.routeDataToUrl('projects', id));
        },
        overlayGoBack(){
            this.overlay_type = {
                "projects": "",
                "project": this.overlay_came_from,
            }[this.overlay_type]
            this.overlay_came_from = ""
        },
        getRouteData(route){
            var route_data = {
                type: '',
                id: '',
            }
            const route_array = route.split('/')
            if (route_array[1] == 'projects') {
                route_data.type = 'projects';
                if (route_array.length > 2) {
                    route_data.id = route_array[2]
                };
            } else {
                return false
            }

            return route_data
        },
        routeDataToUrl(type, id){
            var route_type_name = ''
            if (type == 'projects') {
                route_type_name = 'projects';
            }

            return '/' + route_type_name + (id ? '/' + id : '')
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
            this.selectedImageUrl = imageUrl;
            this.selectedImageAlt = altText;
            this.selectedPolaroidData = null;
            this.dialogContentType = 'image';
            this.imageDialogVisible = true;
        },

        getPrettyDate(date){
            const options = {
                day: 'numeric',
                month: 'short',
                year: '2-digit',
            };

            return date.toLocaleDateString('en-US', options);
        },
        getProjectImageUrl(projectId, imageFilename) {
            if (!projectId || !imageFilename) {
                // console.warn('Missing projectId or imageFilename for getProjectImageUrl');
                return '';
                // Return empty or a placeholder image URL
            }
            try {
                // Path relative from src/views/HomeView.vue to src/assets/projects/
                return new URL(`../assets/projects/${projectId}/${imageFilename}`, import.meta.url).href;
            } catch (e) {
                console.error(`Error creating image URL for project '${projectId}', image '${imageFilename}':`, e);
                return '';
                // Return empty or a placeholder image URL
            }
        },
        getProjectPdfUrl(projectId, pdfFilename) {
            if (!projectId || !pdfFilename) {
                return '';
            }
            try {
                return new URL(`../assets/projects/${projectId}/${pdfFilename}`, import.meta.url).href;
            } catch (e) {
                console.error(`Error creating PDF URL for project '${projectId}', PDF '${pdfFilename}':`, e);
                return '';
            }
        },
        getTruncatedDescription(description, maxLength = 120) {
            if (!description || typeof description !== 'string') return '';
            // Basic stripping of markdown for length calculation and display
            let plainText = description
                .replace(/\{\{.*?\}\}/g, '')
                // Remove image placeholders
                .replace(/\[(.*?)\]\(.*?\)/g, '$1')
                // Replace links with their text
                .replace(/[*_`~#\-+\.\!]/g, '');
                // Remove other markdown chars, list markers

            plainText = plainText.replace(/\s+/g, ' ').trim();
            // Normalize whitespace

            if (plainText.length <= maxLength) {
                return plainText;
            }
            let truncated = plainText.substring(0, maxLength);
            // Try to end on a word
            const lastSpace = truncated.lastIndexOf(' ');
            if (lastSpace > 0) {
                truncated = truncated.substring(0, lastSpace);
            }
            return truncated + '...';
        },
        processProjectContent(content, projectId) {
            if (!content || typeof content !== 'string') return '';
            
            let htmlContent = '';
            try {
                // Configure marked to add classes or use a renderer if needed for more complex styling
                htmlContent = marked(content);
            } catch (e) {
                console.error('Error parsing markdown:', e);
                // Fallback content
                htmlContent = `<p>Error rendering content.</p>`;
            }

            // Replace {{image_name.ext}} placeholders
            return htmlContent.replace(/\{\{(.*?)\}\}/g, (match, imageNameWithExt) => {
                const imageName = imageNameWithExt.trim();
                if (!imageName) return match;

                try {
                    const imageUrl = this.getProjectImageUrl(projectId, imageName);
                    // Image '${imageName}' could not be resolved
                    if (!imageUrl) return `<!-- Image '${imageName}' could not be resolved -->`;
                    
                    const altText = imageName.substring(0, imageName.lastIndexOf('.')).replace(/[_-]/g, ' ');
                    return `<img src="${imageUrl}" alt="${altText}" style="max-width: 100%; height: auto; display: block; margin: 10px auto; border-radius: 8px; border: 1px solid #ddd;">`;
                } catch (e) {
                    // This catch might be redundant if getProjectImageUrl handles its own errors
                    console.error(`Error processing image placeholder for project ${projectId}: ${imageName}`, e);
                    // Error processing image '${imageName}'
                    return `<!-- Error processing image '${imageName}' -->`;
                }
            });
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
            const new_url = this.routeDataToUrl(route_data.type, route_data.id)
            this.route_history.push(new_url)
        } else {
            this.route_history = []
        }


        // ResizeObserver for projects_container removed, handled in ProjectsSection.vue
        
        // Fetch all data first
        await Promise.all([]);

        // shown_projects update after projects load removed, handled in ProjectsSection.vue via watcher

        this.update_homegrid++
        console.log(this.homegrid_height)

    },
};
</script>

<style scoped>
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
    100%
     {background-image: unset;
        color: white;
        background-clip: unset;
    }
}

.project-card {
    transition: all 0.3s;

}
.project-card:hover{
    transform: scale(1.02);
    -webkit-box-shadow: 7px 8px 18px 4px rgba(0,0,0,0.48);
    -moz-box-shadow: 7px 8px 18px 4px rgba(0,0,0,0.48);
    box-shadow: 7px 8px 18px 4px rgba(0,0,0,0.48);
    z-index: 3
}
.post-it {

    /* Fixed height */
    max-height: 200px;
    max-width: 200px;
    font-size: clamp(0.8rem, 0.5vw, 2rem);
    /* Added padding for content */
    padding: 10px;
    /* Hide overflowing content */
    overflow: hidden;
    /* Using flex to help with content alignment */
    display: flex;
    /* Stack title and description vertically */
    flex-direction: column;
    

}
.truncate-multi-line {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;

}

.post-it h2 {
    /* Space between title and description */
    margin-bottom: 5px;
    /* Prevent title from shrinking */
    flex-shrink: 0;
}

/* Target the div rendering markdown */
.post-it div[v-html] {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    line-clamp: 6;
    /* Adjust number of lines visible */
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical;
    /* Allow description to take available space */
    flex-grow: 1;
    /* Adjust line height for better fit */
    line-height: 1.2em;
    /* Fallback for non-webkit browsers, matches line-clamp */
    max-height: calc(1.2em * 6);
}

:deep(ol) {
  margin-left: 20px !important;
}

:deep(ul) {
  margin-left: 20px !important;
}
</style>