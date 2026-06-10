<template>
  <v-slide-y-transition>
    <v-toolbar
      color="primary"
      density="compact"
      class="mb-4 rounded-lg bulk-toolbar"
      flat
    >
      <v-toolbar-title class="text-white bulk-toolbar-title">
        <v-fade-transition mode="out-in">
          <span :key="selectedItems.length">
            <strong class="tabular-nums">{{ selectedItems.length }}</strong>
            selected
          </span>
        </v-fade-transition>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        v-for="action in actions"
        :key="action.type"
        color="white"
        variant="text"
        @click="handleActionClick(action)"
        class="mr-2"
        :disabled="actionDisabled(action)"
      >
        <v-icon :icon="action.icon" class="mr-2" />
        {{ action.text }}
      </v-btn>
      <v-btn
        icon="mdi-close"
        color="white"
        variant="text"
        @click="clearSelection"
        :disabled="selectedItems.length === 0"
      />
    </v-toolbar>
  </v-slide-y-transition>
</template>

<script setup lang="ts">
import { useAppStore } from "../stores/app";
const appStore = useAppStore();
import type { Employee, Action } from "../types";

const props = defineProps<{
  selectedItems: Employee[];
  items: Employee[];
  actions: Action[];
}>();

const emit = defineEmits<{
  (e: "exportData"): void;
}>();

// Methods
const handleActionClick = (action: Action) => {
  if (action.type === "export-data") {
    emit("exportData");
  } else {
    action.action();
    appStore.setSelectedEmployees(props.selectedItems);
  }
};

const clearSelection = () => {
  appStore.setSelectedEmployees([]);
};

const actionDisabled = (action: Action) => {
  if (action.type === "export-data") {
    return props.items.length === 0;
  }
  return !(
    action.isEnabled?.(props.selectedItems) ?? props.selectedItems.length > 0
  );
};
</script>

<style scoped>
.bulk-toolbar {
  box-shadow: var(--shadow-sm);
}
.bulk-toolbar-title {
  font-size: 0.9375rem;
  font-weight: 500;
}
.bulk-toolbar-title strong {
  font-weight: 800;
}
</style>
