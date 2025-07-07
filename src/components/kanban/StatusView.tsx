"use client";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { Card, List } from "@/components/kanban/types";
import { Badge } from "@/components/ui/badge";
import { IoReorderThreeOutline } from "react-icons/io5";
import { Square, Calendar, Settings, CheckCircle } from "lucide-react";

interface StatusViewProps {
  lists: List[];
  onDragEnd: (result: any) => void;
}

const STATUS_COLUMNS = [
  { id: "new", label: "New task", icon: Square, color: "text-gray-500" },
  {
    id: "scheduled",
    label: "Scheduled",
    icon: Calendar,
    color: "text-orange-500",
  },
  {
    id: "inprogress",
    label: "In Progress",
    icon: Settings,
    color: "text-blue-500",
  },
  {
    id: "completed",
    label: "Completed",
    icon: CheckCircle,
    color: "text-green-500",
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
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4  overflow-x-auto">
        {STATUS_COLUMNS.map((status) => {
          const Icon = status.icon;
          const taskCount = groupedByStatus[status.id].length;

          return (
            <Droppable droppableId={status.id} key={status.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="w-70 h-120 flex-shrink-0 bg-muted rounded-lg border p-4"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Icon className={`w-4 h-4 ${status.color}`} />
                    <h2 className="text-sm font-medium">{status.label}</h2>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {taskCount}
                    </Badge>
                  </div>

                  {taskCount === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-8">
                      {status.id === "completed"
                        ? "No completed tasks yet"
                        : `No ${status.label.toLowerCase()}`}
                    </p>
                  )}

                  {groupedByStatus[status.id].map(({ card }, index) => (
                    <Draggable
                      key={card.id}
                      draggableId={card.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white dark:bg-zinc-900 rounded shadow p-3 mb-2 text-sm border"
                        >
                          <div className="flex items-center gap-2">
                            <IoReorderThreeOutline className="text-gray-400 flex-shrink-0" />
                            <span className="truncate">{card.title}</span>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default StatusView;
