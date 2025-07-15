import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAvatar } from "@/stores/AvatarStore";
import { Link } from "react-router";
import { User2 } from "lucide-react";
import { i18n } from "@lingui/core";

export const UserMenu = () => {
  const { avatarUrl } = useAvatar();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="avatar"
            className="h-8 w-8 rounded-full object-cover cursor-pointer"
          />
        ) : (
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarFallback className="bg-primary text-primary-foreground flex items-center justify-center">
              <User2 className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>
          {i18n.t({ id: "ui.My Account", message: "My Account" })}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Link to="/profile">
            {i18n.t({ id: "ui.Profile", message: "Profile" })}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Link to="/account">
            {i18n.t({ id: "ui.Account", message: "Account" })}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
          {i18n.t({ id: "ui.Logout", message: "Logout" })}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
