import type { Employee } from "../types";
import * as XLSX from "xlsx";

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
