"use client";

import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { IoMdAdd } from "react-icons/io";
import ColumnContainer from "./ColumnContainer";
import type { List } from "@/components/kanban/types";
import TableView from "./TableView";
import StatusView from "./StatusView";
import { CiViewTable } from "react-icons/ci";
import { MdOutlineViewKanban } from "react-icons/md";

const LOCAL_KEY = "kanban-board";

const KanbanBoard = () => {
  const [list, setList] = useState<List[]>([]);
  const [view, setView] = useState<"kanban" | "table" | "status">("kanban");

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) setList(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
  }, [list]);

  const handleAddList = useCallback(() => {
    const colors = [
      "bg-yellow-400",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-400",
      "bg-blue-400",
    ];
    setList((prevList) => [
      ...prevList,
      {
        id: Date.now().toString(),
        title: `List ${prevList.length + 1}`,
        color: colors[prevList.length % colors.length],
        card: [],
      },
    ]);
  }, []);

  const onDragEnd = (result: any) => {
    const { source, destination, type } = result;
    if (!destination) return;

    if (type === "column") {
      const reordered = Array.from(list);
      const [removed] = reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, removed);
      setList(reordered);
      return;
    }

    const sourceList = list.find((l) => l.id === source.droppableId);
    const destList = list.find((l) => l.id === destination.droppableId);
    if (!sourceList || !destList) return;

    const sourceCards = [...sourceList.card];
    const [movedCard] = sourceCards.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceCards.splice(destination.index, 0, movedCard);
      setList((prev) =>
        prev.map((l) =>
          l.id === sourceList.id ? { ...l, card: sourceCards } : l
        )
      );
    } else {
      const destCards = [...destList.card];
      destCards.splice(destination.index, 0, movedCard);
      setList((prev) =>
        prev.map((l) => {
          if (l.id === sourceList.id) return { ...l, card: sourceCards };
          if (l.id === destList.id) return { ...l, card: destCards };
          return l;
        })
      );
    }
  };

  const handleStatusDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    setList((prevList) =>
      prevList.map((listItem) => ({
        ...listItem,
        card: listItem.card.map((card) =>
          card.id === draggableId
            ? { ...card, status: destination.droppableId }
            : card
        ),
      }))
    );
  };

  return (
    <div className="min-h-screen p-6 bg-background text-foreground overflow-x-auto">
      {/* View Toggle */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={view === "table" ? "secondary" : "outline"}
          onClick={() => setView("table")}
        >
          <CiViewTable />
          Table view
        </Button>
        <Button
          variant={view === "kanban" ? "secondary" : "outline"}
          onClick={() => setView("kanban")}
        >
          <MdOutlineViewKanban />
          Kanban board
        </Button>
        <Button
          variant={view === "status" ? "secondary" : "outline"}
          onClick={() => setView("status")}
        >
          Status
        </Button>
      </div>

      <DragDropContext
        onDragEnd={view === "status" ? handleStatusDragEnd : onDragEnd}
      >
        {view === "kanban" ? (
          <>
            <Droppable
              droppableId="all-columns"
              direction="horizontal"
              type="column"
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex gap-4 pb-6"
                >
                  {list.map((column, index) => (
                    <Draggable
                      draggableId={column.id}
                      index={index}
                      key={column.id}
                    >
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                          className="flex-shrink-0"
                        >
                          <ColumnContainer
                            column={column}
                            list={list}
                            setList={setList}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <div className="w-full flex justify-start mt-4">
              <Button onClick={handleAddList}>
                <IoMdAdd className="mr-2 h-4 w-4" /> Add Another List
              </Button>
            </div>
          </>
        ) : view === "table" ? (
          <TableView list={list} setList={setList} />
        ) : (
          <StatusView lists={list} onDragEnd={handleStatusDragEnd} />
        )}
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
