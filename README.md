# Webhook Helper

一个基于 Next.js 的 Webhook 接收和消息推送服务，支持接收来自 GitHub、Uptime Kuma 或自定义的 webhook 消息，并通过 OneBot 协议推送给用户。

## 快速开始

### 环境要求

- Node.js 20+
- PostgreSQL 数据库
- PNPM

### 安装

1. **克隆项目**

```bash
git clone https://github.com/zHElEARN/webhook-helper.git
cd webhook-helper
```

2. **安装依赖**

```bash
pnpm install
```

3. **环境配置**

创建 `.env.local` 文件：

```env
# 数据库连接
DATABASE_URL="postgresql://username:password@localhost:5432/webhook_helper"

# OneBot 配置
ONEBOT_API_URL="http://your-onebot-server:port"
ONEBOT_ACCESS_TOKEN="your-onebot-access-token"  # 可选

# 管理员账户
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your-secure-password"

# Webhook 端点
WEBHOOK_ENDPOINT="https://your-domain.com"
```

4. **数据库设置**

```bash
# 生成 Prisma 客户端
pnpm dlx prisma generate

# 运行数据库迁移
pnpm dlx prisma db push
```

5. **编译并启动**

```bash
pnpm run build
pnpm run start
```

访问 `http://localhost:3000` 查看应用。

## 使用指南

### 管理界面

1. **登录管理后台**: 访问 `/admin/login` 使用管理员账户登录
2. **API 密钥管理**: 在 `/admin/api-keys` 创建和管理 API 密钥
3. **查看日志**: 在 `/admin/logs` 查看所有 Webhook 日志

### Webhook 端点

Webhook 端点格式：

```
POST /webhook/{type}/{api_key}?chat_type={group|private}&chat_number={number}
```

**参数说明**:

- `type`: webhook 类型 (`github`, `uptime-kuma`, `custom`)
- `api_key`: 有效的 API 密钥
- `chat_type`: 聊天类型 (`group` 群聊 | `private` 私聊)
- `chat_number`: 群号或 QQ 号

### 支持的 Webhook 类型

#### 1. GitHub Webhook

接收 GitHub 仓库的推送事件：

**设置方法**:

1. 在 GitHub 仓库设置中添加 Webhook
2. URL: `https://your-domain.com/webhook/github/{api_key}?chat_type=group&chat_number=123456`
3. Content type: `application/json`
4. Events: `Push events`

**消息格式**:

```
GitHub Webhook
详细: https://your-domain.com/logs/{id}

Repository: owner/repo-name
Pusher: username
[Author] Commit message
```

#### 2. Uptime Kuma Webhook

接收 Uptime Kuma 的监控状态变化：

**设置方法**:

1. 在 Uptime Kuma 中添加 Notification
2. Type: `Webhook`
3. Webhook URL: `https://your-domain.com/webhook/uptime-kuma/{api_key}?chat_type=group&chat_number=123456`

**消息格式**:

```
Uptime Kuma Webhook
详细: https://your-domain.com/logs/{id}

Monitor: 监控名称
Message: 状态消息
```

#### 3. 自定义 Webhook

接收自定义格式的消息：

**请求格式**:

```json
{
  "message": "你的自定义消息内容"
}
```

**消息格式**:

```
Custom Webhook
详细: https://your-domain.com/logs/{id}

你的自定义消息内容
```

### 示例：爬虫程序集成

```python
import requests

def send_notification(message):
    webhook_url = "https://your-domain.com/webhook/custom/your-api-key"
    params = {
        "chat_type": "group",
        "chat_number": "123456789"
    }
    payload = {
        "message": message
    }

    response = requests.post(webhook_url, json=payload, params=params)
    return response.status_code == 204

# 在爬虫程序中使用
if new_data_found:
    send_notification(f"检测到新数据: {data_summary}")
```

## 许可证

本项目采用 MIT 许可证。

## 支持

如果您遇到问题或有功能建议，请创建 Issue 或联系开发者。
