export type Subtask = {
  id: string;
  title: string;
};

export type Card = {
  id: string;
  title: string;
  subtasks?: Subtask[];
  description?: string;
  dueDate: string;
  priority?: "urgent" | "high" | "normal" | "low";
  status?: "new" | "scheduled" | "inprogress" | "completed";
};
export type List = {
  id: string;
  title: string;
  color: string;
  card: Card[];
};
export type Lists = {
  [key: string]: List;
};
