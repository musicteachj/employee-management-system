<template>
  <div>
    <AccordionTable
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
      :tableColumns="tableColumns"
      :groupByInfo="groupByInfo"
      :tableActions="tableActions"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import type { Employee, GroupByInfo, ActionType } from "../types";
import { useAppStore } from "../stores/app";
import AccordionTable from "../components/AccordionTable.vue";

const appStore = useAppStore();
const route = useRoute();

// Variables
const title = ref("");
const subtitle = ref("");
const loading = ref(false);
const loadingText = ref("Loading accordion data...");
const routeName = ref(route.name as string);
const enableSearch = ref(false);
const enableActions = ref(false);
const enableExport = ref(false);
const enableOpenRecord = ref(false);
const enableSelect = ref(false);
const tableActions = ref<ActionType[]>([]);
const items = ref<Employee[]>([]);
const tableColumns = ref<string[]>([]);
const groupByInfo = ref<GroupByInfo>({
  groupBy: null,
  groupByOptions: [],
});

// Lifecycle hooks
onMounted(() => {
  loadData();
});

const loadData = async () => {
  try {
    loading.value = true;
    // Reset variables before loading data
    resetData();
    // Populate data based on route name
    switch (routeName.value) {
      case "By Manager":
        title.value = "By Manager";
        subtitle.value = "Employees by manager";
        enableSearch.value = true;
        enableActions.value = true;
        enableExport.value = true;
        enableOpenRecord.value = true;
        enableSelect.value = true;
        items.value = await appStore.getByManager();
        tableColumns.value = [
          "firstName",
          "lastName",
          "department",
          "position",
          "workEmail",
          "hireDate",
          "status",
        ];
        groupByInfo.value = {
          groupBy: "managerName",
          groupByOptions: ["managerName"],
        };
        tableActions.value = ["assign-to-manager", "export-data"];
        break;
      case "By Department":
        title.value = "By Department";
        subtitle.value = "Employees by department";
        enableSearch.value = true;
        enableActions.value = true;
        enableExport.value = true;
        enableOpenRecord.value = true;
        enableSelect.value = true;
        items.value = await appStore.getByDepartment();
        tableColumns.value = [
          "firstName",
          "lastName",
          "position",
          "managerName",
          "workEmail",
          "hireDate",
          "status",
        ];
        groupByInfo.value = {
          groupBy: "department",
          groupByOptions: ["department"],
        };
        tableActions.value = ["training-status-update", "export-data"];
        break;
      case "By Status":
        title.value = "By Status";
        subtitle.value = "Employees by status";
        enableSearch.value = true;
        enableActions.value = true;
        enableExport.value = true;
        enableOpenRecord.value = true;
        enableSelect.value = true;
        items.value = await appStore.getActiveTerminated();
        tableColumns.value = [
          "firstName",
          "lastName",
          "department",
          "position",
          "managerName",
          "workEmail",
          "hireDate",
          "terminationDate",
        ];
        groupByInfo.value = {
          groupBy: "status",
          groupByOptions: ["status"],
        };
        tableActions.value = ["status-change", "export-data"];
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
  tableColumns.value = [];
};

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
