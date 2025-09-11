<script setup lang="ts"></script>

<template>
  <v-app>
    <v-layout>
      <v-app-bar color="primary" flat>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
        <v-app-bar-title> Employee Management System </v-app-bar-title>
      </v-app-bar>
      <v-navigation-drawer>
        <v-list>
          <v-list-item>
            <v-list-item-title>Home</v-list-item-title>
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
