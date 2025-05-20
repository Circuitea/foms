import ApplicationLogo from "@/components/ApplicationLogo"
import type { PropsWithChildren } from "react"

export default function Guest({ children }: PropsWithChildren) {
  return (
    <div className={`bg-[url("/img/guest_bg.jpg")]` + " bg-cover bg-center bg-fixed"}>
      <div className="flex min-h-screen pt-4 items-center justify-center sm:pt-0 bg-black/20 backdrop-blur-[2px]">
        <div className="flex flex-col md:flex-row items-stretch shadow-2xl rounded-lg overflow-hidden max-w-4xl w-full mx-4">
          <div className="flex-1 flex flex-col justify-center items-center bg-white p-8 md:p-10">
            <ApplicationLogo className="h-20 w-20 mb-4" />
            <h2 className="text-xl font-bold text-center mb-1">City Disaster Risk Reduction</h2>
            <h2 className="text-xl font-bold text-center mb-1">and Management Office</h2>
          </div>

          <div className="flex-1 w-full bg-auth text-auth-foreground px-6 py-10 sm:px-10">{children}</div>
        </div>
      </div>
    </div>
  )
}
