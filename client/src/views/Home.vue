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
          <h3 class="text-h4">150</h3>
          <p class="text-subtitle1">Total Employees</p>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center pa-4" elevation="2">
          <v-icon size="x-large" color="success" class="mb-2"
            >mdi-account-plus</v-icon
          >
          <h3 class="text-h4">12</h3>
          <p class="text-subtitle1">New Hires</p>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center pa-4" elevation="2">
          <v-icon size="x-large" color="warning" class="mb-2"
            >mdi-domain</v-icon
          >
          <h3 class="text-h4">8</h3>
          <p class="text-subtitle1">Departments</p>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center pa-4" elevation="2">
          <v-icon size="x-large" color="info" class="mb-2"
            >mdi-chart-line</v-icon
          >
          <h3 class="text-h4">95%</h3>
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
            >
              Add New Employee
            </v-btn>
            <v-btn
              color="secondary"
              class="ma-2"
              prepend-icon="mdi-file-document"
              variant="outlined"
            >
              Generate Report
            </v-btn>
            <v-btn
              color="success"
              class="ma-2"
              prepend-icon="mdi-chart-box"
              variant="outlined"
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
            <v-list density="compact">
              <v-list-item prepend-icon="mdi-account-plus">
                <v-list-item-title
                  >John Doe joined Engineering</v-list-item-title
                >
                <v-list-item-subtitle>2 hours ago</v-list-item-subtitle>
              </v-list-item>
              <v-list-item prepend-icon="mdi-account-edit">
                <v-list-item-title
                  >Jane Smith updated profile</v-list-item-title
                >
                <v-list-item-subtitle>5 hours ago</v-list-item-subtitle>
              </v-list-item>
              <v-list-item prepend-icon="mdi-chart-line">
                <v-list-item-title>Q4 reviews completed</v-list-item-title>
                <v-list-item-subtitle>1 day ago</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// Simple home page component
</script>

<style scoped></style>
