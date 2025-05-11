<!-- SchemaBuilder.vue -->
<template lang="pug">
div(v-if="modelValue && Array.isArray(modelValue)" :class="{ 'ml-4': nested }")
  v-row(v-for="(nestedField, nestedIndex) in modelValue" :key="nestedIndex")
    v-col(cols="4")
      v-text-field(v-model="nestedField.field" label="Nested Field" variant="outlined")
    v-col(cols="4")
      v-select(v-model="nestedField.type" :items="['string', 'number', 'boolean', 'object', 'list']" label="Type" variant="outlined")
    v-col(cols="2" v-if="nestedField.type === 'object'")
        v-btn(prepend-icon="mdi-code-json" @click="nestedField.showNested = !nestedField.showNested") {{nestedField.showNested? "Hide":"Show"}}
    v-col(cols="2" v-if="nestedField.type === 'list'")
        v-select(v-model="nestedField.items" :items="['string', 'number', 'boolean', 'object']" label="List Items Type" variant="outlined")
    v-col(cols="2")
      v-btn(icon="mdi-delete" color="error" @click="removeNestedField(nestedIndex)")
    v-col(cols="12" v-if="nestedField.type === 'object' && nestedField.showNested")
      SchemaBuilder(v-model="nestedField.properties" :nested="true")
  v-btn(variant="outlined" @click="addNestedField" prepend-icon="mdi-plus" :class="{ 'ml-4': nested }") Add Nested Field

</template>

<script>
import { ref, watch, defineProps, defineEmits, onMounted} from 'vue';
export default {
    props: {
        modelValue: {
            type: Array,
            required: true
        },
        nested:{
            type: Boolean,
            default: false
        }
    },
    emits: ['update:modelValue'],
    setup(props, {emit}){
        // const nestedFields = ref(props.modelValue)
        //removed
        const addNestedField = () => {
            const newNested = { field: '', type: 'string', properties: [], items:null, showNested: false }
            emit('update:modelValue', [...props.modelValue, newNested]);
        };

        const removeNestedField = (index) => {
            const updatedValue = [...props.modelValue];
            updatedValue.splice(index, 1);
            emit('update:modelValue', updatedValue);
        };
        watch(() => props.modelValue, (newValue) => {
            emit('update:modelValue', newValue);
        }, { deep: true });
        return {addNestedField, removeNestedField}
    }
}
</script>
<style scoped>

</style>