<template lang="pug">
v-container(fluid)
  v-card
    v-tabs(v-model="selectedTab" color="white")
      v-tab(value="prompt") Prompt Bouwer
      v-tab(value="request") API Request
      v-tab(value="saved") Opgeslagen Prompts

    v-card-text
      v-window(v-model="selectedTab")
        v-window-item(value="prompt")
          v-row
            v-col(cols="12")
              v-textarea(v-model="prompt" label="Prompt" auto-grow rows="3" variant="outlined")
                template(v-slot:append)
                  v-btn(icon="mdi-content-copy" size="small" @click="copyToClipboard(prompt)")
              v-divider.my-4

              h3 Schema Definitie
              v-btn(variant="outlined" @click="addSchemaField" prepend-icon="mdi-plus") Veld Toevoegen
              v-row(v-for="(field, index) in schema" :key="index")
                v-col(cols="4")
                  v-text-field(v-model="field.field" label="Veldnaam" variant="outlined")
                v-col(cols="4")
                  v-select(v-model="field.type" :items="['string', 'number', 'boolean', 'object', 'list']" label="Type" variant="outlined")
                v-col(cols="2" v-if="field.type === 'object'")
                  v-btn(prepend-icon="mdi-code-json" @click="field.showNested = !field.showNested") {{field.showNested? "Hide":"Show"}} Nested
                v-col(cols="2" v-if="field.type === 'list'")
                  v-select(v-model="field.items" :items="['string', 'number', 'boolean', 'object']" label="List Items Type" variant="outlined")
                v-col(cols="2")
                  v-btn(icon="mdi-delete" color="error" @click="removeSchemaField(index)")
                v-col(cols="12" v-if="field.type === 'object' && field.showNested")
                  SchemaBuilder(v-model="field.properties" :nested="true")

              v-divider.my-4
              v-textarea(v-model="generatedSchema" label="Gegenereerd Schema (JSON)" rows="5" variant="outlined" @input="validateJson")
                template(v-slot:append)
                  v-btn(icon="mdi-content-copy" size="small" @click="copyToClipboard(generatedSchema)")
                  v-btn(icon="mdi-download" size="small" @click="downloadJson")

              v-alert(v-if="jsonError" type="error" variant="outlined") {{ jsonError }}

              v-divider.my-4
              v-select(v-model="selectedProvider" :items="providerKeys" label="Provider" variant="outlined" @update:modelValue="selectedModel = null")
              v-select(v-model="selectedModel" :items="availableModels" label="Model" variant="outlined" :disabled="!selectedProvider")
              v-slider(v-model="temperature" label="Temperatuur" min="0" max="1" step="0.01" thumb-label="always")


              v-divider.my-4
              h3 Bestanden
              v-file-input(v-model="files" label="Bestanden Toevoegen" multiple chips @change="handleFiles")
              v-expansion-panels(v-model="filePanels" multiple)
                v-expansion-panel(v-for="(fileData, index) in processedFiles" :key="index" :value="index")
                  v-expansion-panel-title {{fileData.filename}}
                  v-expansion-panel-text
                    template(v-for="(item, itemIndex) in fileData.data" :key="itemIndex")
                      div(v-if="item.type === 'text'")
                        p {{ item.data }}
                      img(v-else-if="item.type === 'image'" :src="item.data" style="max-width: 100%; height: auto;")
                      div(v-else)
                        p Unsupported file type
              v-divider.my-4
              v-btn(color="success" @click="savePrompt" prepend-icon="mdi-content-save") Prompt Opslaan
        v-window-item(value="request")
          v-btn(color="primary" @click="sendApiRequest" :loading="loading" block prepend-icon="mdi-send") Verstuur API Request
          v-progress-linear(v-if="loading" indeterminate color="primary")

          v-alert(v-if="error" type="error" variant="outlined") {{ error }}
          v-alert(v-if="apiResponse && !error" type="success" variant="outlined") API Request Succesvol
          v-card(v-if="apiResponse" class="mt-4")
            v-card-title Response
            v-card-text
              v-textarea(readonly :modelValue="formattedApiResponse" color="white" auto-grow label="Api response" )
                template(v-slot:append)
                    v-btn(icon="mdi-content-copy" size="small" @click="copyToClipboard(formattedApiResponse)")
                    v-btn(icon="mdi-download" size="small" @click="downloadApiResponse")
              hr
              div(v-if="apiResponse.tokens_used") Tokens Used: {{ apiResponse.tokens_used }}
              div(v-if="apiResponse.model_used") Model Used: {{ apiResponse.model_used }}
              div(v-if="apiResponse.model_version") Model Version: {{ apiResponse.model_version }}
              div(v-if="apiResponse.timestamp") Timestamp: {{ apiResponse.timestamp }}
              div(v-if="apiResponse.delta_time_s") Delta Time (s): {{ apiResponse.delta_time_s }}

        v-window-item(value="saved")
          v-row(align="center" justify="space-between")
            v-col
              h2 Opgeslagen Prompts
            v-col(cols="auto")
              v-btn(color="primary" @click="exportSavedPrompts" prepend-icon="mdi-download") Exporteer Prompts
              v-btn(color="primary" @click="importSavedPrompts" prepend-icon="mdi-upload") Importeer Prompts
              input(type="file" ref="importFileInput" style="display: none" @change="handleImportFile" accept=".json")

          v-list(v-if="savedPrompts.length > 0")
            v-list-item(v-for="(savedPrompt, index) in savedPrompts" :key="index")
              v-list-item-title {{ savedPrompt.name }}
              v-list-item-subtitle(v-if="savedPrompt.prompt.length > 50") {{ savedPrompt.prompt.substring(0, 50) + "..." }}
              v-list-item-subtitle(v-else) {{savedPrompt.prompt}}
              v-btn(icon="mdi-download" @click="loadPrompt(savedPrompt.name)" variant="text" title="Load")
              v-btn(icon="mdi-delete" color="error" @click="deletePrompt(savedPrompt.name)" variant="text" title="Delete")
              v-btn(icon="mdi-content-copy" color="primary" @click="copyToClipboard(savedPrompt.prompt)" variant="text" title="Copy Prompt")
              v-btn(icon="mdi-download" color="green" @click="downloadSinglePrompt(savedPrompt)" variant="text" title="Download Prompt")
          div(v-else) Geen opgeslagen prompts.

</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import axios from 'axios';
import SchemaBuilder from '@/components/forms/SchemaBuilder.vue'; // Import the recursive component

export default {
    name: 'GptView',
    components: {
        SchemaBuilder
    },
    props: {

    },
    emits: [],
    setup() {
      // Setup is still needed for component registration.  But it's empty.
      // All logic moved to data, computed, methods, watch, and mounted.
      return {}
    },
    data() {
        return {
            prompt: '',
            schema: [],
            generatedSchema: '{}',
            selectedProvider: null,
            availableProviders: {},
            selectedModel: null,
            loading: false,
            apiResponse: null,
            error: null,
            savedPrompts: [],
            selectedTab: "prompt",
            apiUrl: "https://gpt-function-771520566941.europe-west4.run.app",
            jsonError: null,
            temperature: 0.1,
            files: [],       // For v-file-input
            processedFiles: [], // Processed file data (text/images)
            filePanels: [],      // For v-expansion-panels
        }
    },
    computed: {
        availableModels() {
            return this.availableProviders[this.selectedProvider] || [];
        },
        formattedApiResponse() {
            return this.apiResponse ? JSON.stringify(this.apiResponse.result, null, 2) : '';
        },
        providerKeys(){
            return Object.keys(this.availableProviders)
        }
    },
    methods: {
        addSchemaField() {
            this.schema.push({ field: '', type: 'string', properties: [], items: null, showNested: false });
        },
        removeSchemaField(index) {
            this.schema.splice(index, 1);
        },
        generateSchema() {
            try {
                const schemaObj = {};
                function processField(field, targetObj) {
                    if (!field.field) return;

                    if (field.type === 'object') {
                        const nestedObj = {};
                         if (Array.isArray(field.properties)) {
                            field.properties.forEach(nestedField => {
                                processField(nestedField, nestedObj);
                            });
                        }
                        targetObj[field.field] = nestedObj;
                    } else if (field.type === 'list') {
                        if(field.items === "object"){
                            targetObj[field.field] = [{}];
                        }
                        else{
                            targetObj[field.field] = [field.items || 'string'];
                        }
                    } else {
                        targetObj[field.field] = field.type || 'string';
                    }
                }

                this.schema.forEach(field => {
                    processField(field, schemaObj);
                });

                this.generatedSchema = JSON.stringify(schemaObj, null, 2);
                this.jsonError = null;
            } catch (e) {
                this.jsonError = "Schema Generation Error: " + e.message;
            }
        },
        validateJson() {
            try {
                JSON.parse(this.generatedSchema);
                this.jsonError = null;
                const parsedSchema = JSON.parse(this.generatedSchema)
                const newSchema = this.schemaFromJson(parsedSchema)
                this.schema = newSchema
            } catch (e) {
                this.jsonError = 'Invalid JSON: ' + e.message;
            }
        },
        schemaFromJson(jsonSchema) {
            const newSchema = [];

            for (const key in jsonSchema) {
                if (jsonSchema.hasOwnProperty(key)) {
                const value = jsonSchema[key];
                const field = { field: key, showNested: false };

                if (typeof value === 'object') {
                    if (Array.isArray(value)) { // It's a list
                    field.type = 'list';
                    if(value.length > 0){
                        if (typeof value[0] === 'object'){
                            field.items = 'object'
                        }
                        else {
                            field.items = typeof value[0]; // 'string', 'number', etc.
                        }
                    }
                    else{
                        field.items = 'string'
                    }
                    } else { // It's an object
                    field.type = 'object';
                    field.properties = this.schemaFromJson(value); // Recursively process nested objects
                    field.showNested = true;
                    }
                } else {
                    field.type = typeof value; // 'string', 'number', 'boolean'
                }
                newSchema.push(field);
                }
            }
            return newSchema;
        },
        savePrompt() {
            try {
                JSON.parse(this.generatedSchema)
            }
            catch(error){
                this.jsonError = "Cannot save. Invalid JSON"
                return;
            }
            const promptName = this.prompt.substring(0, 20);
            const promptData = {
                name: promptName,
                prompt: this.prompt,
                schema: this.schema,
                generatedSchema: this.generatedSchema,
                provider: this.selectedProvider,
                model: this.selectedModel,
                temperature: this.temperature,
                files: this.processedFiles, // Save processed files
            };

            const existingIndex = this.savedPrompts.findIndex(p => p.name === promptName);
            if (existingIndex > -1) {
                this.savedPrompts[existingIndex] = promptData;
            } else {
                this.savedPrompts.push(promptData);
            }
            this.updateLocalStorage()
        },
        loadPrompt(promptName) {
            this.selectedTab = "prompt"
            const savedPrompt = this.savedPrompts.find(p => p.name === promptName);
            if (savedPrompt) {
                this.prompt = savedPrompt.prompt;
                this.schema = savedPrompt.schema;
                this.generatedSchema = savedPrompt.generatedSchema;
                this.selectedProvider = savedPrompt.provider;
                this.selectedModel = savedPrompt.model;
                this.temperature = savedPrompt.temperature;
                this.processedFiles = savedPrompt.files || []; // Load files
                this.validateJson()
            }
        },
        deletePrompt(promptName) {
            this.savedPrompts = this.savedPrompts.filter(p => p.name !== promptName);
            this.updateLocalStorage()
        },
        updateLocalStorage(){
            localStorage.setItem('savedPrompts', JSON.stringify(this.savedPrompts));
        },
        async fetchProviders() {
            try {
                const response = await axios.get(`${this.apiUrl}/providers`);
                this.availableProviders = response.data;
            } catch (e) {
                this.error = 'Error fetching providers: ' + e.message;
            }
        },
        async sendApiRequest() {
            this.loading = true;
            this.error = null;
            this.apiResponse = null;
            try {
                JSON.parse(this.generatedSchema)
            }
            catch(error){
                this.jsonError = "Cannot send request. Invalid JSON"
                this.loading = false;
                return;
            }

            try {
              const requestData = {
                data: [
                    { type: 'text', text: this.prompt },
                    ...this.processedFiles.flatMap(file =>
                        file.data.map(item => ({ type: item.type, [item.type === 'image' ? 'image' : 'text']: item.data })) // Use item.type
                    )
                ],
                provider: this.selectedProvider,
                model: this.selectedModel,
                schema_string: this.generatedSchema,
                temperature: this.temperature,
              };

                const response = await axios.post(`${this.apiUrl}/gpt`, requestData, {
                    headers: { 'Content-Type': 'application/json' }
                });
                this.apiResponse = response.data?.output || null;
            } catch (e) {
                this.error = 'API Request Error: ' + e.message;
            } finally {
                this.loading = false;
            }
        },
        copyToClipboard(text) {
            if (!text) return;
            navigator.clipboard.writeText(text).then(() => {
                //Success
            }).catch(err => {
                console.error('Could not copy text: ', err);
            });
        },
        downloadJson() {
          if (!this.generatedSchema) return;

          const blob = new Blob([this.generatedSchema], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'schema.json';
          a.click();
          URL.revokeObjectURL(url); // Clean up
        },
        downloadApiResponse() {
            if (!this.formattedApiResponse) return;
            const blob = new Blob([this.formattedApiResponse], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'api_response.json'; // Better filename
            a.style.display = 'none'; // Hide the link
            document.body.appendChild(a); // Append to body
            a.click();
            document.body.removeChild(a);   // Clean up: Remove the element
            URL.revokeObjectURL(url);
        },

       async handleFiles(event) {
          if (!event || !event.target || !event.target.files) return; // Important: Handle null/undefined case
          this.processedFiles = []; // Clear previous files
          this.filePanels = [];
          for (const file of event.target.files) {  // Directly iterate over newFiles
            if (file.type.startsWith('image/')) {
              // Handle images
              const base64Image = await this.readFileAsBase64(file);
              this.processedFiles.push({
                filename: file.name,
                data: [{
                  type: 'image',
                  data: base64Image
                }]
              });

            } else if (file.type === 'application/pdf') {
              // Handle PDFs
              const extractedData = await this.$extractTextAndImages(file);
              this.processedFiles.push({
                filename: file.name,
                data: extractedData
              });
            }
              this.filePanels.push(this.processedFiles.length -1)
          }

        },
        readFileAsBase64(file) {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              let base64String = reader.result
              if (!file.type.startsWith('image/')){
                base64String = "data:image/png;base64,"+base64String.split(",")[1]
              }
              resolve(base64String);

            };
            reader.onerror = reject;
            if (file.type.startsWith('image/')) {
              reader.readAsDataURL(file); // For images, read directly as DataURL
            } else {
              reader.readAsArrayBuffer(file) //other files
            }
          });
        },

        exportSavedPrompts() {
            if (this.savedPrompts.length === 0) {
              return; // Or show a message to the user
            }

            const data = JSON.stringify(this.savedPrompts, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'saved_prompts.json';
            a.click();
            URL.revokeObjectURL(url); // Clean up
          },

          importSavedPrompts() {
            this.$refs.importFileInput.click(); // Trigger the hidden file input
          },
          handleImportFile(event) {
            const file = event.target.files[0];
            if (!file) {
              return;
            }
             if (file.type !== 'application/json') {
                alert('Please select a JSON file.'); // Use Vuetify dialog/alert if desired
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
              try {
                const importedPrompts = JSON.parse(e.target.result);
                // Validate imported data (optional but recommended)
                if (!Array.isArray(importedPrompts)) {
                    throw new Error("Imported data must be an array")
                }
                this.savedPrompts = importedPrompts;
                this.updateLocalStorage();
                // Optionally, show a success message
              } catch (error) {
                alert('Error importing prompts: ' + error.message); // Or use a Vuetify dialog
              }
            };
             reader.onerror = () => {
                alert("Failed to read file")
             }
            reader.readAsText(file);
          },
        downloadSinglePrompt(prompt) {
            const data = JSON.stringify(prompt, null, 2);
            const blob = new Blob([data], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${prompt.name.replace(/\s+/g, '_')}_prompt.json`; // Sanitize filename
            a.click();
            URL.revokeObjectURL(url);
        },

    },
    watch: {
        schema: {
            handler() {
                this.generateSchema();
            },
            deep: true
        },
        // savedPrompts: { // Removed, call updateLocalStorage directly
        //     handler() {
        //       this.updateLocalStorage();
        //     },
        //     deep: true
        // },
    },

    mounted() {
        this.fetchProviders();
        const saved = localStorage.getItem('savedPrompts');
        if (saved) {
            try{
                this.savedPrompts = JSON.parse(saved);
            }
            catch(error){
                this.savedPrompts = []
                console.log("error loading saved prompts", error)
            }
        }
        this.generateSchema()
    },
}
</script>

<style scoped>
/* Add any component-specific styles here */
</style>