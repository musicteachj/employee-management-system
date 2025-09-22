<template>
  <div class="org-chart">
    <!-- Header Section -->
    <v-card class="pa-4 ma-2 mb-4 header-card" elevation="3" rounded="lg">
      <v-card-title class="pa-0 mb-2">
        <h5 class="text-h5 text-primary font-weight-bold">
          Organization Chart
        </h5>
      </v-card-title>
      <v-card-subtitle class="pa-0">
        <p class="text-body-2 text-medium-emphasis">
          Hierarchical view of organizational structure and reporting
          relationships
        </p>
      </v-card-subtitle>
      <v-divider class="mt-4 divider-gradient" />
    </v-card>

    <!-- Loading State -->
    <div v-if="loading" class="text-center pa-8">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
      <p class="mt-4 text-body-1">Loading organization chart...</p>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Summary Cards -->
      <v-row class="ma-n1 mb-4">
        <v-col cols="12" sm="6" md="3">
          <v-card
            class="pa-4 summary-card"
            elevation="3"
            rounded="lg"
            color="primary"
            variant="tonal"
          >
            <div class="d-flex align-center">
              <v-icon icon="mdi-account-group" size="40" class="mr-3"></v-icon>
              <div>
                <h3 class="text-h3">{{ totalEmployees }}</h3>
                <p class="text-body-2">Total Employees</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card
            class="pa-4 summary-card"
            elevation="3"
            rounded="lg"
            color="success"
            variant="tonal"
          >
            <div class="d-flex align-center">
              <v-icon icon="mdi-sitemap" size="40" class="mr-3"></v-icon>
              <div>
                <h3 class="text-h3">{{ maxLevels }}</h3>
                <p class="text-body-2">Org Levels</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card
            class="pa-4 summary-card"
            elevation="3"
            rounded="lg"
            color="info"
            variant="tonal"
          >
            <div class="d-flex align-center">
              <v-icon icon="mdi-account-tie" size="40" class="mr-3"></v-icon>
              <div>
                <h3 class="text-h3">{{ totalManagers }}</h3>
                <p class="text-body-2">Managers</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card
            class="pa-4 summary-card"
            elevation="3"
            rounded="lg"
            color="warning"
            variant="tonal"
          >
            <div class="d-flex align-center">
              <v-icon icon="mdi-domain" size="40" class="mr-3"></v-icon>
              <div>
                <h3 class="text-h3">{{ totalDepartments }}</h3>
                <p class="text-body-2">Departments</p>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Filters -->
      <v-card class="pa-4 ma-2 mb-4 filters-card" elevation="3" rounded="lg">
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="searchQuery"
              label="Search employees..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              clearable
              hide-details
              class="search-field"
              color="primary"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="selectedDepartment"
              :items="departmentOptions"
              label="Department"
              variant="outlined"
              density="compact"
              clearable
              hide-details
              class="filter-field"
              color="primary"
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="selectedJobLevel"
              :items="jobLevelOptions"
              label="Job Level"
              variant="outlined"
              density="compact"
              clearable
              hide-details
              class="filter-field"
              color="primary"
            ></v-select>
          </v-col>
          <v-col cols="12" md="2">
            <v-btn
              @click="resetFilters"
              variant="outlined"
              color="primary"
              block
              density="comfortable"
            >
              Reset Filters
            </v-btn>
          </v-col>
        </v-row>
      </v-card>

      <!-- Organization Chart -->
      <v-card class="pa-2 ma-2 chart-card" elevation="3" rounded="lg">
        <v-card-title class="pa-0 mb-2">
          <h5 class="text-h5 text-primary font-weight-bold">
            Organizational Hierarchy
          </h5>
        </v-card-title>
        <v-divider class="mb-4 divider-gradient" />

        <div class="org-chart-container">
          <div v-if="filteredOrgChart.length === 0" class="text-center pa-8">
            <v-icon icon="mdi-account-search" size="64" color="grey"></v-icon>
            <p class="text-body-1 mt-4">
              No employees found matching your criteria
            </p>
          </div>
          <div v-else class="org-hierarchy">
            <!-- Root level employees (CEO, top executives) -->
            <div class="root-level">
              <OrgChartNode
                v-for="employee in filteredOrgChart"
                :key="employee._id"
                :employee="employee"
                :level="0"
                :search-query="searchQuery"
                @employee-click="viewEmployee"
              />
            </div>
          </div>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "../stores/app";
import type { Employee, JobLevel } from "../types";
import OrgChartNode from "../components/OrgChartNode.vue";

const router = useRouter();
const appStore = useAppStore();

// Reactive data
const loading = ref(true);
const employees = ref<Employee[]>([]);

// Local enriched node type for org chart
type EmployeeNode = Employee & {
  children: EmployeeNode[];
  computedLevel: number;
};

// Filters
const searchQuery = ref("");
const selectedDepartment = ref<string | null>(null);
const selectedJobLevel = ref<JobLevel | null>(null);

// Filter options
const departmentOptions = computed(() => {
  const departments = [
    ...new Set(employees.value.map((emp) => emp.department)),
  ];
  return departments.sort();
});

const jobLevelOptions = computed(() => {
  const levels = [...new Set(employees.value.map((emp) => emp.jobLevel))];
  return levels.sort();
});

// Computed properties for summary cards
const totalEmployees = computed(() => employees.value.length);

const totalDepartments = computed(() => {
  return new Set(employees.value.map((emp) => emp.department)).size;
});

// Organization chart structure
const orgChart = computed<EmployeeNode[]>(() => {
  // Rank map for job levels to help with consistent ordering
  const jobLevelRank: Record<JobLevel, number> = {
    CEO: 0,
    "C-Level": 1,
    VP: 2,
    Director: 3,
    Manager: 4,
    Lead: 5,
    Senior: 6,
    Mid: 7,
    Entry: 8,
  };

  const compareNodes = (a: EmployeeNode, b: EmployeeNode) => {
    const aRank = (a.organizationLevel ??
      jobLevelRank[a.jobLevel] ??
      999) as number;
    const bRank = (b.organizationLevel ??
      jobLevelRank[b.jobLevel] ??
      999) as number;
    if (aRank !== bRank) return aRank - bRank;
    if (a.department !== b.department)
      return a.department.localeCompare(b.department);
    if (a.position !== b.position) return a.position.localeCompare(b.position);
    return a.fullName.localeCompare(b.fullName);
  };

  // Build node map (ignore employees without stable ids)
  const nodeMap = new Map<string, EmployeeNode>();
  const parentIdMap = new Map<string, string>();

  for (const emp of employees.value) {
    if (!emp._id) continue;
    nodeMap.set(emp._id, {
      ...(emp as Employee),
      children: [],
      computedLevel: -1,
    });
  }

  // Link children to managers with cycle and self-guard
  const createsCycle = (childId: string, managerId: string): boolean => {
    if (childId === managerId) return true;
    let current: string | undefined = managerId;
    // Walk up existing parent chain to detect if child is an ancestor of manager
    const safety = nodeMap.size + 5;
    let steps = 0;
    while (current && steps < safety) {
      if (current === childId) return true;
      current = parentIdMap.get(current);
      steps++;
    }
    return false;
  };

  for (const emp of employees.value) {
    if (!emp._id) continue;
    const childId = emp._id;
    const managerId = emp.managerId;
    if (!managerId) continue;
    const managerNode = nodeMap.get(managerId);
    const childNode = nodeMap.get(childId);
    if (!managerNode || !childNode) continue;
    if (createsCycle(childId, managerId)) continue;
    managerNode.children.push(childNode);
    parentIdMap.set(childId, managerId);
  }

  // Identify roots (no parent or manager outside current dataset)
  let roots: EmployeeNode[] = [];
  for (const [id, node] of nodeMap) {
    if (!parentIdMap.has(id)) {
      roots.push(node);
    }
  }

  // If somehow all nodes have parents (cycle), fall back to treating all as roots
  if (roots.length === 0) {
    roots = Array.from(nodeMap.values());
  }

  // BFS to assign computed levels and sort children at each level
  const queue: EmployeeNode[] = [];
  for (const root of roots) {
    root.computedLevel = 0;
    queue.push(root);
  }
  while (queue.length) {
    const current = queue.shift()!;
    current.children.sort(compareNodes);
    for (const child of current.children) {
      if (
        child.computedLevel === -1 ||
        child.computedLevel > current.computedLevel + 1
      ) {
        child.computedLevel = current.computedLevel + 1;
        queue.push(child);
      }
    }
  }

  // Any unvisited nodes (due to cycles or disconnected) -> treat as new roots
  for (const node of nodeMap.values()) {
    if (node.computedLevel === -1) {
      node.computedLevel = 0;
      roots.push(node);
    }
  }

  // Final stable sort of roots
  roots.sort(compareNodes);
  return roots;
});

// Derived metrics from built tree
const maxLevels = computed(() => {
  const getMaxDepth = (nodes: EmployeeNode[]): number => {
    let max = 0;
    const stack: Array<{ node: EmployeeNode; depth: number }> = nodes.map(
      (n) => ({ node: n, depth: 1 })
    );
    while (stack.length) {
      const { node, depth } = stack.pop()!;
      if (depth > max) max = depth;
      for (const child of node.children) {
        stack.push({ node: child, depth: depth + 1 });
      }
    }
    return max;
  };
  return getMaxDepth(orgChart.value);
});

const totalManagers = computed(() => {
  let count = 0;
  const stack: EmployeeNode[] = [...orgChart.value];
  while (stack.length) {
    const node = stack.pop()!;
    if (node.children.length > 0) count++;
    for (const child of node.children) stack.push(child);
  }
  return count;
});

// Filtered organization chart
const filteredOrgChart = computed<EmployeeNode[]>(() => {
  if (
    !searchQuery.value &&
    !selectedDepartment.value &&
    !selectedJobLevel.value
  ) {
    return orgChart.value;
  }

  // Filter function to check if employee or any descendant matches criteria
  const matchesFilter = (emp: EmployeeNode): boolean => {
    // Check if current employee matches
    const matchesSearch =
      !searchQuery.value ||
      emp.fullName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchesDepartment =
      !selectedDepartment.value || emp.department === selectedDepartment.value;

    const matchesJobLevel =
      !selectedJobLevel.value || emp.jobLevel === selectedJobLevel.value;

    const currentMatches =
      matchesSearch && matchesDepartment && matchesJobLevel;

    // Check if any children match (recursively)
    const childrenMatch = emp.children.some((child) => matchesFilter(child));

    return currentMatches || childrenMatch;
  };

  // Filter and rebuild structure
  const filterEmployee = (emp: EmployeeNode): EmployeeNode | null => {
    const filteredChildren = emp.children
      .map((child) => filterEmployee(child))
      .filter((child) => child !== null) as EmployeeNode[];

    if (matchesFilter(emp)) {
      return { ...emp, children: filteredChildren };
    }

    return null;
  };

  return orgChart.value
    .map((emp) => filterEmployee(emp))
    .filter((emp) => emp !== null) as EmployeeNode[];
});

// Methods
const loadData = async () => {
  try {
    loading.value = true;
    employees.value = await appStore.getEmployees();
  } catch (error) {
    console.error("Error loading employees:", error);
  } finally {
    loading.value = false;
  }
};

const resetFilters = () => {
  searchQuery.value = "";
  selectedDepartment.value = null;
  selectedJobLevel.value = null;
};

const viewEmployee = (employee: Employee) => {
  router.push({ name: "employee-edit", params: { id: employee._id } });
};

// Lifecycle
onMounted(() => {
  loadData();
});
</script>

<style scoped>
/* Component-specific styles only - common styles are in global CSS */
</style>
