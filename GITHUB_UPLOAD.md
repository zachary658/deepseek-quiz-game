# 🚀 GitHub上传和部署指南

## 📋 第一步：上传到GitHub

### 1. 创建GitHub仓库
1. 登录 [GitHub](https://github.com)
2. 点击右上角的 "+" 号，选择 "New repository"
3. 仓库名称：`deepseek-quiz-game`
4. 描述：`DeepSeek技术知识挑战 - 实时在线答题游戏`
5. 选择 "Public"（公开仓库）
6. **不要**勾选 "Add a README file"
7. 点击 "Create repository"

### 2. 上传代码到GitHub
在项目目录中执行以下命令：

```bash
# 添加远程仓库（替换为你的GitHub用户名）
git remote add origin https://github.com/你的用户名/deepseek-quiz-game.git

# 推送代码到GitHub
git branch -M main
git push -u origin main
```

## 🌐 第二步：一键部署到云平台

### 方式1: Heroku部署（推荐新手）

1. **注册Heroku账号**
   - 访问 https://signup.heroku.com/
   - 注册免费账号

2. **安装Heroku CLI**
   - Windows: 下载 https://devcenter.heroku.com/articles/heroku-cli
   - 安装后重启命令行

3. **部署命令**
   ```bash
   # 登录Heroku
   heroku login
   
   # 创建应用（替换为你想要的应用名）
   heroku create deepseek-quiz-你的名字
   
   # 部署
   git push heroku main
   
   # 打开应用
   heroku open
   ```

4. **获取访问地址**
   - 主页：`https://deepseek-quiz-你的名字.herokuapp.com`
   - 管理后台：`https://deepseek-quiz-你的名字.herokuapp.com/admin`
   - 排行榜：`https://deepseek-quiz-你的名字.herokuapp.com/leaderboard`

### 方式2: Vercel部署（最快速）

1. **安装Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登录并部署**
   ```bash
   vercel login
   vercel --prod
   ```

3. **按提示配置**
   - 选择项目目录
   - 确认项目设置
   - 等待部署完成

### 方式3: Railway部署（现代化）

1. **访问Railway**
   - 打开 https://railway.app/
   - 使用GitHub账号登录

2. **连接仓库**
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 选择你的 `deepseek-quiz-game` 仓库

3. **自动部署**
   - Railway自动检测Node.js项目
   - 自动安装依赖并部署
   - 获取自动生成的域名

## 📱 第三步：分享给用户

### 🎯 获取分享链接
部署成功后，你将获得一个公网访问地址，例如：
- `https://deepseek-quiz-你的名字.herokuapp.com`
- `https://deepseek-quiz-game.vercel.app`
- `https://deepseek-quiz-game.up.railway.app`

### 📲 微信分享方法
1. **复制主页链接**
2. **发送到微信群**：
   ```
   🎯 DeepSeek技术知识挑战开始啦！
   
   📚 15道专业题目，测试你的AI技术水平
   ⏱️ 每题10秒限时，紧张刺激
   🏆 实时排行榜，看看谁是技术达人
   
   点击链接立即参与：
   https://你的域名.com
   
   填写真实姓名和学号即可开始答题！
   ```

3. **学生参与方式**：
   - 点击链接打开游戏
   - 填写姓名和学号
   - 点击"立即开始答题"
   - 开始挑战！

## 🎛️ 第四步：管理和监控

### 📊 管理后台
访问 `https://你的域名.com/admin` 可以：
- 查看在线人数和答题统计
- 重置游戏数据
- 监控系统性能
- 管理用户排行榜

### 🏆 排行榜页面
访问 `https://你的域名.com/leaderboard` 可以：
- 查看实时排行榜
- 显示用户答题情况
- 展示最终成绩

## 🔧 第五步：自定义配置

### 修改题目内容
1. 编辑 `server.js` 文件
2. 找到 `gameState.questions` 数组
3. 修改题目内容、选项和答案
4. 提交更改并重新部署：
   ```bash
   git add .
   git commit -m "更新题目内容"
   git push origin main
   git push heroku main  # 如果使用Heroku
   ```

### 调整游戏参数
```javascript
const QUESTION_TIME_LIMIT = 10;  // 答题时间限制（秒）
const TOTAL_QUESTIONS = 15;      // 题目总数
const MAX_CONNECTIONS = 500;     // 最大连接数
```

## 🎉 完成！

现在你的DeepSeek技术知识挑战游戏已经：

✅ **上传到GitHub** - 代码开源，其他人可以学习和贡献  
✅ **部署到云端** - 全球用户都可以通过互联网访问  
✅ **支持移动端** - 微信群完美分享和使用  
✅ **实时多人** - 支持500+用户同时答题  
✅ **管理便捷** - 完整的后台管理和监控  

## 📞 技术支持

如果遇到问题，可以：
1. 查看项目的 `README.md` 和 `DEPLOYMENT.md` 文档
2. 检查 `PROJECT_SUMMARY.md` 了解完整功能
3. 在GitHub仓库中提交Issue
4. 查看云平台的部署日志

---

🎯 **恭喜！你的DeepSeek技术知识挑战游戏现在已经可以供全世界的用户访问了！** 