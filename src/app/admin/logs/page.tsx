import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, FileText } from "lucide-react";
import { getWebhookLogs } from "./actions";
import { LogItem } from "./item";
import { LogsPagination } from "./pagination";

const LogsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
  }>;
}) => {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const result = await getWebhookLogs(page);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Webhook 日志</h1>
        <p className="text-muted-foreground">共 {result.total} 条记录</p>
      </div>

      {!result.success ? (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{result.error}</AlertDescription>
        </Alert>
      ) : result.logs.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">暂无日志记录</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {result.logs.map((log) => (
              <LogItem key={log.id} log={log} />
            ))}
          </div>

          <LogsPagination
            currentPage={result.currentPage}
            totalPages={result.totalPages}
          />
        </>
      )}
    </div>
  );
};

export default LogsPage;
