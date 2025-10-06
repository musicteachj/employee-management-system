<template>
  <div>
    <!-- Search Form Card -->
    <v-card class="pa-4 ma-2 data-table-card" elevation="3" rounded="lg">
      <v-card-title class="pa-0 mb-2">
        <h5 class="text-h5 text-primary font-weight-bold">Search Employees</h5>
      </v-card-title>
      <v-card-subtitle class="pa-0 mb-4">
        <p class="text-body-2 text-medium-emphasis">
          Use the filters below to search for employees across all fields
        </p>
      </v-card-subtitle>
      <v-divider class="mb-4" />

      <!-- Search Form -->
      <v-form @submit.prevent="performSearch">
        <v-row>
          <!-- Essential Search Fields -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="searchCriteria.fullName"
              label="Employee Name"
              variant="outlined"
              density="compact"
              clearable
              prepend-inner-icon="mdi-account-search"
              hint="Search by first name, last name, or full name"
              color="primary"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-select
              v-model="searchCriteria.department"
              :items="departmentOptions"
              label="Department"
              variant="outlined"
              density="compact"
              clearable
              prepend-inner-icon="mdi-office-building"
              color="primary"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="searchCriteria.position"
              label="Position/Job Title"
              variant="outlined"
              density="compact"
              clearable
              prepend-inner-icon="mdi-briefcase"
              color="primary"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-select
              v-model="searchCriteria.status"
              :items="appStore.formOptions.statuses"
              label="Employment Status"
              variant="outlined"
              density="compact"
              clearable
              prepend-inner-icon="mdi-account-check"
              color="primary"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-select
              v-model="searchCriteria.managerId"
              :items="managerOptions"
              item-title="name"
              item-value="id"
              label="Manager"
              variant="outlined"
              density="compact"
              clearable
              prepend-inner-icon="mdi-account-supervisor"
              color="primary"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-select
              v-model="searchCriteria.employmentType"
              :items="appStore.formOptions.employmentTypes"
              label="Employment Type"
              variant="outlined"
              density="compact"
              clearable
              prepend-inner-icon="mdi-card-account-details"
              color="primary"
            />
          </v-col>

          <!-- Validation Message -->
          <v-col v-if="!hasValidInput && showValidationMessage" cols="12">
            <v-alert
              type="info"
              variant="tonal"
              density="compact"
              icon="mdi-information"
              class="mb-2"
            >
              Please fill out at least one search field to find employees.
            </v-alert>
          </v-col>

          <!-- Action Buttons -->
          <v-col cols="12" class="d-flex gap-3 mt-4">
            <v-btn
              type="submit"
              color="primary"
              variant="elevated"
              prepend-icon="mdi-magnify"
              :loading="searching"
              :disabled="!hasValidInput"
              size="large"
              class="mr-3"
            >
              Search Employees
            </v-btn>

            <v-btn
              color="secondary"
              variant="outlined"
              prepend-icon="mdi-refresh"
              @click="clearSearch"
              size="large"
              class="mr-3"
            >
              Clear All
            </v-btn>

            <v-btn
              v-if="searchResults.length > 0"
              color="secondary"
              variant="outlined"
              prepend-icon="mdi-download"
              @click="exportResults"
              size="large"
            >
              Export Results ({{ searchResults.length }})
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>

    <!-- Search Results -->
    <div v-if="hasSearched && searchResults.length > 0">
      <DataTable
        :items="searchResults"
        :title="`Search Results`"
        :subtitle="`Found ${searchResults.length} employee${
          searchResults.length !== 1 ? 's' : ''
        } matching your criteria`"
        :loading="searching"
        :loading-text="'Searching employees...'"
        :enableSearch="false"
        :enableActions="false"
        :enableExport="true"
        :enableOpenRecord="true"
        :enableSelect="false"
        :tableActions="[]"
        :tableColumns="tableColumns"
        :showTitles="true"
      />
    </div>

    <!-- No Results Message -->
    <v-card
      v-if="hasSearched && searchResults.length === 0 && !searching"
      class="pa-6 ma-2 text-center"
      elevation="2"
      rounded="lg"
    >
      <v-icon
        icon="mdi-account-search"
        size="64"
        color="grey-lighten-1"
        class="mb-4"
      />
      <h6 class="text-h6 text-medium-emphasis mb-2">No employees found</h6>
      <p class="text-body-2 text-medium-emphasis">
        Try adjusting your search criteria or clearing some filters to see more
        results.
      </p>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from "vue";
import { useAppStore } from "../stores/app";
import DataTable from "../components/DataTable.vue";
import type { Employee, EmploymentType, ActiveStatus } from "../types";

const appStore = useAppStore();

// Search state
const searching = ref(false);
const hasSearched = ref(false);
const searchResults = ref<Employee[]>([]);
const showValidationMessage = ref(false);

// Simplified search criteria interface for essential fields
interface SearchCriteria {
  fullName?: string;
  department?: string;
  position?: string;
  status?: ActiveStatus;
  managerId?: string;
  employmentType?: EmploymentType;
}

// Initialize search criteria
const searchCriteria = reactive<SearchCriteria>({
  fullName: "",
  department: "",
  position: "",
  status: undefined,
  managerId: "",
  employmentType: undefined,
});

// Computed options for dropdowns
const departmentOptions = computed(() => {
  const uniqueDepartments = [
    ...new Set(appStore.employees.map((emp) => emp.department)),
  ];
  return uniqueDepartments.sort();
});

const managerOptions = computed(() => {
  return appStore.managers.map((manager) => ({
    id: manager.id,
    name: `${manager.name} (${manager.department})`,
  }));
});

// Validation - check if at least one field has a value
const hasValidInput = computed(() => {
  return (
    (searchCriteria.fullName && searchCriteria.fullName.trim()) ||
    (searchCriteria.department && searchCriteria.department.trim()) ||
    (searchCriteria.position && searchCriteria.position.trim()) ||
    searchCriteria.status ||
    (searchCriteria.managerId && searchCriteria.managerId.trim()) ||
    searchCriteria.employmentType
  );
});

// Table columns for search results
const tableColumns = ref([
  "firstName",
  "lastName",
  "department",
  "position",
  "jobLevel",
  "employmentType",
  "workLocation",
  "managerName",
  "hireDate",
  "status",
]);

// Methods
const performSearch = async () => {
  // Validate that at least one field is filled
  if (!hasValidInput.value) {
    showValidationMessage.value = true;
    return;
  }

  try {
    searching.value = true;
    hasSearched.value = true;
    showValidationMessage.value = false;

    // Clean up empty values from search criteria
    const cleanCriteria: any = {};

    // Add non-empty string values
    Object.entries(searchCriteria).forEach(([key, value]) => {
      if (typeof value === "string" && value.trim()) {
        cleanCriteria[key] = value.trim();
      } else if (value && typeof value === "object" && !Array.isArray(value)) {
        // Handle nested objects like hireDate, salary, etc.
        const cleanNested: any = {};
        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
          if (
            nestedValue !== undefined &&
            nestedValue !== null &&
            nestedValue !== ""
          ) {
            cleanNested[nestedKey] = nestedValue;
          }
        });
        if (Object.keys(cleanNested).length > 0) {
          cleanCriteria[key] = cleanNested;
        }
      } else if (value !== undefined && value !== null && value !== "") {
        cleanCriteria[key] = value;
      }
    });

    console.log("Performing search with criteria:", cleanCriteria);
    searchResults.value = await appStore.searchEmployees(cleanCriteria);
  } catch (error) {
    console.error("Search failed:", error);
    searchResults.value = [];
  } finally {
    searching.value = false;
  }
};

const clearSearch = () => {
  // Reset all search criteria
  Object.assign(searchCriteria, {
    fullName: "",
    department: "",
    position: "",
    status: undefined,
    managerId: "",
    employmentType: undefined,
  });

  // Clear results and validation
  searchResults.value = [];
  hasSearched.value = false;
  showValidationMessage.value = false;
};

const exportResults = () => {
  // TODO: Implement CSV export functionality
  console.log("Exporting search results:", searchResults.value);
};

// Load initial data on mount
onMounted(async () => {
  // Could pre-populate with recent searches or load all employees for quick access
});
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

/* Form field enhancements */
::deep(.v-field__outline) {
  --v-field-border-opacity: 0.3;
}

::deep(.v-field--focused .v-field__outline) {
  --v-field-border-opacity: 1;
  border-width: 2px;
}

::deep(.v-field__input) {
  background: rgba(var(--color-primary-rgb), 0.02);
  border-radius: 8px;
}

/* Button styling */
.v-btn {
  transition: all 0.3s ease;
}

.v-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
