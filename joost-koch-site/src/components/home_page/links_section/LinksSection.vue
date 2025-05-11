<template lang="pug">
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
</template>

<script>
import MulticoloredText from '@/components/ui/elements/MulticoloredText.vue';

export default {
    name: 'LinksSection',
    components: {
        MulticoloredText
    },
    methods: {
        open(url) {
            window.open(url, '_blank')
        }
    }
}
</script>

<style scoped>
.hover-shadow:hover {
    filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.7));
    cursor: pointer;
}
</style>