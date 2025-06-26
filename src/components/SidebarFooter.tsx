// import { Trans } from "@lingui/react";
// import {
//   SidebarProvider,
//   Sidebar,
//   SidebarHeader,
//   SidebarContent,
//   SidebarFooter,
//   SidebarMenu,
//   SidebarMenuItem,
//   SidebarMenuButton,
// } from "./ui/sidebar";
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
// } from "@radix-ui/react-dropdown-menu";
// import { ChevronUp } from "lucide-react";
// import { Link } from "react-router";
// export  const Footer=()=> {
//   return (
//     <SidebarFooter>
//       <SidebarMenu>
//         <SidebarMenuItem>
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <SidebarMenuButton>
//                 <Trans id="User" />

//                 <ChevronUp className="ml-auto" />
//               </SidebarMenuButton>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent
//               side="top"
//               className="w-[--radix-popper-anchor-width] min-w-[10rem]  bg-gray-200 dark:bg-gray-800 rounded-md border border-gray-500 dark:border-gray-700 shadow-lg overflow-hidden p-1 cursor-pointer w-40 data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
//             >
//               <DropdownMenuItem>
//                 <span>
//                   {" "}
//                   <Link to="/account">
//                   <Trans id="Account" />
//                   </Link>
//                 </span>
//               </DropdownMenuItem>
//               <DropdownMenuItem>
//                 <span>
//                   {" "}
//                   <Trans id="Billing" />
//                 </span>
//               </DropdownMenuItem>
//               <DropdownMenuItem>
//                 <span>
//                   {" "}
//                   <Trans id="Sign Out" />
//                 </span>
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </SidebarMenuItem>
//       </SidebarMenu>
//     </SidebarFooter>
//   );
// }
// export default Footer; 
