# 🎯 DeepSeek技术知识挑战

一个基于Node.js + Socket.io的实时在线答题游戏，专门为计算机专业学生设计的DeepSeek大语言模型技术知识挑战平台。

## 🌟 项目特色

### 🎮 游戏特性
- **实时对战**：支持500+并发用户同时答题
- **梯次难度**：15道题目分为基础、进阶、专家三个难度级别
- **紧张刺激**：每题10秒倒计时，配有动画效果和震动反馈
- **智能排名**：分数相同时按答题时间排序
- **移动优化**：完美支持微信端和手机浏览器

### 📚 题目内容
- **DeepSeek基础知识**：公司背景、模型类型、应用领域
- **技术架构详解**：MoE架构、Transformer、参数规模
- **前沿技术**：混合精度训练、分布式并行、强化学习

### 🎨 界面设计
- **现代化UI**：渐变背景、圆角设计、毛玻璃效果
- **响应式布局**：自适应PC端和移动端
- **动效丰富**：倒计时跳动、页面震动、闪烁提醒

## 🚀 快速开始

### 环境要求
- Node.js 16.0+
- npm 或 yarn

### 本地部署

```bash
# 克隆项目
git clone https://github.com/你的用户名/deepseek-quiz-game.git
cd deepseek-quiz-game

# 安装依赖
npm install

# 启动服务器
npm start

# 访问游戏
# PC端：http://localhost:3000
# 管理后台：http://localhost:3000/admin
# 排行榜：http://localhost:3000/leaderboard
```

### 云端部署

#### Heroku部署
```bash
# 登录Heroku
heroku login

# 创建应用
heroku create deepseek-quiz-game

# 部署代码
git push heroku main

# 查看日志
heroku logs --tail
```

#### Vercel部署
```bash
# 安装Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

#### Railway部署
```bash
# 连接GitHub仓库到Railway
# 选择此项目进行一键部署
```

## 📱 使用方法

### 👥 学生端
1. **微信访问**：分享链接到微信群，点击即可参与
2. **输入信息**：填写真实姓名和学号
3. **开始答题**：点击"立即开始答题"
4. **实时竞技**：查看实时排行榜和分数

### 🎛️ 管理员
1. **访问后台**：`/admin` 路径
2. **监控状态**：查看在线人数、答题统计
3. **重置游戏**：一键重置所有用户数据
4. **查看排行**：实时排行榜管理

## 🎯 核心功能

### 🏆 计分规则
- **基础题（1-10题）**：答对+10分，答错-15分
- **高级题（11-15题）**：答对+10分，答错-15分
- **时间奖励**：分数相同时，答题时间短者排名靠前
- **超时惩罚**：10秒未答题自动扣15分

### 📊 实时统计
- **并发监控**：实时连接数、最大连接数
- **性能指标**：内存使用、答题数量统计
- **用户管理**：防重复参与、姓名学号验证

### 🎪 视觉效果
- **倒计时动画**：
  - 正常状态：绿色脉动
  - 警告状态：橙色心跳
  - 危险状态：红色闪烁
- **页面联动**：
  - 最后3秒：页面震动
  - 题目框闪烁
  - 手机震动反馈

## 🛠️ 技术栈

### 后端技术
- **Node.js**：服务器运行环境
- **Express.js**：Web框架
- **Socket.io**：实时通信
- **内存存储**：高性能数据缓存

### 前端技术
- **原生JavaScript**：核心逻辑
- **CSS3动画**：丰富的视觉效果
- **响应式设计**：完美适配各种设备
- **Socket.io-client**：实时通信客户端

### 部署支持
- **Heroku**：一键部署
- **Vercel**：Serverless部署
- **Railway**：现代化部署平台
- **Docker**：容器化部署

## 📁 项目结构

```
deepseek-quiz-game/
├── server.js              # 主服务器文件
├── package.json           # 项目配置
├── package-lock.json      # 锁定版本
├── Procfile               # Heroku部署配置
├── vercel.json            # Vercel部署配置
├── .gitignore             # Git忽略文件
├── README.md              # 项目说明
└── public/                # 前端资源
    ├── index.html         # 主页面（答题界面）
    ├── admin.html         # 管理后台
    ├── leaderboard.html   # 排行榜页面
    └── quiz.html          # 答题页面
```

## 🔧 配置说明

### 环境变量
```bash
PORT=3000                  # 服务器端口
NODE_ENV=production        # 运行环境
MAX_CONNECTIONS=500        # 最大连接数
QUESTION_TIME_LIMIT=10     # 答题时间限制（秒）
```

### 自定义题目
编辑 `server.js` 中的 `gameState.questions` 数组：

```javascript
{
  id: 1,
  question: "你的题目内容",
  options: ["选项A", "选项B", "选项C", "选项D"],
  correct: 0,  // 正确答案索引（0-3）
  points: 10   // 题目分值
}
```

## 🎮 游戏截图

### 📱 移动端界面
- 登录界面：简洁现代的用户信息输入
- 答题界面：大字体、易点击的选项设计
- 实时反馈：即时显示答题结果和分数

### 💻 PC端界面
- 宽屏优化：充分利用大屏幕空间
- 管理后台：丰富的数据监控和管理功能
- 排行榜：实时更新的竞技排名

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 开源协议

本项目采用 MIT 协议 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👨‍💻 作者

- **项目维护者**：[你的姓名]
- **技术支持**：[邮箱地址]
- **项目地址**：https://github.com/你的用户名/deepseek-quiz-game

## 🙏 致谢

- 感谢 DeepSeek 团队提供的优秀AI技术
- 感谢所有参与测试的同学和老师
- 感谢开源社区的技术支持

---

**🎯 开始你的DeepSeek技术知识挑战之旅吧！** 