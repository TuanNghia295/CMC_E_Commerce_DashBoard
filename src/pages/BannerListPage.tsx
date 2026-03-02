import PageBreadcrumb from "../components/common/PageBreadCrumb";
import BannerListTable from "../components/tables/BannerList/BannerListTable";

export default function BannerListPage() {
  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Banner Management" />

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Banner List
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage promotional banners displayed on the website
          </p>
        </div>

        <BannerListTable />
      </div>
    </div>
  );
}
