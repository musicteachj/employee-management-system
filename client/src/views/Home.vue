<template>
  <v-container>
    <!-- Welcome Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="pa-6 text-center" color="primary" dark>
          <v-card-title class="text-h3 mb-2">
            <v-icon size="large" class="mr-3">mdi-office-building</v-icon>
            Welcome to Employee Management System
          </v-card-title>
          <v-card-subtitle class="text-h6">
            Manage your workforce efficiently and effectively
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <!-- Quick Stats -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center pa-4" elevation="2">
          <v-icon size="x-large" color="primary" class="mb-2"
            >mdi-account-multiple</v-icon
          >
          <h3 class="text-h4">{{ totalEmployees }}</h3>
          <p class="text-subtitle1">Total Employees</p>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center pa-4" elevation="2">
          <v-icon size="x-large" color="success" class="mb-2"
            >mdi-account-plus</v-icon
          >
          <h3 class="text-h4">{{ newHires }}</h3>
          <p class="text-subtitle1">New Hires</p>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center pa-4" elevation="2">
          <v-icon size="x-large" color="warning" class="mb-2"
            >mdi-domain</v-icon
          >
          <h3 class="text-h4">{{ totalDepartments }}</h3>
          <p class="text-subtitle1">Departments</p>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center pa-4" elevation="2">
          <v-icon size="x-large" color="info" class="mb-2"
            >mdi-chart-line</v-icon
          >
          <h3 class="text-h4">{{ activeRate }}%</h3>
          <p class="text-subtitle1">Active Rate</p>
        </v-card>
      </v-col>
    </v-row>

    <!-- Quick Actions -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>
            <v-icon class="mr-2">mdi-lightning-bolt</v-icon>
            Quick Actions
          </v-card-title>
          <v-card-text>
            <v-btn
              color="primary"
              class="ma-2"
              prepend-icon="mdi-account-plus"
              variant="outlined"
              @click="$router.push('/employee/new')"
            >
              Add New Employee
            </v-btn>
            <v-btn
              color="secondary"
              class="ma-2"
              prepend-icon="mdi-file-document"
              variant="outlined"
              @click="handleGenerateReport"
              :disabled="totalEmployees === 0"
            >
              Generate Report
            </v-btn>
            <v-btn
              color="secondary"
              class="ma-2"
              prepend-icon="mdi-chart-box"
              variant="outlined"
              @click="$router.push('/analytics')"
            >
              View Analytics
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-title>
            <v-icon class="mr-2">mdi-bell</v-icon>
            Recent Activity
          </v-card-title>
          <v-card-text>
            <v-list v-if="recentActivities.length > 0" density="compact">
              <v-list-item
                v-for="activity in recentActivities"
                :key="activity.id"
                :prepend-icon="activity.icon"
              >
                <v-list-item-title>{{ activity.title }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  activity.relativeTime
                }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
            <div v-else class="text-center text-medium-emphasis pa-4">
              <v-icon size="large" class="mb-2">mdi-information-outline</v-icon>
              <p>No recent activity to display</p>
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

<style scoped></style>
