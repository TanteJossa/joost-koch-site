<template lang="pug">

div.polaroid-container.hover-shadow( )
    div.polaroid(@mouseover="isHovered = true" @mouseleave="isHovered =false" @click="handleClick")
        div.image-container
           <div class="placeholder-wrapper" v-if="!isImageLoaded">
               <img class="h-100 w-100" :src="placeholderImage" style="object-fit: cover; aspect-ratio: 5/4;" alt="Loading...">
               <v-progress-circular indeterminate color="grey-lighten-5" class="loader"></v-progress-circular>
           </div>
           img(class="h-100 w-100"
               :src="image"
               @load="isImageLoaded = true"
               v-show="isImageLoaded"
               cover
               style="object-fit: cover; aspect-ratio: 5/4"
               alt="Polaroid Photo"
           )
           div(:class="show_glint ? 'glint' : ''")
        div.date {{ formattedDate }}
</template>

<script>
import placeholder from '@/assets/files/placeholder.webp';

export default {
    name: 'PolaroidPhoto',
    emits: ['polaroid-click'],
    props: {
        image: {
            type: String,
            required: true,
        },
        full_res_image: {
           type: String,
           required: false,
           default: null,
        },
        date: {
            type: Date,
            default: null,
        }
    },
    data() {
        return {
            isHovered: false,
            show_glint: false,
            isImageLoaded: false,
            placeholderImage: placeholder,
        };
    },
    methods: {

        handleClick() {
            this.$emit('polaroid-click', {
                image: this.full_res_image || this.image,
                date: this.date,
            });
        },
    },
    watch: {
       image(newVal, oldVal) {
           if (newVal !== oldVal) {
               this.isImageLoaded = false;
           }
       },
        isHovered(){
            if (!this.show_glint){
                this.show_glint = true;
                setTimeout(() => {
                    this.show_glint = false;
                    // Matches the animation duration
                }, 1500);
            }

        }
    },
    computed: {
        formattedDate() {
            if (!this.date) return null;
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Intl.DateTimeFormat(undefined, options).format(this.date);
        }
    },
};
</script>

<style scoped>
.polaroid-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px;

}

.polaroid {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    height: min-content;
    position: relative;
    padding: 10px;
    background: white;
    border: 1px solid #ddd;
    text-align: center;
    transition: transform 0.3s ease;
}

.polaroid:hover {
    transform: scale(1.05);
    z-index: 3;
    -webkit-box-shadow: 7px 8px 18px 4px rgba(0,0,0,0.48);
    -moz-box-shadow: 7px 8px 18px 4px rgba(0,0,0,0.48);
    box-shadow: 7px 8px 18px 4px rgba(0,0,0,0.48);
}

.image-container {
    position: relative;
    overflow: hidden;
    border: 2px solid #ccc;
    background: #f5f5f5;
    width: fit-content;

}
.placeholder-wrapper {
   position: relative;
   filter: grayscale(80%) opacity(60%);
}
.loader {
   position: absolute;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%);
}

.glint {
    position: absolute;
    top: 0;
    left: -100%;
    width: 200%;
    height: 100%;
    background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.5), transparent);
    animation: glint-animation 2s infinite;
}

@keyframes glint-animation {
    0% {
        left: -200%;
    }
    100% {
        left: 150%;
    }
}

.date {
    margin-top: 10px;
    font-size: 14px;
    color: #555;
    font-family: 'Arial', sans-serif;
    width: 100%;
    text-align: left;
    padding-left: 10px;
    min-height: 21px;

}
</style>
