import { FileText, Key } from "lucide-react";
import Link from "next/link";

const AdminPage = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">管理面板</h1>
        <p className="text-muted-foreground">选择要管理的功能</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/admin/logs"
          className="p-6 bg-card rounded-lg border hover:bg-accent transition-colors"
        >
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Webhook 日志</h2>
          </div>
          <p className="text-muted-foreground">查看和管理 Webhook 请求日志</p>
        </Link>

        <Link
          href="/admin/api-keys"
          className="p-6 bg-card rounded-lg border hover:bg-accent transition-colors"
        >
          <div className="flex items-center gap-3 mb-2">
            <Key className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">API Keys</h2>
          </div>
          <p className="text-muted-foreground">管理 API 密钥</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminPage;
