import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import { createOrderNotificationsSubscription } from "../services/realtime/orderNotifications";
import type { AdminOrderNotificationData } from "../types/realtime";

type HeaderOrderNotification = {
  id: number;
  orderCode: string;
  customerLabel: string;
  createdAt: string;
};

const MAX_NOTIFICATIONS = 20;

const resolveCustomerLabel = (notification: AdminOrderNotificationData) => {
  const customer = notification.customer;
  if (!customer || typeof customer !== "object") return "Unknown customer";

  return customer.full_name || customer.email || customer.phone || "Unknown customer";
};

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState<HeaderOrderNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleOrderCreated = useCallback((event: { data: AdminOrderNotificationData }) => {
    const data = event?.data;
    if (!data || typeof data !== "object") return;

    const nextItem: HeaderOrderNotification = {
      id: typeof data.id === "number" ? data.id : Date.now(),
      orderCode: data.order_code || "N/A",
      customerLabel: resolveCustomerLabel(data),
      createdAt: data.created_at || new Date().toISOString(),
    };

    setNotifications((prev) => [nextItem, ...prev].slice(0, MAX_NOTIFICATIONS));
    setUnreadCount((prev) => prev + 1);
  }, []);

  const handleNotificationsSeen = useCallback(() => {
    setUnreadCount(0);
  }, []);

  useEffect(() => {
    const subscription = createOrderNotificationsSubscription({
      queryClient,
      onOrderCreated: handleOrderCreated,
    });

    return () => {
      subscription.stop();
    };
  }, [handleOrderCreated, queryClient]);

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader
          notifications={notifications}
          unreadCount={unreadCount}
          onNotificationsSeen={handleNotificationsSeen}
        />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
