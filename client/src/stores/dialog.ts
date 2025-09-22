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
