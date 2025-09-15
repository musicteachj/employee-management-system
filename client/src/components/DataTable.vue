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
    ></v-text-field>
    <v-data-table
      :search="search"
      :headers="computedHeaders"
      :items="items"
      density="compact"
      class="elevation-0 rounded"
      :items-per-page="10"
      :items-per-page-options="[5, 10, 25, 50]"
      :hide-default-footer="items.length < 10"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon icon="mdi-eye" @click="viewRecord(item)" />
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import { toRefs, ref, computed } from "vue";
import { useRouter } from "vue-router";
import type { Employee } from "../types";

const router = useRouter();

const props = defineProps<{
  items: Employee[];
  title: string;
  subtitle: string;
  enableSearch: boolean;
  enableActions: boolean;
  enableExport: boolean;
  enableOpenRecord: boolean;
  enableSelect: boolean;
}>();
const { items, title, subtitle, enableSearch, enableOpenRecord } =
  toRefs(props);

const computedHeaders = computed(() => {
  // if enableOpenRecord, add a new header with the key "Actions"
  const headers = [
    { title: "Name", key: "firstName" },
    { title: "Email", key: "personalEmail" },
    { title: "Phone", key: "phoneNumber" },
    { title: "Hire Date", key: "hireDate" },
  ];
  if (enableOpenRecord.value) {
    headers.push({ title: "", key: "actions", sortable: false } as any);
  }
  return headers;
});

const search = ref("");

const viewRecord = (item: Employee) => {
  router.push({ name: "employee-edit", params: { id: item._id } });
};
</script>

<style scoped>
/* Ensure table headers are bold */
:deep(.v-data-table-header__content) {
  font-weight: 600;
}
</style>
