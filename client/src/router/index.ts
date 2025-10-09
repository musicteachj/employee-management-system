import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import TableWrapper from "../views/TableWrapper.vue";
import AccordionWrapper from "../views/AccordionWrapper.vue";
import EmployeeForm from "../views/EmployeeForm.vue";
import PerformanceReviews from "../views/PerformanceReviews.vue";
import Analytics from "../views/Analytics.vue";
import OrgChart from "../views/OrgChart.vue";
import SearchEmployees from "../views/SearchEmployees.vue";
import { useAuthStore } from "../stores/auth";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
    meta: {
      title: "Login",
      description: "Login to your account",
      requiresAuth: false,
      guestOnly: true,
    },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register.vue"),
    meta: {
      title: "Register",
      description: "Create a new account",
      requiresAuth: false,
      guestOnly: true,
    },
  },
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/employee/new",
    name: "employee-new",
    meta: {
      title: "Add Employee",
      description: "Add a new employee",
      requiresAuth: true,
    },
    component: EmployeeForm,
  },
  {
    path: "/search-employees",
    name: "search-employees",
    meta: {
      title: "Search Employees",
      description: "Search for employees",
      requiresAuth: true,
    },
    component: SearchEmployees,
  },
  {
    path: "/employee/:id",
    name: "employee-edit",
    meta: {
      title: "Employee Record",
      description: "View and edit employee record",
      requiresAuth: true,
    },
    component: EmployeeForm,
  },
  {
    path: "/unassigned-hires",
    name: "Unassigned Hires",
    meta: {
      title: "Unassigned Hires",
      description: "Employees without managers",
      requiresAuth: true,
    },
    component: TableWrapper,
  },
  {
    path: "/recent-hires",
    name: "Recent Hires",
    meta: {
      title: "Recent Hires",
      description: "Employees hired in the last 30 days",
      requiresAuth: true,
    },
    component: TableWrapper,
  },
  {
    path: "/updated-profiles",
    name: "Updated Profiles",
    meta: {
      title: "Updated Profiles",
      description: "Employees with updated profiles",
      requiresAuth: true,
    },
    component: TableWrapper,
  },
  {
    path: "/by-manager",
    name: "By Manager",
    meta: {
      title: "By Manager",
      description: "Employees groupedby manager",
      requiresAuth: true,
    },
    component: AccordionWrapper,
  },
  {
    path: "/by-department",
    name: "By Department",
    meta: {
      title: "By Department",
      description: "Employees grouped by department",
      requiresAuth: true,
    },
    component: AccordionWrapper,
  },
  {
    path: "/performance-reviews",
    name: "Performance Reviews",
    meta: {
      title: "Performance Reviews",
      description: "Employee performance reviews and analytics",
      requiresAuth: true,
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
      requiresAuth: true,
    },
    component: OrgChart,
  },
  {
    path: "/analytics",
    name: "Analytics",
    meta: {
      title: "Employee Analytics",
      description: "Comprehensive employee data analytics and insights",
      requiresAuth: true,
    },
    component: Analytics,
  },
  {
    path: "/by-status",
    name: "By Status",
    meta: {
      title: "By Status",
      description: "Employees by status",
      requiresAuth: true,
    },
    component: AccordionWrapper,
  },
  {
    path: "/contract-employees",
    name: "Contract Employees",
    meta: {
      title: "Contract Employees",
      description: "Contract employees",
      requiresAuth: true,
    },
    component: TableWrapper,
  },
  {
    path: "/former-employees",
    name: "Former Employees",
    meta: {
      title: "Former Employees",
      description: "Former employees",
      requiresAuth: true,
    },
    component: TableWrapper,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const guestOnly = to.matched.some((record) => record.meta.guestOnly);

  // Routes that require authentication
  if (requiresAuth && !authStore.isAuthenticated) {
    next({
      path: "/login",
      query: { redirect: to.fullPath },
    });
  }
  // Routes for guests only (login, register)
  else if (guestOnly && authStore.isAuthenticated) {
    next("/");
  }
  // Allow navigation
  else {
    next();
  }
});

export default router;
