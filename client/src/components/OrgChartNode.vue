<template>
  <div class="org-node-container">
    <!-- Employee Card -->
    <v-card
      class="employee-card"
      :class="{
        highlighted: isHighlighted,
        'no-top-line': level === 0,
        'has-children': hasChildren,
        executive: isExecutive,
      }"
      elevation="4"
      rounded="lg"
      @click="$emit('employee-click', employee)"
    >
      <v-card-text class="pa-2">
        <div class="d-flex align-center mb-1">
          <v-avatar
            :color="getJobLevelColor(employee.jobLevel)"
            size="28"
            class="mr-2 employee-avatar"
          >
            <span class="text-white font-weight-bold" style="font-size: 10px">
              {{ getInitials(employee.fullName) }}
            </span>
          </v-avatar>
          <div class="flex-grow-1">
            <h6
              class="text-body-2 font-weight-bold text-primary mb-0 text-truncate d-flex align-center"
            >
              <v-icon
                v-if="isExecutive"
                :icon="executiveIcon"
                size="14"
                color="#A16207"
                class="mr-1 flex-shrink-0"
              />
              <span class="text-truncate">{{ employee.fullName }}</span>
            </h6>
            <!-- <p class="text-caption text-medium-emphasis mb-0 text-truncate">
              {{ employee.position }}
            </p> -->
          </div>
        </div>

        <div class="employee-details">
          <div class="d-flex align-center mb-1">
            <v-icon
              icon="mdi-briefcase"
              size="12"
              class="mr-1 text-medium-emphasis"
            ></v-icon>
            <span class="text-caption text-truncate">{{
              employee.position
            }}</span>
          </div>
          <div class="d-flex align-center mb-1">
            <v-icon
              icon="mdi-domain"
              size="12"
              class="mr-1 text-medium-emphasis"
            ></v-icon>
            <span class="text-caption text-truncate">{{
              employee.department
            }}</span>
          </div>
          <div class="d-flex align-center mb-1">
            <v-icon
              icon="mdi-calendar"
              size="12"
              class="mr-1 text-medium-emphasis"
            ></v-icon>
            <span class="text-caption">{{
              formatDate(employee.hireDate)
            }}</span>
          </div>
        </div>

        <!-- Status indicators -->
        <div class="d-flex justify-center align-center mt-1">
          <v-chip
            :color="getJobLevelColor(employee.jobLevel)"
            size="x-small"
            variant="tonal"
            class="text-caption"
          >
            {{ employee.jobLevel }}
          </v-chip>
          <v-chip
            v-if="hasChildren"
            color="primary"
            size="x-small"
            variant="tonal"
            class="text-caption ml-1 toggle-chip"
            :prepend-icon="isExpanded ? 'mdi-chevron-down' : 'mdi-chevron-right'"
            :title="`${isExpanded ? 'Collapse' : 'Expand'} ${
              children.length
            } direct report${children.length === 1 ? '' : 's'}`"
            @click.stop="toggle"
          >
            {{ children.length }}
          </v-chip>
          <v-btn
            v-if="hasChildren"
            icon="mdi-target"
            size="x-small"
            variant="text"
            color="primary"
            class="ml-1 focus-btn"
            title="Focus on this team"
            @click.stop="focus"
          />
        </div>
      </v-card-text>

      <!-- Hover overlay -->
      <v-overlay
        v-model="showOverlay"
        contained
        class="d-flex align-center justify-center"
      >
        <v-btn
          icon="mdi-eye"
          color="white"
          variant="elevated"
          size="large"
        ></v-btn>
      </v-overlay>
    </v-card>

    <!-- Children -->
    <div
      v-if="hasChildren && isExpanded"
      class="children-container"
      ref="childrenContainerRef"
    >
      <!-- Horizontal connector across children -->
      <div
        class="connection-line horizontal-line"
        v-if="children.length > 1"
        :style="{
          left: `${horizontalLineLeft}px`,
          width: `${horizontalLineWidth}px`,
        }"
      ></div>

      <!-- Children nodes -->
      <div
        class="children-grid"
        :class="`level-${level + 1}`"
        ref="childrenGridRef"
      >
        <div
          v-for="(child, index) in children"
          :key="child._id"
          class="child-wrapper"
          :class="{
            'first-child': index === 0,
            'last-child': index === children.length - 1,
            'single-child': children.length === 1,
          }"
          :ref="(el) => setChildRef(el, index)"
        >
          <!-- Recursive child node -->
          <OrgChartNode
            :employee="child"
            :level="level + 1"
            :search-query="searchQuery"
            @employee-click="$emit('employee-click', $event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref, onMounted, onUnmounted, nextTick, watch } from "vue";
import dayjs from "dayjs";
import type { Employee, JobLevel } from "../types";
import { ORG_CHART_API } from "../constants/orgChart";

interface Props {
  employee: Employee & { children?: Employee[] };
  level: number;
  searchQuery?: string;
}

interface Emits {
  (e: "employee-click", employee: Employee): void;
}

const props = withDefaults(defineProps<Props>(), {
  searchQuery: "",
});

defineEmits<Emits>();

// Reactive data
const showOverlay = ref(false);

// Collapse/focus API provided by the OrgChart view (null-safe if used standalone).
const org = inject(ORG_CHART_API, null);

// Computed properties
const children = computed(() => props.employee.children || []);
const hasChildren = computed(() => children.value.length > 0);

const isExpanded = computed(() => {
  const id = props.employee._id;
  if (!org || !id) return true;
  return !org.isCollapsed(id);
});

const toggle = () => {
  if (org && props.employee._id) org.toggleCollapsed(props.employee._id);
};
const focus = () => {
  if (org && props.employee._id) org.focusNode(props.employee._id);
};

// Executives (CEO / C-Level) get a distinct marker in the chart.
const isExecutive = computed(
  () =>
    props.employee.jobLevel === "CEO" || props.employee.jobLevel === "C-Level"
);
const executiveIcon = computed(() =>
  props.employee.jobLevel === "CEO" ? "mdi-crown" : "mdi-star-circle"
);

const isHighlighted = computed(() => {
  if (!props.searchQuery) return false;
  const query = props.searchQuery.toLowerCase();
  return (
    props.employee.fullName.toLowerCase().includes(query) ||
    props.employee.position.toLowerCase().includes(query) ||
    props.employee.department.toLowerCase().includes(query)
  );
});

// Methods
const getInitials = (fullName: string): string => {
  return fullName
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const formatDate = (dateString: string): string => {
  return dayjs(dateString).format("MMM YYYY");
};

// Horizontal connector measurement
const childrenContainerRef = ref<HTMLElement | null>(null);
const childrenGridRef = ref<HTMLElement | null>(null);
const childRefs = ref<HTMLElement[]>([]);
const horizontalLineLeft = ref(0);
const horizontalLineWidth = ref(0);

const setChildRef = (el: any, index: number) => {
  if (el && el instanceof HTMLElement) {
    childRefs.value[index] = el as HTMLElement;
  }
};

const computeHorizontalLine = () => {
  const wrappers = childRefs.value.filter(Boolean);
  if (!childrenContainerRef.value || wrappers.length < 2) {
    horizontalLineLeft.value = 0;
    horizontalLineWidth.value = 0;
    return;
  }
  // Use layout offsets, not getBoundingClientRect: offsetLeft/offsetWidth are in
  // layout pixels relative to .children-container (the positioned ancestor the
  // connector line also anchors to), so they're immune to CSS `zoom` and scroll
  // and stay aligned at any zoom level.
  const centers = wrappers
    .map((el) => el.offsetLeft + el.offsetWidth / 2)
    .sort((a, b) => a - b);
  horizontalLineLeft.value = centers[0];
  horizontalLineWidth.value = centers[centers.length - 1] - centers[0];
};

// Recompute on any layout change in this node's children row. Expanding a deeper
// node widens its column, which resizes this row and shifts siblings — the
// observer catches that and re-measures, so the connector lines stay aligned.
let resizeObserver: ResizeObserver | null = null;
const observeGrid = (el: HTMLElement | null) => {
  resizeObserver?.disconnect();
  if (el && typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(() =>
      requestAnimationFrame(computeHorizontalLine)
    );
    resizeObserver.observe(el);
  }
};

onMounted(() => {
  nextTick(() => {
    computeHorizontalLine();
    observeGrid(childrenGridRef.value);
  });
  window.addEventListener("resize", computeHorizontalLine);
});

onUnmounted(() => {
  window.removeEventListener("resize", computeHorizontalLine);
  resizeObserver?.disconnect();
});

// Re-attach the observer whenever the children row mounts/unmounts (it's v-if'd).
watch(childrenGridRef, (el) => observeGrid(el));

watch([children, isExpanded], async () => {
  await nextTick();
  computeHorizontalLine();
});

const getJobLevelColor = (jobLevel: JobLevel): string => {
  const colorMap: Record<JobLevel, string> = {
    Entry: "blue-grey",
    Mid: "blue",
    Senior: "indigo",
    Lead: "purple",
    Manager: "deep-purple",
    Director: "pink",
    VP: "red",
    "C-Level": "deep-orange",
    CEO: "orange",
  };
  return colorMap[jobLevel] || "grey";
};
</script>

<style scoped>
.org-node-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: fit-content;
  width: 100%;
}

/* Employee card styling */
.employee-card {
  width: 200px;
  min-height: 100px;
  cursor: pointer;
  transition: box-shadow 0.2s ease, border-color 0.2s ease,
    transform 0.2s ease;
  border: 1px solid var(--color-border);
  background: var(--color-white);
  box-shadow: var(--shadow-xs);
  position: relative;
  z-index: 2;
  overflow: visible; /* allow pseudo-element to render above card */
}

.employee-card::before {
  content: "";
  position: absolute;
  width: 3px;
  height: 28px;
  background-color: var(--color-primary);
  top: -28px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 2px;
  opacity: 0.8;
  pointer-events: none;
}

.employee-card.no-top-line::before {
  display: none;
}

.employee-card.has-children::after {
  content: "";
  position: absolute;
  width: 3px;
  height: 40px;
  background-color: var(--color-primary);
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 2px;
  opacity: 0.8;
  pointer-events: none;
}

.employee-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: rgba(var(--color-primary-rgb), 0.45);
}

.employee-card.highlighted {
  border-color: var(--color-primary);
  background: var(--color-primary-pale);
  box-shadow: 0 0 0 1px var(--color-primary), var(--shadow-sm);
}

/* Executives (CEO / C-Level): subtle gold ring to match the enterprise theme */
.employee-card.executive {
  border-color: #d4a82a;
  box-shadow: 0 0 0 1px #d4a82a, var(--shadow-sm);
}

.employee-avatar {
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.employee-card:hover .employee-avatar {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.employee-details {
  min-height: 80px;
}

/* Connection lines */
.connection-line {
  background-color: var(--color-primary);
  position: absolute;
  z-index: 1;
  opacity: 0.6;
}

/* vertical-line removed */

.horizontal-line {
  height: 3px;
  top: 0;
  border-radius: 2px;
}

/* child-vertical-line removed */

/* Children container */
.children-container {
  position: relative;
  margin-top: 20px;
  width: 100%;
  overflow-x: visible;
  padding: 0 20px;
  box-sizing: border-box;
}

.children-grid {
  display: flex;
  justify-content: center;
  gap: 25px;
  flex-wrap: nowrap;
  margin-top: 28px;
  align-items: flex-start;
  min-width: fit-content;
  padding: 0 20px;
}

.child-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Level-based spacing for pyramid effect */
.children-grid.level-1 {
  gap: 30px;
}

.children-grid.level-2 {
  gap: 28px;
}

.children-grid.level-3 {
  gap: 25px;
}

.children-grid.level-4,
.children-grid.level-5,
.children-grid.level-6 {
  gap: 22px;
}

/* Adjust card sizes for top levels when there are many children */
.children-grid.level-1 .employee-card {
  width: 180px;
  min-height: 90px;
}

.children-grid.level-2 .employee-card {
  width: 190px;
  min-height: 95px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .employee-card {
    width: 160px;
    min-height: 85px;
  }

  .children-grid {
    gap: 20px;
    flex-wrap: nowrap;
  }

  .children-container {
    margin-top: 50px;
  }

  .children-grid.level-1,
  .children-grid.level-2,
  .children-grid.level-3,
  .children-grid.level-4,
  .children-grid.level-5,
  .children-grid.level-6 {
    gap: 15px;
  }

  .children-grid.level-1 .employee-card,
  .children-grid.level-2 .employee-card {
    width: 150px;
    min-height: 80px;
  }
}

@media (max-width: 480px) {
  .employee-card {
    width: 140px;
    min-height: 75px;
  }

  .children-grid {
    gap: 12px;
    flex-wrap: nowrap;
  }

  .children-grid.level-1,
  .children-grid.level-2,
  .children-grid.level-3,
  .children-grid.level-4,
  .children-grid.level-5,
  .children-grid.level-6 {
    gap: 10px;
  }

  .children-grid.level-1 .employee-card,
  .children-grid.level-2 .employee-card {
    width: 130px;
    min-height: 70px;
  }
}

/* Animation for highlighting */
@keyframes highlight-pulse {
  0% {
    box-shadow: 0 8px 25px rgba(var(--color-primary-rgb), 0.2);
  }
  50% {
    box-shadow: 0 12px 35px rgba(var(--color-primary-rgb), 0.4);
  }
  100% {
    box-shadow: 0 8px 25px rgba(var(--color-primary-rgb), 0.2);
  }
}

.employee-card.highlighted {
  animation: highlight-pulse 2s infinite;
}

/* Chip styling enhancements */
::deep(.v-chip) {
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* Collapse toggle chip reads as interactive */
.toggle-chip {
  cursor: pointer;
}
.toggle-chip:hover {
  filter: brightness(0.95);
}
.focus-btn {
  opacity: 0.55;
}
.focus-btn:hover {
  opacity: 1;
}

/* Icon styling */
.v-icon {
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.employee-card:hover .v-icon {
  opacity: 1;
}
</style>
