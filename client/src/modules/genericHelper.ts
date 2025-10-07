import type { Employee } from "../types";
import * as XLSX from "xlsx";
import dayjs from "dayjs";

export const applyGroupTableFilter = (
  search: string,
  data: { groupedBy: string; items: Employee[]; count: number }[],
  tableColumns: string[]
) => {
  const searchLower = search.toLowerCase().trim();

  const matchesSearch = (item: Employee) => {
    // Only search in the columns specified by tableColumns prop
    return tableColumns.some((column) => {
      const value = item[column as keyof Employee];
      if (value == null) return false;

      // Convert value to string and search
      return String(value).toLowerCase().includes(searchLower);
    });
  };

  return data
    .map((groupedData) => {
      const filteredItems = groupedData.items.filter(matchesSearch);
      return {
        ...groupedData,
        items: filteredItems,
        count: filteredItems.length,
      };
    })
    .filter((groupedData) => groupedData.items.length > 0);
};

/**
 * Column key to human-readable header mapping
 */
const COLUMN_HEADERS: Record<string, string> = {
  firstName: "First Name",
  lastName: "Last Name",
  fullName: "Full Name",
  department: "Department",
  position: "Position",
  jobLevel: "Job Level",
  employmentType: "Employment Type",
  workLocation: "Work Location",
  managerName: "Manager",
  hireDate: "Hire Date",
  status: "Status",
  personalEmail: "Personal Email",
  workEmail: "Work Email",
  phoneNumber: "Phone Number",
  salary: "Salary",
  currency: "Currency",
  paygrade: "Pay Grade",
  performanceRating: "Performance Rating",
  trainingStatus: "Training Status",
  benefitsEligible: "Benefits Eligible",
  backgroundCheckStatus: "Background Check Status",
  employeeId: "Employee ID",
  city: "City",
  state: "State",
  country: "Country",
  costCenter: "Cost Center",
  businessUnit: "Business Unit",
  terminationDate: "Termination Date",
  lastReviewDate: "Last Review Date",
  nextReviewDate: "Next Review Date",
  probationEndDate: "Probation End Date",
};

/**
 * Exports data to Excel format with specified columns
 * @param data Array of data items to export
 * @param columns Array of column keys to include in export
 * @param filename Name of the downloaded file (without extension)
 */
export const exportToExcel = <T extends Record<string, any>>(
  data: T[],
  columns: string[],
  filename: string = "export"
) => {
  if (!data || data.length === 0) {
    console.warn("No data to export");
    return;
  }

  // Filter data to only include specified columns
  const filteredData = data.map((item) => {
    const filteredItem: Record<string, any> = {};
    columns.forEach((column) => {
      const header = COLUMN_HEADERS[column] || column;
      filteredItem[header] = item[column] ?? "";
    });
    return filteredItem;
  });

  // Create worksheet from filtered data
  const worksheet = XLSX.utils.json_to_sheet(filteredData);

  // Auto-size columns based on content
  const columnWidths = columns.map((column) => {
    const header = COLUMN_HEADERS[column] || column;
    const maxLength = Math.max(
      header.length,
      ...filteredData.map((row) => String(row[header] || "").length)
    );
    return { wch: Math.min(maxLength + 2, 50) }; // Max width of 50
  });
  worksheet["!cols"] = columnWidths;

  // Create workbook and append worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  // Generate file and trigger download
  const timestamp = new Date().toISOString().split("T")[0];
  const filenameWithTimestamp = `${filename}_${timestamp}.xlsx`;
  XLSX.writeFile(workbook, filenameWithTimestamp);
};

/**
 * Helper to format dates consistently
 */
const formatDate = (dateValue: any): string => {
  if (!dateValue) return "";
  const date = dayjs(dateValue);
  return date.isValid() ? date.format("YYYY-MM-DD") : "";
};

/**
 * Helper to format date with time
 */
const formatDateTime = (dateValue: any): string => {
  if (!dateValue) return "";
  const date = dayjs(dateValue);
  return date.isValid() ? date.format("YYYY-MM-DD HH:mm:ss") : "";
};

/**
 * Exports comprehensive employee report with all data points including nested objects
 * @param employees Array of employee records to export
 * @param filename Name of the downloaded file (without extension)
 */
export const exportFullEmployeeReport = (
  employees: Employee[],
  filename: string = "employee_full_report"
) => {
  if (!employees || employees.length === 0) {
    console.warn("No employee data to export");
    return;
  }

  // Transform each employee record to flatten nested objects and format dates
  const transformedData = employees.map((emp) => ({
    // System IDs
    "Employee ID": emp.employeeId || "",
    "System ID": emp._id || "",
    "Doc Type": emp.docType,
    Status: emp.status,

    // Personal Information
    "First Name": emp.firstName,
    "Last Name": emp.lastName,
    "Full Name": emp.fullName,
    "Personal Email": emp.personalEmail,
    "Work Email": emp.workEmail,
    "Phone Number": emp.phoneNumber,
    "Emergency Contact Name": emp.emergencyContactName,
    "Emergency Contact Phone": emp.emergencyContactPhone,
    Address: emp.address,
    City: emp.city,
    State: emp.state,
    Country: emp.country,
    "Date of Birth": formatDate(emp.dateOfBirth),
    "Social Security Number": emp.socialSecurityNumber || "",

    // Employment Information
    Department: emp.department,
    Position: emp.position,
    "Job Level": emp.jobLevel,
    "Employment Type": emp.employmentType,
    "Work Location": emp.workLocation,
    "Manager ID": emp.managerId || "",
    "Manager Name": emp.managerName || "",
    "Direct Reports Count": emp.directReports?.length || 0,
    "Direct Reports IDs": emp.directReports?.join(", ") || "",
    "Cost Center": emp.costCenter || "",
    "Business Unit": emp.businessUnit || "",

    // Dates
    "Hire Date": formatDate(emp.hireDate),
    "Probation End Date": formatDate(emp.probationEndDate),
    "Last Review Date": formatDate(emp.lastReviewDate),
    "Next Review Date": formatDate(emp.nextReviewDate),
    "Termination Date": formatDate(emp.terminationDate),

    // Compensation & Benefits
    Salary: emp.salary,
    Currency: emp.currency,
    "Pay Grade": emp.paygrade,
    "Benefits Eligible": emp.benefitsEligible,

    // Performance & Development
    "Performance Rating": emp.performanceRating,
    "Training Status": emp.trainingStatus,
    "Development Notes": emp.developmentNotes || "",
    "Days Overdue": emp.daysOverdue || "",
    "Review Status": emp.reviewStatus || "",

    // Performance Metrics (flattened)
    "Average Performance Rating": emp.performanceMetrics?.averageRating || "",
    "Performance Rating Trend": emp.performanceMetrics?.ratingTrend || "",
    "Reviews Completed": emp.performanceMetrics?.reviewsCompleted || 0,
    "Performance Overdue Days": emp.performanceMetrics?.overdueDays || "",

    // Performance History Summary
    "Performance History Count": emp.performanceHistory?.length || 0,
    "Latest Review Date": emp.performanceHistory?.[0]
      ? formatDate(emp.performanceHistory[0].reviewDate)
      : "",
    "Latest Review Rating": emp.performanceHistory?.[0]?.rating || "",

    // Compliance & Verification
    "Background Check Status": emp.backgroundCheckStatus,

    // System Fields
    Source: emp.source,
    "Source ID": emp.sourceId || "",
    "Created By": emp.createdBy || "",
    "Created On": formatDateTime(emp.createdOn),
    "Updated By": emp.updatedBy || "",
    "Updated On": formatDateTime(emp.updatedOn),
    "Updated At": formatDateTime(emp.updatedAt),
    "Last Profile Update": formatDateTime(emp.lastProfileUpdate),
    "Profile Update Count": emp.profileUpdateHistory?.length || 0,

    // HR Assignment (flattened)
    "HR Assigned To": emp.hrAssignment?.assignedTo || "",
    "HR Assigned Date": formatDate(emp.hrAssignment?.assignedDate),
    "HR Manager Email": emp.hrAssignment?.managerEmail || "",
    "HR Manager Assign Date": formatDate(emp.hrAssignment?.managerAssignDate),
    "HR Review Comments": emp.hrAssignment?.reviewComments || "",
    "HR Revalidation Status": emp.hrAssignment?.revalidationStatus || "",

    // Onboarding (flattened)
    "Onboarding Author": emp.onboarding?.author || "",
    "Onboarding Author Type": emp.onboarding?.authorType || "",
    "Onboarding Event Date": formatDate(emp.onboarding?.eventDate),
    "Onboarding Event Name": emp.onboarding?.eventName || "",
    "Onboarding Event Reference ID": emp.onboarding?.eventReferenceId || "",
    "Onboarding Key": emp.onboarding?.onboardingKey || "",
    "Onboarding Owner": emp.onboarding?.owner || "",
    "Onboarding Record Updated": formatDateTime(emp.onboarding?.recordUpdated),

    // Attachments
    "Attachments Count": emp._attachments?.length || 0,
    Attachments: emp._attachments?.join(", ") || "",
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(transformedData);

  // Auto-size columns
  const columnKeys = Object.keys(transformedData[0] || {});
  const columnWidths = columnKeys.map((key) => {
    const maxLength = Math.max(
      key.length,
      ...transformedData.map(
        (row) => String(row[key as keyof typeof row] || "").length
      )
    );
    return { wch: Math.min(maxLength + 2, 50) };
  });
  worksheet["!cols"] = columnWidths;

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Report");

  // Generate file and trigger download
  const timestamp = new Date().toISOString().split("T")[0];
  const filenameWithTimestamp = `${filename}_${timestamp}.xlsx`;
  XLSX.writeFile(workbook, filenameWithTimestamp);
};
