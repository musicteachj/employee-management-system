<template>
  <div>
    <!-- Page header (shown for full-page table views) -->
    <div v-if="showTitles" class="page-head">
      <h1 class="page-title">{{ title }}</h1>
      <p v-if="subtitle" class="page-subtitle">{{ subtitle }}</p>
    </div>

    <v-card class="table-card" flat>
      <div class="pa-4">
        <v-text-field
          v-if="enableSearch"
          v-model="search"
          placeholder="Search employees…"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
          density="comfortable"
          class="search-field mb-4"
          color="primary"
        ></v-text-field>

        <!-- Bulk Actions Toolbar -->
        <BulkActionsToolbar
          v-if="enableActions"
          :selected-items="selectedItems"
          :items="items"
          :actions="actions"
          @exportData="exportData"
        />

        <v-data-table
          :headers="computedHeaders"
          :items="filteredItems"
          density="compact"
          class="elevation-0 data-table-custom"
          :show-select="enableSelect"
          :items-per-page="10"
          :items-per-page-options="[5, 10, 25, 50]"
          :hide-default-footer="filteredItems.length < 11"
          :loading="loading"
          :loading-text="loadingText"
          hover
          v-model="selectedItems"
          item-value="_id"
          return-object
        >
          <template v-slot:item.actions="{ item }">
            <v-btn icon size="small" variant="text" @click="viewRecord(item)">
              <v-icon icon="mdi-eye-outline" color="primary" />
              <v-tooltip activator="parent" location="top">
                View Details
              </v-tooltip>
            </v-btn>
          </template>
        </v-data-table>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { toRefs, ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import type { Employee, ActionType } from "../types";
import { bySeniorityDesc } from "../constants/hierarchy";
import { useDialogStore } from "../stores/dialog";
import BulkActionsToolbar from "./BulkActionsToolbar.vue";
import { useAppStore } from "../stores/app";
import { exportToExcel } from "../modules/genericHelper";
const appStore = useAppStore();
const dialogStore = useDialogStore();
const router = useRouter();

const props = defineProps<{
  items: Employee[];
  title: string;
  subtitle: string;
  loading: boolean;
  loadingText: string;
  enableSearch: boolean;
  enableActions: boolean;
  enableExport: boolean;
  enableOpenRecord: boolean;
  enableSelect: boolean;
  tableActions: ActionType[];
  tableColumns: string[];
  showTitles: boolean;
}>();
const {
  items,
  title,
  subtitle,
  loading,
  loadingText,
  enableSearch,
  enableOpenRecord,
  enableActions,
  tableColumns,
} = toRefs(props);

const computedHeaders = computed(() => {
  // Column title mapping for better display names
  const columnTitleMap: Record<string, string> = {
    firstName: "First Name",
    lastName: "Last Name",
    fullName: "Full Name",
    personalEmail: "Personal Email",
    workEmail: "Work Email",
    phoneNumber: "Phone Number",
    department: "Department",
    position: "Position",
    jobLevel: "Job Level",
    employmentType: "Employment Type",
    workLocation: "Work Location",
    managerName: "Manager",
    hireDate: "Hire Date",
    terminationDate: "Termination Date",
    salary: "Salary",
    performanceRating: "Performance Rating",
    trainingStatus: "Training Status",
    backgroundCheckStatus: "Background Check",
    status: "Status",
    lastProfileUpdate: "Last Updated",
    updatedBy: "Updated By",
    lastReviewDate: "Last Review",
    nextReviewDate: "Next Review",
  };

  const headers = tableColumns.value.map((column) => ({
    title:
      columnTitleMap[column] ||
      column.charAt(0).toUpperCase() + column.slice(1),
    key: column,
  }));

  if (enableOpenRecord.value) {
    headers.push({ title: "", key: "actions", sortable: false } as any);
  }
  return headers;
});

const search = ref("");
const selectedItems = computed<Employee[]>({
  get: () => appStore.selectedEmployees,
  set: (val) => appStore.setSelectedEmployees(val),
});

const filteredItems = computed(() => {
  // Baseline ordering: most senior first (CEO -> Entry), consistent with the
  // org chart. The data table's own column sorting overrides this on click.
  const base = [...items.value].sort(bySeniorityDesc);

  if (!search.value) {
    return base;
  }

  const searchTerm = search.value.trim().toLowerCase();

  return base.filter((item) => {
    // Only search in the columns specified by tableColumns prop
    return tableColumns.value.some((column) => {
      const value = item[column as keyof Employee];
      if (value == null) return false;

      // Convert value to string and search
      return String(value).toLowerCase().includes(searchTerm);
    });
  });
});

const viewRecord = (item: Employee) => {
  router.push({ name: "employee-edit", params: { id: item._id } });
};

const actions = computed(() => {
  return dialogStore.getActions(props.tableActions);
});

const exportData = () => {
  exportToExcel(items.value, tableColumns.value, `export_${title.value}`);
};

// Clear selections when underlying items set changes
watch(
  () => items.value,
  () => appStore.setSelectedEmployees([])
);

// Clear selections when filtered items change (e.g., when search is applied)
watch(
  () => filteredItems.value,
  () => appStore.setSelectedEmployees([])
);
</script>

<style scoped>
/* Table/card visuals are handled by global CSS; keep this component lean. */
.data-table-custom {
  background: transparent;
}
</style>
