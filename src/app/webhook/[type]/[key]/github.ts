import { WEBHOOK_ENDPOINT } from "@/lib/env";
import { sendMessage } from "@/lib/onebot";
import { createResponse } from "@/lib/response";
import { logWebhook } from "@/lib/webhook-log";
import { z } from "zod";
import { WebhookHandler, WebhookHandlerParams } from "@/types/webhook";

const userSchema = z
  .object({
    name: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    login: z.string(),
    id: z.number(),
    node_id: z.string(),
    avatar_url: z.string(),
    gravatar_id: z.string(),
    url: z.string(),
    html_url: z.string(),
    followers_url: z.string(),
    following_url: z.string(),
    gists_url: z.string(),
    starred_url: z.string(),
    subscriptions_url: z.string(),
    organizations_url: z.string(),
    repos_url: z.string(),
    events_url: z.string(),
    received_events_url: z.string(),
    type: z.string(),
    user_view_type: z.string().optional(),
    site_admin: z.boolean(),
    username: z.string().optional(),
  })
  .strict();

const repositorySchema = z
  .object({
    id: z.number(),
    node_id: z.string(),
    name: z.string(),
    full_name: z.string(),
    private: z.boolean(),
    owner: userSchema,
    html_url: z.string(),
    description: z.string().nullable(),
    fork: z.boolean(),
    url: z.string(),
    forks_url: z.string(),
    keys_url: z.string(),
    collaborators_url: z.string(),
    teams_url: z.string(),
    hooks_url: z.string(),
    issue_events_url: z.string(),
    events_url: z.string(),
    assignees_url: z.string(),
    branches_url: z.string(),
    tags_url: z.string(),
    blobs_url: z.string(),
    git_tags_url: z.string(),
    git_refs_url: z.string(),
    trees_url: z.string(),
    statuses_url: z.string(),
    languages_url: z.string(),
    stargazers_url: z.string(),
    contributors_url: z.string(),
    subscribers_url: z.string(),
    subscription_url: z.string(),
    commits_url: z.string(),
    git_commits_url: z.string(),
    comments_url: z.string(),
    issue_comment_url: z.string(),
    contents_url: z.string(),
    compare_url: z.string(),
    merges_url: z.string(),
    archive_url: z.string(),
    downloads_url: z.string(),
    issues_url: z.string(),
    pulls_url: z.string(),
    milestones_url: z.string(),
    notifications_url: z.string(),
    labels_url: z.string(),
    releases_url: z.string(),
    deployments_url: z.string(),
    created_at: z.number(),
    updated_at: z.string(),
    pushed_at: z.number(),
    git_url: z.string(),
    ssh_url: z.string(),
    clone_url: z.string(),
    svn_url: z.string(),
    homepage: z.string().nullable(),
    size: z.number(),
    stargazers_count: z.number(),
    watchers_count: z.number(),
    language: z.string().nullable(),
    has_issues: z.boolean(),
    has_projects: z.boolean(),
    has_downloads: z.boolean(),
    has_wiki: z.boolean(),
    has_pages: z.boolean(),
    has_discussions: z.boolean(),
    forks_count: z.number(),
    mirror_url: z.string().nullable(),
    archived: z.boolean(),
    disabled: z.boolean(),
    open_issues_count: z.number(),
    license: z.any().nullable(),
    allow_forking: z.boolean(),
    is_template: z.boolean(),
    web_commit_signoff_required: z.boolean(),
    topics: z.array(z.string()),
    visibility: z.string(),
    forks: z.number(),
    open_issues: z.number(),
    watchers: z.number(),
    default_branch: z.string(),
    stargazers: z.number(),
    master_branch: z.string(),
    organization: z.string(),
    custom_properties: z.record(z.any()),
  })
  .strict();

const organizationSchema = z
  .object({
    login: z.string(),
    id: z.number(),
    node_id: z.string(),
    url: z.string(),
    repos_url: z.string(),
    events_url: z.string(),
    hooks_url: z.string(),
    issues_url: z.string(),
    members_url: z.string(),
    public_members_url: z.string(),
    avatar_url: z.string(),
    description: z.string(),
  })
  .strict();

const commitUserSchema = z
  .object({
    name: z.string(),
    email: z.string(),
    date: z.string(),
    username: z.string().optional(),
  })
  .strict();

const commitSchema = z
  .object({
    id: z.string(),
    tree_id: z.string(),
    distinct: z.boolean(),
    message: z.string(),
    timestamp: z.string(),
    url: z.string(),
    author: commitUserSchema,
    committer: commitUserSchema,
    added: z.array(z.string()),
    removed: z.array(z.string()),
    modified: z.array(z.string()),
  })
  .strict();

const pusherSchema = z
  .object({
    name: z.string(),
    email: z.string(),
  })
  .strict();

const githubWebhookSchema = z
  .object({
    ref: z.string(),
    before: z.string(),
    after: z.string(),
    repository: repositorySchema,
    pusher: pusherSchema,
    organization: organizationSchema,
    sender: userSchema,
    created: z.boolean(),
    deleted: z.boolean(),
    forced: z.boolean(),
    base_ref: z.string().nullable().optional(),
    compare: z.string(),
    commits: z.array(commitSchema),
    head_commit: commitSchema,
  })
  .strict();

export class GitHubWebhookHandler implements WebhookHandler {
  async handle({
    chatType,
    chatNumber,
    body,
  }: WebhookHandlerParams): Promise<Response> {
    try {
      const validatedBody = githubWebhookSchema.parse(body);

      const { id, error } = await logWebhook("github", validatedBody);
      if (error) {
        return createResponse({ detail: error }, 500);
      }

      let message = `GitHub Webhook\n详细: ${WEBHOOK_ENDPOINT}/logs/${id}\n\n仓库: ${validatedBody.repository.full_name}\n推送者: ${validatedBody.pusher.name}`;

      if (validatedBody.commits && validatedBody.commits.length > 0) {
        message += "\n";
        for (const commit of validatedBody.commits) {
          message += `[${commit.author.name}] ${commit.message}\n`;
        }
      }

      const sendResult = await sendMessage(
        { chatType, chatNumber },
        message.trim()
      );

      if (sendResult.error) {
        return createResponse({ detail: sendResult.error }, 400);
      }

      return createResponse(null, 204);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Invalid request body:", error.errors);
        return createResponse({ detail: "Invalid request body" }, 400);
      }
      return createResponse({ detail: "Invalid JSON" }, 400);
    }
  }
}
