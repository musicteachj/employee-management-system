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
      isEnabled: (selected) => selected.length > 0,
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
    },
    {
      text: "Schedule Performance Review",
      icon: "mdi-calendar-clock",
      action: () => {
        setDialog({
          show: true,
          header: "Schedule Performance Review",
          size: "medium",
          type: "schedule-performance-review",
        });
      },
      type: "schedule-performance-review",
      isEnabled: (selected) => selected.length > 0,
    },
    {
      text: "Conduct Review",
      icon: "mdi-calendar-clock",
      action: () => {
        setDialog({
          show: true,
          header: "Conduct Review",
          size: "medium",
          type: "conduct-review",
        });
      },
      type: "conduct-review",
      isEnabled: (selected) => selected.length > 0,
    },
    {
      text: "Change Status",
      icon: "mdi-account-switch",
      action: () => {
        setDialog({
          show: true,
          header: "Change Status",
          size: "medium",
          type: "status-change",
        });
      },
      type: "status-change",
      isEnabled: (selected) => selected.length > 0,
    },
    {
      text: "Export Data",
      icon: "mdi-file-export",
      action: () => {},
      type: "export-data",
      isEnabled: () => true,
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
