import "./ui/global.css";
import { NotificationProvider } from "@/components/NotificationProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NotificationProvider>
          <main className="min-h-screen bg-gray-900 text-gray-100 p-6">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </NotificationProvider>
      </body>
    </html>
  );
}
