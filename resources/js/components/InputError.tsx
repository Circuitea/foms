import { AlertCircle } from "lucide-react"
import type { HTMLAttributes } from "react"

export default function InputError({
  message,
}: { message?: string }) {
  return message ? (
    <div className="flex items-center gap-1 text-xs text-red-600">
      <AlertCircle className="h-3 w-3 flex-shrink-0" />
      <span className="break-words">{message}</span>
    </div>
  ) : null;
}
