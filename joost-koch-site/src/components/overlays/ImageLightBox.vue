<template lang="pug">
v-dialog(
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    transition="dialog-bottom-transition"
    overlay-opacity="0.7"
    max-width="90vw"
    width="auto"
)
    v-card.image-dialog-card(v-if="dialogContentType === 'image'")
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
                @click="$emit('update:modelValue', false)"
            )
                v-icon mdi-close
        v-card-text.d-flex.justify-center.align-center.flex-grow-1.image-dialog-content
            div
                v-img.image-dialog-img(
                    :src="selectedImageUrl"
                    :alt="selectedImageAlt"
                    contain
                )
    div.polaroid-dialog-container(v-else-if="dialogContentType === 'polaroid'")
        PolaroidPhoto(
            v-if="selectedPolaroidData"
            :image="selectedPolaroidData.image"
            :date="selectedPolaroidData.date"
        )
</template>

<script>
// Import the PolaroidPhoto component
import PolaroidPhoto from '@/components/ui/media/PolaroidPhoto.vue';

export default {
  name: 'ImageLightBox',
  components: {
    PolaroidPhoto,
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    dialogContentType: {
      type: String,
      default: null,
      // Valid values: 'image', 'polaroid'
    },
    selectedImageUrl: {
      type: String,
      default: null,
    },
    selectedImageAlt: {
      type: String,
      default: '',
    },
    selectedPolaroidData: {
      type: Object,
      default: null,
      // Expected structure: { image: String, date: String }
    },
  },
  emits: ['update:modelValue'],
};
</script>

<style scoped>
.image-dialog-card {
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.image-dialog-content {
  overflow: auto;
  background-color: #212121;
  /* Ensure content can grow if needed */
  flex-grow: 1;
}

.image-dialog-img {
  max-height: 100%;
  max-width: 100%;
  /* Ensure image scales down correctly within its container */
  object-fit: contain; 
}

.polaroid-dialog-container {
  /* Define size constraints for the polaroid container */
  height: min(1000px, 80vh);
  width: min(800px, 90vw);
  /* Center the PolaroidPhoto component if it's smaller than the container */
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>