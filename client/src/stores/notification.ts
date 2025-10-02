import { defineStore } from "pinia";
import { ref } from "vue";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  message: string;
  type: NotificationType;
  timeout?: number;
}

export const useNotificationStore = defineStore("notification", () => {
  const show = ref(false);
  const message = ref("");
  const type = ref<NotificationType>("info");
  const timeout = ref(5000);

  const showNotification = (notification: Notification) => {
    message.value = notification.message;
    type.value = notification.type;
    timeout.value = notification.timeout || 5000;
    show.value = true;
  };

  const showSuccess = (msg: string, customTimeout?: number) => {
    showNotification({
      message: msg,
      type: "success",
      timeout: customTimeout,
    });
  };

  const showError = (msg: string, customTimeout?: number) => {
    showNotification({
      message: msg,
      type: "error",
      timeout: customTimeout || 7000, // Errors show longer by default
    });
  };

  const showWarning = (msg: string, customTimeout?: number) => {
    showNotification({
      message: msg,
      type: "warning",
      timeout: customTimeout,
    });
  };

  const showInfo = (msg: string, customTimeout?: number) => {
    showNotification({
      message: msg,
      type: "info",
      timeout: customTimeout,
    });
  };

  const hideNotification = () => {
    show.value = false;
  };

  return {
    show,
    message,
    type,
    timeout,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideNotification,
  };
});
