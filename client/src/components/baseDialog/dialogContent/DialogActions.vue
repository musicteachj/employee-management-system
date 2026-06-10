<template>
  <div class="dialog-actions">
    <v-divider class="mb-4" />
    <div class="d-flex justify-end align-center gap-3">
      <v-btn variant="text" :disabled="loading" @click="onCancel"> Cancel </v-btn>
      <v-btn
        color="primary"
        variant="flat"
        :loading="loading"
        :disabled="disabled"
        @click="onSubmit"
      >
        <v-icon class="mr-2" size="small" :icon="submitIcon" />
        {{ submitText }}
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  loading: boolean;
  disabled: boolean;
  submitText: string;
  submitIcon: string;
  onCancel: () => void;
  onSubmit: () => void;
}>();
</script>

<style scoped>
.dialog-actions {
  margin-top: 20px;
}
</style>
