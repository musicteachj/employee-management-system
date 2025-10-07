<template>
  <v-slide-y-transition>
    <v-toolbar
      color="primary"
      density="compact"
      class="mb-4 rounded-lg"
      elevation="2"
    >
      <v-toolbar-title class="text-white">
        <v-fade-transition mode="out-in">
          <span :key="selectedItems.length">
            {{ selectedItems.length }}
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
/* Toolbar styling */
::deep(.v-toolbar) {
  transition: all 0.3s ease;
}

::deep(.v-toolbar:hover) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(var(--color-primary-rgb), 0.3);
}

/* Button styling */
::deep(.v-btn) {
  transition: all 0.3s ease;
}

::deep(.v-btn:hover) {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.05);
}

/* Icon styling */
::deep(.v-icon) {
  transition: all 0.3s ease;
}

/* Toolbar title styling */
::deep(.v-toolbar-title) {
  font-weight: 600;
  letter-spacing: 0.5px;
}
</style>
