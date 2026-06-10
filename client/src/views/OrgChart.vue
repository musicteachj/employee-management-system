<template>
  <div class="org-chart">
    <!-- Page header -->
    <div class="page-head">
      <span class="eyebrow">People</span>
      <h1 class="page-title">Organization Chart</h1>
      <p class="page-subtitle">
        Hierarchical view of organizational structure and reporting
        relationships.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center pa-8">
      <v-progress-circular
        indeterminate
        color="primary"
        size="56"
      ></v-progress-circular>
      <p class="mt-4 text-body-2 text-muted">Loading organization chart…</p>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Summary Cards -->
      <v-row class="mb-2">
        <v-col cols="12" sm="6" md="3">
          <v-card class="kpi-card" flat>
            <div class="kpi-icon">
              <v-icon size="24">mdi-account-group</v-icon>
            </div>
            <div class="kpi-body">
              <span class="kpi-label">Total Employees</span>
              <span class="kpi-value tabular-nums">{{ totalEmployees }}</span>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="kpi-card" flat>
            <div class="kpi-icon kpi-icon--success">
              <v-icon size="24">mdi-sitemap-outline</v-icon>
            </div>
            <div class="kpi-body">
              <span class="kpi-label">Org Levels</span>
              <span class="kpi-value tabular-nums">{{ maxLevels }}</span>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="kpi-card" flat>
            <div class="kpi-icon kpi-icon--info">
              <v-icon size="24">mdi-account-tie-outline</v-icon>
            </div>
            <div class="kpi-body">
              <span class="kpi-label">Managers</span>
              <span class="kpi-value tabular-nums">{{ totalManagers }}</span>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="kpi-card" flat>
            <div class="kpi-icon kpi-icon--warning">
              <v-icon size="24">mdi-domain</v-icon>
            </div>
            <div class="kpi-body">
              <span class="kpi-label">Departments</span>
              <span class="kpi-value tabular-nums">{{ totalDepartments }}</span>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Filters -->
      <v-card class="pa-4 mb-4 filters-card" flat>
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
      <v-card class="chart-card" flat>
        <div class="card-head">
          <v-icon size="20">mdi-sitemap-outline</v-icon>
          Organizational Hierarchy
          <div class="chart-tools">
            <v-btn size="small" variant="text" @click="expandAll">
              Expand all
            </v-btn>
            <v-btn size="small" variant="text" @click="collapseAll">
              Collapse all
            </v-btn>
            <v-divider vertical class="mx-1" />
            <v-btn
              icon="mdi-minus"
              size="x-small"
              variant="text"
              title="Zoom out"
              @click="zoomOut"
            />
            <span class="zoom-label tabular-nums">{{ Math.round(zoom * 100) }}%</span>
            <v-btn
              icon="mdi-plus"
              size="x-small"
              variant="text"
              title="Zoom in"
              @click="zoomIn"
            />
            <v-btn size="small" variant="text" @click="fitToWidth">Fit</v-btn>
            <v-btn
              icon="mdi-backup-restore"
              size="x-small"
              variant="text"
              title="Reset zoom"
              @click="resetZoom"
            />
          </div>
        </div>

        <!-- Focus breadcrumb -->
        <div v-if="focusedId" class="focus-bar">
          <v-icon size="15">mdi-target</v-icon>
          <button class="crumb" @click="clearFocus">Full org</button>
          <template v-for="(c, i) in focusBreadcrumb" :key="c._id">
            <v-icon size="13">mdi-chevron-right</v-icon>
            <button
              class="crumb"
              :class="{ active: i === focusBreadcrumb.length - 1 }"
              @click="c._id && orgApi.focusNode(c._id)"
            >
              {{ c.fullName }}
            </button>
          </template>
        </div>

        <div class="org-chart-container" ref="containerRef">
          <div v-if="displayRoots.length === 0" class="empty-state ma-4">
            <v-icon icon="mdi-account-search-outline" size="40"></v-icon>
            <p class="mt-2 mb-0">No employees found matching your criteria</p>
          </div>
          <div
            v-else
            class="org-hierarchy org-canvas"
            ref="canvasRef"
            :style="{ zoom }"
          >
            <!-- Root level employees (CEO, top executives) -->
            <div class="root-level">
              <OrgChartNode
                v-for="employee in displayRoots"
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
import { ref, reactive, computed, provide, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "../stores/app";
import type { Employee, JobLevel } from "../types";
import { bySeniorityDesc } from "../constants/hierarchy";
import OrgChartNode from "../components/OrgChartNode.vue";
import { ORG_CHART_API, type OrgChartApi } from "../constants/orgChart";

const router = useRouter();
const appStore = useAppStore();

// Reactive data
const loading = ref(true);
const employees = ref<Employee[]>([]);

// Levels 0..DEFAULT_VISIBLE_DEPTH are shown by default; deeper nodes start
// collapsed so the chart isn't an endless horizontal scroll.
const DEFAULT_VISIBLE_DEPTH = 2;

// Collapse state — a node is collapsed (children hidden) if its id is in the set.
const collapsedIds = reactive(new Set<string>());
// Focus / re-root — when set, only this node's subtree renders.
const focusedId = ref<string | null>(null);
// Zoom (CSS `zoom`, which scales layout so the scroll footprint shrinks too).
const zoom = ref(1);
const containerRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLElement | null>(null);

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
  const compareNodes = (a: EmployeeNode, b: EmployeeNode) => {
    // Most senior first (CEO -> Entry), then by department/position/name.
    const bySeniority = bySeniorityDesc(a, b);
    if (bySeniority !== 0) return bySeniority;
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

// Flat node lookup (built from the tree) for focus / breadcrumb.
const nodeById = computed(() => {
  const map = new Map<string, EmployeeNode>();
  const stack = [...orgChart.value];
  while (stack.length) {
    const n = stack.pop()!;
    if (n._id) map.set(n._id, n);
    for (const c of n.children) stack.push(c);
  }
  return map;
});

// --- Collapse / expand ---
const orgApi: OrgChartApi = {
  // While searching, ignore collapse so matches are never hidden.
  isCollapsed: (id) => (searchQuery.value ? false : collapsedIds.has(id)),
  toggleCollapsed: (id) =>
    collapsedIds.has(id) ? collapsedIds.delete(id) : collapsedIds.add(id),
  focusNode: (id) => {
    focusedId.value = id;
  },
};
provide(ORG_CHART_API, orgApi);

const seedCollapse = (nodes: EmployeeNode[]) => {
  const stack = [...nodes];
  while (stack.length) {
    const n = stack.pop()!;
    if (n._id && n.children.length > 0 && n.computedLevel >= DEFAULT_VISIBLE_DEPTH) {
      collapsedIds.add(n._id);
    }
    for (const c of n.children) stack.push(c);
  }
};

// Seed the default-collapsed state once the tree is first available.
const seeded = ref(false);
watch(
  orgChart,
  (nodes) => {
    if (seeded.value || nodes.length === 0) return;
    seedCollapse(nodes);
    seeded.value = true;
  },
  { immediate: true }
);

const expandAll = () => collapsedIds.clear();
const collapseAll = () => {
  collapsedIds.clear();
  for (const [id, node] of nodeById.value) {
    if (node.children.length > 0) collapsedIds.add(id);
  }
};

// --- Zoom ---
const clampZoom = (z: number) => Math.min(1, Math.max(0.3, z));
const zoomIn = () => (zoom.value = clampZoom(zoom.value + 0.1));
const zoomOut = () => (zoom.value = clampZoom(zoom.value - 0.1));
const resetZoom = () => (zoom.value = 1);
const fitToWidth = () => {
  const container = containerRef.value;
  const canvas = canvasRef.value;
  if (!container || !canvas) return;
  // offsetWidth already reflects the current zoom, so unscale to get natural width.
  const natural = canvas.offsetWidth / zoom.value;
  if (!natural) return;
  zoom.value = clampZoom((container.clientWidth - 48) / natural);
};

// --- Focus / re-root ---
const focusBreadcrumb = computed<EmployeeNode[]>(() => {
  if (!focusedId.value) return [];
  const byEmpId = new Map(employees.value.map((e) => [e._id ?? "", e]));
  const path: EmployeeNode[] = [];
  let current: string | null | undefined = focusedId.value;
  const seen = new Set<string>();
  while (current && !seen.has(current)) {
    seen.add(current);
    const node = nodeById.value.get(current);
    if (node) path.unshift(node);
    current = byEmpId.get(current)?.managerId;
  }
  return path;
});

const clearFocus = () => (focusedId.value = null);

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

// What actually renders: a focused subtree if focus is set, else the filtered tree.
const displayRoots = computed<EmployeeNode[]>(() => {
  if (focusedId.value) {
    const node = nodeById.value.get(focusedId.value);
    return node ? [node] : filteredOrgChart.value;
  }
  return filteredOrgChart.value;
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

/* Chart toolbar (right side of the card header) */
.chart-tools {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 2px;
  font-weight: 500;
}
.zoom-label {
  min-width: 40px;
  text-align: center;
  font-size: 0.8125rem;
  color: var(--color-slate);
}

/* Focus breadcrumb bar */
.focus-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px 20px;
  background: var(--color-primary-pale);
  border-bottom: 1px solid var(--color-border);
  font-size: 0.8125rem;
}
.focus-bar .v-icon {
  color: var(--color-primary);
}
.crumb {
  background: none;
  border: none;
  padding: 2px 4px;
  cursor: pointer;
  color: var(--color-primary);
  font: inherit;
  border-radius: 4px;
}
.crumb:hover {
  background: rgba(var(--color-primary-rgb), 0.12);
}
.crumb.active {
  color: var(--color-ink);
  font-weight: 700;
  cursor: default;
}

/* The zoom canvas scales layout via CSS `zoom`, so the scroll area shrinks too. */
.org-canvas {
  transition: none;
}
</style>
