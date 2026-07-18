<script setup lang="ts">
import { ref, nextTick, watch } from "vue";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { useRouter } from "vue-router";
import { useAiStore } from "../stores/ai";

const aiStore = useAiStore();
const router = useRouter();
const draft = ref("");
const scrollArea = ref<HTMLElement | null>(null);

const scrollToBottom = () => {
  nextTick(() => {
    const el = scrollArea.value;
    if (el) el.scrollTop = el.scrollHeight;
  });
};

const send = async () => {
  const text = draft.value;
  if (!text.trim() || aiStore.isStreaming) return;
  draft.value = "";
  scrollToBottom();
  await aiStore.streamChat(text);
};

const TOOL_META: Record<string, { icon: string; label: string }> = {
  search_employees: { icon: "mdi-account-search", label: "Searching employees" },
  get_workforce_analytics: { icon: "mdi-chart-box", label: "Reading analytics" },
  get_overdue_reviews: { icon: "mdi-calendar-clock", label: "Checking overdue reviews" },
  get_direct_reports: { icon: "mdi-account-multiple", label: "Fetching direct reports" },
  get_managers: { icon: "mdi-account-tie", label: "Listing managers" },
  get_employee: { icon: "mdi-account", label: "Looking up employee" },
  get_performance_analytics: { icon: "mdi-chart-line", label: "Reading performance analytics" },
};
const toolMeta = (name: string) => TOOL_META[name] ?? { icon: "mdi-tools", label: name };

const renderMarkdown = (text: string) =>
  DOMPurify.sanitize(marked.parse(text, { async: false }) as string);

const openEmployee = (id: string) => router.push({ name: "employee-edit", params: { id } });

const STARTERS = [
  "Headcount by department",
  "Who's overdue for a review?",
  "List the managers",
  "Who are the recent hires this month?",
];
const sendStarter = (q: string) => {
  if (aiStore.isStreaming) return;
  aiStore.streamChat(q);
};

// Keep the conversation pinned to the latest content as tokens stream in
// (also re-scroll as tool trace rows and employee cards arrive).
watch(
  () =>
    aiStore.messages
      .map((m) => `${m.content}|${m.tools?.length ?? 0}|${m.employees?.length ?? 0}`)
      .join("||"),
  scrollToBottom
);
watch(
  () => aiStore.isOpen,
  (open) => {
    if (open) scrollToBottom();
  }
);
</script>

<template>
  <!-- Launcher FAB -->
  <v-btn
    v-if="!aiStore.isOpen"
    class="ai-fab"
    color="primary"
    icon="mdi-robot-happy-outline"
    size="large"
    elevation="6"
    @click="aiStore.toggleOpen"
  />

  <!-- Chat panel -->
  <v-card v-if="aiStore.isOpen" class="ai-panel" elevation="12">
    <div class="ai-panel__header">
      <div class="ai-panel__title">
        <v-icon icon="mdi-robot-happy-outline" size="20" class="mr-2" />
        Workforce Insights
      </div>
      <v-btn
        variant="text"
        icon="mdi-close"
        size="small"
        @click="aiStore.toggleOpen"
      />
    </div>

    <div ref="scrollArea" class="ai-panel__messages">
      <div v-if="aiStore.messages.length === 0" class="ai-panel__empty">
        <p>Ask a question about your workforce to get started.</p>
        <div class="ai-panel__chips">
          <v-chip
            v-for="q in STARTERS"
            :key="q"
            size="small"
            variant="outlined"
            color="primary"
            class="ai-chip"
            @click="sendStarter(q)"
            >{{ q }}</v-chip
          >
        </div>
      </div>

      <div
        v-for="(msg, i) in aiStore.messages"
        :key="i"
        class="ai-msg"
        :class="msg.role === 'user' ? 'ai-msg--user' : 'ai-msg--assistant'"
      >
        <template v-if="msg.role === 'assistant'">
          <div class="ai-msg__assistant">
            <div v-if="msg.tools?.length" class="ai-trace">
              <div v-for="(t, ti) in msg.tools" :key="ti" class="ai-trace__row">
                <v-icon :icon="toolMeta(t).icon" size="14" class="mr-1" />{{ toolMeta(t).label }}…
              </div>
            </div>
            <div class="ai-msg__bubble ai-md" v-html="renderMarkdown(msg.content)"></div>
            <span
              v-if="aiStore.isStreaming && i === aiStore.messages.length - 1"
              class="ai-msg__cursor"
              >▋</span
            >
            <div v-if="msg.employees?.length" class="ai-cards">
              <button
                v-for="e in msg.employees"
                :key="e.id"
                class="ai-card"
                @click="openEmployee(e.id)"
              >
                <span class="ai-card__name">{{ e.fullName }}</span>
                <span class="ai-card__meta">{{
                  [e.position, e.department].filter(Boolean).join(" · ")
                }}</span>
              </button>
            </div>
          </div>
        </template>
        <div v-else class="ai-msg__bubble">{{ msg.content }}</div>
      </div>
    </div>

    <div class="ai-panel__input">
      <v-text-field
        v-model="draft"
        placeholder="Ask about your workforce…"
        density="compact"
        variant="outlined"
        hide-details
        :disabled="aiStore.isStreaming"
        @keyup.enter="send"
      />
      <v-btn
        color="primary"
        icon="mdi-send"
        size="small"
        :loading="aiStore.isStreaming"
        :disabled="!draft.trim()"
        @click="send"
      />
    </div>
  </v-card>
</template>

<style scoped>
.ai-fab {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 2000;
}

.ai-panel {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 2000;
  width: 380px;
  max-width: calc(100vw - 32px);
  height: 540px;
  max-height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
  border-radius: 16px !important;
  overflow: hidden;
}

.ai-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 12px 12px 16px;
  background: var(--color-sidebar, #1e1b4b);
  color: #fff;
}
.ai-panel__title {
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 0.95rem;
}

.ai-panel__messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: var(--color-surface, #f4f4f5);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.ai-panel__empty {
  margin: auto;
  color: var(--color-gray, #a1a1aa);
  font-size: 0.875rem;
  text-align: center;
  padding: 0 24px;
}
.ai-panel__chips {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
  margin-top: 12px;
}
.ai-chip {
  cursor: pointer;
}

.ai-msg {
  display: flex;
}
.ai-msg--user {
  justify-content: flex-end;
}
.ai-msg--assistant {
  justify-content: flex-start;
}
.ai-msg__bubble {
  max-width: 80%;
  padding: 9px 12px;
  border-radius: 12px;
  font-size: 0.875rem;
  line-height: 1.45;
  white-space: pre-wrap;
  word-break: break-word;
}
.ai-msg--user .ai-msg__bubble {
  background: var(--color-primary, #4f46e5);
  color: #fff;
  border-bottom-right-radius: 4px;
}
.ai-msg--assistant .ai-msg__bubble {
  background: #fff;
  color: var(--color-ink, #18181b);
  border: 1px solid var(--color-border, #e4e4e7);
  border-bottom-left-radius: 4px;
}
.ai-msg__assistant {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 88%;
}
.ai-msg__assistant .ai-msg__bubble {
  max-width: 100%;
}
.ai-msg__cursor {
  color: var(--color-accent, #eab308);
  animation: ai-blink 1s steps(2, start) infinite;
}
@keyframes ai-blink {
  to {
    visibility: hidden;
  }
}

.ai-trace {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 0 2px;
}
.ai-trace__row {
  display: flex;
  align-items: center;
  color: var(--color-gray, #a1a1aa);
  font-size: 0.72rem;
  line-height: 1.3;
}

.ai-cards {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.ai-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1px;
  width: 100%;
  padding: 7px 10px;
  background: #fff;
  border: 1px solid var(--color-border, #e4e4e7);
  border-radius: 10px;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.15s ease;
}
.ai-card:hover,
.ai-card:focus-visible {
  background: var(--color-primary-pale, #e0e0fb);
}
.ai-card__name {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-primary, #4f46e5);
}
.ai-card__meta {
  font-size: 0.72rem;
  color: var(--color-gray, #a1a1aa);
}

/* Sanitized markdown answers: keep tables/code readable in a 380px panel. */
.ai-md :deep(p) {
  margin: 0 0 6px;
}
.ai-md :deep(p:last-child) {
  margin-bottom: 0;
}
.ai-md :deep(ul),
.ai-md :deep(ol) {
  margin: 0 0 6px;
  padding-left: 1.1em;
}
.ai-md :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 4px 0 8px;
  font-size: 0.8rem;
}
.ai-md :deep(th),
.ai-md :deep(td) {
  border: 1px solid var(--color-border, #e4e4e7);
  padding: 4px 6px;
  text-align: left;
}
.ai-md :deep(th) {
  background: var(--color-primary-pale, #e0e0fb);
  font-weight: 700;
}
.ai-md :deep(code) {
  background: var(--color-surface, #f4f4f5);
  border-radius: 4px;
  padding: 1px 4px;
  font-size: 0.8em;
}
.ai-md :deep(pre) {
  background: var(--color-surface, #f4f4f5);
  border-radius: 8px;
  padding: 8px;
  overflow-x: auto;
}
.ai-md :deep(pre code) {
  background: none;
  padding: 0;
}
.ai-md :deep(a) {
  color: var(--color-primary, #4f46e5);
}

.ai-panel__input {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: #fff;
  border-top: 1px solid var(--color-border, #e4e4e7);
}
</style>
