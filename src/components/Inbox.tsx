import {  BadgeCheckIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {i18n} from '@lingui/core'
const Inbox=()=> {
  return (
    <div className="flex flex-col items-center mt-20 justify-center  gap-2">
      <div className="flex w-full flex-wrap gap-2">
                <Badge>{i18n.t({id:"ui.Badge",message:"Badge"})}</Badge>

        <Badge variant="secondary">{i18n.t({id:"ui.Secondary",message:"Secondary"})}</Badge>
        <Badge variant="destructive">{i18n.t({id:"ui.Destructive",message:"Destructive"})}</Badge>
        <Badge variant="outline">{i18n.t({id:"ui.Outline",message:"Outline"})}</Badge>
      </div>
      <div className="flex w-full flex-wrap gap-2">
        <Badge
          variant="secondary"
          className="bg-blue-500 text-white dark:bg-blue-600"
        >
          <BadgeCheckIcon />
        {i18n.t({id:"ui.Verified",message:"Verified"})}
        </Badge>
        <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
          8
        </Badge>
        <Badge
          className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
          variant="destructive"
        >
          99
        </Badge>
        <Badge
          className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
          variant="outline"
        

        >
          20+
        </Badge>
      </div>
    </div>
  )
}
export default Inbox;