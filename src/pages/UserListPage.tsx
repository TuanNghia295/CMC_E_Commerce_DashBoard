import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserListTable from "../components/tables/UserList/UserListTable";

export default function UserListPage() {
  return (
    <div className="space-y-6">
      <PageBreadcrumb
        pageTitle="User Management"
        // items={[
        //   { label: "Dashboard", href: "/" },
        //   { label: "Users", href: "/users" },
        // ]}
      />

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            User List
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage all users
          </p>
        </div>

        <UserListTable />
      </div>
    </div>
  );
}
