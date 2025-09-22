import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import type { DialogState, Action, ActionType } from "../types";

export const useDialogStore = defineStore("dialog", () => {
  const dialogState = reactive<DialogState>({
    show: false,
    header: "",
    size: "medium",
    type: null,
  });

  const closeAndResetDialog = () => {
    Object.assign(dialogState, {
      show: false,
      header: "",
      size: "medium",
      type: null,
    });
  };

  const setDialog = (dialogInfo: DialogState) => {
    Object.assign(dialogState, dialogInfo);
  };

  const actions = ref<Action[]>([
    {
      text: "Assign Manager",
      icon: "mdi-account-plus",
      action: () => {
        setDialog({
          show: true,
          header: "Assign Manager",
          size: "medium",
          type: "assign-to-manager",
        });
      },
      type: "assign-to-manager",
      isEnabled: (selected) =>
        selected.length > 0 && selected.every((e) => !e.managerId),
      tooltip: (selected) =>
        selected.length === 0
          ? "Select at least one employee"
          : selected.some((e) => e.managerId)
          ? "All selected must be unassigned"
          : undefined,
    },
    {
      text: "Convert Employee Type",
      icon: "mdi-account-convert",
      action: () => {
        setDialog({
          show: true,
          header: "Convert Employee Type",
          size: "medium",
          type: "convert-employee-type",
        });
      },
      type: "convert-employee-type",
      isEnabled: (selected) => selected.length > 0,
      tooltip: (selected) =>
        selected.length === 0 ? "Select employees to convert" : undefined,
    },
    {
      text: "Rehire Employee",
      icon: "mdi-briefcase-arrow-up-down",
      action: () => {
        setDialog({
          show: true,
          header: "Rehire Employee",
          size: "medium",
          type: "rehire-employee",
        });
      },
      type: "rehire-employee",
      isEnabled: (selected) =>
        selected.length > 0 && selected.every((e) => e.status === "Terminated"),
      tooltip: (selected) =>
        selected.length === 0
          ? "Select terminated employees"
          : selected.some((e) => e.status !== "Terminated")
          ? "Only terminated employees can be rehired"
          : undefined,
    },
    {
      text: "Update Training Status",
      icon: "mdi-book-open-page-variant",
      action: () => {
        setDialog({
          show: true,
          header: "Update Training Status",
          size: "medium",
          type: "training-status-update",
        });
      },
      type: "training-status-update",
      isEnabled: (selected) => selected.length > 0,
      tooltip: (selected) =>
        selected.length === 0
          ? "Select employees to update training status"
          : undefined,
    },
  ]);

  const getActions = (actionList: ActionType[]) => {
    return actions.value.filter((action) => actionList.includes(action.type));
  };

  return {
    dialogState,
    closeAndResetDialog,
    setDialog,
    actions,
    getActions,
  };
});
