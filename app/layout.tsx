import "./ui/global.css";
import { NotificationProvider } from "@/components/NotificationProvider";
import ClientLayout from "@/components/ClientLayout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NotificationProvider>
          <ClientLayout>{children}</ClientLayout>
        </NotificationProvider>
      </body>
    </html>
  );
}
