<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useDisplay } from "vuetify";
import BaseDialog from "./components/baseDialog/BaseDialog.vue";
import { dialogRegistry, dialogMeta } from "./components/baseDialog/registry";
import { useDialogStore } from "./stores/dialog";
import { useNotificationStore } from "./stores/notification";
import { useAppStore } from "./stores/app";
import { useAuthStore } from "./stores/auth";

const router = useRouter();
const route = useRoute();
const rail = ref(false);
const drawer = ref(true);
const initialLoading = ref(true);

// Auto-collapse the sidebar to its icon rail below desktop (tablet/small laptop),
// keep it expanded on desktop. The toolbar button still toggles manually.
const { lgAndUp } = useDisplay();
watch(
  lgAndUp,
  (isDesktop) => {
    rail.value = !isDesktop;
  },
  { immediate: true }
);

// Grouped sidebar navigation (enterprise console structure)
const navGroups = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", icon: "mdi-view-dashboard-outline", to: "/" },
      { title: "Analytics", icon: "mdi-chart-box-outline", to: "/analytics" },
      {
        title: "Performance Reviews",
        icon: "mdi-chart-line",
        to: "/performance-reviews",
      },
    ],
  },
  {
    label: "People",
    items: [
      { title: "Search Employees", icon: "mdi-magnify", to: "/search-employees" },
      { title: "Add Employee", icon: "mdi-account-plus-outline", to: "/employee/new" },
      { title: "Organization Chart", icon: "mdi-sitemap-outline", to: "/org-chart" },
    ],
  },
  {
    label: "Segments",
    items: [
      { title: "By Manager", icon: "mdi-account-tie-outline", to: "/by-manager" },
      { title: "By Department", icon: "mdi-domain", to: "/by-department" },
      { title: "By Job Level", icon: "mdi-stairs", to: "/by-job-level" },
      { title: "By Status", icon: "mdi-account-switch-outline", to: "/by-status" },
      {
        title: "Contract Employees",
        icon: "mdi-file-document-outline",
        to: "/contract-employees",
      },
      {
        title: "Former Employees",
        icon: "mdi-account-minus-outline",
        to: "/former-employees",
      },
    ],
  },
  {
    label: "Pipeline",
    items: [
      {
        title: "Unassigned Hires",
        icon: "mdi-account-question-outline",
        to: "/unassigned-hires",
      },
      { title: "Recent Hires", icon: "mdi-clock-outline", to: "/recent-hires" },
      {
        title: "Updated Profiles",
        icon: "mdi-account-edit-outline",
        to: "/updated-profiles",
      },
    ],
  },
];

// Current page title for the top bar — prefer the route's human-readable title
// over its internal name (e.g. "Add Employee" instead of "employee-new").
const pageTitle = computed(
  () =>
    (route.meta?.title as string | undefined) ??
    (route.name ? String(route.name) : "Dashboard")
);

// Initials for the user avatar
const userInitials = computed(() => {
  const name = authStore.user?.full_name?.trim();
  if (!name) return "?";
  const parts = name.split(/\s+/);
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
});

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
      <v-navigation-drawer
        v-if="authStore.isAuthenticated"
        :rail="rail"
        v-model="drawer"
        permanent
        width="264"
        class="app-sidebar"
      >
        <!-- Brand header -->
        <div class="sidebar-brand" :class="{ 'sidebar-brand--rail': rail }">
          <router-link to="/" class="brand-link">
            <div class="brand-tile">
              <v-icon size="20" color="#EAB308">mdi-account-group</v-icon>
            </div>
            <div v-if="!rail" class="brand-text">
              <span class="brand-name">EMS</span>
              <span class="brand-sub">Employee Console</span>
            </div>
          </router-link>
        </div>

        <v-divider class="sidebar-divider" />

        <!-- Grouped navigation -->
        <div class="sidebar-nav">
          <template v-for="group in navGroups" :key="group.label">
            <div v-if="!rail" class="nav-group-label">{{ group.label }}</div>
            <v-list
              density="compact"
              nav
              color="primary"
              class="nav-list"
              :class="{ 'nav-list--rail': rail }"
            >
              <v-list-item
                v-for="item in group.items"
                :key="item.to"
                :to="item.to"
                :prepend-icon="item.icon"
                :title="item.title"
                class="nav-item"
                exact
              />
            </v-list>
          </template>
        </div>
      </v-navigation-drawer>

      <v-app-bar
        v-if="authStore.isAuthenticated"
        flat
        class="app-topbar"
        color="white"
        height="64"
      >
        <v-app-bar-nav-icon icon="mdi-menu" @click.stop="rail = !rail" />
        <v-app-bar-title class="topbar-title">
          {{ pageTitle }}
        </v-app-bar-title>

        <v-spacer></v-spacer>

        <template v-if="authStore.isAuthenticated && authStore.user">
          <div class="user-chip">
            <v-avatar size="32" color="primary" class="user-avatar">
              <span class="user-initials">{{ userInitials }}</span>
            </v-avatar>
            <span class="user-name">{{ authStore.user.full_name }}</span>
          </div>
          <v-btn
            icon="mdi-logout-variant"
            variant="text"
            class="ml-1"
            @click="handleLogout"
            title="Logout"
          ></v-btn>
        </template>
      </v-app-bar>
      <v-main>
        <!-- Global loading overlay -->
        <v-overlay
          :model-value="initialLoading"
          class="align-center justify-center"
        >
          <div class="d-flex flex-column align-center text-center">
            <v-progress-circular
              indeterminate
              size="64"
              color="primary"
            ></v-progress-circular>
            <div class="text-h6 mt-4">
              Loading Employee Management System...
            </div>
          </div>
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

<style scoped>
/* ===== Sidebar (midnight indigo) ===== */
.app-sidebar {
  background: var(--color-sidebar) !important;
  border-right: none !important;
  color: #e8e8f5;
}

/* Brand header */
.sidebar-brand {
  padding: 20px 16px 16px;
}
.sidebar-brand--rail {
  padding: 20px 0 16px;
  display: flex;
  justify-content: center;
}
.brand-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}
.brand-tile {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: rgba(129, 140, 248, 0.18);
  border: 1px solid rgba(129, 140, 248, 0.3);
  flex-shrink: 0;
}
.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}
.brand-name {
  font-size: 1.125rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: #ffffff;
}
.brand-sub {
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.4px;
  color: #a5a3d4;
}

.sidebar-divider {
  border-color: rgba(255, 255, 255, 0.08) !important;
}

/* Navigation */
.sidebar-nav {
  padding: 8px 0 24px;
  overflow-y: auto;
}
.nav-group-label {
  padding: 14px 20px 6px;
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.9px;
  color: #7c7aae;
}
.nav-list {
  background: transparent !important;
  padding: 0 10px;
}
.nav-list--rail {
  padding: 0 8px;
}

/* List item text/icons → light on indigo */
.app-sidebar :deep(.v-list-item__content),
.app-sidebar :deep(.v-list-item-title) {
  color: #c7c6e8;
  font-size: 0.84rem;
  font-weight: 600;
}
.app-sidebar :deep(.v-list-item__prepend > .v-icon) {
  color: #9a98ce;
  opacity: 1;
  margin-inline-end: 12px;
}
.app-sidebar :deep(.v-list-item) {
  border-radius: 8px;
  min-height: 40px;
  margin-bottom: 2px;
}

/* Hover */
.app-sidebar :deep(.v-list-item:hover) {
  background: rgba(255, 255, 255, 0.06);
}
.app-sidebar :deep(.v-list-item:hover .v-list-item-title) {
  color: #ffffff;
}
.app-sidebar :deep(.v-list-item:hover .v-icon) {
  color: #c7c6e8;
}

/* Active — soft violet text + left accent + tinted bg */
.app-sidebar :deep(.v-list-item--active) {
  background: rgba(129, 140, 248, 0.16);
}
.app-sidebar :deep(.v-list-item--active)::before {
  opacity: 0;
}
.app-sidebar :deep(.v-list-item--active .v-list-item-title) {
  color: #ffffff;
}
.app-sidebar :deep(.v-list-item--active .v-icon) {
  color: #818cf8;
  opacity: 1;
}
.app-sidebar :deep(.v-list-item--active)::after {
  content: "";
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 3px;
  border-radius: 0 3px 3px 0;
  background: #818cf8;
}

/* ===== Top bar (white) ===== */
.app-topbar {
  border-bottom: 1px solid var(--color-border) !important;
}
.topbar-title {
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--color-ink);
  letter-spacing: -0.01em;
}
.user-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 12px 4px 4px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  margin-right: 4px;
}
.user-initials {
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
}
.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-slate);
}
@media (max-width: 600px) {
  .user-name {
    display: none;
  }
}
</style>
