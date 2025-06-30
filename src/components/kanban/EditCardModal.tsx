import React, { useState } from "react";
 import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
 } from "@/components/ui/dialog";
 import { Input } from "@/components/ui/input";
 import { Button } from "@/components/ui/button";
 import type { Card } from "@/components/kanban/types";
 import { Textarea } from "../ui/textarea";
 type Props = {
  open: boolean;
  onCancel: () => void;
  onConfirm: (updatedTask: Card) => void;
  task: Card;
 };
  const EditCardModal: React.FC<Props> = ({ open, onCancel, onConfirm, task }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  const [newSubtask, setNewSubtask] = useState("");

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    setSubtasks([...subtasks, { id: Date.now().toString(), title: newSubtask }]);
    setNewSubtask("");
  };

  const handleSubmit = () => {
    onConfirm({ ...task, title, description, subtasks });
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="mb-2"
        />
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full border rounded p-2 text-sm mb-2"
        />

        <div>
          <Input
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            placeholder="Add Subtask"
            className="mb-2"
          />
          <Button onClick={handleAddSubtask} size="sm">Add Subtask</Button>
        </div>

        <ul className="mt-2 list-disc pl-4 text-sm text-gray-600">
          {subtasks.map((s) => (
            <li key={s.id}>{s.title}</li>
          ))}
        </ul>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCardModal;
