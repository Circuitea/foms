"use client"

import React from "react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head, Link } from "@inertiajs/react"
import { useState, useEffect } from "react"
import { Users, MapPin, Calendar, Maximize2, AlertTriangle, CheckCircle, X, ChevronLeft, RefreshCw, LayoutDashboard, Clipboard } from "lucide-react"
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet"
import PersonnelMarkersLayer from "./Mapping/Partials/PersonnelMarkersLayer"
import SanJuanBoundary from './Mapping/sanjuan-boundary.json';

import 'leaflet/dist/leaflet.css';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts"
import { PageProps } from "@/types"

interface IncidentData {
  barangay: string;
  [id: number]: number;
}


export default function Dashboard({ incidents, availablePersonnel, ongoingTasks }: PageProps<{ incidents: IncidentData[], availablePersonnel: number, ongoingTasks: number }>) {
  return (
    <div>
      <div className="bg-gray-50">
        {/* Dashboard Content */}
        <div className="flex flex-col gap-6 px-6 py-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-xs border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available Personnel</p>
                  <p className="text-2xl font-bold text-gray-900">{availablePersonnel}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-xs border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ongoing Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">{ongoingTasks}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Clipboard className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            
          </div>

          <div>
            {/* Main Content Area */}
            <div className="space-y-6">
              {/* Personnel Tracking Section */}
              <div className="bg-white rounded-lg shadow-xs border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">PERSONNEL TRACKING</h3>
                    </div>
                    
                  </div>
                </div>

                <div className="p-6">
                  <div
                    className="relative bg-linear-to-br from-blue-50 to-green-50 rounded-lg h-full cursor-pointer hover:shadow-md transition-all"
                  >
                    <Link href="/map">
                      <MapContainer className='min-h-full h-64 z-0 border-2 border-dashed border-gray-300 rounded-lg' center={[14.6034363, 121.0389469]} zoom={14} scrollWheelZoom={false} dragging={false} zoomControl={false}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <GeoJSON
                            style={{color: '#0000CC', weight: 4}}
                            // @ts-ignore
                            data={SanJuanBoundary}
                        />
                      </MapContainer>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Analytics Charts */}
              {/* <div className="bg-white rounded-lg shadow-xs border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Incidents (per Barangay)</h3>
                <ChartContainer config={chartConfig}>
                  <BarChart
                    width={500}
                    data={incidents}
                  >
                    <CartesianGrid />
                    <XAxis
                      dataKey="barangay"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      angle={270}
                      height={150}
                      textAnchor="end"
                    />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey={1} stackId="a" fill="var(--color-1)" />
                    <Bar dataKey={9} stackId="a" fill="var(--color-9)" />
                    <Bar dataKey={11} stackId="a" fill="var(--color-11)" />
                  </BarChart>
                </ChartContainer>
              </div> */}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

Dashboard.layout = (e: React.ReactElement) => <AuthenticatedLayout PageIcon={LayoutDashboard} pageTitle="Dashboard" children={e} />

const chartConfig = {
  1: {
    label: 'General Incident',
    color: '#2563eb',
  },
  9: {
    label: 'Vehicular Accident',
    color: '#60a5fa',
  },
  11: {
    label: 'Medical Response',
    color: '#1B2560',
  }
}