<template>
  <v-card class="pa-4 ma-2 data-table-card" elevation="3" rounded="lg">
    <v-card-title v-if="showTitles" class="pa-0 mb-2">
      <h5 class="text-h5 text-primary font-weight-bold">{{ title }}</h5>
    </v-card-title>
    <v-card-subtitle v-if="showTitles" class="pa-0 mb-4">
      <p class="text-body-2 text-medium-emphasis">
        {{ subtitle }}
      </p>
    </v-card-subtitle>
    <v-divider v-if="showTitles" class="mb-4 divider-gradient" />
    <v-text-field
      v-if="enableSearch"
      v-model="search"
      label="Search employees..."
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      hide-details
      single-line
      density="compact"
      class="search-field mb-4"
      color="primary"
    ></v-text-field>

    <!-- Bulk Actions Toolbar -->
    <BulkActionsToolbar
      v-if="enableActions"
      :selected-items="selectedItems"
      :actions="actions"
    />

    <v-data-table
      :search="trimmedSearch"
      :headers="computedHeaders"
      :items="items"
      density="compact"
      class="elevation-0 rounded-lg data-table-custom"
      :show-select="enableSelect"
      :items-per-page="10"
      :items-per-page-options="[5, 10, 25, 50]"
      :hide-default-footer="items.length < 11"
      hover
      v-model="selectedItems"
      item-value="_id"
      return-object
    >
      <template v-slot:item.actions="{ item }">
        <v-btn
          icon
          size="small"
          variant="text"
          class="action-btn"
          @click="viewRecord(item)"
        >
          <v-icon icon="mdi-eye" color="primary" />
          <v-tooltip activator="parent" location="top">
            View Details
          </v-tooltip>
        </v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import { toRefs, ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import type { Employee, ActionType } from "../types";
import { useDialogStore } from "../stores/dialog";
import BulkActionsToolbar from "./BulkActionsToolbar.vue";
import { useAppStore } from "../stores/app";
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
  showTitles: boolean;
}>();
const {
  items,
  title,
  subtitle,
  enableSearch,
  enableOpenRecord,
  enableActions,
} = toRefs(props);

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
const selectedItems = computed<Employee[]>({
  get: () => appStore.selectedEmployees,
  set: (val) => appStore.setSelectedEmployees(val),
});

const trimmedSearch = computed(() => search.value.trim());

const viewRecord = (item: Employee) => {
  router.push({ name: "employee-edit", params: { id: item._id } });
};

const actions = computed(() => {
  return dialogStore.getActions(props.tableActions);
});

// Clear selections when underlying items set changes
watch(
  () => items.value,
  () => appStore.setSelectedEmployees([])
);
</script>

<style scoped>
/* Card styling with subtle gradient */
.data-table-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.data-table-card:hover {
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
.data-table-custom {
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

/* Action button styling */
.action-btn {
  transition: all 0.3s ease;
  border-radius: 50%;
}

.action-btn:hover {
  background: rgba(25, 118, 210, 0.1);
  transform: scale(1.1);
}

.action-btn :deep(.v-icon) {
  transition: all 0.3s ease;
}

.action-btn:hover :deep(.v-icon) {
  transform: scale(1.2);
  color: #1565c0;
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
</style>
