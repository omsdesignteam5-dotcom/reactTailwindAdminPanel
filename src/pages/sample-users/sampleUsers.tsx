import React, { useState, useMemo, useEffect } from "react";
import {
  Users,
  Search,
  UserPlus,
  Edit2,
  Trash2,
  Filter,
  RefreshCw,
  Shield,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Check,
  X,
  Plus,
  CreditCard,
  MapPin,
  FileText,
  UserCircle2,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "src/components/ui/card/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "src/components/ui/table/table";
import { Badge } from "src/components/ui/badge/badge";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "src/components/ui/avatar/avatar";
import { Input } from "src/components/ui/input/input";
import { Button } from "src/components/ui/button/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select/select";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
} from "src/components/ui/modal/modal";
import { ConfirmDialog } from "src/components/ui/dialog/confirmDialog";
import { ImageCrop } from "src/components/ui/fileUpload/imageUpload";

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: "superadmin" | "admin" | "manager" | "staff" | "user";
  status: "active" | "inactive" | "suspended";
  joinedDate: string;
  lastActive: string;
}

const INITIAL_USERS: User[] = [
  {
    id: "usr-01",
    name: "Alexander Wright",
    email: "alexander.w@company.com",
    role: "superadmin",
    status: "active",
    joinedDate: "2024-01-15",
    lastActive: "Just now",
  },
  {
    id: "usr-02",
    name: "Sarah Jenkins",
    email: "sarah.j@company.com",
    role: "admin",
    status: "active",
    joinedDate: "2024-02-10",
    lastActive: "15 mins ago",
  },
  {
    id: "usr-03",
    name: "Michael Chen",
    email: "michael.c@company.com",
    role: "manager",
    status: "active",
    joinedDate: "2024-03-01",
    lastActive: "2 hours ago",
  },
  {
    id: "usr-04",
    name: "Emily Rodriguez",
    email: "emily.r@company.com",
    role: "staff",
    status: "active",
    joinedDate: "2024-03-22",
    lastActive: "1 day ago",
  },
  {
    id: "usr-05",
    name: "David Kim",
    email: "david.k@company.com",
    role: "user",
    status: "inactive",
    joinedDate: "2024-04-05",
    lastActive: "3 days ago",
  },
  {
    id: "usr-06",
    name: "Jessica Taylor",
    email: "jessica.t@company.com",
    role: "staff",
    status: "inactive",
    joinedDate: "2026-05-20",
    lastActive: "Never",
  },
  {
    id: "usr-07",
    name: "James Wilson",
    email: "james.w@company.com",
    role: "admin",
    status: "suspended",
    joinedDate: "2024-05-12",
    lastActive: "2 weeks ago",
  },
  {
    id: "usr-08",
    name: "Sophia Martinez",
    email: "sophia.m@company.com",
    role: "user",
    status: "active",
    joinedDate: "2024-06-01",
    lastActive: "5 mins ago",
  },
  {
    id: "usr-09",
    name: "William Thompson",
    email: "william.t@company.com",
    role: "manager",
    status: "active",
    joinedDate: "2024-06-15",
    lastActive: "10 mins ago",
  },
  {
    id: "usr-10",
    name: "Olivia Hansen",
    email: "olivia.h@company.com",
    role: "staff",
    status: "inactive",
    joinedDate: "2024-07-02",
    lastActive: "1 month ago",
  },
  {
    id: "usr-11",
    name: "Benjamin Turner",
    email: "benjamin.t@company.com",
    role: "user",
    status: "active",
    joinedDate: "2024-08-11",
    lastActive: "2 days ago",
  },
  {
    id: "usr-12",
    name: "Mia Patel",
    email: "mia.p@company.com",
    role: "staff",
    status: "active",
    joinedDate: "2024-09-05",
    lastActive: "Just now",
  },
  {
    id: "usr-13",
    name: "Lucas Campbell",
    email: "lucas.c@company.com",
    role: "manager",
    status: "inactive",
    joinedDate: "2026-05-24",
    lastActive: "Never",
  },
  {
    id: "usr-14",
    name: "Charlotte Adams",
    email: "charlotte.a@company.com",
    role: "user",
    status: "inactive",
    joinedDate: "2024-10-18",
    lastActive: "3 weeks ago",
  },
  {
    id: "usr-15",
    name: "Daniel Jenkins",
    email: "daniel.j@company.com",
    role: "staff",
    status: "active",
    joinedDate: "2024-11-20",
    lastActive: "5 hours ago",
  },
  {
    id: "usr-16",
    name: "Amelia Foster",
    email: "amelia.f@company.com",
    role: "user",
    status: "suspended",
    joinedDate: "2024-12-01",
    lastActive: "1 month ago",
  },
  {
    id: "usr-17",
    name: "Henry Richardson",
    email: "henry.r@company.com",
    role: "admin",
    status: "active",
    joinedDate: "2025-01-14",
    lastActive: "10 mins ago",
  },
  {
    id: "usr-18",
    name: "Harper Morales",
    email: "harper.m@company.com",
    role: "user",
    status: "active",
    joinedDate: "2025-02-28",
    lastActive: "4 days ago",
  },
  {
    id: "usr-19",
    name: "Alexander Gray",
    email: "alexander.g@company.com",
    role: "staff",
    status: "inactive",
    joinedDate: "2025-03-19",
    lastActive: "2 months ago",
  },
  {
    id: "usr-20",
    name: "Evelyn Ward",
    email: "evelyn.w@company.com",
    role: "manager",
    status: "active",
    joinedDate: "2025-04-22",
    lastActive: "1 hour ago",
  },
];

export default function SampleUsers() {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, statusFilter]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState<User["role"]>("user");
  const [formStatus, setFormStatus] = useState<User["status"]>("active");

  // Delete Confirmation State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Full Screen Modal & Detailed Fields States
  const [isFullModalOpen, setIsFullModalOpen] = useState(false);
  const [detailFirstName, setDetailFirstName] = useState("Sarah");
  const [detailLastName, setDetailLastName] = useState("Jenkins");
  const [detailDob, setDetailDob] = useState("1994-08-12");
  const [detailEmail, setDetailEmail] = useState("sarah.j@company.com");
  const [detailPhone, setDetailPhone] = useState("+1 (555) 382-9901");
  const [detailGender, setDetailGender] = useState("female");

  const [detailStreet, setDetailStreet] = useState("1428 Elm Street");
  const [detailSuite, setDetailSuite] = useState("Suite 4B");
  const [detailCity, setDetailCity] = useState("San Francisco");
  const [detailState, setDetailState] = useState("CA");
  const [detailZip, setDetailZip] = useState("94109");
  const [detailCountry, setDetailCountry] = useState("United States");

  const [detailDocType, setDetailDocType] = useState("Passport");
  const [detailDocId, setDetailDocId] = useState("US-P8829910");
  const [detailIssuingAuth, setDetailIssuingAuth] = useState(
    "US Department of State",
  );
  const [detailIssueDate, setDetailIssueDate] = useState("2020-05-15");
  const [detailExpiryDate, setDetailExpiryDate] = useState("2030-05-14");

  const [detailBankName, setDetailBankName] = useState("Chase Bank N.A.");
  const [detailCardholderName, setDetailCardholderName] =
    useState("SARAH JENKINS");
  const [detailCardNumber, setDetailCardNumber] = useState(
    "4111 2222 3333 4444",
  );
  const [detailCardExpiry, setDetailCardExpiry] = useState("08/29");
  const [detailCardCvv, setDetailCardCvv] = useState("382");

  const [detailRequire2FA, setDetailRequire2FA] = useState(true);
  const [detailReceiveNews, setDetailReceiveNews] = useState(false);
  const [detailSecurityLevel, setDetailSecurityLevel] = useState("medium");

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  // Paginated Users
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  // Actions
  const handleOpenAddModal = () => {
    setModalMode("add");
    setEditingUser(null);
    setFormName("");
    setFormEmail("");
    setFormRole("user");
    setFormStatus("active");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setModalMode("edit");
    setEditingUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormRole(user.role);
    setFormStatus(user.status);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) return;

    if (modalMode === "add") {
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: formName,
        email: formEmail,
        role: formRole,
        status: formStatus,
        joinedDate: new Date().toISOString().split("T")[0],
        lastActive: "Just now",
      };
      setUsers([newUser, ...users]);
    } else if (modalMode === "edit" && editingUser) {
      setUsers(
        users.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                name: formName,
                email: formEmail,
                role: formRole,
                status: formStatus,
              }
            : u,
        ),
      );
    }

    setIsModalOpen(false);
  };

  const handleOpenDeleteDialog = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    const updatedUsers = users.filter((u) => u.id !== userToDelete.id);
    setUsers(updatedUsers);
    const newTotalPages = Math.ceil(updatedUsers.length / ITEMS_PER_PAGE);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setRoleFilter("all");
    setStatusFilter("all");
  };

  const getRoleBadgeVariant = (role: User["role"]) => {
    switch (role) {
      case "superadmin":
        return "destructive"; // Red/destructve
      case "admin":
        return "default"; // Primary
      case "manager":
        return "info"; // Blue
      case "staff":
        return "warning"; // Amber
      default:
        return "secondary"; // Gray
    }
  };

  const getStatusBadgeVariant = (status: User["status"]) => {
    switch (status) {
      case "active":
        return "success";
      case "suspended":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Sample Users
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your user directory, assign access levels, and audit status
            accounts.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            onClick={() => setIsFullModalOpen(true)}
            variant="outline"
            size="lg">
            <UserPlus className="h-4 w-4" /> Add Detailed Profile
          </Button>
          <Button onClick={handleOpenAddModal} size="lg">
            <UserPlus className="h-4 w-4" /> Add New User
          </Button>
        </div>
      </div>

      {/* Filter and Directory Card */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
        <CardHeader className="p-4 border-b border-border/40">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search and Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search Bar */}
              <div className="w-full max-w-xs sm:w-64">
                <Input
                  placeholder="Search name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="h-4 w-4" />}
                />
              </div>

              {/* Role Dropdown */}
              <div className="flex items-center gap-1">
                <Filter className="h-3.5 w-3.5 text-muted-foreground hidden sm:inline" />
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="superadmin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Dropdown */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>

              {/* Reset Button */}
              {(searchQuery ||
                roleFilter !== "all" ||
                statusFilter !== "all") && (
                <Button onClick={handleResetFilters} variant="ghost" size="sm">
                  <RefreshCw className="h-3 w-3" /> Reset
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/10 hover:bg-transparent">
                  <TableHead className="font-semibold text-foreground/80 py-3.5">
                    User Info
                  </TableHead>
                  <TableHead className="font-semibold text-foreground/80 py-3.5">
                    Access Level
                  </TableHead>
                  <TableHead className="font-semibold text-foreground/80 py-3.5">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-foreground/80 py-3.5 hidden md:table-cell">
                    Joined Date
                  </TableHead>
                  <TableHead className="font-semibold text-foreground/80 py-3.5 hidden sm:table-cell">
                    Last Active
                  </TableHead>
                  <TableHead className="font-semibold text-foreground/80 py-3.5 text-right pr-6">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => {
                    const initials = user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase();

                    return (
                      <TableRow
                        key={user.id}
                        className="hover:bg-muted/10 transition-colors">
                        {/* User Identity cell */}
                        <TableCell className="py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border border-border shadow-xs">
                              <AvatarFallback className="bg-primary/5 text-primary text-xs font-semibold">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col min-w-0">
                              <span className="font-medium text-foreground text-sm truncate">
                                {user.name}
                              </span>
                              <span className="text-xs text-muted-foreground truncate">
                                {user.email}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        {/* Access Level cell */}
                        <TableCell className="py-3">
                          <Badge variant={getRoleBadgeVariant(user.role)}>
                            <Shield className="h-3 w-3 mr-1 opacity-70 hidden xs:inline" />
                            {user.role}
                          </Badge>
                        </TableCell>

                        {/* Status cell */}
                        <TableCell className="py-3">
                          <Badge variant={getStatusBadgeVariant(user.status)}>
                            {user.status}
                          </Badge>
                        </TableCell>

                        {/* Joined Date (hidden on mobile) */}
                        <TableCell className="py-3 hidden md:table-cell text-muted-foreground text-xs font-medium">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 opacity-60" />
                            {user.joinedDate}
                          </div>
                        </TableCell>

                        {/* Last Active (hidden on small mobile) */}
                        <TableCell className="py-3 hidden sm:table-cell text-muted-foreground text-xs font-medium">
                          {user.lastActive}
                        </TableCell>

                        {/* Actions cell */}
                        <TableCell className="py-3 text-right pr-6">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              onClick={() => handleOpenEditModal(user)}
                              variant="ghost"
                              size="icon"
                              title="Edit user profile">
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              onClick={() => handleOpenDeleteDialog(user)}
                              variant="ghost"
                              size="icon"
                              title="Delete user profile">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-32 text-center text-muted-foreground text-sm">
                      <div className="flex flex-col items-center justify-center gap-1.5 py-8">
                        <Users className="h-8 w-8 opacity-30 text-muted-foreground mb-1" />
                        <span className="font-semibold text-foreground">
                          No accounts found
                        </span>
                        <span className="text-xs">
                          Try adjusting your filters or search query
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        {filteredUsers.length > 0 && (
          <CardFooter className="flex items-center justify-between border-t border-border/40 py-3.5 px-6 flex-wrap gap-4">
            <span className="text-xs text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {Math.min(
                  filteredUsers.length,
                  (currentPage - 1) * ITEMS_PER_PAGE + 1,
                )}
                -{Math.min(filteredUsers.length, currentPage * ITEMS_PER_PAGE)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-foreground">
                {filteredUsers.length}
              </span>{" "}
              accounts
            </span>
            <div className="flex items-center gap-1.5 ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}>
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => {
                    if (
                      totalPages > 5 &&
                      Math.abs(page - currentPage) > 1 &&
                      page !== 1 &&
                      page !== totalPages
                    ) {
                      if (page === 2 || page === totalPages - 1) {
                        return (
                          <span
                            key={page}
                            className="text-muted-foreground px-1 text-xs">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}>
                        {page}
                      </Button>
                    );
                  },
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}>
                Next
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>

      {/* User Form Modal (Add/Edit) */}
      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalContent size="lg">
          <ModalHeader>
            <ModalTitle>
              {modalMode === "add" ? "Add User Account" : "Edit User Account"}
            </ModalTitle>
            <ModalDescription>
              {modalMode === "add"
                ? "Create a new user profile with specific access level and starting status."
                : "Update the user's name, email, role authority, or status."}
            </ModalDescription>
          </ModalHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground/80">
                Full Name
              </label>
              <Input
                placeholder="e.g. John Doe"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground/80">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="e.g. john.doe@company.com"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground/80">
                Role Authority
              </label>
              <Select
                value={formRole}
                onValueChange={(val) => setFormRole(val as User["role"])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User (Standard)</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="superadmin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground/80">
                Status Code
              </label>
              <Select
                value={formStatus}
                onValueChange={(val) => setFormStatus(val as User["status"])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ModalFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {modalMode === "add" ? (
                  <>
                    <Plus className="h-4 w-4" /> Add Profile
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete User Profile"
        description={
          <>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {userToDelete?.name}
            </span>
            ? This action cannot be undone.
          </>
        }
        confirmText="Delete Profile"
        destructive
        onConfirm={handleConfirmDelete}
      />

      {/* Detailed Full Registration Modal */}
      <Modal open={isFullModalOpen} onOpenChange={setIsFullModalOpen}>
        <ModalContent size="full">
          <div className="flex flex-col h-screen max-h-screen w-full bg-background overflow-hidden p-6 md:p-10">
            {/* Modal Header */}
            <ModalHeader className="flex-shrink-0 border-b border-border/40 pb-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <ModalTitle className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    Detailed User Registration
                  </ModalTitle>
                  {/* <ModalDescription className="text-sm text-muted-foreground mt-1.5">
                    Configure comprehensive identity credentials, bank payment profiles, and physical address details in a full-width form view.
                  </ModalDescription> */}
                </div>
              </div>
            </ModalHeader>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto pr-2 pb-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Image Upload & Quick Settings */}
                <div className="space-y-6">
                  {/* Profile Image Card */}
                  <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
                    <CardHeader className="p-5 border-b border-border/40">
                      <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground/90">
                        <UserCircle2 className="h-4 w-4 text-primary" />
                        Profile Picture
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground">
                        Upload a high-resolution JPG or PNG profile image.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-5">
                      <ImageCrop
                        aspect={1}
                        maxSizeMB={5}
                        onCroppedImage={(file, previewUrl) =>
                          console.log("Profile image:", file, previewUrl)
                        }
                      />
                    </CardContent>
                  </Card>

                  {/* Account Settings / Preferences Card */}
                  <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
                    <CardHeader className="p-5 border-b border-border/40">
                      <CardTitle className="text-base font-semibold text-foreground/90">
                        Preferences & Security
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground">
                        Configure security levels and system options.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-5 space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground/80">
                          Security Level Clearance
                        </label>
                        <Select
                          value={detailSecurityLevel}
                          onValueChange={setDetailSecurityLevel}>
                          <SelectTrigger>
                            <SelectValue placeholder="Clearance Level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low Clearance</SelectItem>
                            <SelectItem value="medium">
                              Medium Clearance
                            </SelectItem>
                            <SelectItem value="high">High Clearance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-muted/20">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-medium text-foreground">
                            Enforce Two-Factor (2FA)
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            Requires Authenticator app login
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={detailRequire2FA}
                          onChange={(e) =>
                            setDetailRequire2FA(e.target.checked)
                          }
                          className="h-4 w-4 rounded border-input text-primary focus:ring-primary cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-muted/20">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-medium text-foreground">
                            System Communications
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            Subscribe to newsletters & logs
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={detailReceiveNews}
                          onChange={(e) =>
                            setDetailReceiveNews(e.target.checked)
                          }
                          className="h-4 w-4 rounded border-input text-primary focus:ring-primary cursor-pointer"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right & Center Column: Detailed Information */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Card 1: Personal & Contact Details */}
                  <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
                    <CardHeader className="p-5 border-b border-border/40">
                      <CardTitle className="text-base font-semibold text-foreground/90">
                        Personal Details & Contact
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground">
                        Basic user information and primary contact credentials.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-5 space-y-4">
                      {/* Row 1: First Name, Last Name, Gender (3 Columns) */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-foreground/80">
                            First Name
                          </label>
                          <Input
                            value={detailFirstName}
                            onChange={(e) => setDetailFirstName(e.target.value)}
                            placeholder="Sarah"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-foreground/80">
                            Last Name
                          </label>
                          <Input
                            value={detailLastName}
                            onChange={(e) => setDetailLastName(e.target.value)}
                            placeholder="Jenkins"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-foreground/80">
                            Gender Selection
                          </label>
                          <Select
                            value={detailGender}
                            onValueChange={setDetailGender}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="non-binary">
                                Non-Binary
                              </SelectItem>
                              <SelectItem value="prefer-not-to-say">
                                Prefer Not To Say
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Row 2: Email, Phone, DOB (3 Columns) */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-foreground/80">
                            Email Address
                          </label>
                          <Input
                            type="email"
                            value={detailEmail}
                            onChange={(e) => setDetailEmail(e.target.value)}
                            placeholder="sarah.j@company.com"
                            leftIcon={<Mail className="h-4 w-4" />}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-foreground/80">
                            Phone Number
                          </label>
                          <Input
                            type="tel"
                            value={detailPhone}
                            onChange={(e) => setDetailPhone(e.target.value)}
                            placeholder="+1 (555) 382-9901"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-foreground/80">
                            Date of Birth
                          </label>
                          <Input
                            type="date"
                            value={detailDob}
                            onChange={(e) => setDetailDob(e.target.value)}
                            leftIcon={<Calendar className="h-4 w-4" />}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card 2: Physical Address Information */}
                  <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
                    <CardHeader className="p-5 border-b border-border/40">
                      <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground/90">
                        <MapPin className="h-4 w-4 text-primary" />
                        Mailing & Billing Address
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground">
                        Official registered physical address for billing, tax
                        filings and physical correspondence.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-5 space-y-4">
                      {/* Row 1: Street, Suite/Unit (2 Columns) */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 space-y-1.5">
                          <label className="text-xs font-medium text-foreground/80">
                            Street Address
                          </label>
                          <Input
                            value={detailStreet}
                            onChange={(e) => setDetailStreet(e.target.value)}
                            placeholder="e.g. 1428 Elm Street"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-foreground/80">
                            Apt / Suite / Unit
                          </label>
                          <Input
                            value={detailSuite}
                            onChange={(e) => setDetailSuite(e.target.value)}
                            placeholder="e.g. Suite 4B"
                          />
                        </div>
                      </div>

                      {/* Row 2: City, State, ZIP, Country (4 Columns in a row) */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-foreground/80">
                            City
                          </label>
                          <Input
                            value={detailCity}
                            onChange={(e) => setDetailCity(e.target.value)}
                            placeholder="San Francisco"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-foreground/80">
                            State / Region
                          </label>
                          <Input
                            value={detailState}
                            onChange={(e) => setDetailState(e.target.value)}
                            placeholder="CA"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-foreground/80">
                            ZIP / Postal Code
                          </label>
                          <Input
                            value={detailZip}
                            onChange={(e) => setDetailZip(e.target.value)}
                            placeholder="94109"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-foreground/80">
                            Country
                          </label>
                          <Select
                            value={detailCountry}
                            onValueChange={setDetailCountry}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Country" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="United States">
                                United States
                              </SelectItem>
                              <SelectItem value="Canada">Canada</SelectItem>
                              <SelectItem value="United Kingdom">
                                United Kingdom
                              </SelectItem>
                              <SelectItem value="Australia">
                                Australia
                              </SelectItem>
                              <SelectItem value="Germany">Germany</SelectItem>
                              <SelectItem value="Japan">Japan</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card 3: Identification & Credentials verification */}
                  <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
                    <CardHeader className="p-5 border-b border-border/40">
                      <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground/90">
                        <FileText className="h-4 w-4 text-primary" />
                        Government ID & Identification Credentials
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground">
                        Document records used to fulfill regulatory and account
                        compliance benchmarks.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-5 space-y-4">
                      {/* Row 1: Doc Type, ID Number, Issuing Auth (3 Columns) */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-foreground/80">
                            Document Type
                          </label>
                          <Select
                            value={detailDocType}
                            onValueChange={setDetailDocType}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Passport">
                                Passport Document
                              </SelectItem>
                              <SelectItem value="National ID">
                                National ID Card
                              </SelectItem>
                              <SelectItem value="Drivers License">
                                Driver's License
                              </SelectItem>
                              <SelectItem value="Social Security">
                                Social Security Number
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-foreground/80">
                            Document ID Number
                          </label>
                          <Input
                            value={detailDocId}
                            onChange={(e) => setDetailDocId(e.target.value)}
                            placeholder="US-P8829910"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-foreground/80">
                            Issuing Authority
                          </label>
                          <Input
                            value={detailIssuingAuth}
                            onChange={(e) =>
                              setDetailIssuingAuth(e.target.value)
                            }
                            placeholder="US Department of State"
                          />
                        </div>
                      </div>

                      {/* Row 2: Issue Date, Expiry Date (2 Columns) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-foreground/80">
                            Date of Issuance
                          </label>
                          <Input
                            type="date"
                            value={detailIssueDate}
                            onChange={(e) => setDetailIssueDate(e.target.value)}
                            leftIcon={<Calendar className="h-4 w-4" />}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-foreground/80">
                            Date of Expiration
                          </label>
                          <Input
                            type="date"
                            value={detailExpiryDate}
                            onChange={(e) =>
                              setDetailExpiryDate(e.target.value)
                            }
                            leftIcon={<Calendar className="h-4 w-4" />}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card 4: Bank & Financial Cards */}
                  <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
                    <CardHeader className="p-5 border-b border-border/40">
                      <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground/90">
                        <CreditCard className="h-4 w-4 text-primary" />
                        Bank & Credit Card Information
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground">
                        Confidential settlement accounts. Credentials are
                        encrypted and tokenized.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-5 space-y-4">
                      {/* Row 1: Bank Name, Cardholder Name (2 Columns) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-foreground/80">
                            Receiving Bank Name
                          </label>
                          <Input
                            value={detailBankName}
                            onChange={(e) => setDetailBankName(e.target.value)}
                            placeholder="e.g. Chase Bank N.A."
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-foreground/80">
                            Cardholder Full Name
                          </label>
                          <Input
                            value={detailCardholderName}
                            onChange={(e) =>
                              setDetailCardholderName(e.target.value)
                            }
                            placeholder="e.g. SARAH JENKINS"
                          />
                        </div>
                      </div>

                      {/* Row 2: Card Number, Expiration, CVV (3 Columns in a grid) */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1 space-y-1.5">
                          <label className="text-xs font-medium text-foreground/80">
                            Card Number
                          </label>
                          <Input
                            value={detailCardNumber}
                            onChange={(e) =>
                              setDetailCardNumber(e.target.value)
                            }
                            placeholder="4111 2222 3333 4444"
                            leftIcon={<CreditCard className="h-4 w-4" />}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-foreground/80">
                            Expiration Date (MM/YY)
                          </label>
                          <Input
                            value={detailCardExpiry}
                            onChange={(e) =>
                              setDetailCardExpiry(e.target.value)
                            }
                            placeholder="MM/YY"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-foreground/80">
                            Security Code (CVV)
                          </label>
                          <Input
                            value={detailCardCvv}
                            onChange={(e) => setDetailCardCvv(e.target.value)}
                            placeholder="e.g. 123"
                            type="password"
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Modal Fixed Footer inside full viewport */}
            <ModalFooter className="flex-shrink-0 border-t border-border/40 pt-4 mt-4 bg-background pr-2">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => setIsFullModalOpen(false)}>
                Dismiss Form
              </Button>
              <Button
                type="button"
                size="lg"
                onClick={() => {
                  console.log("Saving detailed profile form data...");
                  setIsFullModalOpen(false);
                }}>
                Save Detailed Profile
              </Button>
            </ModalFooter>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}
