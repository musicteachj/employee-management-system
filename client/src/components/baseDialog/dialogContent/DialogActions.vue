<template>
  <div class="d-flex justify-end mt-4 gap-3">
    <v-btn
      color="grey"
      variant="outlined"
      :disabled="loading"
      @click="onCancel"
    >
      <v-icon class="mr-2" size="small">mdi-close</v-icon>
      Cancel
    </v-btn>
    <v-btn
      color="primary"
      :loading="loading"
      :disabled="disabled"
      @click="onSubmit"
    >
      <v-icon class="mr-2" size="small" :icon="submitIcon" />
      {{ submitText }}
    </v-btn>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  loading: boolean;
  disabled: boolean;
  submitText: string;
  submitIcon: string;
  onCancel: () => void;
  onSubmit: () => void;
}>();
</script>

<style scoped></style>
