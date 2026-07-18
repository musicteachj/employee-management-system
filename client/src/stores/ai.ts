import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "./auth";
import { useNotificationStore } from "./notification";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Workforce Insights Assistant store (Phase 0: toolless streaming chat).
// Conversation history is held here on the client; the backend is stateless and
// receives the full message list each turn.
export const useAiStore = defineStore("ai", () => {
  const messages = ref<ChatMessage[]>([]);
  const isStreaming = ref(false);
  const isOpen = ref(false);

  const toggleOpen = () => {
    isOpen.value = !isOpen.value;
  };

  const clear = () => {
    messages.value = [];
  };

  // Build auth headers the same way stores/app.ts does (Bearer token from auth store).
  const buildHeaders = (): HeadersInit => {
    const authStore = useAuthStore();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (authStore.token) {
      headers["Authorization"] = `Bearer ${authStore.token}`;
    }
    return headers;
  };

  const streamChat = async (content: string) => {
    const text = content.trim();
    if (!text || isStreaming.value) return;

    const authStore = useAuthStore();
    const notificationStore = useNotificationStore();

    messages.value.push({ role: "user", content: text });
    // Append an empty assistant message we'll fill in as tokens stream.
    messages.value.push({ role: "assistant", content: "" });
    const assistantIdx = messages.value.length - 1;
    isStreaming.value = true;

    try {
      // Relative path → Vite proxies to :8000 in dev, same-origin in prod.
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify({
          // Everything before the empty assistant placeholder.
          messages: messages.value
            .slice(0, assistantIdx)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      // Mirror the 401 handling in stores/app.ts.
      if (response.status === 401) {
        authStore.logout();
        notificationStore.showError("Session expired. Please log in again.");
        throw new Error("Unauthorized");
      }
      if (!response.ok || !response.body) {
        throw new Error(`AI request failed: ${response.status} ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // SSE events are newline-delimited; keep the last (possibly partial) line.
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (!data || data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              // Update via index so the change goes through the reactive proxy.
              messages.value[assistantIdx].content += parsed.text;
            } else if (parsed.error) {
              notificationStore.showError(parsed.error);
            }
          } catch {
            // Ignore partial/non-JSON lines.
          }
        }
      }
    } catch (err: any) {
      if (err.message !== "Unauthorized") {
        notificationStore.showError(err.message || "AI request failed");
      }
      // Drop the assistant placeholder if nothing streamed in.
      if (messages.value[assistantIdx]?.content === "") {
        messages.value.splice(assistantIdx, 1);
      }
    } finally {
      isStreaming.value = false;
    }
  };

  return { messages, isStreaming, isOpen, toggleOpen, clear, streamChat };
});
