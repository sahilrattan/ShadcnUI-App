"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Plus,
  Filter,
  Clock,
  User,
  Mail,
  Phone,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TicketStatus = "open" | "in-progress" | "resolved" | "closed";
type TicketPriority = "low" | "medium" | "high" | "urgent";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  assignee: string;
  createdAt: string;
  updatedAt: string;
  category: string;
  messages: Array<{
    id: string;
    author: string;
    content: string;
    timestamp: string;
    isCustomer: boolean;
  }>;
}

const mockTickets: Ticket[] = [
  {
    id: "TK-001",
    title: "Login issues with mobile app",
    description:
      "Customer unable to login to mobile application after recent update",
    status: "open",
    priority: "high",
    customer: {
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1 (555) 123-4567",
    },
    assignee: "Sarah Johnson",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T14:20:00Z",
    category: "Technical",
    messages: [
      {
        id: "1",
        author: "John Smith",
        content:
          "I can't log into the mobile app since the update yesterday. It keeps saying invalid credentials.",
        timestamp: "2024-01-15T10:30:00Z",
        isCustomer: true,
      },
      {
        id: "2",
        author: "Sarah Johnson",
        content:
          "Hi John, I'm looking into this issue. Can you try clearing the app cache and attempting to login again?",
        timestamp: "2024-01-15T11:15:00Z",
        isCustomer: false,
      },
    ],
  },
  {
    id: "TK-002",
    title: "Billing discrepancy in monthly invoice",
    description:
      "Customer reporting incorrect charges on their monthly billing statement",
    status: "in-progress",
    priority: "medium",
    customer: {
      name: "Emily Davis",
      email: "emily.davis@company.com",
      phone: "+1 (555) 987-6543",
    },
    assignee: "Mike Wilson",
    createdAt: "2024-01-14T09:15:00Z",
    updatedAt: "2024-01-15T16:45:00Z",
    category: "Billing",
    messages: [
      {
        id: "1",
        author: "Emily Davis",
        content:
          "My invoice shows charges for premium features I never activated. Can you please review?",
        timestamp: "2024-01-14T09:15:00Z",
        isCustomer: true,
      },
    ],
  },
  {
    id: "TK-003",
    title: "Feature request: Dark mode",
    description:
      "Customer requesting dark mode option for better user experience",
    status: "resolved",
    priority: "low",
    customer: {
      name: "Alex Chen",
      email: "alex.chen@email.com",
      phone: "+1 (555) 456-7890",
    },
    assignee: "Lisa Brown",
    createdAt: "2024-01-10T14:20:00Z",
    updatedAt: "2024-01-13T11:30:00Z",
    category: "Feature Request",
    messages: [],
  },
  {
    id: "TK-004",
    title: "Data export functionality not working",
    description: "Customer unable to export their data from the dashboard",
    status: "open",
    priority: "urgent",
    customer: {
      name: "Robert Taylor",
      email: "robert.taylor@business.com",
      phone: "+1 (555) 321-0987",
    },
    assignee: "David Kim",
    createdAt: "2024-01-15T16:00:00Z",
    updatedAt: "2024-01-15T16:00:00Z",
    category: "Technical",
    messages: [],
  },
];

const getStatusIcon = (status: TicketStatus) => {
  switch (status) {
    case "open":
      return <AlertCircle className="h-4 w-4" />;
    case "in-progress":
      return <Clock className="h-4 w-4" />;
    case "resolved":
      return <CheckCircle className="h-4 w-4" />;
    case "closed":
      return <XCircle className="h-4 w-4" />;
  }
};

const getStatusColor = (status: TicketStatus) => {
  switch (status) {
    case "open":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    case "in-progress":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "resolved":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "closed":
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

const getPriorityColor = (priority: TicketPriority) => {
  switch (priority) {
    case "low":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "medium":
      return "bg-orange-100 text-orange-800 hover:bg-orange-100";
    case "high":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    case "urgent":
      return "bg-purple-100 text-purple-800 hover:bg-purple-100";
  }
};

export default function TicketingSystem() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [newTicket, setNewTicket] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    title: "",
    description: "",
    priority: "medium" as TicketPriority,
    category: "technical",
    assignee: "Unassigned",
  });

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || ticket.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const updateTicketStatus = (ticketId: string, newStatus: TicketStatus) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              status: newStatus,
              updatedAt: new Date().toISOString(),
            }
          : ticket
      )
    );
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewTicket((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateTicket = () => {
    if (!newTicket.title.trim()) {
      alert("Please enter a title for the ticket");
      return false;
    }
    if (!newTicket.description.trim()) {
      alert("Please enter a description");
      return false;
    }
    if (!newTicket.customerName.trim()) {
      alert("Please enter a customer name");
      return false;
    }
    return true;
  };

  const handleCreateTicket = () => {
    if (!validateTicket()) return;

    // Generate a new ticket ID
    const newId = `TK-${(tickets.length + 1).toString().padStart(3, "0")}`;

    // Create the new ticket object
    const ticket: Ticket = {
      id: newId,
      title: newTicket.title,
      description: newTicket.description,
      status: "open",
      priority: newTicket.priority,
      customer: {
        name: newTicket.customerName,
        email: newTicket.customerEmail,
        phone: newTicket.customerPhone,
      },
      assignee: newTicket.assignee,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: newTicket.category,
      messages: [],
    };

    // Add the new ticket to the state
    setTickets((prev) => [...prev, ticket]);

    // Reset the form
    setNewTicket({
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      title: "",
      description: "",
      priority: "medium",
      category: "technical",
      assignee: "Unassigned",
    });

    // Close the dialog
    setIsCreateDialogOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
          <p className="text-muted-foreground">
            Manage and track customer support requests
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Ticket</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer-name">Customer Name</Label>
                  <Input
                    id="customer-name"
                    name="customerName"
                    placeholder="Enter customer name"
                    value={newTicket.customerName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-email">Customer Email</Label>
                  <Input
                    id="customer-email"
                    name="customerEmail"
                    type="email"
                    placeholder="customer@email.com"
                    value={newTicket.customerEmail}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer-phone">Customer Phone</Label>
                  <Input
                    id="customer-phone"
                    name="customerPhone"
                    placeholder="+1 (555) 123-4567"
                    value={newTicket.customerPhone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newTicket.priority}
                    onValueChange={(value: TicketPriority) =>
                      setNewTicket((prev) => ({ ...prev, priority: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newTicket.category}
                    onValueChange={(value) =>
                      setNewTicket((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                      <SelectItem value="feature-request">
                        Feature Request
                      </SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignee">Assignee</Label>
                  <Input
                    id="assignee"
                    name="assignee"
                    placeholder="Unassigned"
                    value={newTicket.assignee}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Brief description of the issue"
                  value={newTicket.title}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Detailed description of the issue"
                  rows={4}
                  value={newTicket.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateTicket}>Create Ticket</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search tickets, customers, or ticket IDs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Open Tickets
                </p>
                <p className="text-2xl font-bold">
                  {tickets.filter((t) => t.status === "open").length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  In Progress
                </p>
                <p className="text-2xl font-bold">
                  {tickets.filter((t) => t.status === "in-progress").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Resolved
                </p>
                <p className="text-2xl font-bold">
                  {tickets.filter((t) => t.status === "resolved").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Tickets
                </p>
                <p className="text-2xl font-bold">{tickets.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Tickets ({filteredTickets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow
                  key={ticket.id}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell className="font-medium">{ticket.id}</TableCell>
                  <TableCell>
                    <div className="max-w-[200px]">
                      <p className="font-medium truncate">{ticket.title}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {ticket.category}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{ticket.customer.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {ticket.customer.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={getStatusColor(ticket.status)}
                    >
                      {getStatusIcon(ticket.status)}
                      <span className="ml-1 capitalize">
                        {ticket.status.replace("-", " ")}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={getPriorityColor(ticket.priority)}
                    >
                      {ticket.priority.charAt(0).toUpperCase() +
                        ticket.priority.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{ticket.assignee}</TableCell>
                  <TableCell>{formatDate(ticket.createdAt)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            updateTicketStatus(ticket.id, "in-progress")
                          }
                        >
                          Mark In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            updateTicketStatus(ticket.id, "resolved")
                          }
                        >
                          Mark Resolved
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            updateTicketStatus(ticket.id, "closed")
                          }
                        >
                          Close Ticket
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Ticket Detail Dialog */}
      <Dialog
        open={!!selectedTicket}
        onOpenChange={() => setSelectedTicket(null)}
      >
        <DialogContent className="overflow-x-hidden sm:max-w-3xl lg:max-w-5xl h-full sm:h-[calc(100vh-8rem)] sm:max-h-[95vh] overflow-y-auto">
          {selectedTicket && (
            <>
              <DialogHeader>
                <div className="flex  items-center justify-between">
                  <div>
                    <DialogTitle className="text-xl">
                      {selectedTicket.title}
                    </DialogTitle>
                    <p className="text-muted-foreground">{selectedTicket.id}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge
                      variant="secondary"
                      className={getStatusColor(selectedTicket.status)}
                    >
                      {getStatusIcon(selectedTicket.status)}
                      <span className="ml-1 capitalize">
                        {selectedTicket.status.replace("-", " ")}
                      </span>
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={getPriorityColor(selectedTicket.priority)}
                    >
                      {selectedTicket.priority.charAt(0).toUpperCase() +
                        selectedTicket.priority.slice(1)}
                    </Badge>
                  </div>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-1 lg:grid-cols-3  gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground">
                      {selectedTicket.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Conversation</h3>
                    <div className="space-y-4">
                      {selectedTicket.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.isCustomer ? "justify-start" : "justify-end"
                          }`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              message.isCustomer
                                ? "bg-muted text-muted-foreground"
                                : "bg-primary text-primary-foreground"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">
                                {message.author}
                              </span>
                              <span className="text-xs opacity-70">
                                {formatDate(message.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4">
                      <Textarea placeholder="Type your response..." rows={3} />
                      <div className="flex justify-end mt-2">
                        <Button size="sm">Send Reply</Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className=" w-70 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Customer Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedTicket.customer.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {selectedTicket.customer.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {selectedTicket.customer.phone}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Ticket Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Assignee</Label>
                        <p className="text-sm text-muted-foreground">
                          {selectedTicket.assignee}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Category</Label>
                        <p className="text-sm text-muted-foreground">
                          {selectedTicket.category}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Created</Label>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(selectedTicket.createdAt)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">
                          Last Updated
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(selectedTicket.updatedAt)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Update Status</Label>
                    <Select
                      value={selectedTicket.status}
                      onValueChange={(value: TicketStatus) =>
                        updateTicketStatus(selectedTicket.id, value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
