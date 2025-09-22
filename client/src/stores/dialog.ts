import { defineStore } from "pinia";
import { reactive } from "vue";
import type { DialogState } from "../types";

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

  return {
    dialogState,
    closeAndResetDialog,
    setDialog,
  };
});
