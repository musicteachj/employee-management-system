<template>
  <div class="performance-reviews">
    <!-- Page header -->
    <div class="page-head">
      <span class="eyebrow">Overview</span>
      <h1 class="page-title">Performance Reviews</h1>
      <p class="page-subtitle">
        Performance analytics and review management across your organization.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center pa-8">
      <v-progress-circular
        indeterminate
        color="primary"
        size="56"
      ></v-progress-circular>
      <p class="mt-4 text-body-2 text-muted">Loading performance data…</p>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Summary Cards -->
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <v-card class="kpi-card" flat>
            <div class="kpi-icon">
              <v-icon size="24">mdi-chart-line</v-icon>
            </div>
            <div class="kpi-body">
              <span class="kpi-label">Total Reviews</span>
              <span class="kpi-value tabular-nums">{{
                analytics.totalReviews
              }}</span>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="kpi-card kpi-card--gold" flat>
            <div class="kpi-icon">
              <v-icon size="24">mdi-star</v-icon>
            </div>
            <div class="kpi-body">
              <span class="kpi-label">Average Rating</span>
              <span class="kpi-value tabular-nums">{{
                analytics.averageRating.toFixed(1)
              }}</span>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="kpi-card" flat>
            <div class="kpi-icon kpi-icon--info">
              <v-icon size="24">mdi-account-group</v-icon>
            </div>
            <div class="kpi-body">
              <span class="kpi-label">Departments</span>
              <span class="kpi-value tabular-nums">{{
                Object.keys(analytics.departmentPerformance).length
              }}</span>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="kpi-card" flat>
            <div class="kpi-icon kpi-icon--error">
              <v-icon size="24">mdi-clock-alert-outline</v-icon>
            </div>
            <div class="kpi-body">
              <span class="kpi-label">Overdue Reviews</span>
              <span class="kpi-value tabular-nums">{{
                analytics.overdueReviews
              }}</span>
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
      <v-card class="pa-4 mb-4 filters-card" flat>
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
      <v-card class="table-card" flat>
        <div class="card-head">
          <v-icon size="20">mdi-clipboard-text-clock-outline</v-icon>
          Employee Review Status
        </div>

        <v-data-table
          :headers="tableHeaders"
          :items="filteredEmployees"
          density="compact"
          class="elevation-0 performance-data-table px-2 pb-2"
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
/* Component-specific styles only — common table/card styles live in global CSS */
.performance-data-table {
  background: transparent;
}
</style>
