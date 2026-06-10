<template>
  <div class="selected-summary mb-4">
    <div class="d-flex align-center justify-space-between mb-2">
      <span class="summary-label">
        Selected
        <span class="summary-count">{{ selectedEmployees.length }}</span>
      </span>
      <v-btn
        v-if="selectedEmployees.length > 1"
        size="x-small"
        variant="text"
        color="medium-emphasis"
        class="text-caption"
        @click="clearAllEmployees"
      >
        Clear all
      </v-btn>
    </div>

    <div v-if="selectedEmployees.length === 0" class="empty-hint">
      <v-icon size="18" class="mr-1">mdi-account-off-outline</v-icon>
      No employees selected — pick some from the table first.
    </div>

    <div v-else class="chip-row">
      <v-chip
        v-for="employee in selectedEmployees"
        :key="employee._id"
        class="ma-1 ml-0"
        color="primary"
        variant="tonal"
        size="small"
        closable
        @click:close="removeEmployee(employee._id)"
      >
        {{ employee.fullName }}
        <span class="ml-1 text-medium-emphasis">· {{ employee.department }}</span>
      </v-chip>
    </div>
  </div>
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

<style scoped>
.summary-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-gray);
}
.summary-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  margin-left: 4px;
  border-radius: 10px;
  background: var(--color-primary-pale);
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 700;
}
.chip-row {
  display: flex;
  flex-wrap: wrap;
}
.empty-hint {
  display: flex;
  align-items: center;
  font-size: 0.8125rem;
  color: var(--color-gray);
  padding: 4px 0;
}
</style>
