import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@MSMComponents/DataTable/DataTableColumnHeader"
import { DataTableRowActions } from "@MSMComponents/DataTable/DataTableRowActions"
import { z } from "zod"
import MSMMoneyDisplay from "@MSMComponents/MSMMoneyDisplay"
import { TokenType, VendorType } from "@lib/Constants/Types"
import MSMRow from "@MSMComponents/Layout/MSMRow"
import { MSMVendorBadge } from "@MSMComponents/DataDisplay/MSMVendorBadge"
import { TokenReport } from "./ReportingAPICalls"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ShadcnComponents/ui/hover-card"
import DataLabel from "@MSMComponents/DataLabel/DataLabel"
import { toReadableDate, toReadableString } from "Helpers"
import MSMHorizontalDivideLine from "@MSMComponents/Layout/MSMHorizontalDivideLine"

export const calculateNetProfit = (grossProfit: number, tokens: TokenReport[]): number => {
  if (tokens == undefined) { return 0; }
  const totalTokenValue = tokens.reduce((total, token) => {
    return total + token.count * token.per_dollar_value;
  }, 0);
  const netProfit = grossProfit - totalTokenValue;
  return netProfit;
};

const tokensSchema = z.object({
  type: z.enum([TokenType.EBT, TokenType.MARKET_MATCH, TokenType.ATM]),
  count: z.number(),
  per_dollar_value: z.number()
})

const reportsSchema = z.object({
  id: z.string(),
  vendor_name: z.string(),
  vendor_type: z.enum([VendorType.PRODUCER, VendorType.NON_PRODUCER, VendorType.ANCILLARY]),
  reported_gross: z.number(),
  fees_paid: z.number(),
  market_date: z.date(),
  tokens: z.array(tokensSchema)
})

export type ReportsColumnsType = z.infer<typeof reportsSchema>

export const ReportingColumns: ColumnDef<ReportsColumnsType>[] = [
  {
    accessorKey: "business_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vendor Name" />
    ),
    cell: ({ row }) => {
      let businessName: string = row.getValue("business_name")
      return (
        <div className="tbl-col">{businessName}</div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  }, {
    accessorKey: "vendor_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      let vendorType: VendorType = row.getValue("vendor_type")
      return (
        <MSMVendorBadge vendorType={vendorType} />
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "gross",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reported Gross" />
    ),
    cell: ({ row }) => {
      let gross: number = row.getValue("gross")
      return (<MSMMoneyDisplay className="tbl-col" value={gross} />);
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "tokens",
    header: undefined, // Not displayed, but ensures tokens are accessible
    cell: undefined, // No visible content for this column
  },
  {
    accessorKey: "net",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Net Profit" />
    ),
    cell: ({ row }) => {
      let gross: number = row.getValue("gross")
      let tokens: TokenReport[] = row.getValue("tokens")
      let marketFee: number = row.getValue("fees_paid")
      let net = marketFee + calculateNetProfit(gross, tokens)
      let textColor = net > 0 ? "text-green-600" : net < 0 ? "text-red-600" : "text-muted"
      return (
        <HoverCard>
          <HoverCardTrigger>
            <MSMMoneyDisplay className={textColor} value={net} />

          </HoverCardTrigger>

          <HoverCardContent className="w-fit p-2">

            <span className="font-bold text-sm">Tokens Used</span>
            <MSMHorizontalDivideLine verticalSpacing={1} />
            {tokens.map((token) => {
              const label = token.type == TokenType.MARKET_MATCH ?
                toReadableString(token.type) : token.type
              return (
                <DataLabel label={label} value={token.count} />);
            })}


          </HoverCardContent>
        </HoverCard>
      );
    },
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

      return (<MSMMoneyDisplay value={fee} />)
    },

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