export type Subtask = {
  id: string;
  title: string;
};

export type Card = {
  id: string;
  title: string;
  priority?: "urgent" | "high" | "normal" | "low";
  dueDate?: string;
  status?: "new" | "scheduled" | "inprogress" | "completed";
  type?: string;
  assignee?: string;
  description?: string;
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
