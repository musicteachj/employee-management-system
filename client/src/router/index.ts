import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import TableWrapper from "../views/TableWrapper.vue";
import EmployeeForm from "../views/EmployeeForm.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/employee/new",
    name: "employee-new",
    meta: {
      title: "Add Employee",
      description: "Add a new employee",
    },
    component: EmployeeForm,
  },
  {
    path: "/employee/:id",
    name: "employee-edit",
    meta: {
      title: "Employee Record",
      description: "View and edit employee record",
    },
    component: EmployeeForm,
  },
  {
    path: "/unassigned-hires",
    name: "Unassigned Hires",
    meta: {
      title: "Unassigned Hires",
      description: "Employees without managers",
    },
    component: TableWrapper,
  },
  {
    path: "/recent-hires",
    name: "Recent Hires",
    meta: {
      title: "Recent Hires",
      description: "Employees hired in the last 30 days",
    },
    component: TableWrapper,
  },
  {
    path: "/updated-profiles",
    name: "Updated Profiles",
    meta: {
      title: "Updated Profiles",
      description: "Employees with updated profiles",
    },
    component: TableWrapper,
  },
  {
    path: "/by-manager",
    name: "By Manager",
    meta: {
      title: "By Manager",
      description: "Employees groupedby manager",
    },
    component: TableWrapper,
  },
  {
    path: "/by-department",
    name: "By Department",
    meta: {
      title: "By Department",
      description: "Employees grouped by department",
    },
    component: TableWrapper,
  },
  {
    path: "/performance-reviews",
    name: "Performance Reviews",
    meta: {
      title: "Performance Reviews",
      description: "Performance reviews",
    },
    component: TableWrapper,
  },
  {
    path: "/duplicate-records",
    name: "Duplicate Records",
    meta: {
      title: "Duplicate Records",
      description: "Duplicate records",
    },
    component: TableWrapper,
  },
  {
    path: "/active-terminated",
    name: "Active/Terminated",
    meta: {
      title: "Active/Terminated",
      description: "Active/terminated employees",
    },
    component: TableWrapper,
  },
  {
    path: "/contract-employees",
    name: "Contract Employees",
    meta: {
      title: "Contract Employees",
      description: "Contract employees",
    },
    component: TableWrapper,
  },
  {
    path: "/former-employees",
    name: "Former Employees",
    meta: {
      title: "Former Employees",
      description: "Former employees",
    },
    component: TableWrapper,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
