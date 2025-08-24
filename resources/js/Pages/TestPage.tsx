import { PDFViewer, usePDF } from "@react-pdf/renderer";
import { TaskReport } from "../Documents/TaskReport";
import { useEffect } from "react";

export default function TestPage() {
  return (
    <PDFViewer className="w-full min-h-screen h-full">
      <TaskReport />
    </PDFViewer>
  );
}