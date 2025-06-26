import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {i18n} from '@lingui/core'
import { Link } from "react-router"
export const  UserMenu=()=> {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarFallback className="bg-primary text-primary-foreground">S</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>{i18n.t({id:"ui.My Account",message:"My Account"})}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem >
        {i18n.t({id:"ui.Profile",message:"Profile"})}
        </DropdownMenuItem>
         <DropdownMenuSeparator />
        <DropdownMenuItem >
          <Link to="/account">
        {i18n.t({id:"ui.Account",message:"Account"})}
        </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
         
        >
         {i18n.t({id:"ui.Logout",message:"Logout"})}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
export default UserMenu;