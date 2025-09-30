"use client";

import { createContext, useContext, useState, useCallback } from "react";
import Notification from "./Notification";

type NotificationContextType = {
  notify: (message: string, isSuccess: boolean, duration?: number) => void;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notif, setNotif] = useState<{ message: string; isSuccess: boolean, duration?: number } | null>(null);

  const notify = useCallback((message: string, isSuccess: boolean, duration = 3000) => {
    setNotif({ message, isSuccess, duration });
  }, []);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {notif && (
        <Notification
          message={notif.message}
          isSuccess={notif.isSuccess}
          duration={notif.duration}
          onClose={() => setNotif(null)}
        />
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotification must be used within NotificationProvider");
  return context.notify;
}