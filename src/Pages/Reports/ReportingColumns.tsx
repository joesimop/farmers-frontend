import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@MSMComponents/DataTable/DataTableColumnHeader"
import { DataTableRowActions } from "@MSMComponents/DataTable/DataTableRowActions"
import { z } from "zod"

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
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="tbl-col">{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "business_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vendor Name" />
    ),
    cell: ({ row }) => <div className="tbl-col">{row.getValue("business_name")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "gross",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reported Gross" />
    ),
    cell: ({ row }) => <div className="tbl-col">{`$ ${row.getValue("gross")}`}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "fees_paid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fee Charged" />
    ),
    cell: ({ row }) => {

        //Determine Fee Color
        let fee: number = row.getValue("fees_paid")
        let textColor = fee < 0 ? "text-green-600" : "text-red-600"
        textColor = fee === 0 ? "text-muted-foreground" : textColor

        let fullClassName = `tbl-col ${textColor} font-bold`
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
    cell: ({ row }) => <div className="tbl-col">{row.getValue("market_date")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]