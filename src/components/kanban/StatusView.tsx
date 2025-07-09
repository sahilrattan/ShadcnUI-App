"use client";

import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import type { Card, List } from "@/components/kanban/types";
import { Badge } from "@/components/ui/badge";
import { GripVertical } from "lucide-react";
import { Square, Calendar, Settings, CheckCircle } from "lucide-react";
import { cn } from "@/utils/cn";

interface StatusViewProps {
  lists: List[];
  onDragEnd: (result: DropResult) => void;
}

const STATUS_COLUMNS = [
  {
    id: "new",
    label: "New task",
    icon: Square,
    color: "text-slate-600",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    accentColor: "bg-slate-500",
  },
  {
    id: "scheduled",
    label: "Scheduled",
    icon: Calendar,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    accentColor: "bg-amber-500",
  },
  {
    id: "inprogress",
    label: "In Progress",
    icon: Settings,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    accentColor: "bg-blue-500",
  },
  {
    id: "completed",
    label: "Completed",
    icon: CheckCircle,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    accentColor: "bg-emerald-500",
  },
];

export const StatusView = ({ lists, onDragEnd }: StatusViewProps) => {
  const allCards: { card: Card; listId: string }[] = [];
  (lists ?? []).forEach((list) => {
    list.card.forEach((card) => {
      allCards.push({ card, listId: list.id });
    });
  });

  // Group by status
  const groupedByStatus = STATUS_COLUMNS.reduce((acc, s) => {
    acc[s.id] = allCards.filter((c) => c.card.status === s.id);
    return acc;
  }, {} as Record<string, { card: Card; listId: string }[]>);

  return (
    <div className="w-full h-full   p-4 md:p-6">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4">
          {STATUS_COLUMNS.map((status) => {
            const Icon = status.icon;
            const taskCount = groupedByStatus[status.id].length;

            return (
              <Droppable droppableId={status.id} key={status.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "min-w-[280px] w-80 flex-shrink-0  rounded-xl shadow-sm border transition-all duration-200",
                      snapshot.isDraggingOver &&
                        "shadow-lg ring-2 ring-blue-200 dark:ring-blue-800",
                      status.borderColor
                    )}
                  >
                    {/* Column Header */}
                    <div
                      className={cn(
                        "p-4 border-b rounded-t-xl",
                        status.bgColor,
                        status.borderColor
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "p-2 rounded-lg bg-white dark:bg-gray-700 shadow-sm"
                            )}
                          >
                            <Icon className={cn("w-4 h-4", status.color)} />
                          </div>
                          <div>
                            <h3 className="font-semibold  text-black text-sm">
                              {status.label}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {taskCount} {taskCount === 1 ? "task" : "tasks"}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-xs font-medium text-white border-0",
                            status.accentColor
                          )}
                        >
                          {taskCount}
                        </Badge>
                      </div>
                    </div>

                    {/* Column Content */}
                    <div className="p-4 min-h-[400px] max-h-[600px] overflow-y-auto">
                      {taskCount === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <div
                            className={cn(
                              "w-16 h-16 rounded-full flex items-center justify-center mb-4",
                              status.bgColor
                            )}
                          >
                            <Icon
                              className={cn(
                                "w-8 h-8",
                                status.color,
                                "opacity-50"
                              )}
                            />
                          </div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                            {status.id === "completed"
                              ? "No completed tasks yet"
                              : `No ${status.label.toLowerCase()}`}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {status.id === "completed"
                              ? "Complete tasks to see them here"
                              : "Drag tasks here to get started"}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {groupedByStatus[status.id].map(({ card }, index) => (
                            <Draggable
                              key={card.id}
                              draggableId={card.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={cn(
                                    "group bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 p-4 transition-all duration-200 cursor-pointer",
                                    "hover:shadow-md hover:border-gray-300 dark:hover:border-gray-500 hover:-translate-y-0.5",
                                    snapshot.isDragging &&
                                      "shadow-lg ring-2 ring-blue-200 dark:ring-blue-800 rotate-1 scale-105"
                                  )}
                                >
                                  <div className="flex items-start gap-3">
                                    <div
                                      {...provided.dragHandleProps}
                                      className="mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                                    >
                                      <GripVertical className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm leading-5 truncate">
                                          {card.title}
                                        </h4>
                                        <div
                                          className={cn(
                                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ml-2 flex-shrink-0",
                                            status.bgColor,
                                            status.color
                                          )}
                                        >
                                          <Icon className="w-3 h-3" />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        </div>
                      )}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default StatusView;
