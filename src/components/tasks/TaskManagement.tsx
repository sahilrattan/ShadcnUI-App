"use client";

import { useState } from "react";
import {
  format,
  parseISO,
  isSameDay,
  addDays,
  addWeeks,
  subWeeks,
} from "date-fns";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Switch } from "@/components/ui/switch";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  CalendarIcon,
  CheckSquare,
  MapPin,
  Clock,
  Bell,
  Repeat,
  Paperclip,
  Users,
  Flag,
  Search,
  ChevronDown,
} from "lucide-react";
import type { Card, Event, List } from "./types";

const STATUS_OPTIONS = [
  {
    id: "new",
    label: "New Task",
    icon: <CheckSquare className="w-4 h-4 text-gray-500" />,
  },
  {
    id: "scheduled",
    label: "Scheduled",
    icon: <CalendarIcon className="w-4 h-4 text-red-500" />,
  },
  {
    id: "inprogress",
    label: "In Progress",
    icon: <Clock className="w-4 h-4 text-yellow-500" />,
  },
  {
    id: "completed",
    label: "Completed",
    icon: <CheckSquare className="w-4 h-4 text-green-500" />,
  },
];

const PRIORITY_LABELS = {
  urgent: "Urgent",
  high: "High",
  normal: "Normal",
  low: "Low",
};

const EVENT_TYPES = [
  "Meeting",
  "Conference",
  "Workshop",
  "Presentation",
  "Training",
  "Social",
];

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

export const TaskManagement = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [list, setList] = useState<List[]>([
    {
      id: "1",
      title: "Tasks",
      color: "bg-blue-400",
      card: [],
    },
  ]);
  const [events, setEvents] = useState<Event[]>([]);

  // Dialog states
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Card | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Form states
  const [taskForm, setTaskForm] = useState<Partial<Card>>({
    title: "",
    description: "",
    dueDate: undefined,
    priority: undefined,
    type: undefined,
    assignee: undefined,
    status: undefined,
  });

  const [eventForm, setEventForm] = useState<Partial<Event>>({
    title: "",
    description: "",
    date: new Date().toISOString(),
    startTime: "11:00",
    endTime: "12:00",
    location: "",
    type: "Meeting",
    participants: [],
    hasReminder: false,
    hasRepeat: false,
  });

  // Week navigation
  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      if (direction === "prev") {
        return subWeeks(prev, 1);
      } else {
        return addWeeks(prev, 1);
      }
    });
  };

  // Get week days
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Task dialog functions
  const openCreateTaskDialog = () => {
    setEditingTask(null);
    setTaskForm({
      title: "",
      description: "",
      dueDate: undefined,
      priority: undefined,
      type: undefined,
      assignee: undefined,
      status: undefined,
    });
    setTaskDialogOpen(true);
  };

  const handleSaveTask = () => {
    if (!taskForm.title) return;

    if (editingTask) {
      setList((prev) =>
        prev.map((col) => ({
          ...col,
          card: col.card.map((c) =>
            c.id === editingTask.id ? { ...c, ...taskForm } : c
          ),
        }))
      );
    } else {
      const firstList = list[0];
      const newCard: Card = {
        id: crypto.randomUUID(),
        title: taskForm.title || "Untitled",
        description: taskForm.description || "",
        dueDate: taskForm.dueDate ?? "",
        priority: taskForm.priority,
        status: taskForm.status ?? "new",
        type: taskForm.type,
        assignee: taskForm.assignee,
      };

      setList((prev) =>
        prev.map((col) =>
          col.id === firstList.id
            ? { ...col, card: [...col.card, newCard] }
            : col
        )
      );
    }
    setTaskDialogOpen(false);
  };

  // Event dialog functions
  const openCreateEventDialog = () => {
    setEditingEvent(null);
    setEventForm({
      title: "",
      description: "",
      date: new Date().toISOString(),
      startTime: "11:00",
      endTime: "12:00",
      location: "",
      type: "Meeting",
      participants: [],
      hasReminder: false,
      hasRepeat: false,
    });
    setEventDialogOpen(true);
  };

  const handleSaveEvent = () => {
    if (!eventForm.title) return;

    if (editingEvent) {
      setEvents((prev) =>
        prev.map((event) =>
          event.id === editingEvent.id ? { ...event, ...eventForm } : event
        )
      );
    } else {
      const newEvent: Event = {
        id: crypto.randomUUID(),
        title: eventForm.title || "Untitled Event",
        description: eventForm.description || "",
        date: eventForm.date || new Date().toISOString(),
        startTime: eventForm.startTime || "11:00",
        endTime: eventForm.endTime || "12:00",
        location: eventForm.location,
        type: eventForm.type || "Meeting",
        participants: eventForm.participants || [],
        hasReminder: eventForm.hasReminder || false,
        hasRepeat: eventForm.hasRepeat || false,
      };

      setEvents((prev) => [...prev, newEvent]);
    }
    setEventDialogOpen(false);
  };

  // Get tasks and events for a specific date
  const getItemsForDate = (date: Date) => {
    const tasksForDate = list.flatMap((col) =>
      col.card.filter(
        (card) => card.dueDate && isSameDay(parseISO(card.dueDate), date)
      )
    );

    const eventsForDate = events.filter((event) =>
      isSameDay(parseISO(event.date), date)
    );

    return { tasks: tasksForDate, events: eventsForDate };
  };

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add new
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem onClick={openCreateTaskDialog}>
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Task
                </DropdownMenuItem>
                <DropdownMenuItem onClick={openCreateEventDialog}>
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Event
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className=" bg-transparent">
                  Today
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-100 p-0" align="start">
                <div className="   rounded-lg">
                  {/* Year selector */}
                  <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        className=" hover:bg-gray-700"
                        onClick={() =>
                          setCurrentDate(
                            (prev) =>
                              new Date(
                                prev.getFullYear() - 1,
                                prev.getMonth(),
                                prev.getDate()
                              )
                          )
                        }
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-lg font-medium">
                        {format(currentDate, "yyyy")}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-gray-700"
                        onClick={() =>
                          setCurrentDate(
                            (prev) =>
                              new Date(
                                prev.getFullYear() + 1,
                                prev.getMonth(),
                                prev.getDate()
                              )
                          )
                        }
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex">
                    {/* Month selector */}
                    <div className="w-32 border-r border-gray-700">
                      {[
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December",
                      ].map((month, index) => (
                        <button
                          key={month}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition-colors ${
                            currentDate.getMonth() === index
                              ? "bg-gray-700 text-blue-400"
                              : ""
                          }`}
                          onClick={() =>
                            setCurrentDate(
                              (prev) =>
                                new Date(
                                  prev.getFullYear(),
                                  index,
                                  prev.getDate()
                                )
                            )
                          }
                        >
                          {month}
                        </button>
                      ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="flex-1 p-4">
                      {/* Days of week header */}
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                          <div
                            key={day}
                            className="text-center text-xs  font-medium p-1"
                          >
                            {day}
                          </div>
                        ))}
                      </div>

                      {/* Calendar days */}
                      <div className="grid grid-cols-7 gap-1">
                        {(() => {
                          const monthStart = startOfMonth(currentDate);
                          const monthEnd = endOfMonth(currentDate);
                          const calendarStart = startOfWeek(monthStart, {
                            weekStartsOn: 0,
                          });
                          const calendarEnd = endOfWeek(monthEnd, {
                            weekStartsOn: 0,
                          });
                          const calendarDays = eachDayOfInterval({
                            start: calendarStart,
                            end: calendarEnd,
                          });

                          return calendarDays.map((day) => {
                            const isCurrentMonth = isSameMonth(
                              day,
                              currentDate
                            );
                            const isToday = isSameDay(day, new Date());
                            const isSelected = isSameDay(day, currentDate);

                            return (
                              <button
                                key={day.toISOString()}
                                className={`
                                  w-8 h-8 text-sm rounded transition-colors
                                  ${!isCurrentMonth ? "" : ""}
                                  ${isToday ? "bg-blue-500 text-white" : ""}
                                  ${
                                    isSelected && !isToday
                                      ? "bg-gray-600 text-white"
                                      : ""
                                  }
                                  ${
                                    isCurrentMonth && !isToday && !isSelected
                                      ? "hover:bg-gray-700"
                                      : ""
                                  }
                                `}
                                onClick={() => {
                                  setCurrentDate(day);
                                  // Close the dropdown after selection
                                }}
                              >
                                {format(day, "d")}
                              </button>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Search className="w-5 h-5 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5 text-gray-500" />
            </Button>
          </div>
        </div>
      </div>

      {/* Month/Year Display */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateWeek("prev")}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-medium ">
              {format(currentDate, "MMMM yyyy")}
            </h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateWeek("next")}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Week View */}
      <div className="px-6">
        <div className=" rounded-lg border border-gray-300 overflow-hidden">
          {/* Week Header */}
          <div className="grid grid-cols-7 border-b border-gray-300">
            {weekDays.map((day) => {
              const isToday = isSameDay(day, new Date());
              const dayName = format(day, "EEE");
              const dayNumber = format(day, "d");

              return (
                <div
                  key={day.toISOString()}
                  className="p-4 text-center border-r border-gray-300 last:border-r-0"
                >
                  <div className="space-y-1">
                    <div className="text-sm font-medium ">
                      {dayNumber} {dayName}
                    </div>
                    {isToday && (
                      <div className="h-1 bg-blue-500 rounded-full mx-auto w-8"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time indicator */}
          <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-300">
            1h
          </div>

          {/* Week Content */}
          <div className="grid grid-cols-7 min-h-[400px]">
            {weekDays.map((day) => {
              const { tasks, events } = getItemsForDate(day);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={day.toISOString()}
                  className={`p-4 border-r border-gray-300 last:border-r-0 space-y-2 ${
                    isToday ? "bg-blue-50/30" : ""
                  }`}
                >
                  {/* Tasks */}
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-blue-200 text-blue-800 p-3 rounded-lg cursor-pointer hover:bg-blue-300 transition-colors relative"
                      onClick={() => {
                        setEditingTask(task);
                        setTaskForm({ ...task });
                        setTaskDialogOpen(true);
                      }}
                    >
                      <div className="font-medium text-sm">{task.title}</div>
                      {task.priority && (
                        <div className="absolute bottom-2 right-2 flex items-center">
                          <div className="w-5 h-5 rounded-full border-2 border-blue-800 flex items-center justify-center">
                            <span className="text-xs font-bold">1</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Events */}
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="bg-orange-200 text-orange-800 p-3 rounded-lg cursor-pointer hover:bg-orange-300 transition-colors"
                      onClick={() => {
                        setEditingEvent(event);
                        setEventForm({ ...event });
                        setEventDialogOpen(true);
                      }}
                    >
                      <div className="flex items-center gap-2 text-md font-medium mb-1">
                        <Clock className="w-3 h-3" />
                        {event.startTime} - {event.endTime}
                      </div>
                      <div className="font-medium text-sm">{event.title}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Task Dialog - keeping the same as before */}
      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent className="overflow-x-hidden sm:max-w-3xl lg:max-w-3xl h-full sm:h-[calc(100vh-8rem)] sm:max-h-[100vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Left side: Form */}
            <div className="col-span-2 p-6 space-y-4">
              <h2 className="text-lg font-semibold">
                {editingTask ? "Edit Task" : "Create Task"}
              </h2>
              <div className="space-y-3">
                <div>
                  <Input
                    placeholder="Task name"
                    value={taskForm.title || ""}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, title: e.target.value })
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Task description"
                    rows={6}
                    value={taskForm.description || ""}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, description: e.target.value })
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Right sidebar */}
            <div className="border-l border-gray-200 p-6 space-y-4">
              <div className="space-y-2">
                <p className="text-xs uppercase font-semibold">Create in</p>
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-white text-xs font-semibold">
                    T
                  </div>
                  <span className="text-sm font-medium">Trigbit</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase font-semibold">Type</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="justify-start  w-full">
                      {taskForm.type ?? "Select type"}
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
                        onClick={() => setTaskForm({ ...taskForm, type })}
                      >
                        {type}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase font-semibold">Status</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="justify-start  w-full">
                      {taskForm.status
                        ? STATUS_OPTIONS.find((s) => s.id === taskForm.status)
                            ?.label
                        : "Select status"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {STATUS_OPTIONS.map((s) => (
                      <DropdownMenuItem
                        key={s.id}
                        onClick={() =>
                          setTaskForm({
                            ...taskForm,
                            status: s.id as Card["status"],
                          })
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

              <div className="space-y-2">
                <p className="text-xs uppercase font-semibold">Priority</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="justify-start  w-full">
                      {taskForm.priority ? (
                        <span className="flex items-center gap-1">
                          <Flag
                            className={getPriorityColor(taskForm.priority)}
                          />
                          {PRIORITY_LABELS[taskForm.priority]}
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
                          setTaskForm({
                            ...taskForm,
                            priority: k as keyof typeof PRIORITY_LABELS,
                          })
                        }
                      >
                        <div className="flex items-center gap-2">
                          <Flag className={getPriorityColor(k)} />
                          <span>{v}</span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase font-semibold">Assignee</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="justify-start  w-full">
                      {taskForm.assignee ?? "Select assignee"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {["Me", "John Doe", "Jane Smith", "Team A"].map((a) => (
                      <DropdownMenuItem
                        key={a}
                        onClick={() =>
                          setTaskForm({ ...taskForm, assignee: a })
                        }
                      >
                        {a}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase font-semibold">Due date</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className="justify-start  w-full">
                      {taskForm.dueDate
                        ? format(parseISO(taskForm.dueDate), "MMM d, yyyy")
                        : "Pick due date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Calendar
                      mode="single"
                      selected={
                        taskForm.dueDate
                          ? parseISO(taskForm.dueDate)
                          : undefined
                      }
                      onSelect={(date) =>
                        setTaskForm({
                          ...taskForm,
                          dueDate: date?.toISOString(),
                        })
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between border-t border-gray-200 p-4">
            <Button variant="ghost" onClick={() => setTaskDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTask}>
              {editingTask ? "Save Changes" : "Create Task"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Event Dialog - keeping the same as before */}
      <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
        <DialogContent className="overflow-x-hidden sm:max-w-3xl lg:max-w-3xl h-full sm:h-[calc(100vh-8rem)] sm:max-h-[100vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Left side: Form */}
            <div className="col-span-2 p-6 space-y-4">
              <h2 className="text-lg font-semibold">
                {editingEvent ? "Edit Event" : "Create Event"}
              </h2>

              <div className="space-y-4">
                {/* Date and Time */}
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    Today
                  </Button>
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={eventForm.startTime || "11:00"}
                      onChange={(e) =>
                        setEventForm({
                          ...eventForm,
                          startTime: e.target.value,
                        })
                      }
                      className="w-20"
                    />
                    <span>-</span>
                    <Input
                      type="time"
                      value={eventForm.endTime || "12:00"}
                      onChange={(e) =>
                        setEventForm({ ...eventForm, endTime: e.target.value })
                      }
                      className="w-20"
                    />
                  </div>
                </div>

                {/* Event Name */}
                <div>
                  <Input
                    placeholder="Event name"
                    value={eventForm.title || ""}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, title: e.target.value })
                    }
                    className="w-full"
                  />
                </div>

                {/* Location */}
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <Input
                    placeholder="Event location"
                    value={eventForm.location || ""}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, location: e.target.value })
                    }
                    className="flex-1"
                  />
                </div>

                {/* Event Agenda */}
                <div>
                  <Textarea
                    placeholder="Event agenda"
                    rows={6}
                    value={eventForm.description || ""}
                    onChange={(e) =>
                      setEventForm({
                        ...eventForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 pt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Paperclip className="w-4 h-4" />
                    Attach file
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Bell className="w-4 h-4" />
                    Set reminder
                  </Button>
                </div>
              </div>
            </div>

            {/* Right sidebar */}
            <div className="border-l border-gray-200 p-6 space-y-4">
              {/* Set Repeats */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Repeat className="w-4 h-4" />
                  <span className="text-sm">Set repeats</span>
                </div>
                <Switch
                  checked={eventForm.hasRepeat || false}
                  onCheckedChange={(checked) =>
                    setEventForm({ ...eventForm, hasRepeat: checked })
                  }
                />
              </div>

              {/* Create in */}
              <div className="space-y-2">
                <p className="text-xs uppercase font-semibold">Create in</p>
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white text-xs font-semibold">
                    T
                  </div>
                  <span className="text-sm font-medium">trigbit</span>
                </div>
              </div>

              {/* Type */}
              <div className="space-y-2">
                <p className="text-xs uppercase font-semibold">Type</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="justify-start  w-full">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-600"></div>
                        {eventForm.type || "Meeting"}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {EVENT_TYPES.map((type) => (
                      <DropdownMenuItem
                        key={type}
                        onClick={() => setEventForm({ ...eventForm, type })}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-amber-600"></div>
                          {type}
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Participants */}
              <div className="space-y-2">
                <p className="text-xs uppercase font-semibold">Participants</p>
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white text-xs font-semibold">
                    M
                  </div>
                  <span className="text-sm">Me</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start  w-full"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Add participants
                </Button>
              </div>

              {/* Date Selection */}
              <div className="space-y-2">
                <p className="text-xs uppercase font-semibold">Date</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className="justify-start  w-full">
                      {eventForm.date
                        ? format(parseISO(eventForm.date), "MMM d, yyyy")
                        : "Pick date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Calendar
                      mode="single"
                      selected={
                        eventForm.date ? parseISO(eventForm.date) : undefined
                      }
                      onSelect={(date) =>
                        setEventForm({
                          ...eventForm,
                          date: date?.toISOString(),
                        })
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between border-t border-gray-200 p-4">
            <Button variant="ghost" onClick={() => setEventDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveEvent}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {editingEvent ? "Save Changes" : "Create Event"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
