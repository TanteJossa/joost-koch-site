<template lang="pug">
div.w-100(style="position: relative; min-height: 350px")
    div.w-100.d-flex.flex-wrap#photo-container(
        style="position: absolute; top: 0; left: 0; "
    )
        PolaroidPhoto(
            v-for="(image, index) in shown_images"
            :key="image.imageUrl"
            @mouseover="image_hover_index = index"
            @mouseleave="image_hover_index = -1"
            @polaroid-click="handlePolaroidClick"
            :style="{'transform': 'rotate('+image.rotation+'deg)', 'max-width': '250px', 'height': 'calc('+(250) + 'px' + (index < 2 ? ' - 50px)' : ')'), top:  'calc('+( image.top ) + '%' + (index < 2 ? ' +  90px)' : ')'), position: 'absolute', left: index * (90) / shown_images.length  + '%', 'z-index': image_hover_index == index ? '10 !important' : image.z_index}"
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
</template>

<script>
import MulticoloredText from '@/components/ui/elements/MulticoloredText.vue';
import PolaroidPhoto from '@/components/ui/media/PolaroidPhoto.vue';
import { getUniqueIntegers } from '../../../helpers';

export default {
    name: 'PhotosSection',
    components: {
        MulticoloredText,
        PolaroidPhoto,
    },
    emits: ['show-polaroid-dialog'],
    data() {
        return {
            images: [],
            image_hover_index: -1,
            images_text_rotation: (Math.random() * 15 - 7.5) * 0,
        };
    },
    computed: {
        shown_images() {
            const container = document.getElementById('photo-container');
            if (!container) {
                return this.images;
            }
            // Ensure division by zero is handled if images.length is 0, though slice handles it.
            if (this.images.length === 0) {
                return [];
            }
            return this.images.slice(0, Math.round(container.clientWidth / 220));
        },
    },
    methods: {
        handlePolaroidClick(polaroidData) {
            this.$emit('show-polaroid-dialog', polaroidData);
        },
        async loadRandomImages() {
            const ids = getUniqueIntegers(5, 1, 62);
            const imageModules = import.meta.glob('@/assets/luft/*.png', { query: '?url', import: 'default', eager: true });
            const imageList = Object.entries(imageModules).map(([path]) => ({
                filename: path.split('/').pop(),
                // Directly use the URL
                url: imageModules[path],
            }));
            this.images = [];
            await Promise.all(
                ids.map(async (index) => {
                    if (index >= imageList.length) {
                        return null;
                    }
                    const { filename, url } = imageList[index];

                    try {

                        // Extract date from filename (IMG_YYYYMMDD_...)
                        const dateMatch = filename.match(/IMG_(\d{8})_/);
                        let dateObj = null;
                        if (dateMatch) {
                            const dateString = dateMatch[1];
                            const year = parseInt(dateString.slice(0, 4));
                            // Month is 0-indexed
                            const month = parseInt(dateString.slice(4, 6)) - 1;
                            const day = parseInt(dateString.slice(6, 8));
                            dateObj = new Date(year, month, day);
                        }

                        this.images.push({
                            imageUrl: url,
                            date: dateObj,
                            top: Math.random() * 20,
                            rotation: (40 * Math.random() - 20),
                            z_index: Math.round(Math.random() * 10).toString()
                        });
                    } catch (error) {
                        console.error(`Error loading image ${filename}:`, error);
                        return null;
                    }
                })
            );
        },
    },
    mounted() {
        this.loadRandomImages();
    },
};
</script>

<style scoped>
/* Add any specific styles for PhotosSection if needed */
/* For example, ensuring the container has a minimum height or specific layout */
.w-100 {
    width: 100%;
}
.d-flex {
    display: flex;
}
.flex-wrap {
    flex-wrap: wrap;
}
.ml-6 {
    margin-left: 2.25rem;
    /* Approximation for Vuetify ml-6, adjust if precise value is known */
}
/* Styles for PolaroidPhoto and MulticoloredText are in their respective components */
</style>