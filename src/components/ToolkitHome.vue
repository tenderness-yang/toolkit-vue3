<template>
  <div class="toolkit-home">
    <!-- 搜索和筛选区域 -->
    <div class="toolkit-header">
      <div class="search-container">
        <el-input
          v-model="searchQuery"
          placeholder="搜索工具，如：JSON格式化、Base64编码..."
          size="large"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <div class="quick-filters">
          <el-tag
            v-for="filter in quickFilters"
            :key="filter.label"
            :type="activeFilter === filter.value ? 'primary' : 'info'"
            class="filter-tag"
            @click="setActiveFilter(filter.value)"
          >
            {{ filter.label }}
          </el-tag>
        </div>
      </div>
    </div>

    <!-- 工具分类 -->
    <div class="categories-section">
      <h2 class="section-title">工具分类</h2>
      <div class="categories-grid">
        <div
          v-for="category in categories"
          :key="category.id"
          :class="['category-card', { active: activeCategory === category.id }]"
          @click="setActiveCategory(category.id)"
        >
          <div class="category-icon" :style="{ backgroundColor: category.color }">
            <span>{{ category.icon }}</span>
          </div>
          <div class="category-info">
            <h3>{{ category.name }}</h3>
            <p>{{ category.count }} 个工具</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 工具网格 -->
    <div class="tools-section">
      <div class="section-header">
        <h2 class="section-title">所有工具</h2>
        <div class="view-options">
          <el-select v-model="sortBy" placeholder="排序方式" size="small">
            <el-option label="按热度" value="popular" />
            <el-option label="按名称" value="name" />
            <el-option label="按最近使用" value="recent" />
          </el-select>
          <el-switch
            v-model="showFavorites"
            active-text="仅收藏"
            inactive-text="全部"
          />
        </div>
      </div>

      <div class="tools-grid">
        <div
          v-for="tool in filteredTools"
          :key="tool.id"
          class="tool-card"
          @click="openTool(tool)"
        >
          <div class="tool-header">
            <div class="tool-icon-small" :style="{ backgroundColor: tool.color }">
              <span>{{ tool.icon }}</span>
            </div>
            <div class="tool-actions">
              <el-button
                circle
                size="small"
                :type="tool.isFavorite ? 'warning' : 'default'"
                @click.stop="toggleFavorite(tool)"
              >
                <el-icon><Star /></el-icon>
              </el-button>
            </div>
          </div>
          <div class="tool-content">
            <h3>{{ tool.name }}</h3>
            <p>{{ tool.description }}</p>
            <div class="tool-tags">
              <el-tag
                v-for="tag in tool.tags"
                :key="tag"
                size="small"
                type="info"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredTools.length === 0" class="empty-state">
        <el-empty description="没有找到相关工具" />
      </div>
    </div>

    <!-- 最近使用 -->
    <div v-if="recentTools.length > 0" class="recent-section">
      <h2 class="section-title">⏰ 最近使用</h2>
      <div class="recent-tools">
        <el-tag
          v-for="tool in recentTools"
          :key="tool.id"
          class="recent-tag"
          @click="openTool(tool)"
        >
          <span class="recent-icon">{{ tool.icon }}</span>
          {{ tool.name }}
        </el-tag>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="stats-section">
      <el-row :gutter="20">
        <el-col :xs="12" :sm="6" v-for="stat in stats" :key="stat.label">
          <div class="stat-card">
            <div class="stat-icon" :style="{ backgroundColor: stat.color }">
              <span>{{ stat.icon }}</span>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 工具模态框 -->
    <ToolModalFull
      :visible="modalVisible"
      :tool="selectedTool"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Search, Star, Clock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import ToolModalFull from './ToolModalFull.vue'

// 搜索和筛选
const searchQuery = ref('')
const activeFilter = ref('all')
const activeCategory = ref('all')
const sortBy = ref('popular')
const showFavorites = ref(false)

// 工具模态框
const modalVisible = ref(false)
const selectedTool = ref(null)

const quickFilters = [
  { label: '全部', value: 'all' },
  { label: '常用', value: 'common' },
  { label: '收藏', value: 'favorites' },
  { label: '免费', value: 'free' },
  { label: '在线', value: 'online' }
]

// 分类数据
const categories = ref([
  { id: 'text', name: '文本处理', icon: '📝', color: '#6366f1', count: 8 },
  { id: 'encode', name: '编码解码', icon: '🔐', color: '#8b5cf6', count: 6 },
  { id: 'dev', name: '开发工具', icon: '💻', color: '#10b981', count: 12 },
  { id: 'image', name: '图片处理', icon: '🖼️', color: '#f59e0b', count: 5 },
  { id: 'data', name: '数据转换', icon: '📊', color: '#3b82f6', count: 7 },
  { id: 'network', name: '网络工具', icon: '🌐', color: '#ef4444', count: 4 },
  { id: 'other', name: '其他工具', icon: '🔧', color: '#8b5cf6', count: 3 },
  { id: 'ai', name: 'AI工具', icon: '🤖', color: '#ec4899', count: 2 }
])

// 工具数据 - 与 App.vue 中的工具对应
const tools = ref([
  // 文本处理
  { id: 1, name: 'JSON格式化', icon: '📝', description: '美化、压缩、验证JSON数据', category: 'text', tags: ['JSON', '格式化'], color: '#6366f1', stars: 4.9, usage: '1.2k', isFavorite: true, isNew: false },
  { id: 2, name: 'XML格式化', icon: '📄', description: '美化和压缩XML文档', category: 'text', tags: ['XML', '格式化'], color: '#8b5cf6', stars: 4.7, usage: '856', isFavorite: false, isNew: false },
  { id: 3, name: 'Markdown预览', icon: '📋', description: '实时预览Markdown渲染效果', category: 'text', tags: ['Markdown', '预览'], color: '#10b981', stars: 4.8, usage: '723', isFavorite: true, isNew: true },
  { id: 4, name: '文本对比', icon: '📖', description: '对比两个文本的差异', category: 'text', tags: ['文本', '对比'], color: '#3b82f6', stars: 4.6, usage: '512', isFavorite: false, isNew: false },
  { id: 5, name: '正则测试', icon: '🔍', description: '在线测试和调试正则表达式', category: 'text', tags: ['正则', '测试'], color: '#f59e0b', stars: 4.9, usage: '1.1k', isFavorite: true, isNew: false },
  
  // 编码解码
  { id: 6, name: 'Base64编解码', icon: '🔄', description: 'Base64编码和解码', category: 'encode', tags: ['Base64', '编码'], color: '#6366f1', stars: 4.8, usage: '2.3k', isFavorite: true, isNew: false },
  { id: 7, name: 'URL编解码', icon: '🌐', description: 'URL编码和解码', category: 'encode', tags: ['URL', '编码'], color: '#8b5cf6', stars: 4.7, usage: '1.8k', isFavorite: false, isNew: false },
  { id: 8, name: 'JWT解码', icon: '🎫', description: '解析和验证JWT Token', category: 'encode', tags: ['JWT', 'Token'], color: '#10b981', stars: 4.9, usage: '945', isFavorite: true, isNew: true },
  { id: 9, name: '哈希生成', icon: '🔐', description: '生成多种哈希值', category: 'encode', tags: ['哈希', '加密'], color: '#3b82f6', stars: 4.8, usage: '1.5k', isFavorite: false, isNew: false },
  
  // 开发工具
  { id: 10, name: '时间戳转换', icon: '⏰', description: '时间戳与日期互相转换', category: 'dev', tags: ['时间', '转换'], color: '#f59e0b', stars: 4.9, usage: '3.2k', isFavorite: true, isNew: false },
  { id: 11, name: 'Cron表达式', icon: '📊', description: '可视化生成Cron表达式', category: 'dev', tags: ['Cron', '定时'], color: '#ef4444', stars: 4.7, usage: '876', isFavorite: false, isNew: false },
  { id: 12, name: 'UUID生成', icon: '🔑', description: '生成UUID v1/v4版本', category: 'dev', tags: ['UUID', '生成'], color: '#8b5cf6', stars: 4.8, usage: '1.4k', isFavorite: true, isNew: false },
  { id: 13, name: '二维码生成', icon: '📱', description: '生成二维码图片', category: 'dev', tags: ['QR', '图片'], color: '#10b981', stars: 4.6, usage: '689', isFavorite: false, isNew: true },
  { id: 14, name: '单位转换', icon: '📏', description: '多种单位转换', category: 'dev', tags: ['单位', '转换'], color: '#3b82f6', stars: 4.7, usage: '543', isFavorite: false, isNew: false },
  
  // 图片处理
  { id: 15, name: '图片压缩', icon: '🖼️', description: '压缩图片大小', category: 'image', tags: ['图片', '压缩'], color: '#ec4899', stars: 4.8, usage: '2.1k', isFavorite: true, isNew: false },
  { id: 16, name: '图片转Base64', icon: '🔄', description: '将图片转换为Base64', category: 'image', tags: ['图片', 'Base64'], color: '#f59e0b', stars: 4.7, usage: '987', isFavorite: false, isNew: false },
  
  // 数据转换
  { id: 17, name: 'CSV转JSON', icon: '📊', description: 'CSV数据转换为JSON', category: 'data', tags: ['CSV', 'JSON'], color: '#6366f1', stars: 4.6, usage: '432', isFavorite: false, isNew: true },
  { id: 18, name: 'YAML格式化', icon: '📜', description: '美化和验证YAML', category: 'data', tags: ['YAML', '格式化'], color: '#8b5cf6', stars: 4.7, usage: '321', isFavorite: false, isNew: false },
  
  // 网络工具
  { id: 19, name: 'IP查询', icon: '🌐', description: '查询IP地址信息', category: 'network', tags: ['IP', '查询'], color: '#10b981', stars: 4.8, usage: '2.5k', isFavorite: true, isNew: false },
  { id: 20, name: 'Ping测试', icon: '📡', description: '测试网络连通性', category: 'network', tags: ['Ping', '网络'], color: '#3b82f6', stars: 4.6, usage: '654', isFavorite: false, isNew: false },
  
  // 其他工具
  { id: 21, name: '颜色转换', icon: '🎨', description: '颜色格式转换', category: 'other', tags: ['颜色', '转换'], color: '#f59e0b', stars: 4.7, usage: '789', isFavorite: false, isNew: false },
  { id: 22, name: '密码生成', icon: '🔒', description: '生成安全密码', category: 'other', tags: ['密码', '安全'], color: '#ef4444', stars: 4.9, usage: '1.8k', isFavorite: true, isNew: true },
  
  // AI工具
  { id: 23, name: 'AI代码助手', icon: '🤖', description: 'AI辅助编写代码', category: 'ai', tags: ['AI', '代码'], color: '#ec4899', stars: 4.9, usage: '3.5k', isFavorite: true, isNew: true },
  { id: 24, name: '文本摘要', icon: '📝', description: 'AI生成文本摘要', category: 'ai', tags: ['AI', '文本'], color: '#8b5cf6', stars: 4.8, usage: '2.1k', isFavorite: false, isNew: false }
])

// 最近使用工具
const recentTools = ref([])

// 统计信息
const stats = ref([
  { icon: '🛠️', label: '工具总数', value: '24+', color: '#6366f1' },
  { icon: '👥', label: '日活用户', value: '10K+', color: '#8b5cf6' },
  { icon: '⚡', label: '日调用次数', value: '500K+', color: '#10b981' },
  { icon: '💯', label: '可用性', value: '99.9%', color: '#f59e0b' }
])

// 过滤工具
const filteredTools = computed(() => {
  let result = [...tools.value]

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(tool => 
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  // 分类过滤
  if (activeCategory.value !== 'all') {
    result = result.filter(tool => tool.category === activeCategory.value)
  }

  // 收藏过滤
  if (showFavorites.value) {
    result = result.filter(tool => tool.isFavorite)
  }

  // 排序
  if (sortBy.value === 'popular') {
    result.sort((a, b) => b.usage - a.usage)
  } else if (sortBy.value === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortBy.value === 'recent') {
    // 按最近使用排序（这里简化处理）
    result.sort((a, b) => b.stars - a.stars)
  }

  return result
})

// 方法
const setActiveFilter = (filter) => {
  activeFilter.value = filter
}

const setActiveCategory = (category) => {
  activeCategory.value = category
}

const toggleFavorite = (tool) => {
  tool.isFavorite = !tool.isFavorite
  ElMessage.success(tool.isFavorite ? '已添加到收藏' : '已取消收藏')
  
  // 保存到本地存储
  saveFavorites()
}

const openTool = (tool) => {
  console.log('打开工具:', tool.name)

  // 添加到最近使用
  addToRecent(tool)

  // 触发打开工具模态框
  selectedTool.value = tool
  modalVisible.value = true
}

const closeModal = () => {
  modalVisible.value = false
  selectedTool.value = null
}

const viewAllTools = () => {
  activeCategory.value = 'all'
  searchQuery.value = ''
}

const addToRecent = (tool) => {
  // 移除已存在的
  recentTools.value = recentTools.value.filter(t => t.id !== tool.id)
  
  // 添加到开头
  recentTools.value.unshift({
    id: tool.id,
    name: tool.name,
    icon: tool.icon
  })
  
  // 只保留最近5个
  if (recentTools.value.length > 5) {
    recentTools.value = recentTools.value.slice(0, 5)
  }
  
  // 保存到本地存储
  localStorage.setItem('recentTools', JSON.stringify(recentTools.value))
}

const saveFavorites = () => {
  const favorites = tools.value.filter(tool => tool.isFavorite).map(tool => tool.id)
  localStorage.setItem('favorites', JSON.stringify(favorites))
}

// 初始化
onMounted(() => {
  // 加载最近使用
  const savedRecent = localStorage.getItem('recentTools')
  if (savedRecent) {
    try {
      recentTools.value = JSON.parse(savedRecent)
    } catch (e) {
      console.error('加载最近使用失败:', e)
    }
  }
  
  // 加载收藏
  const savedFavorites = localStorage.getItem('favorites')
  if (savedFavorites) {
    try {
      const favoriteIds = JSON.parse(savedFavorites)
      tools.value.forEach(tool => {
        tool.isFavorite = favoriteIds.includes(tool.id)
      })
    } catch (e) {
      console.error('加载收藏失败:', e)
    }
  }
})
</script>

<style scoped>
.toolkit-home {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 头部搜索 */
.toolkit-header {
  margin-bottom: 40px;
}

.search-container {
  max-width: 800px;
  margin: 0 auto;
}

.quick-filters {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-tag {
  cursor: pointer;
  transition: all 0.3s;
}

.filter-tag:hover {
  transform: translateY(-2px);
}

/* 分类区域 */
.categories-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--text-primary);
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.category-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  transition: all 0.3s;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
  border-color: var(--accent-primary);
}

.category-card.active {
  border-color: var(--accent-primary);
  background: var(--accent-gradient);
  color: white;
}

.category-card.active .category-info h3,
.category-card.active .category-info p {
  color: white;
}

.category-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.category-info h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--text-primary);
}

.category-info p {
  font-size: 14px;
  color: var(--text-secondary);
}

/* 工具网格 */
.tools-section {
  margin-bottom: 40px;
}

.view-options {
  display: flex;
  gap: 16px;
  align-items: center;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.tool-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.tool-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: var(--accent-primary);
}

.tool-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.tool-icon-small {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.tool-content h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.tool-content p {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 12px;
  line-height: 1.4;
}

.tool-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

/* 最近使用 */
.recent-section {
  margin-bottom: 40px;
}

.recent-tools {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.recent-tag {
  cursor: pointer;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.recent-tag:hover {
  background: var(--accent-primary);
  color: white;
  transform: translateY(-2px);
}

.recent-icon {
  font-size: 16px;
}

/* 统计信息 */
.stats-section {
  margin-bottom: 40px;
}

.stat-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
}

/* 空状态 */
.empty-state {
  padding: 60px 20px;
  text-align: center;
}

/* 响应式 */
@media (max-width: 768px) {
  .toolkit-home {
    padding: 16px;
  }
  
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .featured-grid {
    grid-template-columns: 1fr;
  }
  
  .tools-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .view-options {
    width: 100%;
    justify-content: space-between;
  }
  
  .stat-card {
    margin-bottom: 16px;
  }
}

@media (max-width: 480px) {
  .categories-grid {
    grid-template-columns: 1fr;
  }
  
  .tools-grid {
    grid-template-columns: 1fr;
  }
  
  .quick-filters {
    justify-content: flex-start;
  }
}
</style>