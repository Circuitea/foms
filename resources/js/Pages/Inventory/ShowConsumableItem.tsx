import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConsumableItemReport } from "@/Documents/ConsumableItemReport";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { getMonthName } from "@/lib/utils";
import { PageProps } from "@/types";
import { ConsumableItem, ConsumableTransactionEntry } from "@/types/inventory";
import { Link, router, usePage } from "@inertiajs/react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import dayjs from "dayjs";
import { MapPin, MoveLeft, Package } from "lucide-react";
import { useState } from "react";
import { CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis } from "recharts";
import ConsumableReport from "./Partials/ConsumableReportDialog";

interface YearWeekTotal {
  running_total: string;
  weekly_quantity: string;
  week: number;
  year: number;
}

type ItemPageProps = PageProps<{
  item: ConsumableItem & { entries: (ConsumableTransactionEntry & { running_total: string })[] };
  totals: YearWeekTotal[];
  months: Record<number, number[]>; // year and months[]
  start_date: string;
  end_date: string;
}>;

export default function ShowConsumableItem({ item, totals, months, start_date, end_date }: ItemPageProps) {
  const { user } = usePage().props.auth;
  const [startDate, setStartDate] = useState(start_date);
  const [endDate, setEndDate] = useState(end_date);
  const monthOptions: {value: string, label: string}[] = [];
  Object.entries(months).forEach(([year, monthsInYear]) => monthsInYear.forEach(month => monthOptions.push({ value: `${year}-${String(month).padStart(2, '0')}`, label: `${getMonthName(month)} ${year}`})))


  return (
    <>
      <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 shrink-0 bg-white">
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/inventory">
              <MoveLeft />
              Back
            </Link>
          </Button>
          <Package className="w-6 h-6 text-[#1B2560]" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{item.name}</h2>
            <p className="text-sm text-gray-600 capitalize">{item.type.name}</p>
          </div>
        </div>
        {/* <Button
          className="px-8 bg-[#1B2560] text-white rounded-md hover:bg-[#2A3B70] transition-colors font-medium"
        >
          Edit Equipment
        </Button> */}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="w-full h-80 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
              <div className="text-center flex flex-col justify-center items-center">
                <div className="text-8xl mb-4">
                  <Package className="w-6 h-6" />
                </div>
                <div className="text-sm text-gray-500">Equipment Image</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Basic Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700">Item Code</label>
                  <p className="text-sm text-gray-900 font-mono">CODE</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Serial Number</label>
                  <p className="text-sm text-gray-900 font-mono">SERIAL NUMBER</p>
                </div> */}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <p className="text-sm text-gray-900 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {item.location}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <p className="text-sm text-gray-900">{item.description}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 gap-2 shadow-lg rounded-lg w-full mt-4">
          <div className="flex justify-between items-baseline mb-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <LineChart className="w-5 h-5" />
              Item Statistics
            </h3>
            <div className="flex gap-2 items-baseline">
              <span>From</span>
              <Select value={startDate} onValueChange={setStartDate}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span>to</span>
              <Select value={endDate} onValueChange={setEndDate}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map(option => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      disabled={option.value < startDate}
                    >{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button className="bg-[#1B2560]" onClick={() => router.reload({ data: {start_date: startDate, end_date: endDate}, only: ['totals'] })}>Apply</Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div id="chart" className="bg-white pr-8 rounded-lg shadow-lg">
              <QuantityGraph data={totals.map(total => ({
                year_week: `${total.year}-W${total.week}`,
                quantity: Number(total.running_total),
              }))} />
            </div>
            <div>
              <DataTable columns={columns} data={item.entries} />
            </div>
          </div>
          <div className="pt-4 flex justify-end">
            <ConsumableReport creator={user} item={item} startDate={startDate} endDate={endDate} />
          </div>
        </div>
      </div>
    </>
  );
}

const chartConfig = {
  quantity: {
    label: 'Quantity',
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

interface QuantityData {
  year_week: string;
  quantity: number;
}

const columns: ColumnDef<ConsumableTransactionEntry>[] = [
  {
    id: 'transaction',
    accessorKey: 'transaction.title',
    header: 'Transaction',
    cell: ({ row }) => (
      <div>
        <p>{row.original.transaction.title}</p>
        <p>{row.original.transaction.description}</p>
      </div>
    ),
  },
  {
    accessorKey: 'quantity',
    cell: ({ row }) => (
      <div className="flex justify-end">
        <span className="w-full text-right">{row.getValue('quantity')}</span>
      </div>
    )
  },
  {
    accessorKey: 'running_total',
    cell: ({ row }) => (
      <div className="flex justify-end">
        <span className="w-full text-right">{row.getValue('running_total')}</span>
      </div>
    )
  }
]

function QuantityGraph({ data }: { data: QuantityData[]}) {

  return (
    <ChartContainer className="min-h-full w-full" config={chartConfig}>
      <LineChart
        accessibilityLayer
        data={data}
        margin={{ top: 20, left: 12, right: 12, bottom: 20 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="year_week"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          label={{ value: 'Year - Week', position: 'bottom' }}
          // tickFormatter={value => `Week: ${value}`}
        />
        <YAxis
          dataKey="quantity"
          tickMargin={8}
          domain={['dataMin - 5', 'dataMax + 5']}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Line
          dataKey="quantity"
          type="bump"
          stroke="var(--color-quantity)"
          strokeWidth={2}
          dot={{ fill: "var(--color-quantity)" }}
          activeDot={{ r: 6 }}
        >
          {/* <LabelList
            position="top"
            offset={12}
            className="fill-foreground"
            fontSize={12}
          /> */}
        </Line>
      </LineChart>
    </ChartContainer>
  );
}

ShowConsumableItem.layout = (e: JSX.Element) => <Authenticated pageTitle="Inventory Item" children={e} />