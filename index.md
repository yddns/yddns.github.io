---
layout: default
title: 首页
---

<!-- 首页内容区域 -->

## 最新文章

<ul class="post-list">
  {% for post in site.posts limit: 5 %}
  <li class="post-list-item">
    <a href="{{ post.url | relative_url }}" class="post-list-title">{{ post.title }}</a>
    <div class="post-list-meta">
      📅 {{ post.date | date: "%Y年%m月%d日" }}
      {% if post.last_modified_at %}
      &nbsp;·&nbsp; 📝 更新于 {{ post.last_modified_at | date: "%m月%d日 %H:%M" }}
      {% endif %}
    </div>
    <div class="post-list-excerpt">
      {{ post.excerpt | strip_html | truncate: 120 }}
    </div>
  </li>
  {% endfor %}
</ul>

{% if site.posts.size == 0 %}
<p style="text-align:center; color:#b2bec3; padding: 40px 0;">
  还没有文章，去 <code>_posts</code> 目录下创建你的第一篇文章吧！
</p>
{% endif %}
