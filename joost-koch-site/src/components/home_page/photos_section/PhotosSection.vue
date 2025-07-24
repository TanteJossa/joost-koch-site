<template lang="pug">
div.w-100(style="position: relative; min-height: 350px")
    div.w-100.d-flex.flex-wrap#photo-container(
        style="position: absolute; top: 0; left: 0; "
    )
        PolaroidPhoto(
            v-for="(image, index) in shown_images"
            :key="image.id"
            @mouseover="image_hover_index = index"
            @mouseleave="image_hover_index = -1"
            @polaroid-click="handlePolaroidClick"
            :style="{'transform': 'rotate('+image.rotation+'deg)', 'max-width': '250px', 'height': 'calc('+(250) + 'px' + (index < 2 ? ' - 50px)' : ')'), top:  'calc('+( image.top ) + '%' + (index < 2 ? ' +  90px)' : ')'), position: 'absolute', left: index * (90) / shown_images.length  + '%', 'z-index': image_hover_index == index ? '10 !important' : image.z_index}"
            :image="image.thumbnail_url"
            :full_res_image="image.full_res_url"
        )
    div.ml-6(
        :style="{'transform': 'rotate('+(images_text_rotation)+'deg)', 'display': 'inline-block', 'position': 'absolute'}"
    )
        div(style="font-family: 'CreamyChalk'; font-size: calc(min(100vw, 600px) / 10)")
            MulticoloredText(
                text="Foto's"
                is_clickable
                @click="displayRandomImages()"
            )
</template>

<script>
import MulticoloredText from '@/components/ui/elements/MulticoloredText.vue';
import PolaroidPhoto from '@/components/ui/media/PolaroidPhoto.vue';
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
            all_images: [],
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
       displayRandomImages() {
           if (this.all_images.length === 0) return;

           // Shuffle all_images and pick the first 5
           const shuffled = this.all_images.sort(() => 0.5 - Math.random());
           const selected = shuffled.slice(0, 5);

           this.images = selected.map(image => ({
               ...image,
               // Re-randomize position and rotation for each view
               top: Math.random() * 20,
               rotation: (40 * Math.random() - 20),
               z_index: Math.round(Math.random() * 10).toString()
           }));
       },
       async fetchAllImages() {
          try {
              const albumUrl = 'https://photos.app.goo.gl/aKcKBqgmSJwcQraN9';
              const apiUrl = `https://luft-photo-requester-234817865209.europe-west4.run.app/get_google_photos_api?url=${encodeURIComponent(albumUrl)}`;
              const response = await fetch(apiUrl);

              if (!response.ok) {
                  throw new Error(`API request failed with status ${response.status}`);
              }

              const photoData = await response.json();

             this.all_images = photoData.map(image => {
                 const thumbWidth = 250;
                 const thumbHeight = Math.round(thumbWidth / image.aspect_ratio);

                 // Get viewport dimensions
                 const viewWidth = window.innerWidth * 0.9; // 90% of viewport width
                 const viewHeight = window.innerHeight * 0.9; // 90% of viewport height

                 // Calculate the best fit for the screen
                 let newWidth, newHeight;
                 if ((viewWidth / viewHeight) > image.aspect_ratio) {
                     // Viewport is wider than the image, so height is the limiting factor
                     newHeight = Math.min(image.max_height, viewHeight);
                     newWidth = Math.round(newHeight * image.aspect_ratio);
                 } else {
                     // Viewport is taller than the image, so width is the limiting factor
                     newWidth = Math.min(image.max_width, viewWidth);
                     newHeight = Math.round(newWidth / image.aspect_ratio);
                 }

                 // Cap at 4K resolution
                 const maxDim = 4096;
                 if (newWidth > maxDim || newHeight > maxDim) {
                     if (image.aspect_ratio >= 1) {
                         newWidth = maxDim;
                         newHeight = Math.round(newWidth / image.aspect_ratio);
                     } else {
                         newHeight = maxDim;
                         newWidth = Math.round(newHeight * image.aspect_ratio);
                     }
                 }

                 const fullResUrl = `${image.base_url}=w${Math.round(newWidth)}-h${Math.round(newHeight)}`;

                 return {
                     ...image,
                     thumbnail_url: `${image.base_url}=w${thumbWidth}-h${thumbHeight}`,
                     full_res_url: fullResUrl,
                 };
             });

              this.displayRandomImages(); // Display initial set

          } catch (error) {
              console.error('Failed to load images from Google Photos API:', error);
          }
      },
    },
    mounted() {
        this.fetchAllImages();
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
