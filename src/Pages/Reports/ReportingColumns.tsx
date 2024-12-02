"use client"

import { ColumnDef } from "@tanstack/react-table"

// import { Badge } from "@ShadcnComponents/ui/badge"
import { Checkbox } from "@ShadcnComponents/ui/checkbox"

// import { labels, priorities, statuses } from "../data/data"
import { DataTableColumnHeader } from "@MSMComponents/DataTable/DataTableColumnHeader"
import { DataTableRowActions } from "@MSMComponents/DataTable/DataTableRowActions"
import { z } from "zod"


// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.

const tokensSchema = z.object({
    type: z.string(),
    count: z.number()
})

const reportsSchema = z.object({
    id: z.string(),
    vendor_name: z.string(),
    reported_gross: z.number(),
    fees_paid: z.number(),
    market_date: z.date(),
    tokens: z.array(tokensSchema)
})

export type ReportsColumnsType = z.infer<typeof reportsSchema>

export const ReportingColumns: ColumnDef<ReportsColumnsType>[] = [
/*   {
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
//   },*/
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "business_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vendor Name" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("business_name")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "gross",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reported Gross" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{`$ ${row.getValue("gross")}`}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "fees_paid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fee Charged" />
    ),
    cell: ({ row }) => {
        let fee: number = row.getValue("fees_paid")
        let textColor = fee < 0 ? "text-green-600" : "text-red-600"
        textColor = fee === 0 ? "text-muted-foreground" : textColor

        let fullClassName = `w-[80px] ${textColor} font-bold`
        fee = Math.abs(fee)
        return (<div className={fullClassName}>{`$ ${fee}`}</div>)},
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "market_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Market Date" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("market_date")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]