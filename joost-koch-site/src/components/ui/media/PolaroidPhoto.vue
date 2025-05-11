<template lang="pug">

div.polaroid-container.hover-shadow( )
    div.polaroid(@mouseover="isHovered = true" @mouseleave="isHovered =false" @click="handleClick")
        div.image-container
            img.h-100.w-100(:src="image" cover style="object-fit: cover; aspect-ratio: 5/4" alt="Polaroid Photo")
            div(:class="show_glint ? 'glint' : ''")
        div.date {{ formattedDate }}
</template>

<script>
export default {
    name: 'PolaroidPhoto',
    emits: ['polaroid-click'],
    props: {
        image: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            default: null,
        }
    },
    data() {
        return {
            isHovered: false,
            show_glint: false
        };
    },
    methods: {

        handleClick() {
            this.$emit('polaroid-click', {
                image: this.image,
                date: this.date,
            });
        },
    },
    watch: {
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
    /* width: 250px; */
    height: min-content;
    /* max-height: calc(100% - 50px); */
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
    /* max-height: calc(100% - 40px); */
    width: fit-content;
    
}

/* .image-container img {
    height: 100%;
    display: block;
} */

.glint {
    position: absolute;
    top: 0;
    left: -100%;
    width: 200%;
    height: 100%;
    background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.5), transparent);
    /* transform: skewX(-30deg); */
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