"use client"

import { ColumnDef } from "@tanstack/react-table"

// import { Badge } from "@ShadcnComponents/ui/badge"
import { Checkbox } from "@ShadcnComponents/ui/checkbox"

import { DataTableColumnHeader } from "@MSMComponents/DataTable/DataTableColumnHeader"
import { DataTableRowActions } from "@MSMComponents/DataTable/DataTableRowActions"
import { z } from "zod"

const vendorSchema = z.object({
    id: z.number(),
    business_name: z.string(),
    type: z.string(),
    current_cpc: z.string(),
    cpc_expr: z.string(),
})

export type VendorData = z.infer<typeof vendorSchema>

export const VendorManagementColumns: ColumnDef<VendorData>[] = [
//   {
//     id: "select",
//     header: ({ table }) => (
//       <Checkbox
//         checked={
//           table.getIsAllPageRowsSelected() ||
//           (table.getIsSomePageRowsSelected() && "indeterminate")
//         }
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//         className="translate-y-[2px]"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Select row"
//         className="translate-y-[2px]"
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },
  {
    accessorKey: "business_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Business name" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("business_name")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
    //   const label = labels.find((label) => label.value === row.original.label)
        let rowData: string = row.getValue("type")
        rowData  = rowData.charAt(0).toUpperCase() + rowData.slice(1).toLowerCase();

      return (
        <div className="flex space-x-2">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className="max-w-[500px] truncate font-medium">
            {rowData}
          </span>
        </div>
      )
    },
    filterFn: (row, type, value) => {
      return value.includes(row.getValue(type))
    }
  },
  {
    accessorKey: "current_cpc",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CPC" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <span>{row.getValue('current_cpc')}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "cpc_expr",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CPC Expr" />
    ),
    cell: ({ row }) => {
        let rowData: string = row.getValue('cpc_expr')
        rowData = rowData === null ? "N/A" : rowData
      return (
        <div className="flex w-[100px] items-center">
          <span>{rowData}</span>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]