import React, { useCallback, useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import StrictModeDroppable from "./StrictModeDroppable";
import Task from "./Task";
import { Button } from "@/components/ui/button";
import { IoMdAdd } from "react-icons/io";
import AddCardModal from "./AddCardModal";
import EditCardModal from "./EditCardModal";
import type { List, Card } from "@/components/kanban/types";

type Props = {
  column: List;
  list: List[];
  setList: React.Dispatch<React.SetStateAction<List[]>>;
  dragHandleProps?: any;
};

const ColumnContainer: React.FC<Props> = ({
  column,
  list,
  setList,
  dragHandleProps,
}) => {
  const [openAdd, setOpenAdd] = useState(false);
  const [editTask, setEditTask] = useState<Card | null>(null);

  const handleAddTask = useCallback(
    (taskData: Card) => {
      setList(
        list.map((item) =>
          item.id === column.id
            ? { ...item, card: [...item.card, taskData] }
            : item
        )
      );
    },
    [column.id, list, setList]
  );

  const handleUpdateTask = (updatedTask: Card) => {
    setList(
      list.map((item) =>
        item.id === column.id
          ? {
              ...item,
              card: item.card.map((c) =>
                c.id === updatedTask.id ? updatedTask : c
              ),
            }
          : item
      )
    );
    setEditTask(null);
  };

  return (
    <div className="w-[260px] flex-shrink-0 flex flex-col gap-2 py-4 px-3 rounded-md bg-[var(--color-card)] dark:bg-zinc-900 border border-[var(--color-border)] shadow-md">
      <StrictModeDroppable droppableId={column.id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex flex-col gap-3"
          >
           <div
  className={`w-full text-white rounded-lg shadow p-3 text-sm font-semibold flex items-center justify-between ${column.color}`}
  {...dragHandleProps}
>
  <span>{column.title}</span>
  <span className="text-xs bg-white text-black rounded-full px-2 py-0.5 min-w-[20px] text-center">
    {column.card.length}
  </span>
</div>


            {column.card.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => (
                  <div>
                    <Task
                      provided={provided}
                      task={task}
                      onClick={() => setEditTask(task)}
                      onDelete={() => {
                        setList(
                          list.map((col) =>
                            col.id === column.id
                              ? {
                                  ...col,
                                  card: col.card.filter(
                                    (c) => c.id !== task.id
                                  ),
                                }
                              : col
                          )
                        );
                      }}
                      onSetPriority={(priority) => {
                        setList(
                          list.map((col) =>
                            col.id === column.id
                              ? {
                                  ...col,
                                  card: col.card.map((c) =>
                                    c.id === task.id ? { ...c, priority } : c
                                  ),
                                }
                              : col
                          )
                        );
                      }}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </StrictModeDroppable>

      <Button
        variant="outline"
        onClick={() => setOpenAdd(true)}
        className="text-primary"
      >
        <IoMdAdd className="mr-2 h-4 w-4" /> Add Task
      </Button>

      <AddCardModal
        open={openAdd}
        onCancel={() => setOpenAdd(false)}
        onConfirm={(task) => {
          handleAddTask({ ...task, description: "", subtasks: [] });
          setOpenAdd(false);
        }}
      />

      {editTask && (
        <EditCardModal
          open={!!editTask}
          task={editTask}
          onCancel={() => setEditTask(null)}
          onConfirm={handleUpdateTask}
        />
      )}
    </div>
  );
};

export default ColumnContainer;
