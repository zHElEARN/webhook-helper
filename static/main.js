document.addEventListener("DOMContentLoaded", function () {
  const queryString = window.location.search;
  const id = queryString.slice(1);

  const contentDiv = document.getElementById("content");

  function isValidUUID(uuid) {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  if (!id) {
    contentDiv.innerHTML = '<div class="error">未提供ID参数</div>';
    return;
  }

  if (isValidUUID(id)) {
    contentDiv.innerHTML = "<div>正在加载数据...</div>";

    fetch(`/logs/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP错误状态: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        renderWebhookData(data, contentDiv);
      })
      .catch((error) => {
        contentDiv.innerHTML = `<div class="error">获取数据失败: ${error.message}</div>`;
      });
  } else {
    contentDiv.innerHTML = '<div class="error">无效的UUID格式</div>';
  }

  // 根据webhook类型渲染不同格式
  function renderWebhookData(data, container) {
    const webhookType = data.webhook_type || "custom";

    container.innerHTML = `
      <div class="webhook-header">
        <h2>Webhook详情 <span class="webhook-type ${webhookType}">${webhookType}</span></h2>
        <div class="webhook-meta">
          <div>ID: ${data.id}</div>
          ${
            data.created_at
              ? `<div>时间: ${new Date(data.created_at).toLocaleString()}</div>`
              : ""
          }
        </div>
      </div>
    `;

    // 根据不同类型渲染不同内容
    switch (webhookType) {
      case "github":
        renderGithubWebhook(data, container);
        break;
      case "uptime-kuma":
        renderUptimeKumaWebhook(data, container);
        break;
      case "custom":
        renderCustomWebhook(data, container);
        break;
      default:
        // 默认显示为JSON格式
        const formattedJson = JSON.stringify(data, null, 2);
        container.innerHTML += `<pre>${formattedJson}</pre>`;
    }
  }

  // 渲染GitHub webhook
  function renderGithubWebhook(data, container) {
    const github = data.response_data;
    if (!github) {
      container.innerHTML +=
        '<div class="error">无效的GitHub webhook数据</div>';
      return;
    }

    // 仓库信息
    const repo = github.repository;
    const repoSection = document.createElement("section");
    repoSection.className = "github-section";
    repoSection.innerHTML = `
      <h3>仓库信息</h3>
      <div class="github-repo-info">
        ${
          repo.owner?.avatar_url
            ? `<img src="${repo.owner.avatar_url}" alt="${repo.owner.login}" class="avatar" />`
            : ""
        }
        <div>
          <h4><a href="${repo.html_url}" target="_blank">${
      repo.full_name
    }</a></h4>
          <div class="repo-meta">
            ${
              repo.language
                ? `<span class="language">${repo.language}</span>`
                : ""
            }
            <span class="visibility">${repo.private ? "私有" : "公开"}</span>
          </div>
        </div>
      </div>
    `;
    container.appendChild(repoSection);

    // 提交信息
    if (github.commits && github.commits.length > 0) {
      const commitsSection = document.createElement("section");
      commitsSection.className = "github-section";

      let commitsHtml = `
        <h3>提交信息 (${github.commits.length}个提交)</h3>
        <div class="commit-summary">
          <div>分支: <code>${github.ref.replace("refs/heads/", "")}</code></div>
          <div>比较: <a href="${
            github.compare
          }" target="_blank">查看变更</a></div>
        </div>
        <ul class="commit-list">
      `;

      github.commits.forEach((commit) => {
        commitsHtml += `
          <li class="commit-item">
            <div class="commit-header">
              <a href="${
                commit.url
              }" target="_blank" class="commit-id">${commit.id.substring(
          0,
          7
        )}</a>
              <span class="commit-author">${
                commit.author?.username || commit.author?.name || "未知用户"
              }</span>
              <span class="commit-time">${new Date(
                commit.timestamp
              ).toLocaleString()}</span>
            </div>
            <div class="commit-message">${commit.message}</div>
            ${renderFileChanges(commit)}
          </li>
        `;
      });

      commitsHtml += "</ul>";
      commitsSection.innerHTML = commitsHtml;
      container.appendChild(commitsSection);
    }

    // 推送者信息
    if (github.pusher || github.sender) {
      const userSection = document.createElement("section");
      userSection.className = "github-section";

      const sender = github.sender;
      userSection.innerHTML = `
        <h3>用户信息</h3>
        <div class="user-info">
          ${
            sender?.avatar_url
              ? `<img src="${sender.avatar_url}" alt="${sender.login}" class="avatar" />`
              : ""
          }
          <div>
            <div class="user-name">${
              sender?.login || github.pusher?.name || "未知用户"
            }</div>
            <div class="user-email">${github.pusher?.email || ""}</div>
          </div>
        </div>
      `;
      container.appendChild(userSection);
    }

    // 原始JSON
    const rawDataSection = document.createElement("section");
    rawDataSection.className = "github-section raw-data-section";
    rawDataSection.innerHTML = `
      <details>
        <summary>查看原始数据</summary>
        <pre>${JSON.stringify(data, null, 2)}</pre>
      </details>
    `;
    container.appendChild(rawDataSection);
  }

  // 渲染文件变更
  function renderFileChanges(commit) {
    if (!commit.added && !commit.removed && !commit.modified) {
      return "";
    }

    let filesHtml = '<div class="file-changes">';

    if (commit.added && commit.added.length > 0) {
      filesHtml += `
        <div class="files-added">
          <span class="file-change-type added">新增</span>
          <span class="file-count">${commit.added.length}个文件</span>
          <div class="file-list">
            ${commit.added
              .map((file) => `<div class="file">${file}</div>`)
              .join("")}
          </div>
        </div>
      `;
    }

    if (commit.removed && commit.removed.length > 0) {
      filesHtml += `
        <div class="files-removed">
          <span class="file-change-type removed">删除</span>
          <span class="file-count">${commit.removed.length}个文件</span>
          <div class="file-list">
            ${commit.removed
              .map((file) => `<div class="file">${file}</div>`)
              .join("")}
          </div>
        </div>
      `;
    }

    if (commit.modified && commit.modified.length > 0) {
      filesHtml += `
        <div class="files-modified">
          <span class="file-change-type modified">修改</span>
          <span class="file-count">${commit.modified.length}个文件</span>
          <div class="file-list">
            ${commit.modified
              .map((file) => `<div class="file">${file}</div>`)
              .join("")}
          </div>
        </div>
      `;
    }

    filesHtml += "</div>";
    return filesHtml;
  }

  // 渲染Uptime-Kuma webhook
  function renderUptimeKumaWebhook(data, container) {
    const uptimeData = data.response_data;
    if (!uptimeData || !uptimeData.monitor || !uptimeData.heartbeat) {
      container.innerHTML +=
        '<div class="error">无效的Uptime-Kuma webhook数据</div>';
      return;
    }

    const monitor = uptimeData.monitor;
    const heartbeat = uptimeData.heartbeat;
    const isDown = heartbeat.status === 0; // 0表示宕机，1表示正常

    // 监控基本信息部分
    const monitorSection = document.createElement("section");
    monitorSection.className = "uptime-section";

    monitorSection.innerHTML = `
      <div class="monitor-header ${isDown ? "status-down" : "status-up"}">
        <div class="monitor-status">
          <span class="status-icon">${isDown ? "🔴" : "🟢"}</span>
          <span class="status-text">${isDown ? "宕机" : "在线"}</span>
        </div>
        <h3 class="monitor-name">${monitor.name}</h3>
      </div>
      
      <div class="monitor-details">
        <div class="detail-item">
          <span class="detail-label">监控类型:</span>
          <span class="detail-value">${monitor.type}</span>
        </div>
        ${
          monitor.hostname
            ? `
        <div class="detail-item">
          <span class="detail-label">主机名:</span>
          <span class="detail-value">${monitor.hostname}</span>
        </div>
        `
            : ""
        }
        ${
          monitor.url
            ? `
        <div class="detail-item">
          <span class="detail-label">URL:</span>
          <span class="detail-value">${monitor.url}</span>
        </div>
        `
            : ""
        }
        <div class="detail-item">
          <span class="detail-label">监控间隔:</span>
          <span class="detail-value">${monitor.interval}秒</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">检测超时:</span>
          <span class="detail-value">${monitor.timeout}秒</span>
        </div>
      </div>
    `;

    container.appendChild(monitorSection);

    // 当前心跳信息部分
    const heartbeatSection = document.createElement("section");
    heartbeatSection.className = "uptime-section";

    heartbeatSection.innerHTML = `
      <h3>心跳详情</h3>
      <div class="heartbeat-info ${isDown ? "status-down" : "status-up"}">
        <div class="heartbeat-time">
          <span class="detail-label">检测时间:</span>
          <span class="detail-value">${heartbeat.localDateTime}</span>
        </div>
        ${
          heartbeat.duration
            ? `
        <div class="heartbeat-duration">
          <span class="detail-label">响应时间:</span>
          <span class="detail-value">${heartbeat.duration}毫秒</span>
        </div>
        `
            : ""
        }
        ${
          heartbeat.msg
            ? `
        <div class="heartbeat-message">
          <span class="detail-label">状态消息:</span>
          <pre class="message-content">${heartbeat.msg}</pre>
        </div>
        `
            : ""
        }
      </div>
    `;

    container.appendChild(heartbeatSection);

    // 警报消息部分
    if (uptimeData.msg) {
      const alertSection = document.createElement("section");
      alertSection.className = "uptime-section alert-section";

      alertSection.innerHTML = `
        <h3>警报消息</h3>
        <div class="alert-message ${isDown ? "status-down" : "status-up"}">
          ${uptimeData.msg}
        </div>
      `;

      container.appendChild(alertSection);
    }

    // 原始JSON数据
    const rawDataSection = document.createElement("section");
    rawDataSection.className = "uptime-section raw-data-section";
    rawDataSection.innerHTML = `
      <details>
        <summary>查看原始数据</summary>
        <pre>${JSON.stringify(data, null, 2)}</pre>
      </details>
    `;
    container.appendChild(rawDataSection);
  }

  // 渲染自定义(Custom) webhook
  function renderCustomWebhook(data, container) {
    const customData = data.response_data;
    if (!customData) {
      container.innerHTML += '<div class="error">无效的自定义webhook数据</div>';
      return;
    }

    // 创建自定义数据部分
    const customSection = document.createElement("section");
    customSection.className = "custom-section";

    // 简化处理逻辑，重点显示message字段
    let customContentHtml = "";

    if (customData.message) {
      // 直接显示message
      customContentHtml = `
        <div class="custom-message">
          <p>${customData.message}</p>
        </div>
      `;
    } else if (typeof customData === "string") {
      // 如果整个数据就是一个字符串
      customContentHtml = `
        <div class="custom-message">
          <p>${customData}</p>
        </div>
      `;
    } else {
      // 没有message字段，简单展示数据
      customContentHtml = `
        <div class="custom-data">
          <pre>${JSON.stringify(customData, null, 2)}</pre>
        </div>
      `;
    }

    customSection.innerHTML = `
      <h3>自定义数据</h3>
      ${customContentHtml}
    `;

    container.appendChild(customSection);

    // 原始JSON
    const rawDataSection = document.createElement("section");
    rawDataSection.className = "custom-section raw-data-section";
    rawDataSection.innerHTML = `
      <details>
        <summary>查看原始数据</summary>
        <pre>${JSON.stringify(data, null, 2)}</pre>
      </details>
    `;
    container.appendChild(rawDataSection);
  }
});
