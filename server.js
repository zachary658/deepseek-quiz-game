const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const qrcode = require('qrcode');
const uuid = require('uuid');
const moment = require('moment');

const app = express();
const server = http.createServer(app);

// Socket.io配置优化 - 支持高并发
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  // 性能优化配置
  maxHttpBufferSize: 1e6, // 1MB
  pingTimeout: 60000,
  pingInterval: 25000,
  upgradeTimeout: 30000,
  allowEIO3: true,
  transports: ['websocket', 'polling'],
  // 连接限制和内存优化
  connectTimeout: 45000,
  serveClient: true // 启用客户端文件服务
});

app.use(express.static('public'));
app.use(express.json());

// 游戏状态
let gameState = {
  isActive: true, // 游戏始终活跃，用户加入即可开始
  currentQuestion: 0,
  startTime: null,
  questionStartTime: null,
  questionTimer: null,
  questions: [
    {
      id: 1,
      question: "DeepSeek是由哪家公司开发的AI大语言模型？",
      options: ["百度", "阿里巴巴", "幻方量化", "腾讯"],
      correct: 2,
      points: 10
    },
    {
      id: 2,
      question: "DeepSeek-V3是什么类型的AI模型？",
      options: ["图像识别模型", "大语言模型", "语音识别模型", "推荐系统"],
      correct: 1,
      points: 10
    },
    {
      id: 3,
      question: "DeepSeek模型主要用于什么领域？",
      options: ["自动驾驶", "自然语言处理", "人脸识别", "游戏AI"],
      correct: 1,
      points: 10
    },
    {
      id: 4,
      question: "DeepSeek-V3相比传统模型的主要优势是什么？",
      options: ["体积更小", "成本更低", "速度更快", "以上都是"],
      correct: 3,
      points: 10
    },
    {
      id: 5,
      question: "DeepSeek采用了哪种神经网络架构？",
      options: ["CNN", "RNN", "Transformer", "GAN"],
      correct: 2,
      points: 10
    },
    {
      id: 6,
      question: "DeepSeek-V3采用的MoE全称是什么？",
      options: ["Mix of Experts", "Mixture of Experts", "Model of Excellence", "Multiple of Elements"],
      correct: 1,
      points: 10
    },
    {
      id: 7,
      question: "DeepSeek-V3总参数量大约是多少？",
      options: ["67亿", "671亿", "6710亿", "67100亿"],
      correct: 1,
      points: 10
    },
    {
      id: 8,
      question: "DeepSeek在训练中使用了多少万亿个tokens？",
      options: ["10.8万亿", "14.8万亿", "18.8万亿", "22.8万亿"],
      correct: 1,
      points: 10
    },
    {
      id: 9,
      question: "DeepSeek-V3每个token大约激活多少参数？",
      options: ["37亿", "67亿", "137亿", "237亿"],
      correct: 0,
      points: 10
    },
    {
      id: 10,
      question: "DeepSeek使用的混合精度训练格式是？",
      options: ["FP16", "FP8", "BF16", "FP32"],
      correct: 1,
      points: 10
    },
    {
      id: 11,
      question: "DeepSeek-V3采用的MLA全称是什么？",
      options: ["Multi-Layer Attention", "Multi-head Latent Attention", "Multi-Linear Aggregation", "Multi-Modal Learning Architecture"],
      correct: 1,
      points: 15
    },
    {
      id: 12,
      question: "DeepSeek-V3在分布式训练中采用了多少路专家并行？",
      options: ["32路", "64路", "128路", "256路"],
      correct: 1,
      points: 15
    },
    {
      id: 13,
      question: "DeepSeek-R1主要采用了哪种强化学习技术？",
      options: ["PPO", "GRPO", "DQN", "A3C"],
      correct: 1,
      points: 15
    },
    {
      id: 14,
      question: "DeepSeek采用的RDMA通信协议主要用于什么？",
      options: ["数据压缩", "低延迟高带宽通信", "模型量化", "梯度裁剪"],
      correct: 1,
      points: 15
    },
    {
      id: 15,
      question: "DeepSeek-V3在千卡集群训练中实现的线性加速比是？",
      options: ["85%", "92%", "95%", "98%"],
      correct: 1,
      points: 15
    }
  ]
};

// 性能优化：用户数据存储优化
let users = new Map();
let leaderboard = [];
let gameTimer = null;

// 性能优化：批处理和缓存
let leaderboardCache = null;
let lastLeaderboardUpdate = 0;
const LEADERBOARD_CACHE_TTL = 2000; // 2秒缓存
let pendingUpdates = new Set();
let updateBatchTimer = null;

// 性能监控
let connectionCount = 0;
let maxConnections = 0;
let answerCount = 0;
let lastPerformanceLog = Date.now();

// 连接管理和限制
const MAX_CONNECTIONS = 600; // 设置最大连接数
const CONNECTION_RATE_LIMIT = 10; // 每秒最大新连接数
let recentConnections = [];

// 题目配置
const QUESTION_TIME_LIMIT = 10; // 每题10秒限时
const TOTAL_QUESTIONS = 15; // 总共15题

// 路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'quiz.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/leaderboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'leaderboard.html'));
});

app.get('/quiz/:roomId', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'quiz.html'));
});

// QR码生成API
app.post('/api/generate-qr', async (req, res) => {
  try {
    const roomId = uuid.v4().slice(0, 8);
    const quizUrl = `${req.protocol}://${req.get('host')}/quiz/${roomId}`;

    const qrCodeDataURL = await qrcode.toDataURL(quizUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    res.json({
      success: true,
      roomId,
      url: quizUrl,
      qrCode: qrCodeDataURL
    });
  } catch (error) {
    console.error('生成QR码失败:', error);
    res.status(500).json({
      success: false,
      message: '生成QR码失败'
    });
  }
});

// 获取当前排行榜
app.get('/api/leaderboard', (req, res) => {
  res.json(getCachedLeaderboard().slice(0, 10));
});

// 性能优化：排行榜缓存系统
function getCachedLeaderboard() {
  const now = Date.now();
  if (leaderboardCache && (now - lastLeaderboardUpdate) < LEADERBOARD_CACHE_TTL) {
    return leaderboardCache;
  }

  leaderboardCache = calculateLeaderboard();
  lastLeaderboardUpdate = now;
  return leaderboardCache;
}

function calculateLeaderboard() {
  return Array.from(users.values())
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      const aTime = a.answers.reduce((sum, ans) => sum + ans.timeSpent, 0);
      const bTime = b.answers.reduce((sum, ans) => sum + ans.timeSpent, 0);
      return aTime - bTime;
    })
    .map((user, index) => ({
      rank: index + 1,
      name: user.name,
      studentId: user.studentId,
      score: user.score,
      totalAnswers: user.answers.length,
      correctAnswers: user.answers.filter(ans => ans.isCorrect).length,
      currentQuestion: user.currentQuestionIndex,
      totalQuestions: TOTAL_QUESTIONS
    }));
}

// 性能优化：批量更新系统
function scheduleLeaderboardUpdate() {
  if (updateBatchTimer) return;

  updateBatchTimer = setTimeout(() => {
    if (pendingUpdates.size > 0) {
      broadcastLeaderboardUpdate();
      pendingUpdates.clear();
    }
    updateBatchTimer = null;
  }, 500); // 500ms批处理
}

function broadcastLeaderboardUpdate() {
  const leaderboard = getCachedLeaderboard();
  io.emit('leaderboardUpdate', leaderboard.slice(0, 10));
}

// 连接速率限制
function checkConnectionRateLimit() {
  const now = Date.now();
  recentConnections = recentConnections.filter(time => now - time < 1000);
  return recentConnections.length < CONNECTION_RATE_LIMIT;
}

// 性能监控
function logPerformanceMetrics() {
  const now = Date.now();
  if (now - lastPerformanceLog > 30000) { // 每30秒记录一次
    console.log(`📊 性能统计: 连接数=${connectionCount}, 最大连接=${maxConnections}, 答题数=${answerCount}, 内存=${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
    lastPerformanceLog = now;
  }
}

// Socket.io连接处理
io.on('connection', (socket) => {
  // 连接数控制
  connectionCount++;
  maxConnections = Math.max(maxConnections, connectionCount);

  // 连接限制检查
  if (connectionCount > MAX_CONNECTIONS) {
    console.log(`⚠️ 连接数超限: ${connectionCount}/${MAX_CONNECTIONS}`);
    socket.emit('connectionLimited', { message: '服务器负载过高，请稍后重试' });
    socket.disconnect(true);
    connectionCount--;
    return;
  }

  // 连接速率限制
  if (!checkConnectionRateLimit()) {
    console.log('⚠️ 连接速率超限');
    socket.emit('rateLimited', { message: '连接过于频繁，请稍后重试' });
    socket.disconnect(true);
    connectionCount--;
    return;
  }

  recentConnections.push(Date.now());
  console.log(`🔗 用户连接: ${socket.id} (总连接数: ${connectionCount})`);

  logPerformanceMetrics();

  // 用户加入游戏
  socket.on('joinGame', (data) => {
    const { name, studentId, roomId } = data;

    // 验证姓名和学号
    if (!name || !studentId) {
      socket.emit('joinError', { message: '请填写完整的姓名和学号' });
      return;
    }

    if (name.trim().length < 2) {
      socket.emit('joinError', { message: '姓名至少需要2个字符' });
      return;
    }

    if (studentId.trim().length < 5) {
      socket.emit('joinError', { message: '学号格式不正确' });
      return;
    }

    // 检查学号是否已经存在
    const existingUserByStudentId = Array.from(users.values()).find(user => user.studentId === studentId.trim());
    if (existingUserByStudentId) {
      socket.emit('joinError', { message: '该学号已经参与游戏，不允许重复参与' });
      return;
    }

    // 检查姓名是否已经存在
    const existingUserByName = Array.from(users.values()).find(user => user.name === name.trim());
    if (existingUserByName) {
      socket.emit('joinError', { message: '该姓名已经参与游戏，不允许重复参与' });
      return;
    }

    const user = {
      id: socket.id,
      name: name.trim(),
      studentId: studentId.trim(),
      roomId,
      score: 0,
      answers: [],
      joinTime: new Date(),
      currentQuestionIndex: 0,
      questionTimer: null, // 个人计时器
      startTime: new Date()
    };

    users.set(socket.id, user);
    socket.join(roomId);

    socket.emit('joinSuccess', {
      user,
      gameState: {
        isActive: true,
        currentQuestion: 0,
        totalQuestions: TOTAL_QUESTIONS
      }
    });

    // 性能优化：减少广播频率
    io.emit('userJoined', user);
    pendingUpdates.add(socket.id);
    scheduleLeaderboardUpdate();

    console.log(`👤 用户 ${user.name}(${user.studentId}) 加入游戏`);

    // 立即开始第一题
    startUserQuestion(socket, user, 0);
  });

  // 开始游戏（管理员功能，用于重置所有用户）
  socket.on('startGame', () => {
    // 重置所有用户的答题状态
    users.forEach(user => {
      user.score = 0;
      user.answers = [];
      user.currentQuestionIndex = 0;
      if (user.questionTimer) {
        clearTimeout(user.questionTimer);
        user.questionTimer = null;
      }
    });

    // 清除缓存
    leaderboardCache = null;
    leaderboard = [];

    console.log('🎮 管理员重新开始游戏!');

    // 给所有用户重新发送第一题
    users.forEach((user, socketId) => {
      const userSocket = io.sockets.sockets.get(socketId);
      if (userSocket) {
        startUserQuestion(userSocket, user, 0);
      }
    });
  });

  // 提交答案
  socket.on('submitAnswer', (data) => {
    const user = users.get(socket.id);
    if (!user) return;

    const { questionId, answer, timeSpent } = data;
    const question = gameState.questions.find(q => q.id === questionId);

    if (!question) return;

    // 检查用户是否已经回答过这道题
    const hasAnswered = user.answers.some(ans => ans.questionId === questionId);
    if (hasAnswered) return;

    // 清除该用户的计时器
    if (user.questionTimer) {
      clearTimeout(user.questionTimer);
    }

    const isCorrect = answer === question.correct;
    let points = 0;

    if (isCorrect) {
      points = 10;
    } else {
      points = -15;
    }

    user.answers.push({
      questionId,
      answer,
      isCorrect,
      points,
      timeSpent: timeSpent || QUESTION_TIME_LIMIT
    });

    user.score += points;
    user.currentQuestionIndex++;
    answerCount++;

    socket.emit('answerResult', {
      isCorrect,
      points,
      correctAnswer: question.correct,
      totalScore: user.score
    });

    // 性能优化：批量更新排行榜
    pendingUpdates.add(socket.id);
    scheduleLeaderboardUpdate();

    // 通知管理员用户答题情况
    io.emit('userAnswered', {
      user: {
        name: user.name,
        studentId: user.studentId,
        score: user.score,
        currentQuestion: user.answers.length,
        totalQuestions: TOTAL_QUESTIONS
      },
      questionNumber: user.currentQuestionIndex,
      isCorrect,
      points
    });

    console.log(`📝 用户 ${user.name}(${user.studentId}) 答题: ${isCorrect ? '正确' : '错误'}, 得分: ${points}, 总分: ${user.score}`);

    // 检查用户是否完成所有题目
    if (user.currentQuestionIndex >= TOTAL_QUESTIONS) {
      socket.emit('userCompleted', {
        message: '您已完成所有题目！',
        finalScore: user.score,
        totalQuestions: TOTAL_QUESTIONS,
        correctAnswers: user.answers.filter(ans => ans.isCorrect).length
      });
      console.log(`🏁 用户 ${user.name}(${user.studentId}) 完成所有题目! 最终得分:${user.score}`);
    } else {
      // 1.5秒后发送下一题
      setTimeout(() => {
        startUserQuestion(socket, user, user.currentQuestionIndex);
      }, 1500);
    }
  });

  // 结束游戏
  socket.on('endGame', () => {
    endAllUsersGame();
  });

  // 重置游戏（管理员专用）
  socket.on('resetGame', () => {
    resetGame();
  });

  // 用户断开连接
  socket.on('disconnect', () => {
    connectionCount--;
    const user = users.get(socket.id);
    if (user) {
      // 清除用户的个人计时器
      if (user.questionTimer) {
        clearTimeout(user.questionTimer);
      }
      users.delete(socket.id);
      pendingUpdates.add(socket.id);
      scheduleLeaderboardUpdate();
      console.log(`👋 用户 ${user.name}(${user.studentId}) 离开游戏 (剩余连接: ${connectionCount})`);
    }
  });
});

// 为用户开始一道题目
function startUserQuestion(socket, user, questionIndex) {
  if (questionIndex >= TOTAL_QUESTIONS) return;

  const question = gameState.questions[questionIndex];
  if (!question) return;

  // 清除之前的计时器
  if (user.questionTimer) {
    clearTimeout(user.questionTimer);
  }

  // 发送题目给用户
  socket.emit('nextQuestion', {
    question: question,
    questionNumber: questionIndex + 1,
    totalQuestions: TOTAL_QUESTIONS,
    timeLimit: QUESTION_TIME_LIMIT
  });

  console.log(`📚 用户 ${user.name} 开始第${questionIndex + 1}题: ${question.question}`);

  // 设置10秒计时器，时间到自动算错误
  user.questionTimer = setTimeout(() => {
    // 检查用户是否已经答过这道题
    const hasAnswered = user.answers.some(ans => ans.questionId === question.id);
    if (!hasAnswered) {
      // 自动提交错误答案
      user.answers.push({
        questionId: question.id,
        answer: -1, // 表示未答题
        isCorrect: false,
        points: -15,
        timeSpent: QUESTION_TIME_LIMIT
      });

      user.score -= 15;
      user.currentQuestionIndex++;
      answerCount++;

      socket.emit('timeUp', {
        isCorrect: false,
        points: -15,
        correctAnswer: question.correct,
        totalScore: user.score,
        message: '时间到！自动算作错误'
      });

      // 更新排行榜
      pendingUpdates.add(socket.id);
      scheduleLeaderboardUpdate();

      // 通知管理员
      io.emit('userAnswered', {
        user: {
          name: user.name,
          studentId: user.studentId,
          score: user.score,
          currentQuestion: user.answers.length,
          totalQuestions: TOTAL_QUESTIONS
        },
        questionNumber: user.currentQuestionIndex,
        isCorrect: false,
        points: -15
      });

      console.log(`⏰ 用户 ${user.name}(${user.studentId}) 超时未答题，自动扣15分，总分: ${user.score}`);

      // 检查是否完成所有题目
      if (user.currentQuestionIndex >= TOTAL_QUESTIONS) {
        socket.emit('userCompleted', {
          message: '您已完成所有题目！',
          finalScore: user.score,
          totalQuestions: TOTAL_QUESTIONS,
          correctAnswers: user.answers.filter(ans => ans.isCorrect).length
        });
        console.log(`🏁 用户 ${user.name}(${user.studentId}) 完成所有题目! 最终得分:${user.score}`);
      } else {
        // 1.5秒后继续下一题
        setTimeout(() => {
          startUserQuestion(socket, user, user.currentQuestionIndex);
        }, 1500);
      }
    }
    user.questionTimer = null;
  }, QUESTION_TIME_LIMIT * 1000); // 10秒倒计时
}

// 结束所有用户的游戏
function endAllUsersGame() {
  const finalLeaderboard = getCachedLeaderboard();

  io.emit('gameEnded', {
    finalLeaderboard: finalLeaderboard.slice(0, 10)
  });

  console.log('🏁 管理员结束游戏!');
  console.log(`📊 最终统计: 参与用户=${users.size}, 总答题数=${answerCount}`);
}

// 重置游戏（管理员专用）
function resetGame() {
  // 清除所有用户的计时器
  users.forEach(user => {
    if (user.questionTimer) {
      clearTimeout(user.questionTimer);
    }
  });

  // 清除所有数据和缓存
  users.clear();
  leaderboard = [];
  leaderboardCache = null;
  pendingUpdates.clear();
  answerCount = 0;

  // 通知所有客户端游戏已重置
  io.emit('gameReset', {
    message: '游戏已重置，请重新加入'
  });

  console.log('🔄 游戏已重置，所有用户数据已清除');
}

// 性能监控和自动垃圾回收
setInterval(() => {
  if (global.gc) {
    global.gc();
  }
  logPerformanceMetrics();
}, 60000); // 每分钟一次

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 服务器运行在端口 ${PORT}`);
  console.log(`📱 访问 http://localhost:${PORT} 查看首页`);
  console.log(`⚙️  访问 http://localhost:${PORT}/admin 查看管理后台`);
  console.log(`🏆 访问 http://localhost:${PORT}/leaderboard 查看排行榜`);
  console.log(`🔧 游戏配置: 15道题目, 每题${QUESTION_TIME_LIMIT}秒限时, 用户加入即开始答题`);
}); 