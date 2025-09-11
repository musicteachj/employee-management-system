<script setup lang="ts">
import { ref } from "vue";

const rail = ref(false);
const drawer = ref(true);
const open = ref<string[]>([]);
</script>

<template>
  <v-app>
    <v-layout>
      <v-app-bar color="primary" flat>
        <v-app-bar-nav-icon @click.stop="rail = !rail" />
        <v-app-bar-title> Employee Management System </v-app-bar-title>
      </v-app-bar>
      <v-navigation-drawer
        expand-on-hover
        :rail="rail"
        v-model="drawer"
        permanent
      >
        <v-list density="compact" v-model:opened="open">
          <v-list-item prepend-icon="mdi-account-plus">
            <v-list-item-title>New Hires</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-clock-outline">
            <v-list-item-title>Recent Hires</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-account-edit">
            <v-list-item-title>Updated Profiles</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-account-tie">
            <v-list-item-title>By Manager</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-domain">
            <v-list-item-title>By Department</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-chart-line">
            <v-list-item-title>Performance Reviews</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-content-duplicate">
            <v-list-item-title>Duplicate Records</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-account-switch">
            <v-list-item-title>Active/Terminated</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-handshake">
            <v-list-item-title>Contract Employees</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-account-minus">
            <v-list-item-title>Former Employees</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main>
        <router-view class="pa-4" />
      </v-main>
    </v-layout>
  </v-app>
</template>

<style scoped></style>
