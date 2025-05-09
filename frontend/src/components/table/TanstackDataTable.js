import React, { useMemo } from "react";
import TanstackDataTable from "./TanstackDataTable";

const SampleTable = () => {
  const data = useMemo(
    () => [
      {
        Employee_Name: "Alice Wanjiku",
        Date: "2025-01-10T00:00:00Z",
        Leave_Period: "2025",
        Days_Planned: 10,
      },
      {
        Employee_Name: "Brian Kipkoech",
        Date: "2025-02-15T00:00:00Z",
        Leave_Period: "2025",
        Days_Planned: 12,
      },
    ],
    []
  );

  const columns = useMemo(
    () => [
      {
        header: "Employee",
        accessorKey: "Employee_Name",
      },
      {
        header: "Date",
        accessorKey: "Date",
        cell: (info) => {
          const date = new Date(info.getValue());
          return date.toLocaleDateString();
        },
      },
      {
        header: "Leave Period",
        accessorKey: "Leave_Period",
      },
      {
        header: "Days Planned",
        accessorKey: "Days_Planned",
      },
    ],
    []
  );

  return <TanstackDataTable data={data} columns={columns} />;
};

export default SampleTable;
