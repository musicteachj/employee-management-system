<template>
  <v-container fluid class="pa-0">
    <!-- Page header -->
    <div class="page-head d-flex flex-wrap align-center justify-space-between">
      <div>
        <span class="eyebrow">Overview</span>
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">
          A live snapshot of your workforce and recent activity.
        </p>
      </div>
      <v-btn
        color="primary"
        prepend-icon="mdi-account-plus-outline"
        @click="$router.push('/employee/new')"
      >
        Add Employee
      </v-btn>
    </div>

    <!-- KPI stats -->
    <v-row class="mb-2">
      <v-col cols="12" sm="6" md="3">
        <v-card class="kpi-card kpi-card--gold" flat>
          <div class="kpi-icon">
            <v-icon size="24">mdi-account-multiple</v-icon>
          </div>
          <div class="kpi-body">
            <span class="kpi-label">Total Employees</span>
            <span class="kpi-value tabular-nums">{{ totalEmployees }}</span>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="kpi-card" flat>
          <div class="kpi-icon kpi-icon--success">
            <v-icon size="24">mdi-account-plus</v-icon>
          </div>
          <div class="kpi-body">
            <span class="kpi-label">New Hires</span>
            <span class="kpi-value tabular-nums">{{ newHires }}</span>
            <span class="kpi-sub">Last 30 days</span>
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
            <span class="kpi-value tabular-nums">{{ totalDepartments }}</span>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="kpi-card" flat>
          <div class="kpi-icon">
            <v-icon size="24">mdi-chart-line</v-icon>
          </div>
          <div class="kpi-body">
            <span class="kpi-label">Active Rate</span>
            <span class="kpi-value tabular-nums">{{ activeRate }}%</span>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Quick actions + recent activity -->
    <v-row>
      <v-col cols="12" md="5">
        <v-card class="info-card" flat>
          <div class="card-head">
            <v-icon size="20">mdi-lightning-bolt-outline</v-icon>
            Quick Actions
          </div>
          <v-card-text class="pa-4">
            <div class="d-flex flex-column gap-3">
              <v-btn
                color="primary"
                prepend-icon="mdi-account-plus-outline"
                block
                @click="$router.push('/employee/new')"
              >
                Add New Employee
              </v-btn>
              <v-btn
                color="primary"
                variant="outlined"
                prepend-icon="mdi-chart-box-outline"
                block
                @click="$router.push('/analytics')"
              >
                View Analytics
              </v-btn>
              <v-btn
                variant="outlined"
                prepend-icon="mdi-file-download-outline"
                block
                @click="handleGenerateReport"
                :disabled="totalEmployees === 0"
              >
                Generate Report
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="7">
        <v-card class="info-card" flat>
          <div class="card-head">
            <v-icon size="20">mdi-bell-outline</v-icon>
            Recent Activity
          </div>
          <v-card-text class="pa-2">
            <v-list v-if="recentActivities.length > 0" class="activity-list">
              <v-list-item
                v-for="activity in recentActivities"
                :key="activity.id"
                class="activity-item"
              >
                <template #prepend>
                  <div class="activity-icon">
                    <v-icon size="18">{{ activity.icon }}</v-icon>
                  </div>
                </template>
                <v-list-item-title class="activity-title">{{
                  activity.title
                }}</v-list-item-title>
                <v-list-item-subtitle class="activity-time">{{
                  activity.relativeTime
                }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
            <div v-else class="empty-state ma-2">
              <v-icon size="32" class="mb-2">mdi-information-outline</v-icon>
              <p class="mb-0">No recent activity to display</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAppStore } from "../stores/app";
import { exportFullEmployeeReport } from "../modules/genericHelper";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { RecentActivity } from "../types";

dayjs.extend(relativeTime);

const appStore = useAppStore();

// Calculate total employees (excluding terminated)
const totalEmployees = computed(() => {
  return appStore.employees.filter((emp) => emp.status !== "Terminated").length;
});

// Calculate new hires (within 30 days)
const newHires = computed(() => {
  const thirtyDaysAgo = dayjs().subtract(30, "day");
  return appStore.employees.filter((emp) => {
    const hireDate = dayjs(emp.hireDate);
    return (
      hireDate.isAfter(thirtyDaysAgo) || hireDate.isSame(thirtyDaysAgo, "day")
    );
  }).length;
});

// Get total departments count
const totalDepartments = computed(() => {
  return appStore.departments.length;
});

// Calculate active rate (active employees / total employees * 100)
const activeRate = computed(() => {
  const totalEmps = appStore.employees.length;
  const activeEmps = appStore.employees.filter(
    (emp) => emp.status === "Active"
  ).length;
  return totalEmps > 0 ? Math.round((activeEmps / totalEmps) * 100) : 0;
});

// Get recent activity from employee data
const recentActivities = computed((): RecentActivity[] => {
  const activities: RecentActivity[] = [];

  // Get recent hires (within 30 days)
  const thirtyDaysAgo = dayjs().subtract(30, "day");
  appStore.employees.forEach((emp) => {
    const hireDate = dayjs(emp.hireDate);
    if (
      hireDate.isAfter(thirtyDaysAgo) ||
      hireDate.isSame(thirtyDaysAgo, "day")
    ) {
      activities.push({
        id: `hire-${emp._id}`,
        type: "new_hire",
        icon: "mdi-account-plus",
        title: `${emp.fullName} joined ${emp.department}`,
        timestamp: emp.hireDate,
        relativeTime: hireDate.fromNow(),
      });
    }
  });

  // Get recent profile updates (within 14 days)
  const fourteenDaysAgo = dayjs().subtract(14, "day");
  appStore.employees.forEach((emp) => {
    const updateDate = emp.updatedAt || emp.lastProfileUpdate;
    if (updateDate) {
      const updated = dayjs(updateDate);
      if (
        updated.isAfter(fourteenDaysAgo) ||
        updated.isSame(fourteenDaysAgo, "day")
      ) {
        // Don't show if it's the same as hire date (to avoid duplicates)
        if (!dayjs(emp.hireDate).isSame(updated, "day")) {
          activities.push({
            id: `update-${emp._id}`,
            type: "profile_update",
            icon: "mdi-account-edit",
            title: `${emp.fullName} updated profile`,
            timestamp: updateDate,
            relativeTime: updated.fromNow(),
          });
        }
      }
    }
  });

  // Get recent performance reviews (within 30 days)
  appStore.employees.forEach((emp) => {
    if (emp.performanceHistory && emp.performanceHistory.length > 0) {
      const latestReview =
        emp.performanceHistory[emp.performanceHistory.length - 1];
      const reviewDate = dayjs(latestReview.reviewDate);
      if (
        reviewDate.isAfter(thirtyDaysAgo) ||
        reviewDate.isSame(thirtyDaysAgo, "day")
      ) {
        activities.push({
          id: `review-${emp._id}-${latestReview.reviewId}`,
          type: "review",
          icon: "mdi-chart-line",
          title: `${emp.fullName} completed performance review`,
          timestamp: latestReview.reviewDate,
          relativeTime: reviewDate.fromNow(),
        });
      }
    }
  });

  // Sort by timestamp (most recent first) and limit to 5
  return activities
    .sort((a, b) => dayjs(b.timestamp).valueOf() - dayjs(a.timestamp).valueOf())
    .slice(0, 5);
});

// Generate comprehensive employee report
const handleGenerateReport = () => {
  if (appStore.employees.length === 0) {
    console.warn("No employees to export");
    return;
  }

  exportFullEmployeeReport(appStore.employees, "employee_full_report");
};
</script>

<style scoped>
.activity-list {
  background: transparent;
}
.activity-item {
  border-radius: var(--radius-sm);
  margin-bottom: 2px;
}
.activity-item:hover {
  background: var(--color-surface);
}
.activity-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 9px;
  margin-right: 12px;
  background: rgba(var(--color-primary-rgb), 0.1);
  color: var(--color-primary);
}
.activity-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-ink);
}
.activity-time {
  font-size: 0.75rem;
  color: var(--color-gray);
}
</style>
