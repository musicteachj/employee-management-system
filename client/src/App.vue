<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import BaseDialog from "./components/baseDialog/BaseDialog.vue";
import { dialogRegistry, dialogMeta } from "./components/baseDialog/registry";
import { useDialogStore } from "./stores/dialog";
import { useNotificationStore } from "./stores/notification";
import { useAppStore } from "./stores/app";
import { useAuthStore } from "./stores/auth";

const router = useRouter();
const rail = ref(false);
const drawer = ref(true);
const open = ref<string[]>([]);
const initialLoading = ref(true);

const dialogStore = useDialogStore();
const notificationStore = useNotificationStore();
const appStore = useAppStore();
const authStore = useAuthStore();

const currentDialog = computed(() => {
  const t = dialogStore.dialogState.type as keyof typeof dialogRegistry | null;
  return t ? dialogRegistry[t] : null;
});

// Get color based on notification type
const snackbarColor = computed(() => {
  switch (notificationStore.type) {
    case "success":
      return "success";
    case "error":
      return "error";
    case "warning":
      return "warning";
    case "info":
      return "info";
    default:
      return "info";
  }
});

// Handle logout
const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};

// Load employee data
const loadEmployeeData = async () => {
  try {
    await Promise.all([
      appStore.getEmployees(),
      // Add other initial data fetches here if needed
    ]);
  } catch (error) {
    console.error("Error loading employee data:", error);
    notificationStore.showError(
      "Failed to load employee data. Please try again."
    );
  }
};

// Watch for authentication changes and load data when user logs in
watch(
  () => authStore.isAuthenticated,
  async (isAuthenticated) => {
    if (isAuthenticated) {
      await loadEmployeeData();
    }
  }
);

// Initialize app data on mount
onMounted(async () => {
  try {
    // Load employee data if already authenticated (page refresh)
    if (authStore.isAuthenticated) {
      await loadEmployeeData();
    }
  } catch (error) {
    console.error("Error loading initial data:", error);
    notificationStore.showError(
      "Failed to load application data. Please refresh the page."
    );
  } finally {
    initialLoading.value = false;
  }
});

watch(
  () => dialogStore.dialogState.type,
  (t) => {
    if (t && dialogMeta[t as keyof typeof dialogMeta]) {
      const meta = dialogMeta[t as keyof typeof dialogMeta];
      dialogStore.setDialog({
        ...dialogStore.dialogState,
        ...meta,
        show: true,
        type: t,
      });
    }
  }
);
</script>

<template>
  <v-app>
    <v-layout>
      <v-app-bar color="primary" flat>
        <v-app-bar-nav-icon
          v-if="authStore.isAuthenticated"
          @click.stop="rail = !rail"
        />
        <v-app-bar-title>
          <router-link to="/" class="text-white text-decoration-none">
            Employee Management System
          </router-link>
        </v-app-bar-title>

        <v-spacer></v-spacer>

        <template v-if="authStore.isAuthenticated && authStore.user">
          <v-chip class="mr-2" variant="flat" color="white">
            <v-icon class="mr-2" color="primary">mdi-account-circle</v-icon>
            {{ authStore.user.full_name }}
          </v-chip>
          <v-btn icon="mdi-logout" @click="handleLogout" title="Logout"></v-btn>
        </template>
      </v-app-bar>
      <v-navigation-drawer
        v-if="authStore.isAuthenticated"
        expand-on-hover
        :rail="rail"
        v-model="drawer"
        permanent
      >
        <v-list density="compact" v-model:opened="open" color="primary">
          <v-list-item prepend-icon="mdi-plus" to="/employee/new">
            <v-list-item-title>Add New Employee</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-magnify" to="/search-employees">
            <v-list-item-title>Search Employees</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-account-plus" to="/unassigned-hires">
            <v-list-item-title>Unassigned Hires</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-clock-outline" to="/recent-hires">
            <v-list-item-title>Recent Hires</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-account-edit" to="/updated-profiles">
            <v-list-item-title>Updated Profiles</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-account-tie" to="/by-manager">
            <v-list-item-title>By Manager</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-domain" to="/by-department">
            <v-list-item-title>By Department</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-account-switch" to="/by-status">
            <v-list-item-title>By Status</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-handshake" to="/contract-employees">
            <v-list-item-title>Contract Employees</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-account-minus" to="/former-employees">
            <v-list-item-title>Former Employees</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-chart-line" to="/performance-reviews">
            <v-list-item-title>Performance Reviews</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-chart-box" to="/analytics">
            <v-list-item-title>Analytics</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-sitemap" to="/org-chart">
            <v-list-item-title>Organization Chart</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main>
        <!-- Global loading overlay -->
        <v-overlay
          :model-value="initialLoading"
          class="align-center justify-center"
        >
          <v-progress-circular
            indeterminate
            size="64"
            color="primary"
          ></v-progress-circular>
          <div class="text-h6 mt-4">Loading Employee Management System...</div>
        </v-overlay>

        <router-view v-if="!initialLoading" class="pa-4" />
        <BaseDialog>
          <component :is="currentDialog" v-if="currentDialog" />
        </BaseDialog>
      </v-main>

      <!-- Global notification snackbar -->
      <v-snackbar
        v-model="notificationStore.show"
        :timeout="notificationStore.timeout"
        :color="snackbarColor"
        location="top right"
        elevation="24"
      >
        {{ notificationStore.message }}
        <template v-slot:actions>
          <v-btn
            variant="text"
            @click="notificationStore.hideNotification"
            icon="mdi-close"
          ></v-btn>
        </template>
      </v-snackbar>
    </v-layout>
  </v-app>
</template>

<style scoped></style>
