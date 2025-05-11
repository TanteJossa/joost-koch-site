<template lang="pug">
    div.w-100(style="position: relative; ")
        
        WoodTexture(style="position:absolute; pointer-events: all;" ref="woodTexture" :canvasHeight="homegrid_height")
        div.w-100#home-grid(
            style="position: absolute; min-height: 100vh"
            @mousemove="woodMouseMove"
        )   
            HomeGrid
                template(#name)
                    div.h-100.d-flex.align-center.justify-center(style="text-align: center;")

                        h1(
                            style="font-size: calc(min(100vw, 600px) / 5); display: inline-block;"
                            @click="is_moving_wood = !is_moving_wood"
                        )
                            | J
                            Eyes
                            | st K{{is_moving_wood ? '●' : 'o' }}ch
                template(#div1)

                    div.ml-6.mt-9(
                        :style="{'transform': 'rotate('+(projects_text_rotation)+'deg)', 'display': 'inline-block'}"

                    )
                        div(style="font-family: 'CreamyChalk'; font-size: calc(min(100vw, 600px) / 10)")
                            MulticoloredText(
                                text="Projecten"
                                is_clickable
                                @click="openProjects"
                            )



                    div.ml-3.d-flex.flex-row#projects(ref="projects" @resize="shown_projects = shownProjects()")
                        PostIt.ml-3.post-it(
                            v-for="(project, index) in shown_projects"
                            @mouseover="project_hover_index = index"
                            @mouseleave="project_hover_index = -1"
                            is_clickable
                            @click="openProject(project.id)"
                            :style="{'z-index': project_hover_index == index ? '10 !important' : 0}"
                        )
                            h2 {{project.title}}
                            div.truncate-multi-line(v-html="processProjectContent(project.description, project.id)")
                template(#div2 )
                    div.w-100.h-100(style="position: relative;")

                        div.w-100.d-flex.flex-wrap#photo-container(
                            style="position: absolute; top: 0; left: 0; "
                        )
                            PolaroidPhoto(
                                v-for="(image, index) in shown_images"
                                @mouseover="image_hover_index = index"
                                @mouseleave="image_hover_index = -1"
                                :style="{'transform': 'rotate('+image.rotation+'deg)', 'max-width': '250px', 'max-height': 'calc('+(250) + 'px' + (index < 2 ? ' - 50px)' : ')'), top:  'calc('+( image.top ) + '%' + (index < 2 ? ' +  90px)' : ')'), position: 'absolute', left: index * (90) / shown_images.length  + '%', 'z-index': image_hover_index == index ? '10 !important' : image.z_index}"
                                :image="image.imageUrl"
                                :date="image.date ? image.date : undefined"
                            )
                        div.ml-6(
                            :style="{'transform': 'rotate('+(images_text_rotation)+'deg)', 'display': 'inline-block', 'position': 'absolute'}"

                        )
                            div(style="font-family: 'CreamyChalk'; font-size: calc(min(100vw, 600px) / 10)")
                                MulticoloredText(
                                    text="Foto's"
                                    is_clickable
                                    @click="loadRandomImages()"
                                )
                template(#div3)
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
                template(#div4)
                    div.pl-6
                        div.ml-3(style="font-family: 'CreamyChalk'; font-size: calc(min(100vw, 600px) / 10)")
                            MulticoloredText(
                                text="Links"
                            )
                        //- div.ma-2(style="height: 80px; overflow-y: hidden; border-radius: 13px")
                            iframe(
                                style="border-radius:12px", 
                                src="https://open.spotify.com/embed/track/7qGoMOzR9pJ1bPl4bFmTN7?utm_source=generator", 
                                width="100%", height="120px", 
                                frameborder="0", 
                                allowfullscreen, 
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture", 
                                loading="lazy"
                            )         
      
                        div.ma-2.mb-0(style="overflow-y: hidden; border-radius: 13px")
                            iframe(
                                style="border-radius:12px", 
                                src="https://open.spotify.com/embed/playlist/5C43gmwC8gamonutCtNTn5?utm_source=generator", 
                                width="100%", 
                                height="152", 
                                frameborder="0", 
                                allowfullscreen, 
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture", 
                                loading="lazy"
                            )

                        div.mb-3.ml-3.d-flex.justify-start.flex-wrap
                        
                            v-icon.hover-shadow(
                                style="font-size: 50px"
                                icon="mdi-github"
                                @click="open('https://github.com/TanteJossa')"
                            )
                            v-icon.ml-2.hover-shadow(
                                style="font-size: 50px"
                                icon="mdi-instagram"
                                @click="open('https://www.instagram.com/joostkoch/')"
                            )
                            v-icon.ml-2.hover-shadow(
                                style="font-size: 50px"
                                icon="mdi-linkedin"
                                @click="open('https://www.linkedin.com/in/joost-koch-a299aa269/')"
                            )
                            v-icon.ml-2.hover-shadow(
                                style="font-size: 50px"
                                icon="mdi-spotify"
                                @click="open('https://open.spotify.com/user/q1v0gsdavetx3m2k1jm472nhx?si=5d330fcfbc3046e6')"
                            )
                            v-img.ml-2.hover-shadow(
                                style="font-size: 50px; max-width: 40px; height: 50px; color: white"
                                src="@/assets/Bluesky_Logo.svg"
                                @click="open('https://bsky.app/profile/joost-koch.nl')"
                            )
                            v-icon.ml-2.hover-shadow(
                                style="font-size: 50px"
                                icon="mdi-twitter"
                                @click="open('https://x.com/TanteJossa')"
                            )
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
        v-card(style="display: flex; flex-direction: column; max-height: 90vh;")
            v-toolbar(
                dark
                color="primary"
                density="compact"
            )
                v-toolbar-title {{ selectedImageAlt }}
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
                v-img(
                    :src="selectedImageUrl"
                    :alt="selectedImageAlt"
                    contain
                    style="max-height: 100%; max-width: 100%;"
                )

</template>

<script>
import Eyes from '@/components/Eyes.vue';
import WoodTexture from '@/components/WoodTexture.vue';
import { PowerGlitch } from 'powerglitch'
import PostIt from '@/components/PostIt.vue'; // Adjust path as needed
import MulticoloredText from '@/components/MulticoloredText.vue';
import HomeGrid from '@/components/HomeGrid.vue';
import { v4 as uuidv4 } from 'uuid';
import { getUniqueIntegers, extractDateFromFilename } from '../helpers';
import PolaroidPhoto from '@/components/PolaroidPhoto.vue';
import projectsData from '../assets/projects.json';
import { marked } from 'marked';


export default {
    name: 'TestView',
    components: {
        Eyes,
        WoodTexture,
        PostIt,
        MulticoloredText,
        HomeGrid,
        PolaroidPhoto
    },
    setup(){

        return {
            PowerGlitch
        }
    },
    data() {
        return {
            update_homegrid: 0,
            is_moving_wood: false,
            project_hover_index: -1,
            shown_projects: [],
            route_history: [],
            
            projects: [], // Initialize projects as an empty array

            project_search: "",
            project_sort: "Rank",

            images: [],
            image_hover_index:-1,
            images_text_rotation: (Math.random() * 15 - 7.5) * 0,
            projects_text_rotation: (Math.random() * 15 - 7.5) * 0,
            media_text_rotation: (Math.random() * 10 - 5) * 0,

            media_type: Math.random() > 0.5 ? 'series' : 'movies',

            media_is_sorted: false,
            series: [],
            movies: [],
            loading_media: false,


            imageDialogVisible: false,
            selectedImageUrl: null,
            selectedImageAlt: '',

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
        shown_images(){
            const container = document.getElementById('photo-container')
            if (!container){
                return this.images
            }
            return this.images.slice(0, Math.round(container.clientWidth / 220))
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
        woodMouseMove(event){
            const component = this.$refs.woodTexture;
            if (!component) return;
            if (this.is_moving_wood){
                
            component.$el.dispatchEvent(new MouseEvent("mousemove" ,event))
            }

        },
        shownProjects(){
            if (!this.projects || this.projects.length === 0) {
                return [];
            }
            const projects_container = this.$refs.projects;
            if (!projects_container) {
                return [];
            }
            const box = projects_container.getBoundingClientRect();
            return this.projects.slice(0, Math.floor(box.width / 220) * (this.$vuetify.display.lgAndUp ? 2 : 1));
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
                return; // Nothing to go back to
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


        openProjects(){
            this.route_history.push(this.routeDataToUrl('projects'))
        },
        openProject(id){
            this.route_history.push(this.routeDataToUrl('projects', id))
        },
        getProjectFromId(id){
            if (!this.projects || this.projects.length === 0) {
                return {};
            }
            return this.projects.find(e => e.id == id) || {}
        },


        openImageDialog(imageUrl, altText) {
            this.selectedImageUrl = imageUrl;
            this.selectedImageAlt = altText;
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
                return ''; // Return empty or a placeholder image URL
            }
            try {
                // Path relative from src/views/HomeView.vue to src/assets/projects/
                return new URL(`../assets/projects/${projectId}/${imageFilename}`, import.meta.url).href;
            } catch (e) {
                console.error(`Error creating image URL for project '${projectId}', image '${imageFilename}':`, e);
                return ''; // Return empty or a placeholder image URL
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
                .replace(/\{\{.*?\}\}/g, '') // Remove image placeholders
                .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Replace links with their text
                .replace(/[*_`~#\-+\.\!]/g, ''); // Remove other markdown chars, list markers

            plainText = plainText.replace(/\s+/g, ' ').trim(); // Normalize whitespace

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
        open(url){
            window.open(url, '_blank')
        },
        processProjectContent(content, projectId) {
            if (!content || typeof content !== 'string') return '';
            
            let htmlContent = '';
            try {
                // Configure marked to add classes or use a renderer if needed for more complex styling
                htmlContent = marked(content);
            } catch (e) {
                console.error('Error parsing markdown:', e);
                htmlContent = `<p>Error rendering content.</p>`; // Fallback content
            }

            // Replace {{image_name.ext}} placeholders
            return htmlContent.replace(/\{\{(.*?)\}\}/g, (match, imageNameWithExt) => {
                const imageName = imageNameWithExt.trim();
                if (!imageName) return match;

                try {
                    const imageUrl = this.getProjectImageUrl(projectId, imageName);
                    if (!imageUrl) return `<!-- Image '${imageName}' could not be resolved -->`;
                    
                    const altText = imageName.substring(0, imageName.lastIndexOf('.')).replace(/[_-]/g, ' ');
                    return `<img src="${imageUrl}" alt="${altText}" style="max-width: 100%; height: auto; display: block; margin: 10px auto; border-radius: 8px; border: 1px solid #ddd;">`;
                } catch (e) {
                    // This catch might be redundant if getProjectImageUrl handles its own errors
                    console.error(`Error processing image placeholder for project ${projectId}: ${imageName}`, e);
                    return `<!-- Error processing image '${imageName}' -->`;
                }
            });
        },
        async loadRandomImages(){
            const ids = getUniqueIntegers(5, 1, 62);
            const imageModules = import.meta.glob('@/assets/luft/*.png', {as: 'url', eager: true });
            const imageList = Object.entries(imageModules).map(([path]) => ({
                filename: path.split('/').pop(),
                url: imageModules[path], // Directly use the URL
            }));
            console.log(imageList)
            this.images = []
            await Promise.all(
                ids.map(async (index) => {
                    if (index >= imageList.length){
                        return null
                    }
                    const { filename, url } = imageList[index];

                    try {
                        // const module = await import(/* @vite-ignore */ `${url}`);
                        // const imageUrl = module.default;

                        // Extract date from filename (IMG_YYYYMMDD_...)
                        const dateMatch = filename.match(/IMG_(\d{8})_/);
                        let dateObj = null;
                        if (dateMatch) {
                            const dateString = dateMatch[1];
                            const year = parseInt(dateString.slice(0, 4));
                            const month = parseInt(dateString.slice(4, 6)) - 1; // Month is 0-indexed
                            const day = parseInt(dateString.slice(6, 8));
                            dateObj = new Date(year, month, day);
                        }

                        this.images.push({
                            imageUrl: url,
                            date: dateObj,
                            top: Math.random() * 20,
                            rotation: (40*Math.random() - 20),
                            z_index: Math.round(Math.random() * 10).toString()
                        })
                    } catch (error) {
                        console.error(`Error loading image ${filename}:`, error);
                        return null;
                    }
                })
            );
            console.log(this.images)
        },
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


        const projects_container = this.$refs.projects;
        if (projects_container) {
            const observer = new ResizeObserver(() => {
                this.shown_projects = this.shownProjects();

                this.update_homegrid = true
            });
            observer.observe(projects_container);
        }
        
        // Fetch all data first
        await Promise.all([/*this.fetchProjects() removed*/ this.loadRandomImages(), this.loadMedia()]);

        // Now that projects are loaded, update shown_projects
        this.shown_projects = this.shownProjects();

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

    height: 200px; /* Fixed height */
    width: 200px;
    font-size: clamp(0.8rem, 0.5vw, 2rem);
    padding: 10px; /* Added padding for content */
    overflow: hidden; /* Hide overflowing content */
    display: flex; /* Using flex to help with content alignment */
    flex-direction: column; /* Stack title and description vertically */
    

}
.truncate-multi-line {
    overflow: hidden;         
    text-overflow: ellipsis;  
    display: -webkit-box;     
    line-clamp: 3;
    -webkit-line-clamp: 3;    
    -webkit-box-orient: vertical;

}

.post-it h2 {
    margin-bottom: 5px; /* Space between title and description */
    flex-shrink: 0; /* Prevent title from shrinking */
}

.post-it div[v-html] { /* Target the div rendering markdown */
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    line-clamp: 6;
    -webkit-line-clamp: 6; /* Adjust number of lines visible */
    -webkit-box-orient: vertical;
    flex-grow: 1; /* Allow description to take available space */
    line-height: 1.2em; /* Adjust line height for better fit */
    max-height: calc(1.2em * 6); /* Fallback for non-webkit browsers, matches line-clamp */
}

:deep(ol) {
  margin-left: 20px !important;
}

:deep(ul) {
  margin-left: 20px !important;
}
</style>