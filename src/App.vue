<template>
  <div class="app">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="logo">
        <div class="logo-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="url(#logo-gradient)" />
            <path d="M9 9L12 6L15 9L12 12L9 9Z" fill="white" />
            <path d="M15 15L12 18L9 15L12 12L15 15Z" fill="white" />
            <circle cx="12" cy="12" r="2" fill="white" />
            <defs>
              <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#6366f1" />
                <stop offset="100%" stop-color="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span>DevToolkit</span>
      </div>
      <ul class="nav-links">
        <li><a href="#" :class="{ active: currentPage === 'home' }" @click="currentPage = 'home'">首页</a></li>
        <li><a href="#" :class="{ active: currentPage === 'toolkit' }" @click="currentPage = 'toolkit'">工具集</a></li>
        <li><a href="#" :class="{ active: currentPage === 'attribute' }" @click="currentPage = 'attribute'">属性生成</a></li>
        <li><a href="#" :class="{ active: currentPage === 'about' }" @click="currentPage = 'about'">关于</a></li>
      </ul>
      <div class="nav-actions">
        <div class="theme-switcher">
          <button v-for="theme in themes" :key="theme.value"
            :class="['theme-btn', theme.value, { active: currentTheme === theme.value }]" :title="theme.name"
            @click="setTheme(theme.value)">
          </button>
        </div>
        <a href="https://github.com/tenderness-yang/toolkit-vue3" target="_blank" class="github-btn">
          <span class="github-icon">📦</span>
        </a>
      </div>
    </nav>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 首页 -->
      <div v-if="currentPage === 'home'" class="container">
        <!-- Hero 区域 -->
        <section class="hero" :style="{ animation: 'slideIn 0.6s ease' }">
          <h1 class="gradient-text">🚀 开发者的高效工具箱</h1>
          <p class="hero-desc">一站式在线工具平台，包含文本处理、代码格式化、数据转换等 {{ totalTools }}+ 实用工具，让开发更高效</p>
          <div class="search-box">
            <input v-model="searchQuery" type="text" placeholder="搜索工具，例如：JSON 格式化、Base64 编码..."
              @keyup.enter="goToToolkit" />
            <span class="search-icon">🔍</span>
          </div>
          <div class="hero-actions">
            <el-button type="primary" size="large" @click="currentPage = 'toolkit'">
              探索所有工具
            </el-button>
            <el-button size="large" @click="scrollToFeatures">
              查看功能
            </el-button>
          </div>
        </section>
        <!-- 热门工具预览 -->
        <section class="preview-section">
          <div class="section-header">
            <h2 class="section-title">🔥 热门工具</h2>
            <el-button type="text" @click="currentPage = 'toolkit'">查看全部 →</el-button>
          </div>
          <div class="preview-tools">
            <div v-for="tool in featuredTools" :key="tool.name" class="preview-tool" @click="openTool(tool)">
              <div class="tool-icon">{{ tool.icon }}</div>
              <h3>{{ tool.name }}</h3>
              <p>{{ tool.description }}</p>
            </div>
          </div>
        </section>
        <!-- 特色功能 -->
        <section class="features-section" ref="featuresSection">
          <h2 class="section-title">✨ 核心功能</h2>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">🎨</div>
              <h3>多主题支持</h3>
              <p>浅色、深色、蓝色、绿色四种主题，一键切换，保护眼睛</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🔍</div>
              <h3>智能搜索</h3>
              <p>快速查找工具，支持名称、描述、标签多维度搜索</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📱</div>
              <h3>响应式设计</h3>
              <p>完美适配桌面、平板、手机等各种设备</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">⚡</div>
              <h3>实时处理</h3>
              <p>所有工具都支持实时输入输出，无需刷新页面</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">💾</div>
              <h3>本地存储</h3>
              <p>收藏夹、最近使用、主题偏好自动保存</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🔧</div>
              <h3>完整工具</h3>
              <p>24+ 个实用工具，覆盖开发日常需求</p>
            </div>
          </div>
        </section>



        <!-- 统计信息 -->
        <section class="stats-section">
          <div class="stats-grid">
            <div class="stat-card">
              <span class="stat-icon">🛠️</span>
              <span class="stat-value">{{ totalTools }}+</span>
              <span class="stat-label">工具数量</span>
            </div>
            <div class="stat-card">
              <span class="stat-icon">👥</span>
              <span class="stat-value">10K+</span>
              <span class="stat-label">日活用户</span>
            </div>
            <div class="stat-card">
              <span class="stat-icon">⚡</span>
              <span class="stat-value">500K+</span>
              <span class="stat-label">日调用次数</span>
            </div>
            <div class="stat-card">
              <span class="stat-icon">💯</span>
              <span class="stat-value">99.9%</span>
              <span class="stat-label">可用性</span>
            </div>
          </div>
        </section>
      </div>

      <!-- 工具集页面 -->
      <div v-else-if="currentPage === 'toolkit'" class="toolkit-page">
        <ToolkitHome />
      </div>

      <!-- 属性代码生成页面 -->
      <div v-else-if="currentPage === 'attribute'" class="attribute-page">
        <AttributeGenerator />
      </div>

      <!-- 关于页面 -->
      <div v-else-if="currentPage === 'about'" class="container">
        <div class="about-page">
          <h1 class="section-title">👨‍💻 关于 DevToolkit</h1>

          <div class="about-content">
            <div class="about-card">
              <h2>项目介绍</h2>
              <p>DevToolkit 是一个为开发者设计的在线工具集合，旨在提供高效、便捷的开发辅助工具。我们致力于帮助开发者提高工作效率，减少重复劳动。</p>
            </div>

            <div class="about-card">
              <h2>技术栈</h2>
              <div class="tech-stack">
                <el-tag type="primary">Vue 3</el-tag>
                <el-tag type="success">Element Plus</el-tag>
                <el-tag type="warning">Vite</el-tag>
                <el-tag type="danger">JavaScript</el-tag>
                <el-tag type="info">CSS3</el-tag>
              </div>
            </div>

            <div class="about-card">
              <h2>联系我们</h2>
              <p>如有问题或建议，欢迎通过以下方式联系我们：</p>
              <div class="contact-info">
                <p>🐙 GitHub: https://github.com/tenderness-yang</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-links">
        <a href="#" @click="currentPage = 'home'">首页</a>
        <a href="#" @click="currentPage = 'toolkit'">工具集</a>
        <a href="#" @click="currentPage = 'attribute'">属性生成</a>
        <a href="#" @click="currentPage = 'about'">关于</a>
      </div>
      <p class="copyright">© 2026 DevToolkit. Made with ❤️ for developers</p>
    </footer>

    <!-- 工具模态框 -->
    <ToolModal :visible="modalVisible" :tool="selectedTool" @close="closeModal" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import ToolModal from './components/ToolModal.vue'
import ToolkitHome from './components/ToolkitHome.vue'
import ToolModalFull from './components/ToolModalFull.vue'
import AttributeGenerator from './components/AttributeGenerator.vue'

// 主题配置
const themes = [
  { value: 'light', name: '浅色主题' },
  { value: 'dark', name: '深色主题' },
  { value: 'blue', name: '蓝色主题' },
  { value: 'green', name: '绿色主题' }
]

const currentTheme = ref('light')

// 设置主题
const setTheme = (theme) => {
  currentTheme.value = theme
  localStorage.setItem('theme', theme)
}

// 分类
const categories = ['全部工具', '文本处理', '开发工具', '数据转换', '编码解码', '图像处理', '网络工具']
const activeCategory = ref('全部工具')

// 搜索
const searchQuery = ref('')

// 工具数据
const tools = ref([
  { name: 'JSON 格式化', icon: '📝', description: '美化、压缩、验证 JSON 数据，支持语法高亮和错误提示', tags: ['JSON', '格式化'], category: '文本处理', usage: 1234 },
  { name: 'Base64 编解码', icon: '🔄', description: '快速进行 Base64 编码和解码，支持文本和文件', tags: ['Base64', '编码'], category: '编码解码', usage: 856 },
  { name: '哈希生成器', icon: '🔐', description: '生成 MD5、SHA1、SHA256 等多种哈希值', tags: ['MD5', 'SHA'], category: '开发工具', usage: 987 },
  { name: 'XML 格式化', icon: '📄', description: '美化和压缩 XML 文档，支持 XPath 查询', tags: ['XML', '格式化'], category: '文本处理', usage: 456 },
  { name: 'URL 编解码', icon: '🌐', description: '对 URL 进行编码和解码，处理特殊字符', tags: ['URL', '编码'], category: '编码解码', usage: 678 },
  { name: '颜色转换器', icon: '🎨', description: 'HEX、RGB、HSL 颜色格式互相转换', tags: ['颜色', '转换'], category: '数据转换', usage: 543 },
  { name: 'Cron 表达式生成', icon: '📊', description: '可视化生成和解析 Cron 表达式', tags: ['Cron', '定时'], category: '开发工具', usage: 321 },
  { name: 'UUID 生成器', icon: '🔑', description: '生成 UUID v1/v4 版本，支持批量生成', tags: ['UUID', '生成'], category: '开发工具', usage: 765 },
  { name: '二维码生成', icon: '📱', description: '将文本、URL 等生成二维码图片', tags: ['QR', '图片'], category: '图像处理', usage: 892 },
  { name: '单位转换器', icon: '📏', description: '长度、重量、温度等多种单位转换', tags: ['单位', '转换'], category: '数据转换', usage: 234 },
  { name: '正则表达式测试', icon: '🔍', description: '在线测试和调试正则表达式', tags: ['Regex', '测试'], category: '开发工具', usage: 567 },
  { name: 'Markdown 预览', icon: '📋', description: '实时预览 Markdown 渲染效果', tags: ['Markdown', '预览'], category: '文本处理', usage: 445 },
  { name: 'YAML 格式化', icon: '📜', description: '美化和验证 YAML 配置文件', tags: ['YAML', '格式化'], category: '文本处理', usage: 389 },
  { name: 'JWT 解码', icon: '🎫', description: '解析和验证 JWT Token', tags: ['JWT', 'Token'], category: '编码解码', usage: 612 },
  { name: '时间戳转换', icon: '⏰', description: 'Unix 时间戳与日期互相转换', tags: ['时间', '转换'], category: '数据转换', usage: 723 },
  { name: 'CSS 压缩', icon: '🎯', description: '压缩 CSS 代码，移除空格和注释', tags: ['CSS', '压缩'], category: '开发工具', usage: 298 }
])

const totalTools = computed(() => tools.value.length)

// 特色工具
const featuredTools = computed(() => {
  return [...tools.value]
    .sort((a, b) => b.usage - a.usage)
    .slice(0, 3)
})

// 过滤工具
const filteredTools = computed(() => {
  let result = tools.value

  // 分类过滤
  if (activeCategory.value !== '全部工具') {
    result = result.filter(tool => tool.category === activeCategory.value)
  }

  // 搜索过滤
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(tool =>
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  return result
})

// 当前页面
const currentPage = ref('home')

// 工具模态框
const modalVisible = ref(false)
const selectedTool = ref(null)

// 打开工具
const openTool = (tool) => {
  selectedTool.value = tool
  modalVisible.value = true
}

// 关闭工具
const closeModal = () => {
  modalVisible.value = false
  selectedTool.value = null
}

// 跳转到工具集页面
const goToToolkit = () => {
  if (searchQuery.value.trim()) {
    currentPage.value = 'toolkit'
    // 这里可以传递搜索词到工具集页面
  } else {
    currentPage.value = 'toolkit'
  }
}

// 滚动到特色功能
const scrollToFeatures = () => {
  const featuresSection = document.querySelector('.features-section')
  if (featuresSection) {
    featuresSection.scrollIntoView({ behavior: 'smooth' })
  }
}

// 恢复保存的主题
onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'light'
  currentTheme.value = savedTheme
  document.documentElement.setAttribute('data-theme', savedTheme)
})

// 监听主题变化，同步到 html 元素
watch(currentTheme, (newTheme) => {
  document.documentElement.setAttribute('data-theme', newTheme)
})
</script>

<style>
:root {
  /* 浅色主题 */
  --bg-primary: #f8fafc;
  --bg-secondary: #ffffff;
  --bg-tertiary: #f1f5f9;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --text-tertiary: #94a3b8;
  --border-color: #e2e8f0;
  --accent-primary: #6366f1;
  --accent-secondary: #8b5cf6;
  --accent-gradient: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-tertiary: #334155;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-tertiary: #64748b;
  --border-color: #334155;
  --accent-primary: #818cf8;
  --accent-secondary: #a78bfa;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
}

[data-theme="blue"] {
  --bg-primary: #f0f9ff;
  --bg-secondary: #ffffff;
  --bg-tertiary: #e0f2fe;
  --text-primary: #0c4a6e;
  --text-secondary: #0369a1;
  --text-tertiary: #0ea5e9;
  --border-color: #bae6fd;
  --accent-primary: #0284c7;
  --accent-secondary: #06b6d4;
  --accent-gradient: linear-gradient(135deg, #0284c7 0%, #06b6d4 50%, #14b8a6 100%);
}

[data-theme="green"] {
  --bg-primary: #f0fdf4;
  --bg-secondary: #ffffff;
  --bg-tertiary: #dcfce7;
  --text-primary: #166534;
  --text-secondary: #15803d;
  --text-tertiary: #22c55e;
  --border-color: #bbf7d0;
  --accent-primary: #16a34a;
  --accent-secondary: #22c55e;
  --accent-gradient: linear-gradient(135deg, #16a34a 0%, #22c55e 50%, #84cc16 100%);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
}

.app {
  min-height: 100vh;
  transition: all 0.3s ease;
}

/* 动画 */
@keyframes float {

  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-10px);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

/* 列表过渡动画 */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

/* 导航栏 */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: var(--accent-gradient);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.nav-links {
  display: flex;
  gap: 30px;
  list-style: none;
}

.nav-links a {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
  position: relative;
  padding: 8px 0;
}

.nav-links a:hover,
.nav-links a.active {
  color: var(--accent-primary);
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--accent-gradient);
  transition: width 0.3s;
}

.nav-links a:hover::after,
.nav-links a.active::after {
  width: 100%;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

/* 主题切换器 */
.theme-switcher {
  display: flex;
  gap: 8px;
  background: var(--bg-tertiary);
  padding: 5px;
  border-radius: 10px;
}

.theme-btn {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s;
}

.theme-btn:hover {
  transform: scale(1.1);
}

.theme-btn.active {
  border-color: var(--accent-primary);
}

.theme-btn.light {
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
}

.theme-btn.dark {
  background: linear-gradient(135deg, #1e293b, #0f172a);
}

.theme-btn.blue {
  background: linear-gradient(135deg, #e0f2fe, #0284c7);
}

.theme-btn.green {
  background: linear-gradient(135deg, #dcfce7, #16a34a);
}

.github-btn {
  width: 40px;
  height: 40px;
  background: var(--bg-tertiary);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.3s;
}

.github-btn:hover {
  background: var(--accent-gradient);
}

.github-icon {
  font-size: 20px;
}

/* 主容器 */
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 100px 40px 40px;
}

/* Hero 区域 */
.hero {
  text-align: center;
  padding: 60px 0;
}

.gradient-text {
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 16px;
  background: var(--accent-gradient);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient 3s ease infinite;
}

.hero-desc {
  font-size: 18px;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto 30px;
}

.search-box {
  max-width: 600px;
  margin: 0 auto;
  position: relative;
}

.search-box input {
  width: 100%;
  padding: 16px 50px 16px 24px;
  font-size: 16px;
  border: 2px solid var(--border-color);
  border-radius: 16px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  transition: all 0.3s;
  font-family: inherit;
}

.search-box input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.search-icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
}

/* 分类标签 */
.categories {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 40px 0;
  flex-wrap: wrap;
}

.category-btn {
  padding: 10px 20px;
  border: 2px solid var(--border-color);
  border-radius: 25px;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;
}

.category-btn:hover {
  border-color: var(--accent-primary);
  color: var(--accent-primary);
}

.category-btn.active {
  background: var(--accent-gradient);
  color: white;
  border-color: transparent;
}

/* 工具卡片网格 */
.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 40px;
}

.tool-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 24px;
  transition: all 0.3s;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.tool-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--accent-gradient);
  transform: scaleX(0);
  transition: transform 0.3s;
}

.tool-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-xl);
}

.tool-card:hover::before {
  transform: scaleX(1);
}

.tool-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-bottom: 16px;
  background: var(--accent-gradient);
}

.tool-card h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.tool-card p {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.tool-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tool-tag {
  padding: 4px 10px;
  background: var(--bg-tertiary);
  border-radius: 6px;
  font-size: 12px;
  color: var(--text-tertiary);
  font-family: 'JetBrains Mono', monospace;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 64px;
  display: block;
  margin-bottom: 16px;
}

.empty-state p {
  font-size: 18px;
  color: var(--text-secondary);
}

/* 特色工具展示 */
.featured-section {
  margin-top: 80px;
  padding: 40px;
  background: var(--bg-secondary);
  border-radius: 24px;
  border: 1px solid var(--border-color);
}

.featured-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.featured-header h2 {
  font-size: 28px;
  font-weight: 700;
}

.view-all-btn {
  padding: 10px 20px;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;
}

.view-all-btn:hover {
  border-color: var(--accent-primary);
  color: var(--accent-primary);
}

.featured-tools {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.featured-tool {
  background: var(--bg-tertiary);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s;
  cursor: pointer;
}

.featured-tool:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-md);
}

.featured-tool .icon {
  font-size: 48px;
  margin-bottom: 12px;
  animation: float 3s ease-in-out infinite;
}

.featured-tool h4 {
  font-size: 16px;
  margin-bottom: 8px;
}

.featured-tool p {
  font-size: 13px;
  color: var(--text-secondary);
}

/* 统计信息 */
.stats-section {
  margin-top: 60px;
  padding: 40px;
  background: var(--accent-gradient);
  border-radius: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.stat-card {
  text-align: center;
  color: white;
}

.stat-icon {
  font-size: 32px;
  display: block;
  margin-bottom: 12px;
  animation: float 3s ease-in-out infinite;
}

.stat-value {
  font-size: 36px;
  font-weight: 800;
  display: block;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
}

/* 新页面样式 */
.main-content {
  min-height: calc(100vh - 130px);
  /* 减去导航栏和页脚高度 */
}

.toolkit-page {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.attribute-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Hero 区域按钮 */
.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 24px;
}

/* 特色功能区域 */
.features-section {
  margin: 80px 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 30px;
}

.feature-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
  border-color: var(--accent-primary);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.feature-card h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--text-primary);
}

.feature-card p {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* 预览工具区域 */
.preview-section {
  margin: 80px 0;
}

.preview-tools {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.preview-tool {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.preview-tool:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: var(--accent-primary);
}

.preview-tool .tool-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background: var(--accent-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin: 0 auto 16px;
}

.preview-tool h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.preview-tool p {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.4;
}

/* 关于页面 */
.about-page {
  padding: 40px 0;
}

.about-content {
  display: grid;
  gap: 30px;
  margin-top: 30px;
}

.about-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 30px;
}

.about-card h2 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--text-primary);
}

.about-card p {
  font-size: 16px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.tech-stack {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 16px;
}

.contact-info {
  margin-top: 16px;
}

.contact-info p {
  margin-bottom: 8px;
  font-size: 16px;
}

/* 通用样式 */
.section-title {
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 16px;
  color: var(--text-primary);
}

.section-desc {
  font-size: 18px;
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

/* 页脚 */
.footer {
  margin-top: 80px;
  padding: 40px;
  border-top: 1px solid var(--border-color);
  text-align: center;
  color: var(--text-secondary);
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 20px;
}

.footer-links a {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: var(--accent-primary);
}

.copyright {
  font-size: 14px;
}

/* Element Plus 深色主题适配 */
:deep(.el-input__wrapper) {
  background: var(--bg-primary) !important;
  border-color: var(--border-color) !important;
  box-shadow: 0 0 0 1px var(--border-color) inset !important;
}

:deep(.el-input__inner) {
  color: var(--text-primary) !important;
}

:deep(.el-textarea__inner) {
  background: var(--bg-primary) !important;
  border-color: var(--border-color) !important;
  color: var(--text-primary) !important;
}

:deep(.el-select__wrapper) {
  background: var(--bg-primary) !important;
  border-color: var(--border-color) !important;
  box-shadow: 0 0 0 1px var(--border-color) inset !important;
}

:deep(.el-select-dropdown) {
  background: var(--bg-secondary) !important;
  border-color: var(--border-color) !important;
}

:deep(.el-select-dropdown__item) {
  color: var(--text-primary) !important;
}

:deep(.el-select-dropdown__item.hover),
:deep(.el-select-dropdown__item:hover) {
  background: var(--bg-tertiary) !important;
}

:deep(.el-select-dropdown__item.selected) {
  background: var(--accent-primary) !important;
  color: white !important;
}

:deep(.el-button) {
  --el-button-bg-color: var(--bg-tertiary) !important;
  --el-button-border-color: var(--border-color) !important;
  --el-button-text-color: var(--text-secondary) !important;
  --el-button-hover-text-color: var(--accent-primary) !important;
  --el-button-hover-border-color: var(--accent-primary) !important;
}

:deep(.el-button--primary) {
  --el-button-bg-color: var(--accent-primary) !important;
  --el-button-border-color: var(--accent-primary) !important;
  --el-button-text-color: white !important;
  --el-button-hover-bg-color: var(--accent-secondary) !important;
  --el-button-hover-border-color: var(--accent-secondary) !important;
}

:deep(.el-alert) {
  --el-alert-bg-color: var(--bg-tertiary) !important;
  --el-alert-border-color: var(--border-color) !important;
  --el-alert-text-color: var(--text-primary) !important;
}

:deep(.el-alert--info) {
  --el-alert-bg-color: rgba(99, 102, 241, 0.1) !important;
  --el-alert-border-color: rgba(99, 102, 241, 0.2) !important;
}

:deep(.el-alert--success) {
  --el-alert-bg-color: rgba(34, 197, 94, 0.1) !important;
  --el-alert-border-color: rgba(34, 197, 94, 0.2) !important;
}

:deep(.el-alert--error) {
  --el-alert-bg-color: rgba(239, 68, 68, 0.1) !important;
  --el-alert-border-color: rgba(239, 68, 68, 0.2) !important;
}

:deep(.el-tag) {
  --el-tag-bg-color: var(--bg-tertiary) !important;
  --el-tag-border-color: var(--border-color) !important;
  --el-tag-text-color: var(--text-secondary) !important;
}

:deep(.el-tag--info) {
  --el-tag-bg-color: var(--bg-tertiary) !important;
  --el-tag-border-color: var(--border-color) !important;
  --el-tag-text-color: var(--text-secondary) !important;
}

:deep(.el-tag--success) {
  --el-tag-bg-color: rgba(34, 197, 94, 0.1) !important;
  --el-tag-border-color: rgba(34, 197, 94, 0.2) !important;
  --el-tag-text-color: rgb(34, 197, 94) !important;
}

/* 滚动条美化 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-tertiary);
}

::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-tertiary);
}

/* 响应式 */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 0 20px;
  }

  .nav-links {
    display: none;
  }

  .container {
    padding: 90px 20px 20px;
  }

  .gradient-text {
    font-size: 32px;
  }

  .featured-tools {
    grid-template-columns: 1fr;
  }

  .tools-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
