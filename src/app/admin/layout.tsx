import { Toaster } from "@/components/ui/sonner";
import { FileText, Home, Key } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/admin"
              className="text-xl font-bold hover:text-primary transition-colors"
            >
              管理面板
            </Link>
            <nav className="flex items-center gap-1">
              <Link
                href="/admin"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Home className="h-4 w-4" />
                首页
              </Link>
              <Link
                href="/admin/logs"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <FileText className="h-4 w-4" />
                Webhook 日志
              </Link>
              <Link
                href="/admin/api-keys"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Key className="h-4 w-4" />
                API Keys
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <Toaster richColors />
    </div>
  );
}
