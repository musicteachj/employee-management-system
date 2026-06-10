import { computed, type ComputedRef, type Ref } from "vue";
import type { Employee } from "../types";

/**
 * Partition the selected employees into those a bulk action would actually
 * change ("applicable") and those it would skip (already in the target state, or
 * not a valid target for this action).
 *
 * `isApplicable` may read other reactive values (e.g. the chosen manager/status);
 * because it runs inside a computed, those dependencies are tracked, so the
 * partition recomputes as the form changes.
 */
export function useApplicableEmployees(
  selectedEmployees: Ref<Employee[]> | ComputedRef<Employee[]>,
  isApplicable: (emp: Employee) => boolean
) {
  const applicableEmployees = computed(() =>
    selectedEmployees.value.filter(isApplicable)
  );

  const applicableIds = computed(
    () =>
      applicableEmployees.value
        .map((e) => e._id)
        .filter((id): id is string => Boolean(id))
  );

  const skippedCount = computed(
    () => selectedEmployees.value.length - applicableEmployees.value.length
  );

  // Every selected employee is a no-op for the current choice.
  const allSkipped = computed(
    () =>
      selectedEmployees.value.length > 0 &&
      applicableEmployees.value.length === 0
  );

  return { applicableEmployees, applicableIds, skippedCount, allSkipped };
}
