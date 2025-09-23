<template>
  <v-card class="pa-4 ma-2 accordion-table-card" elevation="3" rounded="lg">
    <v-card-title class="pa-0 mb-2">
      <h5 class="text-h5 text-primary font-weight-bold">{{ title }}</h5>
    </v-card-title>
    <v-card-subtitle class="pa-0 mb-4">
      <p class="text-body-2 text-medium-emphasis">
        {{ subtitle }}
      </p>
    </v-card-subtitle>
    <v-divider class="mb-4 divider-gradient" />
    <v-text-field
      v-if="enableSearch"
      v-model="search"
      label="Search groups..."
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      hide-details
      single-line
      density="compact"
      clearable
      class="search-field mb-4"
      color="primary"
    ></v-text-field>
    <v-data-table
      :loading="loading"
      :loading-text="loadingText"
      :headers="computedHeaders"
      :items="groupedData"
      density="compact"
      show-expand
      item-value="groupedBy"
      :hide-default-footer="groupedData.length < 11"
      class="elevation-0 rounded-lg accordion-data-table"
      hover
    >
      <template v-slot:expanded-row="{ columns, item, index: rowIndex }">
        <td :colspan="columns.length" style="background-color: #ebf5f0">
          <v-card class="pa-4" flat color="transparent">
            <DataTable
              :items="item.items"
              :title="item.groupedBy"
              :subtitle="item.groupedBy"
              :loading="false"
              :loading-text="''"
              :enableSearch="false"
              :enableActions="false"
              :enableExport="false"
              :enableOpenRecord="true"
              :enableSelect="false"
              :showTitles="false"
              :tableActions="[]"
              :tableColumns="tableColumns"
            />
          </v-card>
        </td>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import { toRefs, ref, computed } from "vue";
import type { Employee, GroupByInfo, GroupByOption } from "../types";
import DataTable from "./DataTable.vue";
import { applyGroupTableFilter } from "../modules/genericHelper";

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
  enableOtherGroupings: boolean;
  tableColumns: string[];
  groupByInfo: GroupByInfo;
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
  enableOtherGroupings,
  tableColumns,
  groupByInfo,
} = toRefs(props);

const computedHeaders = computed(() => {
  // Map technical field names to user-friendly labels
  const labelMap: Record<string, string> = {
    managerName: "Manager",
    department: "Department",
    status: "Status",
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
  if (search.value) {
    assignedData = applyGroupTableFilter(search.value, assignedData);
  }
  return assignedData;
});

const search = ref("");
</script>

<style scoped>
/* Card styling with subtle gradient */
.accordion-table-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.accordion-table-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

/* Enhanced divider with gradient */
.divider-gradient {
  background: linear-gradient(
    90deg,
    transparent 0%,
    #1976d2 50%,
    transparent 100%
  );
  height: 2px;
  border: none;
}

/* Search field enhancements */
.search-field {
  transition: all 0.3s ease;
}

.search-field :deep(.v-field__outline) {
  --v-field-border-opacity: 0.3;
}

.search-field :deep(.v-field--focused .v-field__outline) {
  --v-field-border-opacity: 1;
  border-width: 2px;
}

.search-field :deep(.v-field__input) {
  background: rgba(25, 118, 210, 0.02);
  border-radius: 8px;
}

/* Table styling */
.accordion-data-table {
  background: transparent;
}

/* Table headers with enhanced styling */
:deep(.v-data-table-header__content) {
  font-weight: 700;
  color: #1976d2;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

:deep(.v-data-table__th) {
  background: #f5f7fa !important;
  border-bottom: 2px solid #1976d2;
}

/* Row hover effects */
:deep(.v-data-table__tr:hover) {
  background: linear-gradient(
    135deg,
    rgba(25, 118, 210, 0.04) 0%,
    rgba(25, 118, 210, 0.08) 100%
  );
  transform: scale(1.005);
  transition: all 0.2s ease;
}

:deep(.v-data-table__td) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 12px 16px;
}

/* Alternating row colors for better readability */
:deep(.v-data-table__tr:nth-child(even)) {
  background: rgba(248, 250, 252, 0.5);
}

/* Expand button styling */
:deep(.v-data-table__expand-icon) {
  color: #1976d2;
  transition: all 0.3s ease;
}

:deep(.v-data-table__expand-icon:hover) {
  color: #1565c0;
  transform: scale(1.1);
}

/* Expanded row styling - keep the original background color */
:deep(.v-data-table__expanded__content) {
  background-color: #ebf5f0;
}

/* Footer styling */
:deep(.v-data-table-footer) {
  background: linear-gradient(135deg, #f8fafc 0%, #e8f4fd 100%);
  border-top: 1px solid rgba(25, 118, 210, 0.2);
  border-radius: 0 0 12px 12px;
}

/* Pagination button styling */
:deep(.v-pagination__item) {
  transition: all 0.3s ease;
}

:deep(.v-pagination__item:hover) {
  background: rgba(25, 118, 210, 0.1);
  transform: scale(1.05);
}

:deep(.v-pagination__item--is-active) {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3);
}

/* Loading state styling */
:deep(.v-data-table__loading) {
  background: rgba(25, 118, 210, 0.02);
}
</style>
