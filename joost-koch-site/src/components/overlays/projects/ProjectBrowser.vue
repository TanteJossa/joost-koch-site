<template lang="pug">
div.h-100.pa-4
    div.d-flex.flex-row
        // Use :model-value and @update:model-value to correctly bind to props
        v-text-field.project-search-field(
            :model-value="projectSearch"
            @update:model-value="$emit('update:projectSearch', $event)"
            label="Search Project"
            clearable
        )
        // Use :model-value and @update:model-value for v-select as well
        v-select(
            :items="['Date', 'Title', 'Rank']"
            :model-value="projectSort"
            @update:model-value="$emit('update:projectSort', $event)"
            label="Sort"
            style="max-width: 150px;"
        )
    div.d-flex.flex-wrap.project-list-scroll
        v-card.ma-1.project-card(
            color="light-grey"
            v-ripple
            v-for="project in sorted_projects"
            :key="project.id"
            :style="{'width': $vuetify.display.mdAndUp ? 'calc(50% - 8px)' : '100%'}"
            @click="handleProjectClick(project.id)"
        )
            v-card-title {{project.title}}
            v-card-text
                v-row(no-gutters)
                    v-col(v-if="project.images && project.images.length > 0 && project.images[0]", cols="auto", style="min-width: 92px;")
                        img(
                            :src="getProjectImageUrl(project.id, project.images[0])"
                            :alt="project.title + ' thumbnail'"
                            class="project-list-item-thumbnail"
                        )
                    v-col
                        div.project-list-item-description {{ getTruncatedDescription(project.description) }}
</template>

<script>
export default {
  name: 'ProjectBrowser',
  props: {
    projects: {
      type: Array,
      required: true,
    },
    projectSearch: {
      type: String,
      default: '',
    },
    projectSort: {
      type: String,
      default: 'Rank',
    },
  },
  emits: {
    'update:projectSearch': null,
    // Payload validation for update:projectSearch
    'update:projectSort': null,
    // Payload validation for update:projectSort
    'open-project': (projectId) => typeof projectId === 'string' || typeof projectId === 'number',
  },
  computed: {
    sorted_projects() {
      if (!this.projects || this.projects.length === 0) {
        return [];
      }
      // Ensure project dates are Date objects if sorting by Date
      // This should ideally be handled when projects prop is received or transformed
      const projectsWithDateObjects = this.projects.map(p => ({
        ...p,
        date: p.date instanceof Date ? p.date : new Date(p.date)
      }));

      const sort_method = {
        "Date": (a, b) => {
          // Handle invalid dates
          const dateA = a.date instanceof Date && !isNaN(a.date) ? a.date.getTime() : 0;
          const dateB = b.date instanceof Date && !isNaN(b.date) ? b.date.getTime() : 0;
          return dateB - dateA; // Sort descending by date (newest first)
        },
        "Title": (a, b) => a.title.localeCompare(b.title),
        "Rank": (a, b) => (a.rank || 0) - (b.rank || 0),
      }[this.projectSort];

      let filteredProjects = projectsWithDateObjects;
      if (this.projectSearch) {
        const searchTerm = this.projectSearch.toLowerCase();
        filteredProjects = projectsWithDateObjects.filter(e =>
          e.title.toLowerCase().includes(searchTerm) ||
          (e.description && e.description.toLowerCase().includes(searchTerm)) ||
          (e.tags && e.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
        );
      }
      
      return filteredProjects.sort(sort_method);
    },
  },
  methods: {
    getProjectImageUrl(projectId, imageFilename) {
      if (!projectId || !imageFilename) {
        return '';
        // Return empty or a placeholder image URL
      }
      try {
        // Path relative from src/components/overlays/projects/ProjectBrowser.vue to src/assets/projects/
        return new URL(`../../../assets/projects/${projectId}/${imageFilename}`, import.meta.url).href;
      } catch (e) {
        console.error(`Error creating image URL for project '${projectId}', image '${imageFilename}':`, e);
        return '';
        // Return empty or a placeholder image URL
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
        .replace(/[*_`~#\-+.!\\]/g, '');
        // Remove other markdown chars, list markers (escaped backslash)

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
    handleProjectClick(projectId) {
      this.$emit('open-project', projectId);
    },
  },
};
</script>

<style scoped>
.project-search-field {
  /* Adjusted to allow v-select to take some space */
  flex-grow: 1;
  margin-right: 8px;
}

.project-list-scroll {
  overflow-y: auto;
  /* Ensure it takes available height */
  height: calc(100% - 56px);
  /* Assuming text field and select row is approx 56px */
  width: 100%;
  /* Ensure it takes full width */
}

.project-list-item-thumbnail {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 12px;
}

.project-list-item-description {
  font-size: 0.9em;
  /* Ensure text wraps and doesn't overflow card */
  word-break: break-word;
  /* Fallback for older browsers */
  overflow-wrap: break-word;
  /* Standard property */
  /* Max lines can be controlled with line-clamp if needed, but truncation handles length */
}

.project-card {
  transition: all 0.3s;
  cursor: pointer;
}

.project-card:hover {
  transform: scale(1.02);
  -webkit-box-shadow: 7px 8px 18px 4px rgba(0,0,0,0.48);
  -moz-box-shadow: 7px 8px 18px 4px rgba(0,0,0,0.48);
  box-shadow: 7px 8px 18px 4px rgba(0,0,0,0.48);
  z-index: 3;
}
</style>