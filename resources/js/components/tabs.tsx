import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const PageTabs = TabsPrimitive.Root

const PageTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <div className="border-t border-gray-600 bg-[#1B2560]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#1B2560]">
      <TabsPrimitive.List
        ref={ref}
        className={cn(
          // "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
          'flex space-x-8',
          className
        )}
        {...props}
      />
    </div>
  </div>
))
PageTabsList.displayName = TabsPrimitive.List.displayName

const PageTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      // "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      "flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-300 data-[state=inactive]:hover:text-white data-[state=inactive]:hover:border-gray-400 data-[state=active]:border-blue-400 data-[state=active]:text-blue-300",
      className,
      "bg-[#1B2560]"
    )}
    {...props}
  />
))
PageTabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const PageTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
PageTabsContent.displayName = TabsPrimitive.Content.displayName

export { PageTabs, PageTabsList, PageTabsTrigger, PageTabsContent }
