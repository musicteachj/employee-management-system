import type { InjectionKey } from "vue";

// Shared API the OrgChart view provides to the recursive OrgChartNode children,
// so collapse/expand and focus work without prop/emit plumbing through the tree.
export interface OrgChartApi {
  /** Whether a node's children are currently hidden. */
  isCollapsed: (id: string) => boolean;
  /** Toggle a node's collapsed state. */
  toggleCollapsed: (id: string) => void;
  /** Re-root the chart on a node (show only its subtree). */
  focusNode: (id: string) => void;
}

export const ORG_CHART_API: InjectionKey<OrgChartApi> = Symbol("orgChartApi");
