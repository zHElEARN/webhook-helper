from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from dependencies.db import WEBHOOK_ENDPOINT, log_webhook
from dependencies.verify_chat_info import ChatInfo, verify_chat_info
from dependencies.verify_key import verify_key
from utils.onebot import send_message

router = APIRouter(prefix="/github")

from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class User(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    login: str
    id: int
    node_id: str
    avatar_url: str
    gravatar_id: str
    url: str
    html_url: str
    followers_url: str
    following_url: str
    gists_url: str
    starred_url: str
    subscriptions_url: str
    organizations_url: str
    repos_url: str
    events_url: str
    received_events_url: str
    type: str
    user_view_type: Optional[str] = None
    site_admin: bool
    username: Optional[str] = None  # Only present in commit author/committer


class Repository(BaseModel):
    id: int
    node_id: str
    name: str
    full_name: str
    private: bool
    owner: User
    html_url: str
    description: Optional[str] = None
    fork: bool
    url: str
    forks_url: str
    keys_url: str
    collaborators_url: str
    teams_url: str
    hooks_url: str
    issue_events_url: str
    events_url: str
    assignees_url: str
    branches_url: str
    tags_url: str
    blobs_url: str
    git_tags_url: str
    git_refs_url: str
    trees_url: str
    statuses_url: str
    languages_url: str
    stargazers_url: str
    contributors_url: str
    subscribers_url: str
    subscription_url: str
    commits_url: str
    git_commits_url: str
    comments_url: str
    issue_comment_url: str
    contents_url: str
    compare_url: str
    merges_url: str
    archive_url: str
    downloads_url: str
    issues_url: str
    pulls_url: str
    milestones_url: str
    notifications_url: str
    labels_url: str
    releases_url: str
    deployments_url: str
    created_at: int  # Unix timestamp
    updated_at: str  # ISO format string
    pushed_at: int  # Unix timestamp
    git_url: str
    ssh_url: str
    clone_url: str
    svn_url: str
    homepage: Optional[str] = None
    size: int
    stargazers_count: int
    watchers_count: int
    language: Optional[str]
    has_issues: bool
    has_projects: bool
    has_downloads: bool
    has_wiki: bool
    has_pages: bool
    has_discussions: bool
    forks_count: int
    mirror_url: Optional[str] = None
    archived: bool
    disabled: bool
    open_issues_count: int
    license: Optional[Any] = None
    allow_forking: bool
    is_template: bool
    web_commit_signoff_required: bool
    topics: List[str]
    visibility: str
    forks: int
    open_issues: int
    watchers: int
    default_branch: str
    stargazers: int
    master_branch: str
    organization: str
    custom_properties: Dict[str, Any]


class Organization(BaseModel):
    login: str
    id: int
    node_id: str
    url: str
    repos_url: str
    events_url: str
    hooks_url: str
    issues_url: str
    members_url: str
    public_members_url: str
    avatar_url: str
    description: str


class CommitUser(BaseModel):
    name: str
    email: str
    username: Optional[str] = None


class Commit(BaseModel):
    id: str
    tree_id: str
    distinct: bool
    message: str
    timestamp: str  # ISO format string
    url: str
    author: CommitUser
    committer: CommitUser
    added: List[str]
    removed: List[str]
    modified: List[str]


class Pusher(BaseModel):
    name: str
    email: str


class GitHubWebhookPayload(BaseModel):
    ref: str
    before: str
    after: str
    repository: Repository
    pusher: Pusher
    organization: Organization
    sender: User
    created: bool
    deleted: bool
    forced: bool
    base_ref: Optional[str] = None
    compare: str
    commits: List[Commit]
    head_commit: Commit


@router.post("/{key}", dependencies=[Depends(verify_key)])
async def github_webhook(
    data: GitHubWebhookPayload, chat_info: ChatInfo = Depends(verify_chat_info)
):
    log_id = log_webhook("github", data.model_dump_json())

    message = f"""GitHub Webhook
详细: {WEBHOOK_ENDPOINT}/static/?{log_id}

Repository: {data.repository.full_name}
Pusher: {data.pusher.name}"""

    if data.commits:
        message += "\n"
        for commit in data.commits:
            message += f"[{commit.author.name}] {commit.message}\n"

    return await send_message(chat_info, message.strip())
