"use client"

import React, { useState, useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"

const PersonCard = ({
  name,
  title,
  image,
}: {
  name: string
  title: string
  image?: string
}) => (
  <Card className="text-center w-28 sm:w-32 p-2 sm:p-2 shadow-md bg-white dark:bg-slate-900">
    <Avatar className="mx-auto mb-1 h-8 w-8">
      {image ? (
        <AvatarImage src={image} />
      ) : (
        <AvatarFallback className="bg-gray-100 text-gray-700 text-[10px]">
          {name
            .split(" ")
            .map((w) => w[0])
            .join("")}
        </AvatarFallback>
      )}
    </Avatar>
    <h4 className="font-semibold text-xs">{name}</h4>
    <p className="text-[10px] text-primary">{title}</p>
  </Card>
)

const CardWithConnector = ({
  name,
  title,
  image,
  lineHeight = 12,
}: {
  name: string
  title: string
  image?: string
  lineHeight?: number
}) => (
  <div className="relative flex flex-col items-center">
    <PersonCard name={name} title={title} image={image} />
    <div
      className="absolute top-full left-1/2 w-px bg-gray-300"
      style={{ height: `${lineHeight * 4}px`, transform: "translateX(-50%)" }}
    />
  </div>
)

export const OrgChart = () => {
  const [zoom, setZoom] = useState(1)
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        setZoom((prevZoom) => {
          const newZoom = prevZoom - e.deltaY * 0.003
          return Math.min(1, Math.max(0.3, newZoom))
        })
      }
    }

    const container = chartRef.current
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false })
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel)
      }
    }
  }, [])

  return (
    <div className="overflow-auto w-full h-full">
      <div
        ref={chartRef}
        className="min-w-max origin-top transition-transform"
        style={{ transform: `scale(${zoom})` }}
      >

        <div className="w-full min-w-max flex flex-col items-center gap-10 p-4 sm:p-10 relative">
          {/* Top Person */}
          <div className="relative z-10">
            <CardWithConnector name="Person 1" title="Founder & CEO" lineHeight={10} />
          </div>

          {/* Directors */}
          <div className="relative flex justify-center gap-160 items-start">
            <div className="absolute top-0 left-1/2 w-[800px] h-px bg-gray-300 -translate-x-1/2" />
            <div className="absolute top-0 left-[10%] w-px h-10 bg-gray-300" />
            <div className="absolute top-0 right-[10%] w-px h-10 bg-gray-300" />

            <CardWithConnector name="Person 2" title="Director of Finance" lineHeight={10} />
            <CardWithConnector name="Person 3" title="Director of Product" lineHeight={10} />
          </div>

          {/* Managers and their teams */}
          <div className="relative flex justify-center gap-20 items-start">
            {/* Horizontal line connecting Person 4, 5, 6 */}
            <div className="absolute top-0 left-1/2 w-[1500px] h-px bg-gray-300 -translate-x-1/2" />
            <div className="absolute top-0 left-[15%] w-px h-10 bg-gray-300" />
            <div className="absolute top-0 left-1/2 w-px h-10 bg-gray-300 -translate-x-1/2" />
            <div className="absolute top-0 right-[15%] w-px h-10 bg-gray-300" />

            {/* Person 4 and subordinates */}
            <div className="flex flex-col items-center gap-4 relative">
              <CardWithConnector name="Person 4" title="Senior Accountant" lineHeight={4} />
              <div className="relative flex gap-4">
                <div className="absolute top-0 left-1/2 w-[600px] h-px bg-gray-300 -translate-x-1/2" />
                <PersonCard name="A1" title="Account Assistant 1" />
                <PersonCard name="A2" title="Account Assistant 2" />
                <PersonCard name="A3" title="Account Intern" />
                <PersonCard name="A4" title="Account Intern" />
                <PersonCard name="A5" title="Account Intern" />
              </div>
            </div>

            {/* Person 5 and subordinates */}
            <div className="flex flex-col items-center gap-4 relative">
              <CardWithConnector name="Person 5" title="Business Data Analyst" lineHeight={4} />
              <div className="relative flex gap-4">
                <div className="absolute top-0 left-1/2 w-[600px] h-px bg-gray-300 -translate-x-1/2" />
                <PersonCard name="B1" title="Data Analyst 1" />
                <PersonCard name="B2" title="Data Analyst 2" />
                <PersonCard name="B3" title="Data Intern" />
                <PersonCard name="B4" title="Data Intern" />
                <PersonCard name="B5" title="Data Intern" />
              </div>
            </div>

            {/* Person 6 and subordinates */}
            <div className="flex flex-col items-center gap-4 relative">
              <CardWithConnector name="Person 6" title="Product Manager" lineHeight={4} />
              <div className="relative flex gap-4">
                <div className="absolute top-0 left-1/2 w-[600px] h-px bg-gray-300 -translate-x-1/2" />
                <PersonCard name="C1" title="UX Designer" />
                <PersonCard name="C2" title="UI Developer" />
                <PersonCard name="C3" title="QA Tester" />
                <PersonCard name="C4" title="QA Tester" />
                <PersonCard name="C5" title="QA Tester" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrgChart
