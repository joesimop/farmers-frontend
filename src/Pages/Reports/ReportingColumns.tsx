import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@MSMComponents/DataTable/DataTableColumnHeader"
import { DataTableRowActions } from "@MSMComponents/DataTable/DataTableRowActions"
import { z } from "zod"
import MSMMoneyDisplay from "@MSMComponents/DataDisplay/MSMMoneyDisplay"
import { TokenType, VendorType } from "@lib/Constants/Types"
import MSMRow from "@MSMComponents/Layout/MSMRow"
import { MSMVendorBadge } from "@MSMComponents/DataDisplay/MSMVendorBadge"
import { TokenReport } from "./ReportingAPICalls"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ShadcnComponents/ui/hover-card"
import DataLabel from "@MSMComponents/DataDisplay/DataLabel"
import { isEmptyList, toReadableDate, toReadableString } from "Helpers"
import MSMHorizontalDivideLine from "@MSMComponents/Layout/MSMHorizontalDivideLine"
import { parseISO } from "date-fns"

export const calculateNetProfit = (fees_paid: number, tokens: TokenReport[]): number => {
  if (tokens == undefined) { return fees_paid; }
  const totalTokenValue = tokens.reduce((total, token) => {
    return total + token.count * token.per_dollar_value;
  }, 0);
  return fees_paid - totalTokenValue;
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

const BaseStartReportingColumns: ColumnDef<ReportsColumnsType>[] = [
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
  },
  {
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
    accessorKey: "market_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Market Date" />
    ),
    cell: ({ row }) =>
      <div className="tbl-col">
        {toReadableDate(row.getValue("market_date"))}
      </div>,
  },
  {
    accessorKey: "tokens",
    header: undefined, // Not displayed, but ensures tokens are accessible
    cell: undefined, // No visible content for this column
  },
]

const tokenColumns = (tokens: TokenReport[]): ColumnDef<ReportsColumnsType>[] => {
  //If there are no tokens...
  if (tokens === null) { return [];}

  return tokens.map(token => ({
    accessorKey: `${token.type}`, // This is a virtual accessor. We'll handle the cell manually.
    header: ({ column }) => <DataTableColumnHeader column={column} title={TokenType.toString(token.type)} />,
    cell: ({ row }) => {
      let rowTokens: TokenReport[] = row.getValue("tokens");
      let rowToken: TokenReport | undefined = rowTokens.find((t) => t.type == token.type)
      return (<span>{rowToken ? rowToken.count : "N/A"}</span>);
    },
    enableSorting: false,
  }))
};

const BaseEndReportingColumns: ColumnDef<ReportsColumnsType>[] = [
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
    accessorKey: "money_owed",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Money Owed" />
    ),
    cell: ({ row }) => {
      let tokens: TokenReport[] = row.getValue("tokens")
      let marketFee: number = row.getValue("fees_paid")
      let moneyOwed = calculateNetProfit(marketFee, tokens)
      let textColor = moneyOwed > 0 ? "text-green-600" : moneyOwed < 0 ? "text-red-600" : ""
      return (
        <HoverCard>
          <HoverCardTrigger>
            <MSMMoneyDisplay className={textColor} value={moneyOwed} />

          </HoverCardTrigger>

          <HoverCardContent className="w-fit p-2">

            <span className="font-bold text-sm">Tokens Used</span>
            <MSMHorizontalDivideLine verticalSpacing={1} />
            {tokens.map((token) => {
              return (
                <DataLabel label={TokenType.toString(token.type)} value={token.count} />);
            })}


          </HoverCardContent>
        </HoverCard>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },

]

export const ReportingColumns = (tokens: TokenReport[]): ColumnDef<ReportsColumnsType>[] => {
  return [...BaseStartReportingColumns, ...tokenColumns(tokens), ...BaseEndReportingColumns]
}