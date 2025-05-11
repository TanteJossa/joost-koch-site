<template lang="pug">
div.pl-6
    div.ml-3.links-title-text
        MulticoloredText(
            text="Links"
        )

    div.ma-2.mb-0.spotify-embed-container
        iframe.spotify-iframe(
            src="https://open.spotify.com/embed/playlist/5C43gmwC8gamonutCtNTn5?utm_source=generator",
            width="100%",
            height="152", 
            frameborder="0", 
            allowfullscreen, 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture", 
            loading="lazy"
        )

    div.mb-3.ml-3.d-flex.justify-start.flex-wrap
    
        v-icon.hover-shadow.social-icon(
            icon="mdi-github"
            @click="open('https://github.com/TanteJossa')"
        )
        v-icon.ml-2.hover-shadow.social-icon(
            icon="mdi-instagram"
            @click="open('https://www.instagram.com/joostkoch/')"
        )
        v-icon.ml-2.hover-shadow.social-icon(
            icon="mdi-linkedin"
            @click="open('https://www.linkedin.com/in/joost-koch-a299aa269/')"
        )
        v-icon.ml-2.hover-shadow.social-icon(
            icon="mdi-spotify"
            @click="open('https://open.spotify.com/user/q1v0gsdavetx3m2k1jm472nhx?si=5d330fcfbc3046e6')"
        )
        v-img.ml-2.hover-shadow.social-icon-img(
            src="@/assets/Bluesky_Logo.svg"
            @click="open('https://bsky.app/profile/joost-koch.nl')"
        )
        v-icon.ml-2.hover-shadow.social-icon(
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
.links-title-text {
  font-family: 'CreamyChalk';
  font-size: calc(min(100vw, 600px) / 10);
}

.spotify-embed-container {
  overflow-y: hidden;
  border-radius: 13px;
}

.spotify-iframe {
  border-radius: 12px;
}

.social-icon {
  font-size: 50px;
}

.social-icon-img {
  font-size: 50px; /* May not have an effect due to explicit width/height */
  max-width: 40px;
  height: 50px;
  color: white; /* Ensures SVG is white if it doesn't have its own fill */
}

.hover-shadow:hover {
    filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.7));
    cursor: pointer;
}
</style>