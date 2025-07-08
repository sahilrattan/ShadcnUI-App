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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { IoFlag, IoCalendarOutline } from "react-icons/io5";
import type { Card } from "./types";

export type ConfirmationModalProps = {
  onConfirm: (taskData: Card) => void;
  onCancel: () => void;
  open: boolean;
};

const AddCardModal: React.FC<ConfirmationModalProps> = ({
  open,
  onCancel,
  onConfirm,
}) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Card["priority"]>();
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [status, setStatus] = useState<Card["status"]>();
  const [type, setType] = useState<string>();
  const [assignee, setAssignee] = useState<string>();

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
        dueDate: dueDate?.toISOString(),
        status,
        type,
        assignee,
      });
      setTitle("");
      setPriority(undefined);
      setDueDate(undefined);
      setStatus(undefined);
      setType(undefined);
      setAssignee(undefined);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
        </DialogHeader>

        {/* Title */}
        <Input
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Due Date and Priority */}
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
              {["urgent", "high", "normal", "low"].map((level) => (
                <DropdownMenuItem
                  key={level}
                  onClick={() => setPriority(level as Card["priority"])}
                >
                  <IoFlag className={`${getPriorityColor(level)} mr-2`} />
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem onClick={() => setPriority(undefined)}>
                <span className="text-gray-400 mr-2">🚫</span> Clear
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Type */}
        <div className="mt-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                {type ?? " Type"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {["Operational", "Administrative", "Research", "Support"].map(
                (t) => (
                  <DropdownMenuItem key={t} onClick={() => setType(t)}>
                    {t}
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Status */}
        <div className="mt-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                {status
                  ? status.charAt(0).toUpperCase() + status.slice(1)
                  : " Status"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {["new", "scheduled", "inprogress", "completed"].map((s) => (
                <DropdownMenuItem
                  key={s}
                  onClick={() => setStatus(s as Card["status"])}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Assignee */}
        <div className="mt-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                {assignee ?? " Assignee"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {["Me", "John Doe", "Jane Smith", "Team A"].map((a) => (
                <DropdownMenuItem key={a} onClick={() => setAssignee(a)}>
                  {a}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Footer */}
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
