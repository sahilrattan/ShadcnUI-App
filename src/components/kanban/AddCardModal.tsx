import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoFlag, IoCalendarOutline } from "react-icons/io5";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export type ConfirmationModalProps = {
  onConfirm: (taskData: any) => void;
  onCancel: () => void;
  open: boolean;
};

const AddCardModal: React.FC<ConfirmationModalProps> = ({
  open,
  onCancel,
  onConfirm,
}) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<
    "urgent" | "high" | "normal" | "low" | undefined
  >();
  const [dueDate, setDueDate] = useState<Date | undefined>();

  const getPriorityColor = (p?: string) => {
    switch (p) {
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

  const handleSubmit = () => {
    if (title.trim()) {
      onConfirm({
        id: Date.now().toString(),
        title,
        priority,
        dueDate: (dueDate ?? new Date()).toISOString(),
      });
      setTitle("");
      setPriority(undefined);
      setDueDate(undefined);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
        </DialogHeader>

        {/* Title input */}
        <Input
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="flex gap-4 items-center mt-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <IoCalendarOutline className="text-gray-500" />
                {dueDate ? format(dueDate, "PPP") : "Pick due date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <IoFlag className={`${getPriorityColor(priority)} text-lg`} />
                {priority
                  ? priority.charAt(0).toUpperCase() + priority.slice(1)
                  : "Priority"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setPriority("urgent")}>
                <IoFlag className="text-red-500 mr-2" /> Urgent
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriority("high")}>
                <IoFlag className="text-yellow-500 mr-2" /> High
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriority("normal")}>
                <IoFlag className="text-blue-500 mr-2" /> Normal
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriority("low")}>
                <IoFlag className="text-gray-500 mr-2" /> Low
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriority(undefined)}>
                <span className="text-gray-400 mr-2">🚫</span> Clear
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <DialogFooter className="pt-4">
          <Button onClick={onCancel} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCardModal;
