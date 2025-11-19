<template>
  <div class="performance-reviews">
    <!-- Header Section -->
    <v-card class="pa-4 ma-2 mb-4 header-card" elevation="3" rounded="lg">
      <v-card-title class="pa-0 mb-2">
        <h5 class="text-h5 text-primary font-weight-bold">
          Performance Reviews Dashboard
        </h5>
      </v-card-title>
      <v-card-subtitle class="pa-0">
        <p class="text-body-2 text-medium-emphasis">
          Comprehensive performance analytics and review management
        </p>
      </v-card-subtitle>
      <v-divider class="mt-4" />
    </v-card>

    <!-- Loading State -->
    <div v-if="loading" class="text-center pa-8">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
      <p class="mt-4 text-body-1">Loading performance data...</p>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Summary Cards -->
      <v-row class="ma-n1">
        <v-col cols="12" sm="6" md="3">
          <v-card
            class="pa-4 summary-card"
            elevation="3"
            rounded="lg"
            color="primary"
            variant="tonal"
          >
            <div class="d-flex align-center">
              <v-icon icon="mdi-chart-line" size="40" class="mr-3"></v-icon>
              <div>
                <h3 class="text-h3">{{ analytics.totalReviews }}</h3>
                <p class="text-body-2">Total Reviews</p>
              </div>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card
            class="pa-4 summary-card"
            elevation="3"
            rounded="lg"
            color="success"
            variant="tonal"
          >
            <div class="d-flex align-center">
              <v-icon icon="mdi-star" size="40" class="mr-3"></v-icon>
              <div>
                <h3 class="text-h3">
                  {{ analytics.averageRating.toFixed(1) }}
                </h3>
                <p class="text-body-2">Average Rating</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card
            class="pa-4 summary-card"
            elevation="3"
            rounded="lg"
            color="info"
            variant="tonal"
          >
            <div class="d-flex align-center">
              <v-icon icon="mdi-account-group" size="40" class="mr-3"></v-icon>
              <div>
                <h3 class="text-h3">
                  {{ Object.keys(analytics.departmentPerformance).length }}
                </h3>
                <p class="text-body-2">Departments</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card
            class="pa-4 summary-card"
            elevation="3"
            rounded="lg"
            color="warning"
            variant="tonal"
          >
            <div class="d-flex align-center">
              <v-icon icon="mdi-clock-alert" size="40" class="mr-3"></v-icon>
              <div>
                <h3 class="text-h3">{{ analytics.overdueReviews }}</h3>
                <p class="text-body-2">Overdue Reviews</p>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Charts Section -->
      <v-row class="ma-n1">
        <v-col cols="12" md="4">
          <PerformanceDistributionChart
            :rating-distribution="analytics.ratingDistribution"
          />
        </v-col>
        <v-col cols="12" md="8">
          <PerformanceTrendChart
            :performance-trends="analytics.performanceTrends"
          />
        </v-col>
      </v-row>

      <v-row class="ma-n1">
        <v-col cols="12">
          <DepartmentComparisonChart
            :department-performance="analytics.departmentPerformance"
          />
        </v-col>
      </v-row>

      <!-- Filters and Search -->
      <v-card class="pa-4 ma-2 mb-4 filters-card" elevation="3" rounded="lg">
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="searchQuery"
              label="Search employees..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              clearable
              hide-details
              class="search-field"
              color="primary"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="selectedDepartment"
              :items="departmentOptions"
              label="Department"
              variant="outlined"
              density="compact"
              clearable
              hide-details
              class="filter-field"
              color="primary"
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="selectedStatus"
              :items="statusOptions"
              label="Review Status"
              variant="outlined"
              density="compact"
              clearable
              hide-details
              class="filter-field"
              color="primary"
            ></v-select>
          </v-col>
          <v-col cols="12" md="2">
            <v-btn
              @click="resetFilters"
              variant="outlined"
              color="primary"
              block
              density="comfortable"
            >
              Reset Filters
            </v-btn>
          </v-col>
        </v-row>
      </v-card>

      <!-- Review Status Table -->
      <v-card class="pa-4 ma-2 table-card" elevation="3" rounded="lg">
        <v-card-title class="pa-0 mb-2">
          <h5 class="text-h5 text-primary font-weight-bold">
            Employee Review Status
          </h5>
        </v-card-title>
        <v-divider class="mb-4" />

        <v-data-table
          :headers="tableHeaders"
          :items="filteredEmployees"
          density="compact"
          class="elevation-0 rounded-lg performance-data-table"
          :items-per-page="15"
          :items-per-page-options="[10, 15, 25, 50]"
          :hide-default-footer="filteredEmployees.length < 11"
          hover
        >
          <template v-slot:item.reviewStatus="{ item }">
            <v-chip
              :color="getStatusColor(item.reviewStatus)"
              size="small"
              variant="tonal"
            >
              {{ getStatusText(item.reviewStatus) }}
            </v-chip>
          </template>

          <template v-slot:item.performanceRating="{ item }">
            <v-chip
              :color="getRatingColor(item.performanceRating)"
              size="small"
              variant="tonal"
            >
              {{ item.performanceRating }}
            </v-chip>
          </template>

          <template v-slot:item.daysOverdue="{ item }">
            <span v-if="item.daysOverdue" class="text-error font-weight-bold">
              {{ item.daysOverdue }} days
            </span>
            <span v-else class="text-success"> Current </span>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn
              icon="mdi-eye"
              size="small"
              variant="text"
              color="primary"
              @click="viewEmployee(item)"
            ></v-btn>
            <v-btn
              icon="mdi-calendar-plus"
              size="small"
              variant="text"
              color="primary"
              @click="scheduleReview(item)"
            ></v-btn>
            <v-btn
              icon="mdi-clipboard-check"
              size="small"
              variant="text"
              color="primary"
              @click="giveReview(item)"
            ></v-btn>
          </template>
        </v-data-table>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "../stores/app";
import type {
  PerformanceAnalytics,
  Employee,
  PerformanceRating,
} from "../types";
import PerformanceDistributionChart from "../components/charts/PerformanceDistributionChart.vue";
import PerformanceTrendChart from "../components/charts/PerformanceTrendChart.vue";
import DepartmentComparisonChart from "../components/charts/DepartmentComparisonChart.vue";
import { useDialogStore } from "../stores/dialog";

const router = useRouter();
const appStore = useAppStore();
const dialogStore = useDialogStore();

// Reactive data
const loading = ref(true);
const analytics = ref<PerformanceAnalytics>({
  totalReviews: 0,
  overdueReviews: 0,
  averageRating: 0,
  ratingDistribution: {
    "Exceeds Expectations": 0,
    "Meets Expectations": 0,
    "Needs Improvement": 0,
    Unsatisfactory: 0,
    Unrated: 0,
  },
  departmentPerformance: {},
  performanceTrends: [],
});
const employees = ref<Employee[]>([]);

// Filters
const searchQuery = ref("");
const selectedDepartment = ref<string | null>(null);
const selectedStatus = ref<string | null>(null);

// Filter options
const departmentOptions = computed(() => {
  const departments = [
    ...new Set(employees.value.map((item) => item.department)),
  ];
  return departments.sort();
});

const statusOptions = [
  { title: "Current", value: "current" },
  { title: "Due Soon", value: "due_soon" },
  { title: "Overdue", value: "overdue" },
  { title: "Never Reviewed", value: "never_reviewed" },
];

// Table configuration
const tableHeaders = [
  { title: "Employee", key: "fullName", sortable: true },
  { title: "Department", key: "department", sortable: true },
  { title: "Current Rating", key: "performanceRating", sortable: true },
  { title: "Last Review", key: "lastReviewDate", sortable: true },
  { title: "Next Review", key: "nextReviewDate", sortable: true },
  { title: "Status", key: "reviewStatus", sortable: true },
  { title: "Days Overdue", key: "daysOverdue", sortable: true },
  { title: "", key: "actions", sortable: false },
];

// Computed properties
const filteredEmployees = computed(() => {
  let filtered = employees.value;

  if (selectedDepartment.value) {
    filtered = filtered.filter(
      (item) => item.department === selectedDepartment.value
    );
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(
      (item) => item.reviewStatus === selectedStatus.value
    );
  }

  if (searchQuery.value) {
    filtered = filtered.filter((item) => {
      return tableHeaders.some((header) => {
        const value = item[header.key as keyof Employee];
        if (value == null) return false;
        return String(value)
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase());
      });
    });
  }

  return filtered;
});

// Methods
const loadData = async () => {
  try {
    loading.value = true;

    // Load analytics and review status in parallel
    const [analyticsData, employeesData] = await Promise.all([
      appStore.getPerformanceAnalytics(),
      appStore.getReviewStatusList(),
    ]);

    analytics.value = analyticsData;
    employees.value = employeesData;
  } catch (error) {
    console.error("Error loading performance data:", error);
  } finally {
    loading.value = false;
  }
};

const resetFilters = () => {
  searchQuery.value = "";
  selectedDepartment.value = null;
  selectedStatus.value = null;
};

const getStatusColor = (status: Employee["reviewStatus"]) => {
  switch (status) {
    case "current":
      return "success";
    case "due_soon":
      return "warning";
    case "overdue":
      return "error";
    case "never_reviewed":
      return "grey";
    default:
      return "grey";
  }
};

const getStatusText = (status: Employee["reviewStatus"]) => {
  switch (status) {
    case "current":
      return "Current";
    case "due_soon":
      return "Due Soon";
    case "overdue":
      return "Overdue";
    case "never_reviewed":
      return "Never Reviewed";
    default:
      return "Unknown";
  }
};

const getRatingColor = (rating: PerformanceRating) => {
  switch (rating) {
    case "Exceeds Expectations":
      return "success";
    case "Meets Expectations":
      return "primary";
    case "Needs Improvement":
      return "warning";
    case "Unsatisfactory":
      return "error";
    case "Unrated":
      return "grey";
    default:
      return "grey";
  }
};

const viewEmployee = (item: Employee) => {
  router.push({ name: "employee-edit", params: { id: item._id } });
};

const scheduleReview = (item: Employee) => {
  appStore.setSelectedEmployees([item]);
  const schedulePerformanceReviewAction = dialogStore.getActions([
    "schedule-performance-review",
  ]);
  if (schedulePerformanceReviewAction) {
    schedulePerformanceReviewAction[0].action();
  }
};

const giveReview = (item: Employee) => {
  appStore.setSelectedEmployees([item]);
  const giveReviewAction = dialogStore.getActions(["conduct-review"]);
  if (giveReviewAction) {
    giveReviewAction[0].action();
  }
};

// Lifecycle
onMounted(() => {
  loadData();
});
</script>

<style scoped>
/* Component-specific styles only - common styles are in global CSS */

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
  background: rgba(var(--color-primary-rgb), 0.02);
  border-radius: 8px;
}

/* Filter field enhancements */
.filter-field {
  transition: all 0.3s ease;
}

.filter-field :deep(.v-field__outline) {
  --v-field-border-opacity: 0.3;
}

.filter-field :deep(.v-field--focused .v-field__outline) {
  --v-field-border-opacity: 1;
  border-width: 2px;
}

/* Table styling */
.performance-data-table {
  background: transparent;
}

/* Table headers with enhanced styling */
.performance-data-table :deep(.v-data-table-header__content) {
  font-weight: 700;
  color: var(--color-secondary);
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

.performance-data-table :deep(.v-data-table__th) {
  background: #f5f7fa !important;
}

/* Row hover effects */
.performance-data-table :deep(.v-data-table__tr:hover) {
  background: linear-gradient(
    135deg,
    rgba(var(--color-primary-rgb), 0.04) 0%,
    rgba(var(--color-primary-rgb), 0.08) 100%
  );
  transform: scale(1.005);
  transition: all 0.2s ease;
}

.performance-data-table :deep(.v-data-table__td) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

/* Alternating row colors for better readability */
.performance-data-table :deep(.v-data-table__tr:nth-child(even)) {
  background: rgba(248, 250, 252, 0.5);
}

/* Footer styling */
.performance-data-table :deep(.v-data-table-footer) {
  background: linear-gradient(135deg, #f8fafc 0%, #e8f4fd 100%);
  border-top: 1px solid rgba(var(--color-primary-rgb), 0.2);
  border-radius: 0 0 12px 12px;
}

/* Pagination button styling */
.performance-data-table :deep(.v-pagination__item) {
  transition: all 0.3s ease;
}

.performance-data-table :deep(.v-pagination__item:hover) {
  background: rgba(var(--color-primary-rgb), 0.1);
  transform: scale(1.05);
}

.performance-data-table :deep(.v-pagination__item--is-active) {
  background: linear-gradient(
    135deg,
    var(--color-primary) 0%,
    var(--color-info) 100%
  );
  color: white;
  box-shadow: 0 2px 8px rgba(var(--color-primary-rgb), 0.3);
}

/* Card styling with subtle gradient */
.header-card,
.filters-card,
.table-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.header-card:hover,
.filters-card:hover,
.table-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

/* Summary card enhancements */
.summary-card {
  transition: all 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}
</style>
