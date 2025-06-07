# 🚀 DeepSeek答题游戏部署指南

本文档提供了在多个云平台部署DeepSeek技术知识挑战游戏的详细步骤。

## 📋 部署前准备

### 1. 环境要求
- Node.js 16.0 或更高版本
- Git 2.0 或更高版本
- 一个GitHub账号

### 2. 项目检查
确保项目包含以下必要文件：
- `server.js` - 主服务器文件
- `package.json` - 项目配置
- `Procfile` - Heroku配置
- `vercel.json` - Vercel配置
- `public/` - 前端文件目录

## 🌐 云平台部署选项

### 选项1: Heroku部署 (推荐新手)

#### 优势
- ✅ 完全免费（免费套餐）
- ✅ 零配置部署
- ✅ 自动SSL证书
- ✅ 容易管理

#### 部署步骤

1. **注册Heroku账号**
   - 访问 https://signup.heroku.com/
   - 注册免费账号

2. **安装Heroku CLI**
   ```bash
   # Windows (使用安装包)
   # 下载: https://devcenter.heroku.com/articles/heroku-cli
   
   # macOS
   brew tap heroku/brew && brew install heroku
   
   # Ubuntu
   sudo snap install --classic heroku
   ```

3. **登录Heroku**
   ```bash
   heroku login
   ```

4. **创建Heroku应用**
   ```bash
   cd deepseek-quiz-game
   heroku create your-app-name  # 替换为你的应用名
   ```

5. **部署代码**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

6. **访问应用**
   ```bash
   heroku open
   ```

#### 访问地址
```
主页: https://your-app-name.herokuapp.com
管理后台: https://your-app-name.herokuapp.com/admin
排行榜: https://your-app-name.herokuapp.com/leaderboard
```

### 选项2: Vercel部署 (推荐快速部署)

#### 优势
- ✅ 超快部署速度
- ✅ 全球CDN加速
- ✅ 自动HTTPS
- ✅ GitHub集成

#### 部署步骤

1. **安装Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录Vercel**
   ```bash
   vercel login
   ```

3. **部署项目**
   ```bash
   cd deepseek-quiz-game
   vercel --prod
   ```

4. **配置项目**
   - 按提示选择项目设置
   - 选择 Node.js 运行时

### 选项3: Railway部署 (推荐现代化)

#### 优势
- ✅ 现代化界面
- ✅ 简单配置
- ✅ 良好性能
- ✅ 免费额度

#### 部署步骤

1. **访问Railway**
   - 打开 https://railway.app/
   - 使用GitHub账号登录

2. **创建新项目**
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 选择你的 `deepseek-quiz-game` 仓库

3. **等待部署**
   - Railway自动检测Node.js项目
   - 自动安装依赖并部署

4. **获取访问地址**
   - 在项目设置中找到自动生成的域名

### 选项4: 自建服务器部署

#### 适用场景
- 有自己的VPS或云服务器
- 需要完全控制
- 大量用户访问

#### 部署步骤

1. **连接服务器**
   ```bash
   ssh username@your-server-ip
   ```

2. **安装Node.js**
   ```bash
   # Ubuntu/Debian
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # CentOS/RHEL
   curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
   sudo yum install -y nodejs
   ```

3. **克隆项目**
   ```bash
   git clone https://github.com/your-username/deepseek-quiz-game.git
   cd deepseek-quiz-game
   ```

4. **安装依赖**
   ```bash
   npm install --production
   ```

5. **使用PM2运行**
   ```bash
   # 安装PM2
   sudo npm install -g pm2
   
   # 启动应用
   pm2 start server.js --name "deepseek-quiz"
   
   # 设置开机自启
   pm2 startup
   pm2 save
   ```

6. **配置Nginx (可选)**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🔧 环境配置

### 环境变量设置

根据部署平台设置以下环境变量：

```bash
# 基础配置
PORT=3000                    # 服务器端口
NODE_ENV=production          # 运行环境

# 游戏配置
MAX_CONNECTIONS=500          # 最大连接数
QUESTION_TIME_LIMIT=10       # 答题时间限制
TOTAL_QUESTIONS=15           # 题目总数

# 可选配置
ENABLE_PERFORMANCE_LOG=true  # 启用性能日志
CACHE_TTL=2000              # 缓存生存时间（毫秒）
```

#### Heroku环境变量设置
```bash
heroku config:set NODE_ENV=production
heroku config:set MAX_CONNECTIONS=500
```

#### Vercel环境变量设置
在Vercel控制台的项目设置中添加环境变量。

## 📱 移动端配置

### 微信端优化
项目已自动优化微信浏览器兼容性：

1. **meta标签优化**
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
   <meta name="applicable-device" content="mobile">
   ```

2. **触摸优化**
   ```css
   * {
     -webkit-tap-highlight-color: transparent;
   }
   ```

3. **响应式设计**
   - 自动适配手机屏幕
   - 优化触摸按钮大小
   - 简化移动端界面

## 🔍 部署后检查

### 1. 功能测试
- [ ] 主页能正常加载
- [ ] 用户可以注册并开始答题
- [ ] 实时通信正常工作
- [ ] 排行榜实时更新
- [ ] 管理后台可以访问

### 2. 性能测试
- [ ] 页面加载速度 < 3秒
- [ ] Socket.io连接稳定
- [ ] 支持预期的并发用户数
- [ ] 内存使用合理

### 3. 移动端测试
- [ ] 微信内浏览器正常显示
- [ ] 触摸操作流畅
- [ ] 答题倒计时动画正常
- [ ] 震动反馈工作（支持的设备）

## 🛠️ 常见问题排除

### 1. 部署失败
```bash
# 检查Node.js版本
node --version  # 应该 >= 16.0

# 检查依赖安装
npm install

# 检查环境变量
echo $PORT
```

### 2. Socket.io连接问题
- 确保防火墙允许WebSocket连接
- 检查CORS配置
- 验证端口设置

### 3. 性能问题
- 监控内存使用：`pm2 monit`
- 检查日志：`heroku logs --tail`
- 调整连接数限制

### 4. 移动端显示问题
- 验证响应式CSS
- 检查viewport meta标签
- 测试不同设备分辨率

## 📊 监控和维护

### 1. 日志监控
```bash
# Heroku日志
heroku logs --tail

# PM2日志
pm2 logs

# 自定义日志
tail -f /var/log/deepseek-quiz.log
```

### 2. 性能监控
- 连接数监控
- 内存使用监控
- 响应时间监控
- 错误率监控

### 3. 定期维护
- 定期重启应用（避免内存泄漏）
- 更新依赖包
- 备份用户数据
- 监控服务器资源

## 🎯 生产环境建议

### 1. 安全配置
- 使用HTTPS
- 设置CORS白名单
- 添加请求频率限制
- 输入数据验证

### 2. 性能优化
- 启用Gzip压缩
- 使用CDN加速静态资源
- 数据库优化（如需要）
- 负载均衡（高并发场景）

### 3. 扩展性考虑
- 水平扩展方案
- 数据库分离
- Redis缓存
- 微服务架构

---

🎉 **恭喜！你已经成功部署了DeepSeek技术知识挑战游戏！**

现在你的学生们可以通过互联网访问并参与这个精彩的答题挑战了。 