<template>
  <div>
    <h5 class="text-h5">New Hires</h5>
    <p>...text</p>
    <v-divider />
    <v-data-table :headers="headers" :items="items" density="compact" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  items: any[];
}>();

const headers = [
  { title: "Name", key: "firstName" },
  { title: "Email", key: "personalEmail" },
  { title: "Phone", key: "phoneNumber" },
  { title: "Hire Date", key: "hireDate" },
];
</script>

<style scoped></style>
