import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { DataTable } from "./DataTable";

export function SmartTable({ columns, rows, filters = [], searchKeys = [], empty }) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const visibleRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesQuery = !query || searchKeys.some((key) => String(row[key] || "").toLowerCase().includes(query.toLowerCase()));
      const selectedFilter = filters.find((filter) => filter.value === activeFilter);
      const matchesFilter = activeFilter === "all" || !selectedFilter || selectedFilter.match(row);
      return matchesQuery && matchesFilter;
    });
  }, [activeFilter, filters, query, rows, searchKeys]);

  return (
    <div className="smart-table">
      <div className="table-tools">
        <label className="search-box">
          <Search size={16} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="بحث..." />
        </label>
        {filters.length > 0 && (
          <select value={activeFilter} onChange={(event) => setActiveFilter(event.target.value)}>
            <option value="all">الكل</option>
            {filters.map((filter) => <option key={filter.value} value={filter.value}>{filter.label}</option>)}
          </select>
        )}
      </div>
      <DataTable columns={columns} rows={visibleRows} empty={empty} />
    </div>
  );
}
