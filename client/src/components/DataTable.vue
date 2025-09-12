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
    <v-data-table
      :headers="headers"
      :items="items"
      density="compact"
      class="elevation-0 rounded"
      :items-per-page="10"
      :items-per-page-options="[5, 10, 25, 50]"
      :hide-default-footer="items.length < 10"
    />
  </v-card>
</template>

<script setup lang="ts">
import { toRefs } from "vue";
const props = defineProps<{
  items: any[];
  title: string;
  subtitle: string;
}>();
const { items, title, subtitle } = toRefs(props);

const headers = [
  { title: "Name", key: "firstName" },
  { title: "Email", key: "personalEmail" },
  { title: "Phone", key: "phoneNumber" },
  { title: "Hire Date", key: "hireDate" },
];
</script>

<style scoped>
/* Ensure table headers are bold */
:deep(.v-data-table-header__content) {
  font-weight: 600;
}
</style>
