# 🚀 快速部署指南

## 📋 准备工作

1. **确保已安装**：
   - Git
   - Node.js 16+
   - GitHub账号

## 🎯 一键部署到云平台

### 方式1: Heroku (推荐)

```bash
# 1. 克隆到本地
git clone https://github.com/你的用户名/deepseek-quiz-game.git
cd deepseek-quiz-game

# 2. 安装Heroku CLI
# Windows: 下载安装包 https://devcenter.heroku.com/articles/heroku-cli

# 3. 登录并创建应用
heroku login
heroku create 你的应用名

# 4. 部署
git push heroku main

# 5. 打开应用
heroku open
```

### 方式2: Vercel (最快)

```bash
# 1. 安装Vercel CLI
npm i -g vercel

# 2. 登录并部署
vercel login
vercel --prod
```

### 方式3: Railway (现代化)

1. 访问 https://railway.app/
2. 连接GitHub账号
3. 选择此仓库
4. 一键部署

## 🌐 访问地址

部署成功后，你将获得：

- **主页**: `https://你的域名.com`
- **管理后台**: `https://你的域名.com/admin`
- **排行榜**: `https://你的域名.com/leaderboard`

## 📱 微信分享

将主页链接分享到微信群，学生点击即可参与答题！

## 🔧 自定义配置

编辑 `server.js` 中的题目内容：

```javascript
questions: [
  {
    id: 1,
    question: "你的题目",
    options: ["A", "B", "C", "D"],
    correct: 0,  // 正确答案索引
    points: 10   // 分值
  }
]
```

## 🎮 开始使用

1. 分享链接给学生
2. 学生填写姓名学号
3. 开始答题挑战
4. 查看实时排行榜

---

🎯 **现在就开始你的DeepSeek技术知识挑战吧！** 