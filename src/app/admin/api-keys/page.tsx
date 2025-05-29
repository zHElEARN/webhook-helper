import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Key } from "lucide-react";
import { getAPIKeys } from "./actions";
import { CopyButton } from "./copy-button";
import { CreateButton } from "./create-button";
import { DeleteButton } from "./delete-button";
import { RefreshButton } from "./refresh-button";

const AdminPage = async () => {
  const result = await getAPIKeys();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">API Keys 管理</h1>
        <div className="flex gap-2">
          <RefreshButton />
          <CreateButton />
        </div>
      </div>

      {!result.success ? (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{result.error}</AlertDescription>
        </Alert>
      ) : result.data.length === 0 ? (
        <div className="text-center py-8">
          <Key className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">
            暂无 API Key，点击右上角按钮创建
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {result.data.map((key) => (
            <div
              key={key.id}
              className="flex items-center justify-between p-4 bg-card rounded-lg border"
            >
              <div className="flex items-center gap-2 flex-1">
                <span className="text-sm text-muted-foreground">Key:</span>
                <code className="text-sm bg-muted px-2 py-1 rounded">
                  {key.key}
                </code>
                <CopyButton text={key.key} />
              </div>
              <DeleteButton id={key.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
