"use client"

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
  <Card className="text-center w-36  sm:w-44 p-2 sm:p-3 shadow-md bg-white dark:bg-slate-900">
    <Avatar className="mx-auto mb-1 h-10 w-10">
      {image ? (
        <AvatarImage src={image} />
      ) : (
        <AvatarFallback className="bg-gray-100 text-gray-700 text-xs">
          {name.split(" ").map((w) => w[0]).join("")}
        </AvatarFallback>
      )}
    </Avatar>
    <h4 className="font-semibold text-sm">{name}</h4>
    <p className="text-xs text-primary">{title}</p>
  </Card>
)

export const OrgChart=()=> {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px] sm:min-w-0 flex flex-col items-center gap-10 p-4 sm:p-10 relative">

        <div className="relative z-10">
          <PersonCard name="Person 1" title="Founder & CEO" />
          <div className="absolute left-1/2 top-full h-10 w-px bg-gray-300 -translate-x-1/2" />
        </div>

        <div className="relative flex justify-center gap-20 items-start">

          <div className="absolute top-0 left-1/2 w-[300px] h-px bg-gray-300 -translate-x-1/2" />
          <div className="absolute top-0 left-[25%] w-px h-10 bg-gray-300" />
          <div className="absolute top-0 right-[25%] w-px h-10 bg-gray-300" />


          <div className="relative">
            <PersonCard name="Person 2" title="Director of Finance" />
            <div className="absolute left-1/2 top-full h-10 w-px bg-gray-300 -translate-x-1/2" />
          </div>


          <div className="relative">
            <PersonCard name="Person 3" title="Director of Product" />
            <div className="absolute left-1/2 top-full h-10 w-px bg-gray-300 -translate-x-1/2" />
          </div>
        </div>


        <div className="relative flex justify-center gap-20 items-start">

          <div className="absolute top-0 left-1/2 w-[420px] h-px bg-gray-300 -translate-x-1/2" />
          <div className="absolute top-0 left-[30%] w-px h-10 bg-gray-300" />
          <div className="absolute top-0 left-1/2 w-px h-10 bg-gray-300 -translate-x-1/2" />
          <div className="absolute top-0 right-[30%] w-px h-10 bg-gray-300" />

          <PersonCard name="Person 4" title="Senior Accountant" />
          <PersonCard name="Person 5" title="Business Data Analyst" />
          <PersonCard name="Person 6 " title="Product Manager" />
        </div>

      </div>
    </div>
  )
}
export default OrgChart;