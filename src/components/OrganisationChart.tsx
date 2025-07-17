"use client";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MdPersonSearch } from "react-icons/md";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/utils/cn";
import { UserService } from "@/api/services/UserService";
import type { UserListVM } from "@/api/models/UserListVM";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Person {
  id: string;
  userID?: string | null;
  name: string;
  title: string;
  image?: string;
  level: number;
  parentId?: string;
  email?: string | null;
}

const getFullName = (user: UserListVM): string => {
  const firstName = user.firstName?.trim() || "";
  const lastName = user.lastName?.trim() || "";
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  } else if (firstName) {
    return firstName;
  } else if (lastName) {
    return lastName;
  } else {
    return user.userName || user.email || "Unknown User";
  }
};

const getInitials = (fullName: string): string => {
  return fullName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const PersonCard = ({
  person,
  isHighlighted,
  refEl,
  isCEO = false,
}: {
  person: Person;
  isHighlighted: boolean;
  refEl?: (el: HTMLDivElement | null) => void;
  isCEO?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <div
            onClick={() => setOpen((prev) => !prev)}
            className="focus:outline-none"
          >
            <Card
              ref={refEl}
              className={cn(
                "relative bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 border-2 transition-all duration-300 hover:shadow-lg",
                "w-28 sm:w-32 p-2 sm:p-3",
                isCEO
                  ? "border-amber-400 shadow-amber-100 dark:shadow-amber-900/20"
                  : "border-gray-200 dark:border-slate-700",
                isHighlighted
                  ? "scale-110 ring-2 ring-blue-500 shadow-xl border-blue-400"
                  : "",
                "hover:scale-105"
              )}
            >
              {isCEO && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full text-xs font-bold">
                    CEO
                  </div>
                </div>
              )}
              <div className="text-center">
                <Avatar
                  className={cn(
                    "mx-auto mb-1 border-2",
                    isCEO
                      ? "h-10 w-10 sm:h-12 sm:w-12 border-amber-400"
                      : "h-8 w-8 sm:h-10 sm:w-10 border-gray-300 dark:border-slate-600"
                  )}
                >
                  {person.image ? (
                    <AvatarImage src={person.image || "/placeholder.svg"} />
                  ) : (
                    <AvatarFallback
                      className={cn(
                        "text-[10px] sm:text-xs font-semibold",
                        isCEO
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                          : "bg-blue-100 text-primary dark:bg-blue-900 dark:text-blue-200"
                      )}
                    >
                      {getInitials(person.name)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <h4 className="font-semibold text-sm text-gray-900  dark:text-gray-100 mb-1 leading-tight truncate">
                  {person.name}
                </h4>
                <p
                  className={cn(
                    "text-xs font-small truncate",
                    isCEO
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-primary dark:text-blue-400"
                  )}
                >
                  {person.title}
                </p>
              </div>
            </Card>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          className="w-70 p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-lg rounded-lg"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Avatar
                className={cn(
                  "h-10 w-10 border-2",
                  isCEO
                    ? "border-amber-400"
                    : "border-blue-300 dark:border-blue-700"
                )}
              >
                {person.image ? (
                  <AvatarImage src={person.image} />
                ) : (
                  <AvatarFallback
                    className={cn(
                      "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
                      !isCEO &&
                        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    )}
                  >
                    {getInitials(person.name)}
                  </AvatarFallback>
                )}
              </Avatar>

              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">
                  {person.name}
                </h4>
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  {person.title}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-slate-700">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Email
                </p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 ">
                  {person.email ?? "N/A"}
                </p>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const OrgChart = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const refMap = useRef<Record<string, HTMLDivElement | null>>({});
  const [zoom, setZoom] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightName, setHighlightName] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [users, setUsers] = useState<UserListVM[]>([]);
  const [orgData, setOrgData] = useState<Person[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await UserService.getApiVUser("1");
        const userList = response.data || [];
        setUsers(userList);
        if (userList.length > 0) {
          const ceo = userList[0];
          const directors = userList.slice(1, 3);
          const managers = userList.slice(3, 6);
          const employees = userList.slice(6);

          const hierarchicalData: Person[] = [
            {
              id: ceo.userID || "ceo",
              userID: ceo.id,
              name: getFullName(ceo),
              title: "Chief Executive Officer",
              level: 0,
              email: ceo.email,
            },
            ...directors.map((user, index) => ({
              id: user.userID || `director-${index}`,
              userID: user.id,
              name: getFullName(user),
              title:
                index === 0 ? "Director of Finance" : "Director of Product",
              level: 1,
              parentId: ceo.userID || "ceo",
              email: user.email,
            })),
            ...managers.map((user, index) => ({
              id: user.userID || `manager-${index}`,
              userID: user.id,
              name: getFullName(user),
              title:
                index === 0
                  ? "Senior Accountant"
                  : index === 1
                  ? "Business Data Analyst"
                  : "Product Manager",
              level: 2,
              parentId: directors[index % 2]?.userID || `director-${index % 2}`,
              email: user.email,
            })),
            ...employees.map((user, index) => ({
              id: user.userID || `employee-${index}`,
              userID: user.id,
              name: getFullName(user),
              title: "Employee",
              level: 3,
              parentId: managers[index % 3]?.userID || `manager-${index % 3}`,
              email: user.email,
            })),
          ];
          setOrgData(hierarchicalData);
        } else {
          setOrgData([]);
        }
      } catch (err) {
        console.error("Error fetching users", err);
        setOrgData([]);
      }
    };
    fetchUsers();
  }, []);

  const handleSelect = (name: string) => {
    setSearchTerm(name);
    setHighlightName(name);
    setShowSearch(false);
    const el = refMap.current[name];
    if (el && chartRef.current) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
    setTimeout(() => setHighlightName(""), 4000);
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setZoom((prevZoom) =>
          Math.min(1.5, Math.max(0.3, prevZoom - e.deltaY * 0.003))
        );
      }
    };
    const container = chartRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }
    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  const ceo = orgData.find((p) => p.level === 0);
  const directors = orgData.filter((p) => p.level === 1);
  const managers = orgData.filter((p) => p.level === 2);
  const employees = orgData.filter((p) => p.level === 3);

  const employeesByManager: Record<string, Person[]> = {};
  employees.forEach((employee) => {
    if (employee.parentId) {
      if (!employeesByManager[employee.parentId]) {
        employeesByManager[employee.parentId] = [];
      }
      employeesByManager[employee.parentId].push(employee);
    }
  });

  const managersByDirector: Record<string, Person[]> = {};
  managers.forEach((manager) => {
    if (manager.parentId) {
      if (!managersByDirector[manager.parentId]) {
        managersByDirector[manager.parentId] = [];
      }
      managersByDirector[manager.parentId].push(manager);
    }
  });

  const CARD_WIDTH = 128;
  const GAP_40 = 160;
  const GAP_20 = 80;
  const GAP_4 = 16;

  const VERTICAL_LINE_SEGMENT_XL = 65;
  const VERTICAL_LINE_SEGMENT_LG = 48;

  return (
    <div className="overflow-auto w-full h-full relative dark:from-slate-900 dark:to-slate-800">
      <div
        ref={chartRef}
        className="min-w-max origin-top transition-transform duration-300"
        style={{ transform: `scale(${zoom})` }}
      >
        <div className="fixed top-16 right-4 z-50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSearch((prev) => !prev)}
              className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
              title="Search employees"
            >
              <MdPersonSearch size={18} />
            </button>
            <button
              onClick={() => setZoom((z) => Math.min(z + 0.1, 1.5))}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors text-lg font-bold"
              title="Zoom in"
            >
              +
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(z - 0.1, 0.3))}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors text-lg font-bold"
              title="Zoom out"
            >
              −
            </button>
            {showSearch && (
              <div className="absolute top-full right-0 mt-2">
                <Command className="w-[280px] border rounded-lg bg-white dark:bg-slate-800 shadow-xl">
                  <CommandInput
                    placeholder="Search employees..."
                    value={searchTerm}
                    onValueChange={setSearchTerm}
                  />
                  <CommandList>
                    <CommandGroup
                      heading="Employees"
                      className="max-h-48 overflow-y-auto"
                    >
                      {orgData
                        .filter((p) =>
                          p.name
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                        )
                        .map((person) => (
                          <CommandItem
                            key={person.id}
                            value={person.name}
                            onSelect={() => handleSelect(person.name)}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {getInitials(person.name)}
                                </AvatarFallback>
                              </Avatar>
                              {person.name}
                            </div>
                          </CommandItem>
                        ))}
                    </CommandGroup>
                    <CommandEmpty>No employees found</CommandEmpty>
                  </CommandList>
                </Command>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center py-8 px-4 min-h-screen">
          {/* CEO Level */}
          {ceo && (
            <div className="relative flex flex-col items-center  mb-[64px]">
              <PersonCard
                person={ceo}
                isHighlighted={highlightName === ceo.name}
                refEl={(el) => (refMap.current[ceo.name] = el)}
                isCEO={true}
              />
              {directors.length > 0 && (
                <div
                  className="absolute top-full left-1/2 w-px bg-gray-400  dark:bg-gray-600 transform -translate-x-1/2"
                  style={{ height: `${VERTICAL_LINE_SEGMENT_XL}px` }}
                />
              )}
            </div>
          )}

          {/* Directors Level */}
          {directors.length > 0 && (
            <div className="relative mb-[64px]">
              <div
                className="absolute left-1/2 h-px bg-gray-400 dark:bg-gray-600 transform -translate-x-1/2 top-30px"
                style={{
                  width: `${(directors.length - 1) * (CARD_WIDTH + GAP_40)}px`,
                }}
              />
              <div
                className="flex justify-center gap-40"
                style={{ paddingTop: `${VERTICAL_LINE_SEGMENT_XL}px` }}
              >
                {directors.map((director) => {
                  const managerChildren =
                    managersByDirector[director.id]?.length || 0;
                  return (
                    <div
                      key={director.id}
                      className="relative flex flex-col items-center"
                    >
                      <div
                        className="absolute bottom-full left-1/2 w-px bg-gray-400 dark:bg-gray-600 transform -translate-x-1/2"
                        style={{ height: `${VERTICAL_LINE_SEGMENT_XL}px` }}
                      />
                      <PersonCard
                        person={director}
                        isHighlighted={highlightName === director.name}
                        refEl={(el) => (refMap.current[director.name] = el)}
                      />
                      {managerChildren > 0 && (
                        <div
                          className="absolute top-full left-1/2 w-px bg-gray-400 dark:bg-gray-600 transform -translate-x-1/2"
                          style={{ height: `${VERTICAL_LINE_SEGMENT_XL}px` }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Managers Level */}
          {managers.length > 0 && (
            <div className="relative mb-[48px]">
              <div className="absolute left-1/2 h-px bg-gray-400 dark:bg-gray-600 transform -translate-x-1/2 top-30px w-248 " />
              <div
                className="flex justify-center gap-92"
                style={{ paddingTop: `${VERTICAL_LINE_SEGMENT_XL}px` }}
              >
                {managers.map((manager) => {
                  const employeeChildren =
                    employeesByManager[manager.id]?.length || 0;
                  return (
                    <div
                      key={manager.id}
                      className="relative flex flex-col items-center"
                    >
                      <div
                        className="absolute bottom-full left-1/2 w-px bg-gray-400 dark:bg-gray-600 transform -translate-x-1/2"
                        style={{ height: `${VERTICAL_LINE_SEGMENT_XL}px` }}
                      />
                      <PersonCard
                        person={manager}
                        isHighlighted={highlightName === manager.name}
                        refEl={(el) => (refMap.current[manager.name] = el)}
                      />
                      {employeeChildren > 0 && (
                        <div
                          className="absolute top-full left-1/2 w-px bg-gray-400 dark:bg-gray-600 transform -translate-x-1/2"
                          style={{ height: `${VERTICAL_LINE_SEGMENT_LG}px` }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Employees Level */}
          {managers.length > 0 && (
            <div className="flex justify-center gap-20">
              {managers.map((manager) => {
                const managerEmployees = employeesByManager[manager.id] || [];
                if (managerEmployees.length === 0) return null;
                return (
                  <div
                    key={manager.id}
                    className="flex flex-col items-center relative"
                  >
                    <div
                      className="absolute left-1/2 h-px bg-gray-400 dark:bg-gray-600 transform -translate-x-1/2 top-32px"
                      style={{
                        width: `${
                          (managerEmployees.length - 1) * (CARD_WIDTH + GAP_4)
                        }px`,
                      }}
                    />
                    <div
                      className="flex gap-4"
                      style={{ paddingTop: `${VERTICAL_LINE_SEGMENT_LG}px` }}
                    >
                      {managerEmployees.map((employee) => (
                        <div
                          key={employee.id}
                          className="relative flex flex-col items-center"
                        >
                          <div
                            className="absolute bottom-full left-1/2 w-px bg-gray-400 dark:bg-gray-600 transform -translate-x-1/2"
                            style={{ height: `${VERTICAL_LINE_SEGMENT_LG}px` }}
                          />
                          <PersonCard
                            person={employee}
                            isHighlighted={highlightName === employee.name}
                            refEl={(el) => (refMap.current[employee.name] = el)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {orgData.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 text-lg">
                Loading organization chart...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrgChart;
