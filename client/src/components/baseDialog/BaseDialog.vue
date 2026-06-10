<template>
  <v-dialog
    v-model="dialogStore.dialogState.show"
    scrollable
    :persistent="dialogStore.dialogState.persistent ?? true"
    :width="dialogWidth"
  >
    <v-card class="dialog-card" rounded="lg">
      <div class="dialog-header">
        <span class="dialog-title">{{ dialogStore.dialogState.header }}</span>
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          density="comfortable"
          @click="dialogStore.closeAndResetDialog()"
        ></v-btn>
      </div>
      <v-card-text class="dialog-body">
        <slot />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDialogStore } from "../../stores/dialog";

const dialogStore = useDialogStore();

const dialogWidth = computed(() => {
  if (dialogStore.dialogState.maxWidth) return dialogStore.dialogState.maxWidth;
  switch (dialogStore.dialogState.size) {
    case "x-small":
      return "24%";
    case "small":
      return "36%";
    case "medium":
      return "48%";
    case "large":
      return "72%";
    default:
      return "48%";
  }
});
</script>

<style scoped>
.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border);
}
.dialog-title {
  font-size: 1.0625rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--color-ink);
}
.dialog-body {
  padding: 20px !important;
}
</style>
