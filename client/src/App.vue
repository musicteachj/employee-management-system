<script setup lang="ts">
import { ref, computed, watch } from "vue";
// Components
import BaseDialog from "./components/baseDialog/BaseDialog.vue";
// import AssignManager from "./components/baseDialog/dialogContent/AssignManager.vue";
// import ConvertEmployeeType from "./components/baseDialog/dialogContent/ConvertEmployeeType.vue";
// import RehireEmployee from "./components/baseDialog/dialogContent/RehireEmployee.vue";
import { dialogRegistry, dialogMeta } from "./components/baseDialog/registry";
import { useDialogStore } from "./stores/dialog";

const rail = ref(false);
const drawer = ref(true);
const open = ref<string[]>([]);
const dialogStore = useDialogStore();

const currentDialog = computed(() => {
  const t = dialogStore.dialogState.type as keyof typeof dialogRegistry | null;
  return t ? dialogRegistry[t] : null;
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
        <v-app-bar-nav-icon @click.stop="rail = !rail" />
        <v-app-bar-title>
          <router-link to="/" class="text-white text-decoration-none">
            Employee Management System
          </router-link>
        </v-app-bar-title>
      </v-app-bar>
      <v-navigation-drawer
        expand-on-hover
        :rail="rail"
        v-model="drawer"
        permanent
      >
        <v-list density="compact" v-model:opened="open" color="primary">
          <v-list-item prepend-icon="mdi-plus" to="/employee/new">
            <v-list-item-title>Add new employee</v-list-item-title>
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
        <router-view class="pa-4" />
        <BaseDialog>
          <!-- <AssignManager
            v-if="dialogStore.dialogState.type === 'assign-to-manager'"
          />
          <ConvertEmployeeType
            v-if="dialogStore.dialogState.type === 'convert-employee-type'"
          />
          <RehireEmployee
            v-if="dialogStore.dialogState.type === 'rehire-employee'"
          /> -->
          <component :is="currentDialog" v-if="currentDialog" />
        </BaseDialog>
      </v-main>
    </v-layout>
  </v-app>
</template>

<style scoped></style>
