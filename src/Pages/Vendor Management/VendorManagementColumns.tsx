import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@MSMComponents/DataTable/DataTableColumnHeader"
import { z } from "zod"
import { CPCStatusBadge } from "@MSMComponents/CPCComponents/CPCStatusBadge";
import { DataTableRowActions } from "@MSMComponents/DataTable/DataTableRowActions";
import { toReadableString } from "Helpers";
import { VendorType } from "@lib/Constants/Types";
import { MSMVendorBadge } from "@MSMComponents/DataDisplay/MSMVendorBadge";

const vendorSchema = z.object({
  id: z.number(),
  business_name: z.string(),
  type: z.string(),
  current_cpc: z.string(),
  cpc_expr: z.string(),
})

export type VendorData = z.infer<typeof vendorSchema>

export const VendorManagementColumns: ColumnDef<VendorData>[] = [
  {
    accessorKey: "business_name",

    header: ({ column }) => (<DataTableColumnHeader column={column} title="Business name" />),

    cell: ({ row }) => <div className="tbl-col">{row.getValue("business_name")}</div>,

    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "type",

    header: ({ column }) => (<DataTableColumnHeader column={column} title="Type" />),

    cell: ({ row }) => {
      let vendor_type: VendorType = row.getValue("type")
      return (<div className="tbl-col">{<MSMVendorBadge vendorType={vendor_type} />}</div>)
    },

    filterFn: (row, type, value) => {
      return value.includes(row.getValue(type))

    }
  },
  {
    accessorKey: "current_cpc",

    header: ({ column }) => (<div className="tbl-col">CPC</div>),

    cell: ({ row }) => { return (<div className="tbl-col">{row.getValue('current_cpc')} </div>) },

  },
  {
    accessorKey: "cpc_expr",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="CPC Expr" />),

    cell: ({ row }) => {
      return (<div className="justify-between"><CPCStatusBadge date={row.getValue('cpc_expr')} /></div>)
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]