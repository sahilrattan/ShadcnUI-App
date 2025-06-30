import type { Card } from "@/components/kanban/types";
import {
  IoTrash,
  IoFlag,
  IoCalendar,
} from "react-icons/io5";
import { format } from "date-fns";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleX } from "lucide-react";

interface TaskProps {
  task: Card;
  provided: any;
  onClick: () => void;
  onDelete?: () => void;
  onSetPriority?: (priority: Card["priority"]) => void;
}

const getPriorityColor = (priority?: string) => {
  switch (priority) {
    case "urgent":
      return "text-red-500";
    case "high":
      return "text-yellow-500";
    case "normal":
      return "text-blue-500";
    case "low":
      return "text-gray-500";
    default:
      return "text-gray-400";
  }
};

const Task = ({
  task,
  provided,
  onClick,
  onDelete,
  onSetPriority,
  
}: TaskProps) => {
  const priorityColor = getPriorityColor(task.priority);

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="w-full cursor-pointer bg-white shadow rounded-md px-4 py-2 text-sm text-gray-700 flex items-center justify-between"
      onClick={onClick}
    >
      <div className="font-medium">{task.title}</div>

      <div
        className="flex items-center gap-2 ml-2"
        onClick={(e) => e.stopPropagation()}
      >
        <IoCalendar
           className="text-gray-400 hover:text-blue-600 cursor-pointer"
         title="Due Date"
             />
         {task.dueDate && (
        <span className="text-xs text-gray-500">
           {format(new Date(task.dueDate), "MMM d")}
        </span>
             )}


        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IoFlag
              className={`${priorityColor} hover:opacity-80 cursor-pointer`}
              title="Priority"
              
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top">
            <DropdownMenuItem onClick={() => onSetPriority?.("urgent")}>
              <IoFlag className="text-red-500 mr-2" /> Urgent
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSetPriority?.("high")}>
              <IoFlag className="text-yellow-500 mr-2" /> High
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSetPriority?.("normal")}>
              <IoFlag className="text-blue-500 mr-2" /> Normal
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSetPriority?.("low")}>
              <IoFlag className="text-gray-500 mr-2" /> Low
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSetPriority?.(undefined)}>
              <span className="text-gray-500 mr-2">🚫</span> Clear
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <IoTrash
          className="text-gray-400  hover:text-red-500 cursor-pointer"
          title="Delete" 
          onClick={onDelete}
        />
      </div>
    </div>
  );
};

export default Task;
