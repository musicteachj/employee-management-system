import { defineAsyncComponent } from "vue";

export const dialogRegistry = {
  "assign-to-manager": defineAsyncComponent(
    () => import("./dialogContent/AssignManager.vue")
  ),
  "convert-employee-type": defineAsyncComponent(
    () => import("./dialogContent/ConvertEmployeeType.vue")
  ),
  "rehire-employee": defineAsyncComponent(
    () => import("./dialogContent/RehireEmployee.vue")
  ),
  "training-status-update": defineAsyncComponent(
    () => import("./dialogContent/TrainingStatusUpdate.vue")
  ),
} as const;

export const dialogMeta = {
  "assign-to-manager": { header: "Assign Manager", size: "medium" },
  "convert-employee-type": { header: "Convert Employee Type", size: "medium" },
  "rehire-employee": { header: "Rehire Employee", size: "medium" },
  "training-status-update": {
    header: "Update Training Status",
    size: "medium",
  },
} as const;
