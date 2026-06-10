<template>
  <div>
    <!-- Page header -->
    <div class="page-head">
      <h1 class="page-title">{{ title }}</h1>
      <p v-if="subtitle" class="page-subtitle">{{ subtitle }}</p>
    </div>

    <v-card class="table-card" flat>
      <div class="pa-4">
        <v-text-field
          v-if="enableSearch"
          v-model="search"
          placeholder="Search groups…"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
          density="comfortable"
          clearable
          class="search-field mb-4"
          color="primary"
        ></v-text-field>

        <!-- Bulk Actions Toolbar -->
        <BulkActionsToolbar
          v-if="enableActions"
          :selected-items="appStore.selectedEmployees"
          :items="items"
          :actions="actions"
          @exportData="exportData"
        />

        <v-data-table
          :loading="loading"
          :loading-text="loadingText"
          :headers="computedHeaders"
          :items="groupedTableFilteredData"
          density="compact"
          show-expand
          item-value="groupedBy"
          v-model:expanded="expandedRows"
          :hide-default-footer="groupedTableFilteredData.length < 11"
          class="elevation-0 accordion-data-table"
          hover
          @update:expanded="handleExpansionUpdate"
        >
          <template v-slot:expanded-row="{ columns, item }">
            <td :colspan="columns.length" class="accordion-expanded-cell">
              <v-card class="pa-2" flat color="transparent">
            <DataTable
              :items="item.items"
              :title="item.groupedBy"
              :subtitle="item.groupedBy"
              :loading="false"
              :loading-text="''"
              :enableSearch="false"
              :enableActions="false"
              :enableExport="enableExport"
              :enableOpenRecord="enableOpenRecord"
              :enableSelect="enableSelect"
              :showTitles="false"
              :tableActions="[]"
              :tableColumns="tableColumns"
            />
              </v-card>
            </td>
          </template>
        </v-data-table>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { toRefs, ref, computed } from "vue";
import type {
  Employee,
  GroupByInfo,
  GroupByOption,
  ActionType,
} from "../types";
import DataTable from "./DataTable.vue";
import { jobLevelRank } from "../constants/hierarchy";
import { applyGroupTableFilter, exportToExcel } from "../modules/genericHelper";
import BulkActionsToolbar from "./BulkActionsToolbar.vue";
import { useDialogStore } from "../stores/dialog";
import { useAppStore } from "../stores/app";

const dialogStore = useDialogStore();
const appStore = useAppStore();

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
  tableColumns: string[];
  groupByInfo: GroupByInfo;
  tableActions: ActionType[];
}>();

const {
  items,
  title,
  subtitle,
  loading,
  loadingText,
  enableSearch,
  enableActions,
  enableExport,
  enableOpenRecord,
  enableSelect,
  tableColumns,
  groupByInfo,
  tableActions,
} = toRefs(props);

const search = ref("");
const expandedRows = ref<string[]>([]);

const computedHeaders = computed(() => {
  // Map technical field names to user-friendly labels
  const labelMap: Record<string, string> = {
    managerName: "Manager",
    department: "Department",
    status: "Status",
    jobLevel: "Job Level",
    // Add more mappings as needed
  };

  const groupBy = groupByInfo.value.groupBy;
  const displayLabel = groupBy ? labelMap[groupBy] || groupBy : "";

  const headers = [
    { key: "data-table-expand", title: "", sortable: false },
    { key: "groupedBy", title: displayLabel, sortable: false },
    { key: "count", title: "Count", sortable: false },
  ];
  return headers;
});

const groupedData = computed(() => {
  const grouped = items.value.reduce((acc, item) => {
    const groupKey = item[groupByInfo.value.groupBy as GroupByOption];
    if (!groupKey) {
      return acc;
    }
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(item);
    return acc;
  }, {} as Record<string, Employee[]>);

  let assignedData = Object.entries(grouped).map(([groupedBy, items]) => ({
    groupedBy,
    items,
    count: items.length,
  }));

  // When grouping by job level, order the groups by seniority (CEO -> Entry)
  // instead of arbitrary insertion order.
  if (groupByInfo.value.groupBy === "jobLevel") {
    assignedData = assignedData.sort(
      (a, b) => jobLevelRank(b.groupedBy) - jobLevelRank(a.groupedBy)
    );
  }
  return assignedData;
});

const groupedTableFilteredData = computed(() => {
  if (search.value) {
    return applyGroupTableFilter(
      search.value,
      groupedData.value,
      tableColumns.value
    );
  }
  return groupedData.value;
});

const actions = computed(() => {
  return dialogStore.getActions(tableActions.value);
});

// Handle single row expansion
const handleExpansionUpdate = (expanded: string[]) => {
  // Clear any selected items in DataTable when expansion changes
  appStore.setSelectedEmployees([]);

  // If trying to expand more than one row, only keep the last one
  if (expanded.length > 1) {
    expandedRows.value = [expanded[expanded.length - 1]];
  } else {
    expandedRows.value = expanded;
  }
};

const exportData = () => {
  exportToExcel(
    groupedData.value.map((item) => item.items).flat(),
    tableColumns.value,
    `export_${title.value}`
  );
};
</script>

<style scoped>
/* Table/card visuals are handled by global CSS; keep this component lean. */
.accordion-data-table {
  background: transparent;
}

/* Expanded group panel — pale lavender (info background) */
.accordion-expanded-cell {
  background-color: var(--color-primary-pale);
  padding: 4px 8px;
}

:deep(.v-data-table__expanded__content) {
  background-color: var(--color-primary-pale);
}
</style>
