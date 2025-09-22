<template>
  <div>
    <DataTable
      :items="items"
      :title="title"
      :subtitle="subtitle"
      :loading="loading"
      :loading-text="loadingText"
      :enableSearch="enableSearch"
      :enableActions="enableActions"
      :enableExport="enableExport"
      :enableOpenRecord="enableOpenRecord"
      :enableSelect="enableSelect"
      :tableActions="tableActions"
      :showTitles="true"
    />
  </div>
</template>

<script setup lang="ts">
import DataTable from "../components/DataTable.vue";
import { useAppStore } from "../stores/app";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import type { Employee, ActionType } from "../types";

const route = useRoute();

const appStore = useAppStore();

// Variables
const title = ref("");
const subtitle = ref("");
const loading = ref(false);
const loadingText = ref("Loading table data...");
const routeName = ref(route.name as string);
const enableSearch = ref(false);
const enableActions = ref(false);
const enableExport = ref(false);
const enableOpenRecord = ref(false);
const enableSelect = ref(false);
const tableActions = ref<ActionType[]>([]);
const items = ref<Employee[]>([]);

// Methods
const loadData = async () => {
  try {
    loading.value = true;
    // Reset variables before loading data
    resetData();
    // Populate data based on route name
    switch (routeName.value) {
      case "Unassigned Hires":
        title.value = "Unassigned Hires";
        subtitle.value = "Employees without managers";
        enableSearch.value = true;
        enableActions.value = true;
        enableExport.value = true;
        enableOpenRecord.value = true;
        enableSelect.value = true;
        items.value = await appStore.getUnassignedHires();
        tableActions.value = ["assign-to-manager"];
        break;
      case "Recent Hires":
        title.value = "Recent Hires";
        subtitle.value = "Employees hired in the last 30 days";
        enableSearch.value = true;
        enableActions.value = true;
        enableExport.value = true;
        enableOpenRecord.value = true;
        enableSelect.value = true;
        items.value = await appStore.getRecentHires();
        break;
      case "Contract Employees":
        title.value = "Contract Employees";
        subtitle.value = "Employees with contract employment type";
        enableSearch.value = true;
        enableActions.value = true;
        enableExport.value = true;
        enableOpenRecord.value = true;
        enableSelect.value = true;
        items.value = await appStore.getContractEmployees();
        break;
      case "Updated Profiles":
        title.value = "Updated Profiles";
        subtitle.value = "Employees with updated profiles";
        enableSearch.value = true;
        enableActions.value = true;
        enableExport.value = true;
        enableOpenRecord.value = true;
        enableSelect.value = true;
        items.value = await appStore.getUpdatedProfiles();
        break;
      case "Former Employees":
        title.value = "Former Employees";
        subtitle.value = "Employees with terminated status";
        enableSearch.value = true;
        enableActions.value = true;
        enableExport.value = true;
        enableOpenRecord.value = true;
        enableSelect.value = true;
        items.value = await appStore.getFormerEmployees();
        break;
      default:
        resetData();
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const resetData = () => {
  title.value = "";
  subtitle.value = "";
  enableSearch.value = false;
  enableActions.value = false;
  enableExport.value = false;
  enableOpenRecord.value = false;
  enableSelect.value = false;
  tableActions.value = [];
  items.value = [];
};

// Lifecycle hooks
onMounted(() => {
  loadData();
});

// Watchers
watch(
  () => route.name,
  (newRouteName) => {
    if (newRouteName !== routeName.value) {
      routeName.value = newRouteName as string;
      loadData();
    }
  }
);

// Watch for refresh key changes to reload data
watch(
  () => appStore.refreshKey,
  () => {
    loadData();
  }
);
</script>

<style scoped></style>
