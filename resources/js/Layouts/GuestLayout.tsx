import ApplicationLogo from "@/components/ApplicationLogo"
import type { PropsWithChildren } from "react"

export default function Guest({ children }: PropsWithChildren) {
  return (
    <div className={`bg-[url("/img/guest_bg.jpg")]` + " bg-cover bg-center bg-fixed"}>
      <div className="flex min-h-screen pt-4 items-center justify-center sm:pt-0 bg-black/20 backdrop-blur-[2px]">
        <div className="flex flex-col md:flex-row items-stretch shadow-2xl rounded-lg overflow-hidden max-w-4xl w-full mx-4">
          <div className="flex-1 flex flex-col justify-center items-center bg-white p-8 md:p-10">
            <ApplicationLogo className="h-28 w-28 mb-4" />
            <h2 className="text-xl font-bold text-center mb-1">City Disaster Risk Reduction</h2>
            <p className="text-xl font-bold text-center mb-1">and Management Office</p>
          </div>

          <div className="flex-1 w-full relative overflow-hidden bg-linear-to-br from-[#1B2560] to-[#2d3a8a] text-auth-foreground px-6 py-10 sm:px-10">
            {/* Decorative shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/3 -translate-x-1/3"></div>
 
            {/* Content with relative positioning to appear above the shapes */}
            <div className="relative z-10">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
