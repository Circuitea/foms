import { LocationHistoryReport } from "@/Documents/LocationHistoryReport";
import { PDFViewer } from "@react-pdf/renderer";

export default function TestPage() {
  return (
    <PDFViewer className="w-full h-screen">
      {/* <LocationHistoryReport /> */}
    </PDFViewer>
  );
}