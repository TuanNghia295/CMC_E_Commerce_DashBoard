import { createConsumer } from "@rails/actioncable";
import type { QueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { CABLE_ENDPOINT } from "../../constants/endpoints";
import { useUserStore } from "../../store/userStore";
import type { AdminOrdersCreatedEvent } from "../../types/realtime";

type RealtimeOptions = {
  queryClient: QueryClient;
  onOrderCreated?: (event: AdminOrdersCreatedEvent) => void;
};

const EVENT_NAME = "admin.orders.created.v1";
const CHANNEL = "AdminOrdersChannel";
const MAX_BACKOFF_MS = 30_000;

const devLog = (...args: unknown[]) => {
  if (import.meta.env.DEV) {
    console.log("[realtime][orders]", ...args);
  }
};

const resolveCableUrl = () => CABLE_ENDPOINT;

const isCreatedEvent = (payload: unknown): payload is AdminOrdersCreatedEvent => {
  if (!payload || typeof payload !== "object") return false;

  const candidate = payload as Partial<AdminOrdersCreatedEvent>;
  return candidate.event === EVENT_NAME && !!candidate.data && typeof candidate.data === "object";
};

const getBackoffMs = (attempt: number) => {
  const exp = Math.min(MAX_BACKOFF_MS, 1000 * 2 ** Math.max(0, attempt - 1));
  const jitter = Math.floor(Math.random() * 500);
  return exp + jitter;
};

export const createOrderNotificationsSubscription = ({
  queryClient,
  onOrderCreated,
}: RealtimeOptions) => {
  let cable: ReturnType<typeof createConsumer> | null = null;
  let subscription: { unsubscribe: () => void } | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let reconnectAttempts = 0;
  let isStopped = false;
  let isConnecting = false;
  let didTryRefresh = false;

  const cleanupConnection = () => {
    if (subscription) {
      subscription.unsubscribe();
      subscription = null;
    }

    if (cable) {
      cable.disconnect();
      cable = null;
    }
  };

  const clearReconnectTimer = () => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  };

  const scheduleReconnect = (reason: string) => {
    if (isStopped || reconnectTimer || !navigator.onLine) return;

    reconnectAttempts += 1;
    const waitMs = getBackoffMs(reconnectAttempts);
    devLog(`schedule reconnect in ${waitMs}ms`, { reason, reconnectAttempts });

    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      void connect();
    }, waitMs);
  };

  const attemptTokenRefresh = async () => {
    if (didTryRefresh) return false;

    didTryRefresh = true;
    const userStore = useUserStore.getState();

    try {
      const ok = await userStore.checkToken();
      if (!ok) return false;

      reconnectAttempts = 0;
      return true;
    } catch {
      return false;
    }
  };

  const connect = async () => {
    if (isStopped || isConnecting || !navigator.onLine) return;

    const accessToken = useUserStore.getState().accessToken;
    if (!accessToken) {
      devLog("skip connect: no access token");
      return;
    }

    isConnecting = true;
    clearReconnectTimer();
    cleanupConnection();

    const cableUrl = resolveCableUrl();
    devLog("connecting", { cableUrl });

    cable = createConsumer(`${cableUrl}?token=${encodeURIComponent(accessToken)}`);

    subscription = cable.subscriptions.create(
      { channel: CHANNEL },
      {
        connected: () => {
          reconnectAttempts = 0;
          didTryRefresh = false;
          isConnecting = false;
          devLog("connected");
        },

        disconnected: () => {
          isConnecting = false;
          devLog("disconnected");
          scheduleReconnect("disconnected");
        },

        rejected: async () => {
          isConnecting = false;
          devLog("subscription rejected");

          const refreshed = await attemptTokenRefresh();
          if (refreshed) {
            void connect();
            return;
          }

          scheduleReconnect("rejected");
        },

        received: (payload: unknown) => {
          if (!isCreatedEvent(payload)) return;

          toast.success(`New order received: #${payload.data.order_code}`);

          try {
            onOrderCreated?.(payload);
          } catch (error) {
            devLog("onOrderCreated callback error", error);
          }

          queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
      }
    ) as { unsubscribe: () => void };
  };

  const handleOnline = () => {
    devLog("browser online");
    reconnectAttempts = 0;
    clearReconnectTimer();
    void connect();
  };

  const handleOffline = () => {
    devLog("browser offline");
    clearReconnectTimer();
  };

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  void connect();

  return {
    stop: () => {
      isStopped = true;
      clearReconnectTimer();
      cleanupConnection();
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    },
  };
};
