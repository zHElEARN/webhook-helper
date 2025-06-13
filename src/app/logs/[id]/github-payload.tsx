import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  BookIcon,
  ChevronDownIcon,
  EditIcon,
  FileIcon,
  GitBranchIcon,
  GitCommitIcon,
  MinusIcon,
  PlusIcon,
} from "lucide-react";

interface GitHubPayload {
  ref: string;
  after: string;
  before: string;
  forced: boolean;
  created: boolean;
  deleted: boolean;
  pusher: {
    name: string;
    email: string;
  };
  sender: {
    id: number;
    login: string;
    avatar_url: string;
    html_url: string;
    type: string;
  };
  repository: {
    id: number;
    name: string;
    full_name: string;
    html_url: string;
    description?: string;
    private: boolean;
    default_branch: string;
    language?: string;
    stargazers_count: number;
    forks_count: number;
    owner: {
      login: string;
      avatar_url: string;
      type: string;
    };
  };
  commits: Array<{
    id: string;
    url: string;
    message: string;
    timestamp: string;
    author: {
      name: string;
      email: string;
      username: string;
    };
    committer: {
      name: string;
      email: string;
      username: string;
    };
    added: string[];
    removed: string[];
    modified: string[];
  }>;
  head_commit: {
    id: string;
    message: string;
    timestamp: string;
    author: {
      name: string;
      email: string;
      username: string;
    };
    added: string[];
    removed: string[];
    modified: string[];
  };
  compare: string;
}

interface GitHubPayloadProps {
  payload: GitHubPayload;
}

export const GitHubPayload = ({ payload }: GitHubPayloadProps) => {
  const branchName = payload.ref.replace("refs/heads/", "");
  const shortSha = payload.after.substring(0, 7);
  const commitCount = payload.commits.length;

  const getEventType = () => {
    if (payload.created)
      return { text: "新建分支", variant: "default" as const };
    if (payload.deleted)
      return { text: "删除分支", variant: "destructive" as const };
    if (payload.forced)
      return { text: "强制推送", variant: "destructive" as const };
    return { text: "推送", variant: "secondary" as const };
  };

  const eventType = getEventType();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BookIcon className="h-4 w-4" />
        <span className="font-medium">GitHub Push Event</span>
        <Badge variant={eventType.variant}>{eventType.text}</Badge>
      </div>

      <Card className="bg-muted/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={payload.repository.owner.avatar_url} />
              <AvatarFallback>
                {payload.repository.owner.login[0]}
              </AvatarFallback>
            </Avatar>
            <a
              href={payload.repository.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-primary"
            >
              {payload.repository.full_name}
            </a>
            {payload.repository.private && (
              <Badge variant="outline" className="text-xs">
                私有
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <GitBranchIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                分支:{" "}
                <code className="bg-background/50 px-1 rounded">
                  {branchName}
                </code>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <GitCommitIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                提交:{" "}
                <code className="bg-background/50 px-1 rounded">
                  {shortSha}
                </code>
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {commitCount} 个提交
            </div>
          </div>
          {payload.repository.description && (
            <p className="text-sm text-muted-foreground mt-2">
              {payload.repository.description}
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent>
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={payload.sender.avatar_url} />
              <AvatarFallback>{payload.sender.login[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <a
                  href={payload.sender.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:underline text-primary"
                >
                  {payload.sender.login}
                </a>
                <Badge variant="outline" className="text-xs">
                  {payload.sender.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                推送者: {payload.pusher.name} ({payload.pusher.email})
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {payload.commits.length > 0 && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <GitCommitIcon className="h-4 w-4" />
              提交记录 ({payload.commits.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payload.commits.map((commit) => (
                <div key={commit.id} className="border-l-2 border-muted pl-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="bg-background/50 px-2 py-1 rounded text-xs">
                          {commit.id.substring(0, 7)}
                        </code>
                        <span className="text-sm text-muted-foreground">
                          by {commit.author.name}
                        </span>
                      </div>
                      <p className="text-sm font-medium mb-2">
                        {commit.message}
                      </p>

                      <div className="flex flex-wrap gap-2 text-xs mb-3">
                        {commit.added.length > 0 && (
                          <div className="flex items-center gap-1 text-green-600">
                            <PlusIcon className="h-3 w-3" />
                            <span>{commit.added.length} 新增</span>
                          </div>
                        )}
                        {commit.modified.length > 0 && (
                          <div className="flex items-center gap-1 text-primary">
                            <EditIcon className="h-3 w-3" />
                            <span>{commit.modified.length} 修改</span>
                          </div>
                        )}
                        {commit.removed.length > 0 && (
                          <div className="flex items-center gap-1 text-red-600">
                            <MinusIcon className="h-3 w-3" />
                            <span>{commit.removed.length} 删除</span>
                          </div>
                        )}
                      </div>

                      {(commit.added.length > 0 ||
                        commit.modified.length > 0 ||
                        commit.removed.length > 0) && (
                        <Collapsible>
                          <CollapsibleTrigger className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                            <FileIcon className="h-3 w-3" />
                            <span>查看文件变更</span>
                            <ChevronDownIcon className="h-3 w-3" />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-2">
                            <div className="space-y-3 border-l pl-3 ml-2">
                              {commit.added.length > 0 && (
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <PlusIcon className="h-3 w-3 text-green-600" />
                                    <span className="text-xs font-medium text-green-600">
                                      新增文件 ({commit.added.length})
                                    </span>
                                  </div>
                                  <div className="space-y-1">
                                    {commit.added.map((file) => (
                                      <code
                                        key={file}
                                        className="block text-xs bg-green-50 dark:bg-green-950/20 px-2 py-1 rounded"
                                      >
                                        + {file}
                                      </code>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {commit.modified.length > 0 && (
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <EditIcon className="h-3 w-3 text-primary" />
                                    <span className="text-xs font-medium text-primary">
                                      修改文件 ({commit.modified.length})
                                    </span>
                                  </div>
                                  <div className="space-y-1">
                                    {commit.modified.map((file) => (
                                      <code
                                        key={file}
                                        className="block text-xs bg-primary/10 px-2 py-1 rounded"
                                      >
                                        M {file}
                                      </code>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {commit.removed.length > 0 && (
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <MinusIcon className="h-3 w-3 text-red-600" />
                                    <span className="text-xs font-medium text-red-600">
                                      删除文件 ({commit.removed.length})
                                    </span>
                                  </div>
                                  <div className="space-y-1">
                                    {commit.removed.map((file) => (
                                      <code
                                        key={file}
                                        className="block text-xs bg-red-50 dark:bg-red-950/20 px-2 py-1 rounded"
                                      >
                                        - {file}
                                      </code>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(commit.timestamp).toLocaleString("zh-CN")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {payload.compare && (
        <Card className="bg-muted/50">
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                查看变更对比
              </span>
              <a
                href={payload.compare}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                在 GitHub 中查看
              </a>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
