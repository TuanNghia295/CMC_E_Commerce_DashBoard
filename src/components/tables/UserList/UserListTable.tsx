import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import DateRangePicker from "../../common/DateRangePicker/DateRangePicker";
import type { User, UserQueryParams, UserCreateInput, UserUpdateInput } from "../../../types/user";
import UserFormModal from "../../modals/UserFormModal";
import DeleteConfirmModal from "../../modals/DeleteConfirmModal";
import { useUsers } from "../../../hooks/useUsers";
import { useCreateUser } from "../../../hooks/useCreateUser";
import { useUpdateUser } from "../../../hooks/useUpdateUser";
import { useDeleteUser } from "../../../hooks/useDeleteUser";
import Avatar from "../../ui/avatar/Avatar";
import { getAvatarUrl } from "../../../utils/urlHelpers";

export default function UserListTable() {
  // Pagination and filter states
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"full_name" | "email">("full_name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  // Query params for API call
  const [queryParams, setQueryParams] = useState<UserQueryParams>({
    page: 1,
    per_page: 10,
    sort_by: "full_name",
    sort_dir: "asc",
  });

  // React Query hooks
  const { data, isLoading, error } = useUsers(queryParams);
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const users = data?.data || [];
  console.log("USER", users);

  // Debug: Log avatar URLs
  if (users.length > 0) {
    console.log("Avatar URLs:", users.map(u => ({ id: u.id, avatar_url: u.avatar_url })));
  }
  
  const totalPages = data?.meta.total_pages || 1;
  const totalCount = data?.meta.total_count || 0;

  const handleSearch = () => {
    console.log("Search button clicked with query:", searchQuery);
    setQueryParams({
      ...queryParams,
      page: 1,
      q: searchQuery || undefined,
      from_date: startDate ? startDate.toISOString().split("T")[0] : undefined,
      to_date: endDate ? endDate.toISOString().split("T")[0] : undefined,
    });
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    console.log("Clearing all filters");
    setSearchQuery("");
    setStartDate(null);
    setEndDate(null);
    setQueryParams({
      page: 1,
      per_page: perPage,
      sort_by: sortBy,
      sort_dir: sortDir,
    });
    setCurrentPage(1);
  };

  const handleSort = (column: "full_name" | "email") => {
    const newSortDir = sortBy === column && sortDir === "asc" ? "desc" : "asc";
    setSortBy(column);
    setSortDir(newSortDir);
    setQueryParams({
      ...queryParams,
      sort_by: column,
      sort_dir: newSortDir,
    });
  };

  const handleSortToggle = () => {
    const newSortDir = sortDir === "asc" ? "desc" : "asc";
    setSortDir(newSortDir);
    setQueryParams({
      ...queryParams,
      sort_dir: newSortDir,
    });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setQueryParams({
      ...queryParams,
      page: newPage,
    });
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
    setQueryParams({
      ...queryParams,
      page: 1,
      per_page: newPerPage,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Modal handlers
  const handleAddUser = () => {
    setFormMode("create");
    setSelectedUser(null);
    setIsFormModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setFormMode("edit");
    setSelectedUser(user);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (data: UserCreateInput | UserUpdateInput) => {
    if (formMode === "create") {
      await createUserMutation.mutateAsync(data as UserCreateInput);
    } else if (selectedUser) {
      await updateUserMutation.mutateAsync({
        id: selectedUser.id,
        data: data as UserUpdateInput,
      });
    }
    setIsFormModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    try {
      await deleteUserMutation.mutateAsync(selectedUser.id);
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user. Please try again.");
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Failed to load users. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Add User Button */}
      <div className="flex justify-end">
        <button
          onClick={handleAddUser}
          className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add User
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white dark:bg-white/[0.03] p-4 rounded-xl border border-gray-200 dark:border-white/[0.05]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">

          {/* Left side: Search + Date */}
          <div className="flex flex-col sm:flex-row gap-3 flex-1">

            {/* Search */}
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search by name, email, phone..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>

            {/* Date Range */}
            <div className="min-w-[260px]">
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                startPlaceholder="From"
                endPlaceholder="To"
              />
            </div>
          </div>

          {/* Right side: Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              className="px-3 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
            >
              Search
            </button>

            <button
              onClick={handleSortToggle}
              className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-md
                        hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              {sortDir === "asc" ? "A-Z ↑" : "Z-A ↓"}
            </button>

            {(searchQuery || startDate || endDate) && (
              <button
                onClick={handleClearFilters}
                className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200
                          dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table Section */}
      {isLoading ? <div className="flex justify-center items-center h-64">
        <div className="text-gray-500 dark:text-gray-400">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          Loading users...
        </div>
      </div> : (
      <div className="overflow-x-auto overflow-y-visible rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
              <div className="max-w-full overflow-x-auto">
                <Table>
                  <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      <TableCell className="px-5 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                        ID
                      </TableCell>
                      <TableCell className="px-5 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                        Avatar
                      </TableCell>
                      <TableCell
                        className="px-5 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                        onClick={() => handleSort("full_name")}
                      >
                        <div className="flex items-center gap-1">
                          Full Name
                          {sortBy === "full_name" && (
                            <span>{sortDir === "asc" ? "↑" : "↓"}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell
                        className="px-5 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                        onClick={() => handleSort("email")}
                      >
                        <div className="flex items-center gap-1">
                          Email
                          {sortBy === "email" && (
                            <span>{sortDir === "asc" ? "↑" : "↓"}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                        Phone
                      </TableCell>
                      <TableCell className="px-5 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                        Role
                      </TableCell>
                      <TableCell className="px-5 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                        Created At
                      </TableCell>
                       <TableCell className="px-5 py-4 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                        Verified
                      </TableCell>
                      <TableCell className="px-5 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="px-5 py-3 text-sm text-gray-900 dark:text-gray-100">
                            {user.id}
                          </TableCell>
                          <TableCell className="px-5 py-3">
                            {user.avatar_url ? (
                              <Avatar src={getAvatarUrl(user.avatar_url) || user.avatar_url} size="small" alt={user.full_name} />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {user.full_name?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="px-5 py-3 text-sm text-gray-900 dark:text-gray-100">
                            {user.full_name}
                          </TableCell>
                          <TableCell className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">
                            {user.email}
                          </TableCell>
                          <TableCell className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">
                            {user.phone || "-"}
                          </TableCell>
                          <TableCell className="px-5 py-3 text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.role === "admin"
                                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                              }`}
                            >
                              {user.role}
                            </span>
                          </TableCell>
                          <TableCell className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(user.created_at)}
                          </TableCell>
                          <TableCell className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400 text-center">
                            {user.verified ? "Yes" : "No"}
                          </TableCell>
                          <TableCell className="px-5 py-3 text-sm">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditUser(user)}
                                className="px-3 py-1 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 border border-blue-600 dark:border-blue-400 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteClick(user)}
                                className="px-3 py-1 text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 border border-red-600 dark:border-red-400 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
      </div>
      ) }



      {/* Pagination Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-white/[0.03] p-4 rounded-xl border border-gray-200 dark:border-white/[0.05]">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700 dark:text-gray-300">
            Per page:
          </label>
          <select
            value={perPage}
            onChange={(e) => handlePerPageChange(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Showing {users.length === 0 ? 0 : (currentPage - 1) * perPage + 1} to{" "}
            {Math.min(currentPage * perPage, totalCount)} of {totalCount} users
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modals */}
      <UserFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        user={selectedUser}
        mode={formMode}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        userName={selectedUser?.full_name || ""}
        isDeleting={deleteUserMutation.isPending}
      />
    </div>
  );
}
