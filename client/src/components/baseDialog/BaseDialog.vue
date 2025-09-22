<template>
  <v-dialog
    v-model="dialogStore.dialogState.show"
    scrollable
    persistent
    :width="dialogWidth"
  >
    <v-card>
      <v-card-title class="d-flex">
        <p>{{ dialogStore.dialogState.header }}</p>
        <v-spacer></v-spacer>
        <v-icon
          icon="mdi-close"
          size="x-small"
          class="mt-1"
          @click="dialogStore.closeAndResetDialog()"
        ></v-icon>
      </v-card-title>
      <v-card-text>
        <slot />
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="dialogStore.closeAndResetDialog()">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDialogStore } from "../../stores/dialog";

const dialogStore = useDialogStore();

const dialogWidth = computed(() => {
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
