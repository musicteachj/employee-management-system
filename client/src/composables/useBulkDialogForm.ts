import { computed, ref } from "vue";
import { useAppStore } from "../stores/app";
import { useDialogStore } from "../stores/dialog";
import type { Employee } from "../types";

export function useBulkDialogForm() {
  const appStore = useAppStore();
  const dialogStore = useDialogStore();

  const isBusy = ref(false);

  const selectedEmployees = computed<Employee[]>(
    () => appStore.selectedEmployees
  );

  const employeeIds = computed<string[]>(() =>
    selectedEmployees.value
      .map((emp) => emp._id)
      .filter((id): id is string => Boolean(id))
  );

  const today = () => new Date().toISOString().split("T")[0];

  const removeEmployee = (employeeId: string | undefined) => {
    if (employeeId) appStore.removeSelectedEmployee(employeeId);
  };

  const clearAllEmployees = () => appStore.setSelectedEmployees([]);

  const closeDialog = () => dialogStore.closeAndResetDialog();

  return {
    isBusy,
    selectedEmployees,
    employeeIds,
    today,
    removeEmployee,
    clearAllEmployees,
    closeDialog,
  };
}
