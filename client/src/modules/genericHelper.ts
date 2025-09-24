import type { Employee } from "../types";

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
