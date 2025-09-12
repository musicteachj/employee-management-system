<template>
  <div>
    <DataTable :items="items" />
  </div>
</template>

<script setup lang="ts">
import DataTable from "../components/DataTable.vue";
import { useAppStore } from "../stores/app";
import { computed } from "vue";

const appStore = useAppStore();
const items = computed(() => appStore.employees);
</script>

<style scoped></style>
