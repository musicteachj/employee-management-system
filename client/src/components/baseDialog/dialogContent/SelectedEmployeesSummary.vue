<template>
  <v-card variant="outlined" class="mb-4 summary-card dialog-summary">
    <v-card-title class="text-subtitle-1 section-header py-2">
      <v-icon class="mr-2" size="small">mdi-account-multiple</v-icon>
      Selected Employees ({{ selectedEmployees.length }})
    </v-card-title>
    <v-card-text class="pa-3">
      <div v-if="selectedEmployees.length === 0" class="empty-state">
        <v-icon size="48" color="grey-lighten-1" class="mb-3">
          mdi-account-off
        </v-icon>
        <p class="text-body-2 text-grey-darken-1 mb-0">
          No employees selected.
        </p>
        <p class="text-caption text-grey">
          Please select employees from the table first.
        </p>
      </div>

      <div v-else class="employee-list">
        <v-chip
          v-for="employee in selectedEmployees"
          :key="employee._id"
          class="ma-1"
          color="primary"
          variant="outlined"
          size="small"
          closable
          @click:close="removeEmployee(employee._id)"
        >
          <v-icon start icon="mdi-account" />
          {{ employee.fullName }}
          <span class="ml-2 text-caption">({{ employee.department }})</span>
        </v-chip>

        <div class="mt-3" v-if="selectedEmployees.length > 1">
          <v-btn
            size="small"
            variant="text"
            color="error"
            @click="clearAllEmployees"
            class="text-caption"
          >
            <v-icon start size="small">mdi-close-circle</v-icon>
            Clear All
          </v-btn>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAppStore } from "../../../stores/app";
import type { Employee } from "../../../types";

const appStore = useAppStore();
const selectedEmployees = computed<Employee[]>(
  () => appStore.selectedEmployees
);

const removeEmployee = (employeeId: string | undefined) => {
  if (employeeId) appStore.removeSelectedEmployee(employeeId);
};

const clearAllEmployees = () => appStore.setSelectedEmployees([]);
</script>

<style scoped></style>
