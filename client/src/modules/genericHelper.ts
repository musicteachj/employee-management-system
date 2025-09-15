import type { Employee } from "../types";

export const applyGroupTableFilter = (
  search: string,
  data: { groupedBy: string; items: Employee[]; count: number }[]
) => {
  const searchLower = search.toLowerCase().trim();

  const matchesSearch = (item: Record<string, any>) => {
    return Object.values(item).some((value) => {
      return (
        typeof value === "string" && value.toLowerCase().includes(searchLower)
      );
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
