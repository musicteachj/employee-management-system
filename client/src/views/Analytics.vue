<template>
  <div class="analytics">
    <!-- Page header -->
    <div class="page-head">
      <span class="eyebrow">Overview</span>
      <h1 class="page-title">Analytics</h1>
      <p class="page-subtitle">
        Comprehensive employee data analytics and insights.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center pa-8">
      <v-progress-circular
        indeterminate
        color="primary"
        size="56"
      ></v-progress-circular>
      <p class="mt-4 text-body-2 text-muted">Loading analytics data…</p>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Summary Cards -->
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <v-card class="kpi-card" flat>
            <div class="kpi-icon">
              <v-icon size="24">mdi-account-group</v-icon>
            </div>
            <div class="kpi-body">
              <span class="kpi-label">Total Employees</span>
              <span class="kpi-value tabular-nums">{{
                analytics.totalEmployees
              }}</span>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="kpi-card" flat>
            <div class="kpi-icon kpi-icon--success">
              <v-icon size="24">mdi-account-plus</v-icon>
            </div>
            <div class="kpi-body">
              <span class="kpi-label">Active Employees</span>
              <span class="kpi-value tabular-nums">{{
                analytics.activeEmployees
              }}</span>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="kpi-card" flat>
            <div class="kpi-icon kpi-icon--info">
              <v-icon size="24">mdi-domain</v-icon>
            </div>
            <div class="kpi-body">
              <span class="kpi-label">Departments</span>
              <span class="kpi-value tabular-nums">{{
                analytics.totalDepartments
              }}</span>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="kpi-card kpi-card--gold" flat>
            <div class="kpi-icon">
              <v-icon size="24">mdi-currency-usd</v-icon>
            </div>
            <div class="kpi-body">
              <span class="kpi-label">Average Salary</span>
              <span class="kpi-value tabular-nums">
                ${{ Math.round(analytics.averageSalary).toLocaleString() }}
              </span>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Charts Section Row 1 -->
      <v-row>
        <v-col cols="12" md="6">
          <v-card class="chart-card" flat>
            <div class="card-head">
              <v-icon size="20">mdi-chart-donut</v-icon>
              Department Distribution
            </div>
            <div class="pa-4">
              <div class="chart-container" style="height: 300px">
                <DepartmentDistributionChart
                  :department-data="analytics.departmentDistribution"
                />
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card class="chart-card" flat>
            <div class="card-head">
              <v-icon size="20">mdi-chart-pie</v-icon>
              Employment Status
            </div>
            <div class="pa-4">
              <div class="chart-container" style="height: 300px">
                <EmploymentStatusChart
                  :status-data="analytics.statusDistribution"
                />
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Charts Section Row 2 -->
      <v-row>
        <v-col cols="12" md="6">
          <v-card class="chart-card" flat>
            <div class="card-head">
              <v-icon size="20">mdi-chart-bar</v-icon>
              Salary Distribution by Department
            </div>
            <div class="pa-4">
              <div class="chart-container" style="height: 300px">
                <SalaryDistributionChart
                  :salary-data="analytics.salaryByDepartment"
                />
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card class="chart-card" flat>
            <div class="card-head">
              <v-icon size="20">mdi-chart-arc</v-icon>
              Job Level Distribution
            </div>
            <div class="pa-4">
              <div class="chart-container" style="height: 300px">
                <JobLevelChart
                  :job-level-data="analytics.jobLevelDistribution"
                />
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Charts Section Row 3 -->
      <v-row>
        <v-col cols="12">
          <v-card class="chart-card" flat>
            <div class="card-head">
              <v-icon size="20">mdi-chart-line</v-icon>
              Hiring Trends — Last 12 Months
            </div>
            <div class="pa-4">
              <div class="chart-container" style="height: 400px">
                <HiringTrendsChart :hiring-data="analytics.hiringTrends" />
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Additional Analytics Cards -->
      <v-row>
        <v-col cols="12" md="4">
          <v-card class="info-card" flat>
            <div class="card-head">
              <v-icon size="20">mdi-account-clock-outline</v-icon>
              Recent Hires — 30 Days
            </div>
            <v-list density="compact" class="px-2 py-1">
              <v-list-item
                v-for="hire in analytics.recentHires.slice(0, 5)"
                :key="hire.id"
                class="stat-row"
              >
                <v-list-item-title class="stat-row-title">
                  {{ hire.name }}
                </v-list-item-title>
                <v-list-item-subtitle class="stat-row-sub">
                  {{ hire.department }} • {{ hire.hireDate }}
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item
                v-if="analytics.recentHires.length === 0"
                class="stat-row"
              >
                <v-list-item-title class="text-muted">
                  No recent hires
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="info-card" flat>
            <div class="card-head">
              <v-icon size="20">mdi-trophy-outline</v-icon>
              Top Departments by Size
            </div>
            <v-list density="compact" class="px-2 py-1">
              <v-list-item
                v-for="dept in analytics.topDepartments"
                :key="dept.name"
                class="stat-row"
              >
                <v-list-item-title class="stat-row-title">
                  {{ dept.name }}
                </v-list-item-title>
                <template #append>
                  <span class="stat-pill tabular-nums">{{ dept.count }}</span>
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="info-card" flat>
            <div class="card-head">
              <v-icon size="20">mdi-briefcase-outline</v-icon>
              Employment Types
            </div>
            <v-list density="compact" class="px-2 py-1">
              <v-list-item
                v-for="type in analytics.employmentTypes"
                :key="type.type"
                class="stat-row"
              >
                <v-list-item-title class="stat-row-title">
                  {{ type.type }}
                </v-list-item-title>
                <v-list-item-subtitle class="stat-row-sub">
                  {{ type.count }} employees ({{ type.percentage }}%)
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import DepartmentDistributionChart from "../components/charts/DepartmentDistributionChart.vue";
import EmploymentStatusChart from "../components/charts/EmploymentStatusChart.vue";
import SalaryDistributionChart from "../components/charts/SalaryDistributionChart.vue";
import JobLevelChart from "../components/charts/JobLevelChart.vue";
import HiringTrendsChart from "../components/charts/HiringTrendsChart.vue";

// Reactive data
const loading = ref(true);

interface AnalyticsData {
  totalEmployees: number;
  activeEmployees: number;
  totalDepartments: number;
  averageSalary: number;
  departmentDistribution: { name: string; count: number; percentage: number }[];
  statusDistribution: { status: string; count: number; percentage: number }[];
  salaryByDepartment: {
    department: string;
    averageSalary: number;
    count: number;
  }[];
  jobLevelDistribution: { level: string; count: number; percentage: number }[];
  hiringTrends: { month: string; hires: number }[];
  recentHires: {
    id: string;
    name: string;
    department: string;
    hireDate: string;
  }[];
  topDepartments: { name: string; count: number }[];
  employmentTypes: { type: string; count: number; percentage: number }[];
}

const analytics = ref<AnalyticsData>({
  totalEmployees: 0,
  activeEmployees: 0,
  totalDepartments: 0,
  averageSalary: 0,
  departmentDistribution: [],
  statusDistribution: [],
  salaryByDepartment: [],
  jobLevelDistribution: [],
  hiringTrends: [],
  recentHires: [],
  topDepartments: [],
  employmentTypes: [],
});

// Methods
const loadAnalyticsData = async () => {
  try {
    loading.value = true;
    const response = await fetch("/api/analytics/dashboard");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    analytics.value = data;
  } catch (error) {
    console.error("Error loading analytics data:", error);
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  loadAnalyticsData();
});
</script>

<style scoped>
/* Component-specific styles only - common styles are in global CSS */
</style>
