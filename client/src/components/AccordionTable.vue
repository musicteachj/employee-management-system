<template>
  <v-card class="pa-4 ma-2" elevation="1" rounded="lg">
    <v-card-title class="pa-0 mb-2">
      <h5 class="text-h5">{{ title }}</h5>
    </v-card-title>
    <v-card-subtitle class="pa-0 mb-4">
      <p class="text-body-2 text-medium-emphasis">
        {{ subtitle }}
      </p>
    </v-card-subtitle>
    <v-divider class="mb-4" />
    <v-text-field
      v-if="enableSearch"
      v-model="search"
      label="Search"
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      hide-details
      single-line
      density="compact"
      clearable
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
/* Ensure table headers are bold */
:deep(.v-data-table-header__content) {
  font-weight: 600;
}
</style>
