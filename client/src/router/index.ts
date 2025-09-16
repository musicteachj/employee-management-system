import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import TableWrapper from "../views/TableWrapper.vue";
import AccordionWrapper from "../views/AccordionWrapper.vue";
import EmployeeForm from "../views/EmployeeForm.vue";
import PerformanceReviews from "../views/PerformanceReviews.vue";
import Analytics from "../views/Analytics.vue";
import OrgChart from "../views/OrgChart.vue";

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
    component: AccordionWrapper,
  },
  {
    path: "/by-department",
    name: "By Department",
    meta: {
      title: "By Department",
      description: "Employees grouped by department",
    },
    component: AccordionWrapper,
  },
  {
    path: "/performance-reviews",
    name: "Performance Reviews",
    meta: {
      title: "Performance Reviews",
      description: "Employee performance reviews and analytics",
    },
    component: PerformanceReviews,
  },
  {
    path: "/org-chart",
    name: "Organization Chart",
    meta: {
      title: "Organization Chart",
      description:
        "Hierarchical view of organizational structure and reporting relationships",
    },
    component: OrgChart,
  },
  {
    path: "/analytics",
    name: "Analytics",
    meta: {
      title: "Employee Analytics",
      description: "Comprehensive employee data analytics and insights",
    },
    component: Analytics,
  },
  {
    path: "/by-status",
    name: "By Status",
    meta: {
      title: "By Status",
      description: "Employees by status",
    },
    component: AccordionWrapper,
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
