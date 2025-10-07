import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ConsumableItemReport } from "@/Documents/ConsumableItemReport";
import { Personnel } from "@/types";
import { ConsumableItem, ConsumableTransactionEntry } from "@/types/inventory";
import { PDFDownloadLink } from "@react-pdf/renderer";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

interface ReportProps {
  item: ConsumableItem & { entries: (ConsumableTransactionEntry & {  running_total: string })[] };
  creator: Personnel;
  startDate: string;
  endDate: string;
}

export default function ConsumableReport({ item, creator, startDate, endDate }: ReportProps ) {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(0);

  useEffect(() => {
    async function getRecommendation() {
      if (!!item.model_identifier) {
        axios.get<{ prediction: { raw: number, formatted: number, } }>(`/api/inventory/consumable/${item.id}/recommendation`)
        .then((response) => {
          setRecommendation(response.data.prediction.formatted)
          setLoading(false);
        });
      }
    }
    
    setLoading(true);
    getRecommendation();
  }, [item])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Generate Report</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Consumable Item Report</DialogTitle>
        </DialogHeader>

        <div className="w-full flex justify-center items-center">
        {loading
          ? (
            <span>Loading Report</span>
          )
          : (
            <Button asChild>
              <PDFDownloadLink fileName={`consumable_${item.id}_${dayjs(startDate, "YYYY-MM").format("YYYYMM")}-${dayjs(endDate, "YYYY-MM").format("YYYYMM")}`} document={<ConsumableItemReport item={item} creator={creator} from_date={startDate} to_date={endDate} recommendation={recommendation} />}>
                Download Report
              </PDFDownloadLink>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}