"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import type React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IoTrash } from "react-icons/io5";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import type { Card, List } from "@/components/kanban/types";
import {
  IoDocumentTextOutline,
  IoCheckmarkCircle,
  IoHammer,
  IoCalendarOutline,
  IoChevronDown,
  IoChevronForward,
  IoAdd,
  IoFlag,
  IoReorderThreeOutline,
} from "react-icons/io5";
type Props = {
  list: List[];
  setList: React.Dispatch<React.SetStateAction<List[]>>;
};

const STATUS_OPTIONS = [
  {
    id: "new",
    label: "New Task",
    icon: <IoDocumentTextOutline className="text-gray-500" />,
  },
  {
    id: "scheduled",
    label: "Scheduled",
    icon: <IoCalendarOutline className="text-red-500" />,
  },
  {
    id: "inprogress",
    label: "In Progress",
    icon: <IoHammer className="text-yellow-500" />,
  },
  {
    id: "completed",
    label: "Completed",
    icon: <IoCheckmarkCircle className="text-green-500" />,
  },
];

const PRIORITY_LABELS = {
  urgent: "Urgent",
  high: "High",
  normal: "Normal",
  low: "Low",
};

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

const TableView: React.FC<Props> = ({ list, setList }) => {
  const safeList = list ?? [];
  const [activeTasksExpanded, setActiveTasksExpanded] = useState(true);
  const [completedTasksExpanded, setCompletedTasksExpanded] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Card | null>(null);

  const [form, setForm] = useState<Partial<Card>>({
    title: "",
    description: "",
    dueDate: undefined,
    priority: undefined,
    type: undefined,
    assignee: undefined,
    status: undefined,
  });

  const allCards: { card: Card }[] = [];
  safeList.forEach((col) => {
    col.card.forEach((c) => {
      allCards.push({ card: c });
    });
  });

  const activeTasks = allCards.filter(({ card }) => {
    const col = safeList.find((l) => l.card.some((c) => c.id === card.id));
    return col?.title.toLowerCase() !== "completed";
  });

  const completedTasks = allCards.filter(({ card }) => {
    const col = safeList.find((l) => l.card.some((c) => c.id === card.id));
    return col?.title.toLowerCase() === "completed";
  });

  const openCreateDialog = () => {
    setEditingTask(null);
    setForm({
      title: "",
      description: "",
      dueDate: undefined,
      priority: undefined,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (card: Card) => {
    setEditingTask(card);
    setForm({ ...card });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.title) return;
    if (editingTask) {
      // Update existing task
      setList((prev) =>
        prev.map((col) => ({
          ...col,
          card: col.card.map((c) =>
            c.id === editingTask.id ? { ...c, ...form } : c
          ),
        }))
      );
    } else {
      // Create new task
      const firstActiveList = safeList.find(
        (l) => l.title.toLowerCase() !== "completed"
      );

      if (!firstActiveList) {
        const newList = {
          id: crypto.randomUUID(),
          title: "Tasks",
          color: "bg-blue-400",
          card: [],
        };
        setList((prev) => {
          const updatedList = [...prev, newList];

          const newCard: Card = {
            id: crypto.randomUUID(),
            title: form.title || "Untitled",
            description: form.description || "",
            dueDate: form.dueDate ?? "",
            priority: form.priority,
            status: form.status ?? "new",
            type: form.type,
            assignee: form.assignee,
          };

          return updatedList.map((l) =>
            l.id === newList.id ? { ...l, card: [...l.card, newCard] } : l
          );
        });

        setDialogOpen(false);
        return;
      }

      const newCard: Card = {
        id: crypto.randomUUID(),
        title: form.title || "Untitled",
        description: form.description || "",
        dueDate: form.dueDate ?? "",
        priority: form.priority,
        status: form.status ?? "new",
        type: form.type,
        assignee: form.assignee,
      };

      setList((prev) =>
        prev.map((col) =>
          col.id === firstActiveList!.id
            ? { ...col, card: [...col.card, newCard] }
            : col
        )
      );
    }

    setDialogOpen(false);
  };

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    setList((prev) => {
      const updated = [...prev];
      const sourceCol = updated.find((col) => {
        if (source.droppableId === "active-tasks")
          return col.title.toLowerCase() !== "completed";
        if (source.droppableId === "completed-tasks")
          return col.title.toLowerCase() === "completed";
        return false;
      });
      const destCol = updated.find((col) => {
        if (destination.droppableId === "active-tasks")
          return col.title.toLowerCase() !== "completed";
        if (destination.droppableId === "completed-tasks")
          return col.title.toLowerCase() === "completed";
        return false;
      });
      if (!sourceCol || !destCol) return prev;
      const cardIndex = sourceCol.card.findIndex((c) => c.id === draggableId);
      if (cardIndex === -1) return prev;
      const [movedCard] = sourceCol.card.splice(cardIndex, 1);
      destCol.card.splice(destination.index, 0, movedCard);
      return updated;
    });
  };

  const TableHeader = () => (
    <div className="grid grid-cols-6 gap-4 py-2 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-zinc-700">
      <div>Task</div>
      <div>Status</div>
      <div>Type</div>
      <div>Due date</div>
      <div>Priority</div>
      <div>Assignee</div>
    </div>
  );

  const TaskRow = ({ card, index }: { card: Card; index: number }) => {
    const priorityColor = getPriorityColor(card.priority);
    const priorityLabel =
      PRIORITY_LABELS[card.priority as keyof typeof PRIORITY_LABELS] ?? "None";
    const statusLabel =
      STATUS_OPTIONS.find((s) => s.id === card.status)?.label ?? "New Task";
    const handleDeleteTask = (cardId: string) => {
      setList((prev) =>
        prev.map((col) => ({
          ...col,
          card: col.card.filter((c) => c.id !== cardId),
        }))
      );
    };
    return (
      <Draggable draggableId={card.id} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className="group grid grid-cols-6 gap-4 py-3 px-4 hover:bg-gray-50 dark:hover:bg-zinc-900/50 border-b border-gray-100 dark:border-zinc-800 items-center"
            onClick={() => openEditDialog(card)}
          >
            {/* Task Title */}
            <div className="flex items-center gap-2">
              <div {...provided.dragHandleProps} className="cursor-grab p-1">
                <IoReorderThreeOutline className="w-4 h-4 text-gray-400" />
              </div>
              <span className="text-sm font-medium">{card.title}</span>
            </div>

            {/* Status */}
            <div className="text-sm text-gray-500">{statusLabel}</div>

            {/* Type */}
            <div className="text-sm text-gray-500">{card.type || "—"}</div>

            {/* Due Date */}
            <div className="text-sm text-gray-500">
              {card.dueDate
                ? format(parseISO(card.dueDate), "MMM d, yyyy")
                : "—"}
            </div>

            {/* Priority */}
            <div className="flex items-center gap-1 text-sm">
              <IoFlag className={priorityColor} />
              <span>{priorityLabel}</span>
            </div>

            {/* Assignee + Delete */}
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>{card.assignee || "—"}</span>
              <IoTrash
                className="ml-2 text-gray-400 hover:text-red-500 cursor-pointer transition-opacity"
                title="Delete task"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTask(card.id);
                }}
              />
            </div>
          </div>
        )}
      </Draggable>
    );
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="w-full bg-white dark:bg-zinc-950">
          {/* Active */}
          <div className="border border-gray-200 dark:border-zinc-800 rounded-lg mb-4">
            <div
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => setActiveTasksExpanded(!activeTasksExpanded)}
            >
              <div className="flex items-center gap-2">
                {activeTasksExpanded ? <IoChevronDown /> : <IoChevronForward />}
                <span className="font-medium">Active tasks</span>
              </div>
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  openCreateDialog();
                }}
              >
                <IoAdd className="mr-1" /> Create Task
              </Button>
            </div>
            {activeTasksExpanded && (
              <div>
                <div className="overflow-x-auto">
                  <div className="min-w-[700px]">
                    <TableHeader />
                    <Droppable droppableId="active-tasks">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {activeTasks.length > 0 ? (
                            activeTasks.map(({ card }, index) => (
                              <TaskRow
                                key={card.id}
                                card={card}
                                index={index}
                              />
                            ))
                          ) : (
                            <div className="px-4 py-6 text-sm text-gray-500 text-center">
                              No active tasks
                            </div>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Completed */}
          <div className="border border-gray-200 dark:border-zinc-800 rounded-lg">
            <div
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => setCompletedTasksExpanded(!completedTasksExpanded)}
            >
              <div className="flex items-center gap-2">
                {completedTasksExpanded ? (
                  <IoChevronDown />
                ) : (
                  <IoChevronForward />
                )}
                <span className="font-medium">Completed tasks</span>
              </div>
            </div>
            {completedTasksExpanded && (
              <div>
                <div className="overflow-x-auto">
                  <div className="min-w-[700px]">
                    <TableHeader />
                    <Droppable droppableId="completed-tasks">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {completedTasks.length > 0 ? (
                            completedTasks.map(({ card }, index) => (
                              <TaskRow
                                key={card.id}
                                card={card}
                                index={index}
                              />
                            ))
                          ) : (
                            <div className="px-4 py-6 text-sm text-gray-500 text-center">
                              No completed tasks
                            </div>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DragDropContext>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="overflow-x-hidden sm:max-w-3xl lg:max-w-3xl h-full sm:h-[calc(100vh-8rem)] sm:max-h-[100vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Left side: Form */}
            <div className="col-span-2 p-6 space-y-4">
              <h2 className="text-lg font-semibold">
                {editingTask ? "Edit Task" : "Create Task"}
              </h2>
              <div className="space-y-3">
                {/* Title */}
                <div>
                  <Input
                    placeholder="Task name"
                    value={form.title || ""}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    className="w-full"
                  />
                </div>
                {/* Description */}
                <div>
                  <Textarea
                    placeholder="Task description"
                    rows={6}
                    value={form.description || ""}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Right sidebar */}
            <div className=" border-l border-gray-200 p-6 space-y-4">
              <div className="space-y-2">
                <p className="text-xs uppercase font-semibold ">Create in</p>
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-white text-xs font-semibold">
                    S
                  </div>
                  <span className="text-sm font-medium">Trigbit</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase font-semibold ">Type</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="justify-start text-gray-600 w-full"
                    >
                      {form.type ?? "Select type"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {[
                      "Operational",
                      "Administrative",
                      "Research",
                      "Support",
                    ].map((type) => (
                      <DropdownMenuItem
                        key={type}
                        onClick={() => setForm({ ...form, type })}
                      >
                        {type}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase font-semibold ">Status</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="justify-start text-gray-600 w-full"
                    >
                      {form.status
                        ? STATUS_OPTIONS.find((s) => s.id === form.status)
                            ?.label
                        : "Select status"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {STATUS_OPTIONS.map((s) => (
                      <DropdownMenuItem
                        key={s.id}
                        onClick={() =>
                          setForm({ ...form, status: s.id as Card["status"] })
                        }
                      >
                        <div className="flex items-center gap-2">
                          {s.icon}
                          <span>{s.label}</span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <p className="text-xs uppercase font-semibold ">Priority</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="justify-start text-gray-600  w-full"
                    >
                      {form.priority ? (
                        <span className="flex items-center gap-1">
                          <IoFlag className={getPriorityColor(form.priority)} />
                          {PRIORITY_LABELS[form.priority]}
                        </span>
                      ) : (
                        "Set priority"
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {Object.entries(PRIORITY_LABELS).map(([k, v]) => (
                      <DropdownMenuItem
                        key={k}
                        onClick={() =>
                          setForm({
                            ...form,
                            priority: k as keyof typeof PRIORITY_LABELS,
                          })
                        }
                      >
                        <div className="flex items-center gap-2">
                          <IoFlag className={getPriorityColor(k)} />
                          <span>{v}</span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase font-semibold ">Assignee</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="justify-start  text-gray-600  w-full"
                    >
                      {form.assignee ?? "Select assignee"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {["Me", "John Doe", "Jane Smith", "Team A"].map((a) => (
                      <DropdownMenuItem
                        key={a}
                        onClick={() => setForm({ ...form, assignee: a })}
                      >
                        {a}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase font-semibold ">Due date</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="justify-start text-gray-600  w-full"
                    >
                      {form.dueDate
                        ? format(parseISO(form.dueDate), "MMM d, yyyy")
                        : "Pick due date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Calendar
                      mode="single"
                      selected={
                        form.dueDate ? parseISO(form.dueDate) : undefined
                      }
                      onSelect={(date) =>
                        setForm({ ...form, dueDate: date?.toISOString() })
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between border-t border-gray-200 p-4">
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingTask ? "Save Changes" : "Create Task"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TableView;
