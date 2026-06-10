// Single source of truth for the org hierarchy.
//
// Every place in the app that orders, ranks, or validates job levels should
// derive from the constants/helpers here so the rules can never drift apart.
// The canonical seniority, lowest -> highest:
//   Entry < Mid < Senior < Lead < Manager < Director < VP < C-Level < CEO
//
// See the "canonical hierarchy" section of the hierarchy audit plan for the
// assignment rules these helpers enforce.

import type { Employee, EmploymentType, JobLevel, Manager } from "../types";

// Canonical order, lowest seniority first. `jobLevelRank` is the index, so a
// higher number means more senior.
export const JOB_LEVELS: JobLevel[] = [
  "Entry",
  "Mid",
  "Senior",
  "Lead",
  "Manager",
  "Director",
  "VP",
  "C-Level",
  "CEO",
];

// Levels that make someone a people-manager by title alone.
export const MANAGER_LEVELS: JobLevel[] = [
  "Manager",
  "Director",
  "VP",
  "C-Level",
  "CEO",
];

// Employment types allowed to manage people (rule 3).
export const ELIGIBLE_MANAGER_TYPES: EmploymentType[] = ["Full-time", "Part-time"];

// Employee statuses allowed to manage people (rule 2).
const ELIGIBLE_MANAGER_STATUSES = ["Active", "On Leave"] as const;

/** Seniority rank for a level. Higher = more senior. Unknown levels rank -1. */
export function jobLevelRank(level: JobLevel | string | undefined | null): number {
  if (!level) return -1;
  return JOB_LEVELS.indexOf(level as JobLevel);
}

/** Whether a level is a people-manager level by title. */
export function isManagerLevel(level: JobLevel | string | undefined | null): boolean {
  return !!level && MANAGER_LEVELS.includes(level as JobLevel);
}

/** Whether an employment type is allowed to manage people (rule 3). */
export function isEligibleManagerType(
  employmentType: EmploymentType | string | undefined | null
): boolean {
  return (
    !!employmentType &&
    ELIGIBLE_MANAGER_TYPES.includes(employmentType as EmploymentType)
  );
}

/** Rule 1: a manager's level must be equal to or higher than the report's. */
export function canManage(
  managerLevel: JobLevel | string | undefined | null,
  reportLevel: JobLevel | string | undefined | null
): boolean {
  const reportRank = jobLevelRank(reportLevel);
  if (reportRank < 0) return true; // unknown report level: don't block
  return jobLevelRank(managerLevel) >= reportRank;
}

/** Sort comparator for employees by seniority, most senior first (CEO -> Entry). */
export function bySeniorityDesc(
  a: { jobLevel?: JobLevel },
  b: { jobLevel?: JobLevel }
): number {
  return jobLevelRank(b.jobLevel) - jobLevelRank(a.jobLevel);
}

interface EligibleManagerOptions {
  /** The employee(s) being assigned a manager. */
  reports: Employee | Employee[];
  /** Candidate manager pool (e.g. appStore.managers). */
  managers: Manager[];
  /** Full employee list, used to look up status/employmentType and detect cycles. */
  employees: Employee[];
  /**
   * Optional level override for the report(s) (e.g. a job level chosen in a
   * rehire form that differs from the stored record). Used as the seniority floor.
   */
  reportLevelOverride?: JobLevel;
}

/**
 * Return the managers that may be assigned to the given report(s), enforcing the
 * canonical assignment rules:
 *   1. manager level >= the most-senior report's level
 *   2. manager is Active / On Leave
 *   3. manager is Full-time / Part-time
 *   4. no self-management and no cycles (manager must not be, or transitively
 *      report to, any of the reports)
 *
 * Status and employment type live on the full Employee record (the Manager type
 * doesn't carry them), so they're looked up by id from `employees`.
 */
export function getEligibleManagers({
  reports,
  managers,
  employees,
  reportLevelOverride,
}: EligibleManagerOptions): Manager[] {
  const reportList = Array.isArray(reports) ? reports : [reports];
  const byId = new Map(employees.map((e) => [e._id ?? "", e]));

  // Seniority floor: an explicit override (e.g. a rehire's chosen level) wins
  // outright; otherwise it's the most-senior report's level.
  const floorRank =
    reportLevelOverride !== undefined
      ? jobLevelRank(reportLevelOverride)
      : Math.max(-1, ...reportList.map((r) => jobLevelRank(r.jobLevel)));

  const reportIds = new Set(reportList.map((r) => r._id).filter(Boolean) as string[]);

  // True if `managerId` is, or transitively reports up to, any of the reports.
  const reportsUpToAReport = (managerId: string): boolean => {
    let current: string | undefined = managerId;
    const seen = new Set<string>();
    while (current && !seen.has(current)) {
      if (reportIds.has(current)) return true;
      seen.add(current);
      current = byId.get(current)?.managerId || undefined;
    }
    return false;
  };

  return managers.filter((m) => {
    // Rule 4: not one of the reports themselves, and not (transitively) below them.
    if (reportIds.has(m.id)) return false;
    if (reportsUpToAReport(m.id)) return false;

    // Rule 1: seniority floor.
    if (floorRank >= 0 && jobLevelRank(m.jobLevel) < floorRank) return false;

    // Rules 2 & 3: status + employment type (from the full record when available).
    const record = byId.get(m.id);
    if (record) {
      if (!ELIGIBLE_MANAGER_STATUSES.includes(record.status as never)) return false;
      if (!isEligibleManagerType(record.employmentType)) return false;
    }

    return true;
  });
}
