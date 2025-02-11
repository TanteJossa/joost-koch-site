<template lang="pug">
    div.h-100.w-100(style="position: relative")
        
        WoodTexture.h-100(style="pointer-events: all;" ref="woodTexture")
        div.fill-height.w-100(
            style="position: absolute; top: 0; left: 0; overflow-y: scroll"
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



                    div.ml-3.d-flex.flex-wrap#projects(ref="projects" @resize="shown_projects = shownProjects()")
                        PostIt.ml-3.post-it(
                            v-for="(project, index) in shown_projects"
                            @mouseover="project_hover_index = index"
                            @mouseleave="project_hover_index = -1"
                            is_clickable
                            @click="openProject(project.id)"
                            :style="{'z-index': project_hover_index == index ? '10 !important' : 0}"
                        )
                            h2 {{project.title}}
                            p {{project.description}}
                template(#div2 )
                    div.w-100.h-100(style="position: relative; min-height: calc((100vh - 250px) / 2)")

                        div.w-100.h-100.d-flex.flex-wrap#photo-container(
                            style="position: absolute; top: 0; left: 0; height: 100%"
                        )
                            PolaroidPhoto(
                                v-for="(image, index) in shown_images"
                                @mouseover="image_hover_index = index"
                                @mouseleave="image_hover_index = -1"
                                :style="{'transform': 'rotate('+image.rotation+'deg)', 'max-height': 'calc('+(100 - image.top ) + '%' + (index < 1 ? ' - 30px)' : ')'), top:  'calc('+( image.top ) + '%' + (index < 1 ? ' +  40px)' : ')'), position: 'absolute', left: index * (80) / shown_images.length  + '%', 'z-index': image_hover_index == index ? '10 !important' : image.z_index}"
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
                    div.ml-6.mt-9(
                        :style="{'height': 'calc(100% - 50px)','width':'calc(100% - 50px)','transform': 'rotate('+(media_text_rotation)+'deg)', 'display': 'inline-block'}"

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
                        div.w-100(style="height: calc(100% - 280px); width: calc(100% - 40px); overflow-y: scroll; color: white; font-family: 'CreamyChalk'")
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
                    div.ml-3(style="font-family: 'CreamyChalk'; font-size: calc(min(100vw, 600px) / 10)")
                        MulticoloredText(
                            text="Links"
                        )
                    div.ma-2(style="height: 80px; overflow-y: hidden; border-radius: 13px")
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

                    div.mb-3.ml-3.d-flex.flex-wrap
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
                        img.ml-2.hover-shadow(
                            style="font-size: 50px; width: 50px; height: 50px; color: white"
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
                                    p {{project.description}}
                    div.h-100(
                        v-if="route.type == 'projects' && route.id"
                        :set="project = getProjectFromId(route.id)"
                    )
                        div.d-flex.flex-row
                            h1.text-grey \#{{project.rank + ' '}} 
                            h1 {{ project.title }}
                            v-icon.ml-auto(
                                v-if="project.github && project.github.length > 0"
                                icon="mdi-github"
                                size="xx-large"
                                @click="open(project.github)"
                            )
                            p {{ getPrettyDate(project.date) }}
                        
                        p {{ project.description }}



    
</template>

<script>
import Eyes from '@/components/Eyes.vue';
import WoodTexture from '@/components/WoodTexture.vue';
import { PowerGlitch } from 'powerglitch'
import PostIt from '@/components/PostIt.vue'; // Adjust path as needed
import MulticoloredText from '@/components/MulticoloredText.vue';
import HomeGrid from '@/components/HomeGrid.vue';
import { v4 as uuidv4 } from 'uuid';
import { getUniqueIntegers, extractDateFromFilename } from '@/helpers'
import PolaroidPhoto from '@/components/PolaroidPhoto.vue';


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

            projects: [
                {
                    id: "1",
                    title: "PWS",
                    description: `My profielwerkstuk. A research project for school, where me and my friend made a system to automically scan, sort and grade student answers for a high school test.`,
                    rank: 1,
                    date: new Date(),
                    github: "https://github.com/TanteJossa/PWS-latex/blob/main/PWS-NakijkenMetAi-JoostKoch-JonathanWijker.pdf",
                },
                {
                    id: "2",
                    title: "Site",
                    description: `This VueJs 3 website. The background and more.`,
                    rank: 2,
                    date: new Date(),
                    github: "https://github.com/TanteJossa/joost-koch-site",
                },
                {
                    id: "3",
                    title: "MiBand8 Custom Watchface",
                    description: `mi ;) exploration in creating watch faces for the mi band 8`,
                    rank: 3,
                    date: new Date(),
                    github: "https://github.com/TanteJossa/miband8-watchfaces",
                },
                {
                    id: "4",
                    title: "CirclePhysics",
                    description: `Exploration in continous rigid body calculation in python. Display made with pygame.`,
                    rank: 4,
                    date: new Date(),
                    github: "https://github.com/TanteJossa/circle_physics",
                },
                {
                    id: "5",
                    title: "PygamePhysicsSystem",
                    description: `One of my first projects, a small oop physics system in python pygame`,
                    rank: 5,
                    date: new Date(),
                    github: "https://github.com/TanteJossa/PyGamePhysicsEngine",
                },
                {
                    id: "6",
                    title: "PWS-scan",
                    description: `Research in using AI in scanning tests. Custom papers. Grading API server`,
                    rank: 1.1,
                    date: new Date(),
                    github: "https://github.com/TanteJossa/PWS-inscannen",
                },
            ],
            is_moving_wood: false,
            project_hover_index: -1,
            shown_projects: [],
            route_history: [],
            

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
            loading_media: false


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
            const projects_container = this.$refs.projects
            if (projects_container){
                const box = projects_container.getBoundingClientRect()
                
                return this.projects.slice(0, Math.floor(box.width / 220) * (this.$vuetify.display.lgAndUp ? 2 : 1))
            }

            return this.projects
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
        goBack(){
            this.route_history.splice(this.route_history.length - 1, 1)
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
            return this.projects.find(e => e.id == id) || {}
        },


        getPrettyDate(date){
            const options = {
                day: 'numeric',
                month: 'short',
                year: '2-digit',
            };

            return date.toLocaleDateString('en-US', options);
        },
        open(url){
            window.open(url, '_blank')
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


        const projects_container = this.$refs.projects
        if (projects_container){
            const observer = new ResizeObserver(() => {
                this.shown_projects = this.shownProjects()
            });
            observer.observe(projects_container);
        }
        this.shown_projects = this.shownProjects()
        
        await Promise.all([this.loadRandomImages(), this.loadMedia()])


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
    width: clamp(100px, 50%, 200px);
    aspect-ratio: 1 / 1; 
    font-size: clamp(0.8rem, 0.5vw, 2rem)
}
</style>