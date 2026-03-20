<template>
  <div class="attribute-generator">
    <div class="tool-header">
      <h2><i class="bi bi-gear-fill"></i>996属性代码生成器</h2>
      <p class="tool-desc">游戏属性配置代码生成工具 - 支持 Excel 导入、拖拽排序、批量生成</p>
    </div>

    <!-- Excel 文件上传区域 -->
    <el-card class="upload-card mb-4">
      <template #header>
        <div class="card-header">
          <span><i class="bi bi-file-earmark-excel"></i>cfg_att_score.xls 配置文件</span>
        </div>
      </template>
      <el-upload drag :auto-upload="false" :on-change="handleFileChange" :show-file-list="true" accept=".xlsx,.xls">
        <el-icon class="el-icon--upload">
          <UploadFilled />
        </el-icon>
        <div class="el-upload__text">
          拖拽 Excel 文件到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            支持 .xlsx 和 .xls 格式，解析后自动填充属性类型
          </div>
        </template>
      </el-upload>
      <div v-if="fileInfo" class="file-info mt-3">
        <el-alert :title="`已加载：${fileInfo.name} (${fileInfo.size})`" type="success" :closable="false" show-icon />
      </div>
    </el-card>

    <!-- 属性配置区域 -->
    <el-card class="attribute-card mb-4">
      <template #header>
        <div class="card-header">
          <span><i class="bi bi-list-ul"></i> 属性配置</span>
          <el-button type="success" size="small" @click="addAttributeRow">
            <el-icon>
              <Plus />
            </el-icon> 添加属性
          </el-button>
        </div>
      </template>

      <div class="attribute-rows">
        <div v-for="(row, index) in attributeRows" :key="row.id"
          :class="['attribute-row', { 'dragging': row.dragging }]" :data-id="row.id">
          <div class="row-header">
            <div class="drag-handle" :title="'拖拽排序'">
              <el-icon>
                <Grid />
              </el-icon>
            </div>
            <span class="row-number">{{ index + 1 }}</span>
          </div>

          <div class="row-content">
            <div class="row-grid">
              <!-- 属性 ID -->
              <div class="form-item" style="grid-column: span 1;">
                <label class="form-label">
                  <el-icon>
                    <PriceTag />
                  </el-icon> 属性 ID
                  <span v-if="row.attrId" class="selected-type">
                    <el-tag size="small" :type="getSelectedTypeTagType(row)" class="selected-type-tag">
                      {{ getSelectedTypeLabel(row) }}
                    </el-tag>
                  </span>
                </label>
                <el-select v-model="row.attrId" placeholder="请选择属性 ID" filterable allow-clear class="w-100"
                  @change="onAttrIdChange(row)">
                  <el-option v-for="attr in attributeOptions" :key="attr.value" :label="attr.label" :value="attr.value">
                    <span style="flex: 1">{{ attr.label }}</span>
                    <el-tag size="small"
                      :type="attr.typeId === 3 ? 'success' : attr.typeId === 2 ? 'warning' : 'primary'">
                      {{ attr.typeLabel }}
                    </el-tag>
                  </el-option>
                </el-select>
                <div v-if="row.duplicate" class="duplicate-warning">
                  <el-icon>
                    <Warning />
                  </el-icon> 此属性已被选择
                </div>
              </div>

              <!-- 数值 -->
              <div class="form-item">
                <label class="form-label">
                  <el-icon>
                    <Coin />
                  </el-icon> 配置数值
                </label>
                <el-input-number v-model="row.value" :min="0" placeholder="0" class="w-100" />
              </div>

              <!-- 固定增加 -->
              <div class="form-item">
                <label class="form-label">
                  <el-icon>
                    <CirclePlus />
                  </el-icon> 固定增加
                </label>
                <el-input-number v-model="row.fixedInc" :min="0" placeholder="0" class="w-100" />
              </div>

              <!-- 叠加增加 -->
              <div class="form-item">
                <label class="form-label">
                  <el-icon>
                    <TrendCharts />
                  </el-icon> 叠加增加
                </label>
                <el-input-number v-model="row.stackInc" :min="0" placeholder="0" class="w-100" />
              </div>
            </div>

            <div class="row-actions">
              <el-button-group>
                <el-button size="small" @click="moveRowUp(index)" :disabled="index === 0">
                  <el-icon>
                    <ArrowUp />
                  </el-icon>
                </el-button>
                <el-button size="small" @click="moveRowDown(index)" :disabled="index === attributeRows.length - 1">
                  <el-icon>
                    <ArrowDown />
                  </el-icon>
                </el-button>
              </el-button-group>
              <el-button type="danger" size="small" @click="removeAttributeRow(row.id)">
                <el-icon>
                  <Delete />
                </el-icon> 删除
              </el-button>
            </div>
          </div>
        </div>

        <div v-if="attributeRows.length === 0" class="empty-state">
          <el-empty description="暂无属性配置，请点击添加属性" />
        </div>
      </div>
    </el-card>

    <!-- 说明信息 -->
    <el-alert class="mb-4" title="生成说明：生成多条时请填写每级递增数量，生成单条可不填写递增数量" type="info" :closable="false" show-icon />

    <!-- 生成设置 -->
    <el-card class="settings-card mb-4">
      <template #header>
        <div class="card-header">
          <span><i class="bi bi-gear"></i> 生成设置</span>
        </div>
      </template>

      <el-row :gutter="20">
        <el-col :xs="24" :md="8">
          <div class="form-item">
            <label class="form-label">属性前缀</label>
            <el-switch v-model="settings.usePrefix" active-text="使用 3# 前缀" inactive-text="无前缀" />
          </div>
        </el-col>
        <el-col :xs="24" :md="8">
          <div class="form-item">
            <label class="form-label">生成条数</label>
            <el-input-number v-model="settings.generateCount" :min="1" :max="100" class="w-100" />
          </div>
        </el-col>
        <el-col :xs="24" :md="8">
          <el-button type="primary" size="large" class="w-100" @click="generateCode">
            <el-icon>
              <MagicStick />
            </el-icon> 生成代码
          </el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 代码输出区域 -->
    <el-card class="output-card">
      <template #header>
        <div class="card-header">
          <span><i class="bi bi-code-slash"></i> 生成结果</span>
          <el-button @click="copyToClipboard" :icon="CopyDocument">
            复制
          </el-button>
        </div>
      </template>

      <div class="code-output">
        <pre><code>{{ codeResult }}</code></pre>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  UploadFilled, Plus, Delete, ArrowUp, ArrowDown, Grid,
  PriceTag, Coin, CirclePlus, TrendCharts, Warning, CopyDocument, MagicStick,
  Document, Setting
} from '@element-plus/icons-vue'
import * as XLSX from 'xlsx'

// 属性数据配置 - 从 Excel 文件动态加载
const attributeOptions = ref([])

// 属性类型映射 (1=数值，2=万分比，3=百分比)
const attrTypeMap = {
  1: { label: '数值', suffix: '', multiplier: 1 },
  2: { label: '万分比', suffix: '‱', multiplier: 10000 },
  3: { label: '百分比', suffix: '%', multiplier: 100 }
}

// 属性行数据
const attributeRows = ref([])
let rowCounter = 0

// 文件信息
const fileInfo = ref(null)

// 生成设置
const settings = reactive({
  usePrefix: true,
  generateCount: 1
})

// 代码结果
const codeResult = ref('')

// 添加属性行
const addAttributeRow = () => {
  rowCounter++
  attributeRows.value.push({
    id: rowCounter,
    attrId: '',
    attrTypeId: 1, // 1=数值，2=万分比，3=百分比
    value: 0,
    fixedInc: 0,
    stackInc: 0,
    duplicate: false,
    dragging: false
  })

  // 初始化拖拽排序
  setTimeout(() => {
    initSortable()
  }, 100)
}

// 属性 ID 变化时更新相关信息
const onAttrIdChange = (row) => {
  if (row.attrId) {
    const attr = attributeOptions.value.find(opt => opt.value === row.attrId)
    if (attr) {
      row.attrTypeId = attr.typeId
    }
  }
  validateDuplicateAttribute(row.id)
}

// 获取选中属性的类型标签
const getSelectedTypeLabel = (row) => {
  if (row.attrTypeId) {
    return attrTypeMap[row.attrTypeId]?.label || '数值'
  }
  return ''
}

// 获取选中属性的类型标签样式
const getSelectedTypeTagType = (row) => {
  if (row.attrTypeId === 3) return 'success'
  if (row.attrTypeId === 2) return 'warning'
  return 'primary'
}

// 删除属性行
const removeAttributeRow = (rowId) => {
  const index = attributeRows.value.findIndex(row => row.id === rowId)
  if (index !== -1) {
    attributeRows.value.splice(index, 1)

    // 如果删除后没有行了，自动添加一行
    if (attributeRows.value.length === 0) {
      addAttributeRow()
    }

    // 重新校验所有属性
    validateAllAttributes()
  }
}

// 上移属性行
const moveRowUp = (index) => {
  if (index > 0) {
    const temp = attributeRows.value[index]
    attributeRows.value[index] = attributeRows.value[index - 1]
    attributeRows.value[index - 1] = temp
    ElMessage.success('已上移')
  }
}

// 下移属性行
const moveRowDown = (index) => {
  if (index < attributeRows.value.length - 1) {
    const temp = attributeRows.value[index]
    attributeRows.value[index] = attributeRows.value[index + 1]
    attributeRows.value[index + 1] = temp
    ElMessage.success('已下移')
  }
}

// 校验重复属性
const validateDuplicateAttribute = (rowId) => {
  validateAllAttributes()
}

// 校验所有属性行是否有重复
const validateAllAttributes = () => {
  const selectedValues = new Set()
  const duplicates = new Set()

  // 找出所有重复的值
  attributeRows.value.forEach(row => {
    if (row.attrId && row.attrId.trim() !== '') {
      if (selectedValues.has(row.attrId)) {
        duplicates.add(row.attrId)
      } else {
        selectedValues.add(row.attrId)
      }
    }
  })

  // 为每个属性行设置重复状态
  attributeRows.value.forEach(row => {
    if (row.attrId && row.attrId.trim() !== '' && duplicates.has(row.attrId)) {
      row.duplicate = true
    } else {
      row.duplicate = false
    }
  })

  // 检查是否有重复
  const hasDuplicate = duplicates.size > 0
  if (hasDuplicate) {
    ElMessage.warning('存在重复的属性 ID，请修改')
  }

  return !hasDuplicate
}

// 处理文件上传
const handleFileChange = (file) => {
  const rawFile = file.raw
  if (!rawFile) return

  fileInfo.value = {
    name: rawFile.name,
    size: formatFileSize(rawFile.size)
  }

  // 读取 Excel 文件
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: 'array' })

      // 读取第一个工作表
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })

      // 解析属性数据
      parseAttributeData(jsonData)
    } catch (error) {
      ElMessage.error(`文件解析失败：${error.message}`)
    }
  }
  reader.readAsArrayBuffer(rawFile)
}

// 解析属性数据 - 按照新规则
// Excel 格式：
// 第一列：属性 ID（以 // 或 /// 开头的跳过）
// 第二列：属性 ID 名称
// 第三列：忽略
// 第四列：数值类型 (1=数值，2=万分比，3=百分比)
// 第五列：属性描述
// 后续列：忽略
const parseAttributeData = (data) => {
  const newOptions = []

  data.forEach((row, index) => {
    // 跳过空行
    if (!row || row.length === 0) return

    // 跳过标题行（第一行）
    if (index === 0) return

    const attrId = row[0] ? String(row[0]).trim() : ''
    const attrName = row[1] ? String(row[1]).trim() : ''
    const attrTypeId = row[3] ? Number(row[3]) : 1 // 转换为数字
    const attrDesc = row[4] ? String(row[4]).trim() : ''

    // 跳过以 // 或 /// 开头的注释行
    if (attrId.startsWith('//') || attrId.startsWith('///')) {
      return
    }

    // 跳过空的属性 ID
    if (!attrId) return

    // 验证数值类型
    const validType = [1, 2, 3].includes(attrTypeId) ? attrTypeId : 1

    newOptions.push({
      value: attrId,
      label: `${attrId} - ${attrName}`,
      name: attrName,
      typeId: validType,
      desc: attrDesc,
      typeLabel: attrTypeMap[validType].label
    })
  })

  if (newOptions.length > 0) {
    attributeOptions.value = newOptions
    // 清空现有行并添加新行
    attributeRows.value = []
    addAttributeRow()
    ElMessage.success(`成功加载 ${newOptions.length} 个属性配置`)
  } else {
    ElMessage.warning('未在 Excel 中找到有效的属性配置')
  }
}

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]
}

// 初始化拖拽排序
const initSortable = () => {
  const container = document.querySelector('.attribute-rows')
  if (!container) return

  // 使用 SortableJS 进行拖拽排序
  if (window.Sortable) {
    const rows = container.querySelectorAll('.attribute-row')
    rows.forEach(row => {
      if (!row._sortable) {
        row._sortable = true
      }
    })
  }
}

// 生成代码
const generateCode = () => {
  // 校验是否有属性配置
  if (attributeRows.value.length === 0) {
    ElMessage.warning('请至少添加一个属性')
    return
  }

  // 校验是否有重复属性
  if (!validateAllAttributes()) {
    ElMessage.warning('存在重复的属性 ID，请修改后再试')
    return
  }

  // 校验是否所有属性都选择了 ID
  const hasEmptyType = attributeRows.value.some(row => !row.attrId)
  if (hasEmptyType) {
    ElMessage.warning('请为所有属性选择 ID')
    return
  }

  const lines = []
  const prefix = settings.usePrefix ? '3' : ''
  const count = settings.generateCount

  // 判断是否有递增设置
  const hasIncrement = attributeRows.value.some(row => row.fixedInc > 0 || row.stackInc > 0)

  for (let i = 0; i < count; i++) {
    const level = i + 1
    const attributes = []

    attributeRows.value.forEach(row => {
      let configValue = row.value

      // 计算递增
      if (hasIncrement) {
        configValue = row.value + (row.fixedInc * i) + (row.stackInc * i * (i + 1) / 2)
      }

      // 生成格式：属性前缀#属性 ID#根据属性类型计算后的数值
      let code = `${prefix}#${row.attrId}#${configValue}`

      // 不添加添加属性前缀
      if (prefix == '') {
        code = `${row.attrId}#${configValue}`
      }
      attributes.push(code)
    })

    // 用 | 连接多个属性
    lines.push(attributes.join('|'))
  }

  codeResult.value = lines.join('\n')
  ElMessage.success(`成功生成 ${count} 条属性代码`)
}

// 复制到剪贴板
const copyToClipboard = async () => {
  if (!codeResult.value || codeResult.value.trim() === '') {
    ElMessage.warning('没有可复制的内容')
    return
  }

  try {
    await navigator.clipboard.writeText(codeResult.value)
    ElMessage.success('已复制到剪贴板')
  } catch (error) {
    // 降级方案
    const textarea = document.createElement('textarea')
    textarea.value = codeResult.value
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    ElMessage.success('已复制到剪贴板')
  }
}

// 初始化
onMounted(() => {
  // 添加一行默认属性
  addAttributeRow()
})
</script>

<style scoped>
/* 深色主题适配 */
[data-theme="dark"] .attribute-generator {
  --ag-bg-primary: #0f172a;
  --ag-bg-secondary: #1e293b;
  --ag-bg-tertiary: #334155;
  --ag-text-primary: #f1f5f9;
  --ag-text-secondary: #94a3b8;
  --ag-border-color: #475569;
  --ag-accent-primary: #10b981;
  --ag-accent-secondary: #059669;
  --ag-success-bg: rgba(16, 185, 129, 0.1);
  --ag-warning-bg: rgba(245, 158, 11, 0.1);
  --ag-danger-bg: rgba(239, 68, 68, 0.1);
  --ag-card-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  --ag-card-hover-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
}

/* 浅色主题变量 */
.attribute-generator {
  --ag-bg-primary: #ffffff;
  --ag-bg-secondary: #f8fafc;
  --ag-bg-tertiary: #f1f5f9;
  --ag-text-primary: #1e293b;
  --ag-text-secondary: #64748b;
  --ag-border-color: #e2e8f0;
  --ag-accent-primary: #10b981;
  --ag-accent-secondary: #059669;
  --ag-success-bg: rgba(16, 185, 129, 0.05);
  --ag-warning-bg: rgba(245, 158, 11, 0.05);
  --ag-danger-bg: rgba(239, 68, 68, 0.05);
  --ag-card-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  --ag-card-hover-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.attribute-generator {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.tool-header {
  text-align: center;
  margin-top: 50px;
  margin-bottom: 40px;
  padding: 30px;
  background: linear-gradient(135deg, var(--ag-accent-primary) 0%, var(--ag-accent-secondary) 100%);
  border-radius: 16px;
  color: white;
  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
}

[data-theme="dark"] .tool-header {
  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.2);
}

.tool-header h2 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.tool-header h2 i {
  font-size: 36px;
}

.tool-desc {
  font-size: 16px;
  opacity: 0.9;
  font-weight: 300;
}

.mb-4 {
  margin-bottom: 24px;
}

.mb-3 {
  margin-bottom: 16px;
}

.mt-3 {
  margin-top: 16px;
}

.w-100 {
  width: 100%;
}

/* 卡片通用样式 */
:deep(.el-card) {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--ag-card-shadow);
  border: none;
  transition: all 0.3s ease;
  background: var(--ag-bg-secondary);
}

:deep(.el-card:hover) {
  box-shadow: var(--ag-card-hover-shadow);
  transform: translateY(-2px);
}

:deep(.el-card__header) {
  background: linear-gradient(135deg, var(--ag-success-bg) 0%, rgba(16, 185, 129, 0.08) 100%);
  border-bottom: 2px solid var(--ag-accent-primary);
  padding: 16px 20px;
}

[data-theme="dark"] :deep(.el-card__header) {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.08) 100%);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
  color: var(--ag-text-primary);
}

[data-theme="dark"] .card-header {
  color: #166534;
}

.card-header i {
  margin-right: 8px;
  font-size: 18px;
}

/* 上传区域 */
.upload-card :deep(.el-upload) {
  width: 100%;
}

.upload-card :deep(.el-upload-dragger) {
  border: 2px dashed var(--ag-accent-primary);
  border-radius: 12px;
  background: var(--ag-success-bg);
  transition: all 0.3s ease;
  padding: 40px 20px;
}

.upload-card :deep(.el-upload-dragger:hover) {
  border-color: var(--ag-accent-secondary);
  background: var(--ag-success-bg);
  transform: translateY(-2px);
}

.upload-card :deep(.el-icon--upload) {
  font-size: 48px;
  color: var(--ag-accent-primary);
  margin-bottom: 16px;
}

.upload-card :deep(.el-upload__text) {
  font-size: 14px;
  color: var(--ag-text-secondary);
}

.upload-card :deep(.el-upload__text em) {
  color: var(--ag-accent-primary);
  font-style: normal;
  font-weight: 500;
}

.upload-card :deep(.el-upload__tip) {
  font-size: 13px;
  color: var(--ag-text-secondary);
  margin-top: 12px;
}

.file-info {
  margin-top: 16px;
}

/* 属性配置区域 */
.attribute-rows {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, var(--ag-bg-tertiary) 0%, var(--ag-bg-secondary) 100%);
  border-radius: 12px;
}

[data-theme="dark"] .attribute-rows {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
}

.attribute-row {
  display: flex;
  gap: 16px;
  background: var(--ag-bg-secondary);
  border: 2px solid var(--ag-border-color);
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

[data-theme="dark"] .attribute-row {
  background: #1e293b;
  border-color: #475569;
}

.attribute-row::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, var(--ag-accent-primary) 0%, var(--ag-accent-secondary) 100%);
  transition: width 0.3s ease;
}

.attribute-row:hover {
  border-color: var(--ag-accent-primary);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.15);
  transform: translateX(4px);
}

[data-theme="dark"] .attribute-row:hover {
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.25);
}

.attribute-row:hover::before {
  width: 6px;
}

.attribute-row.dragging {
  opacity: 0.5;
  transform: rotate(2deg) scale(1.02);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
}

.row-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  min-width: 60px;
}

.drag-handle {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--ag-bg-tertiary) 0%, var(--ag-bg-secondary) 100%);
  border: 2px solid var(--ag-border-color);
  border-radius: 10px;
  cursor: move;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

[data-theme="dark"] .drag-handle {
  background: linear-gradient(135deg, #334155 0%, #1e293b 100%);
  border-color: #475569;
}

.drag-handle:hover {
  background: linear-gradient(135deg, var(--ag-accent-primary) 0%, var(--ag-accent-secondary) 100%);
  color: white;
  border-color: var(--ag-accent-primary);
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.drag-handle:active {
  transform: scale(0.95);
}

.drag-handle i {
  font-size: 20px;
}

.row-number {
  font-size: 13px;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, var(--ag-accent-primary) 0%, var(--ag-accent-secondary) 100%);
  padding: 6px 12px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.row-content {
  flex: 1;
  display: flex;
  gap: 16px;
  align-items: flex-end;
}

.row-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 2.5fr 1fr 1fr 1fr;
  gap: 12px;
  min-width: 700px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--ag-text-secondary);
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

[data-theme="dark"] .form-label {
  color: #94a3b8;
}

.form-label i {
  font-size: 16px;
  color: var(--ag-accent-primary);
}

.selected-type {
  margin-left: auto;
}

.selected-type-tag {
  font-size: 12px;
  padding: 2px 8px;
}

.type-tag {
  justify-content: center;
}

.duplicate-warning {
  font-size: 12px;
  color: #f59e0b;
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--ag-warning-bg);
  padding: 4px 8px;
  border-radius: 6px;
}

.row-actions {
  display: flex;
  gap: 8px;
  flex-direction: column;
  justify-content: flex-end;
}

.row-actions :deep(.el-button-group) {
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.row-actions :deep(.el-button-group .el-button) {
  border: none;
  background: linear-gradient(135deg, var(--ag-bg-tertiary) 0%, var(--ag-bg-secondary) 100%);
  color: var(--ag-text-secondary);
  transition: all 0.3s ease;
}

[data-theme="dark"] .row-actions :deep(.el-button-group .el-button) {
  background: linear-gradient(135deg, #334155 0%, #1e293b 100%);
  color: #94a3b8;
}

.row-actions :deep(.el-button-group .el-button:hover:not(:disabled)) {
  background: linear-gradient(135deg, var(--ag-accent-primary) 0%, var(--ag-accent-secondary) 100%);
  color: white;
  transform: translateY(-2px);
}

.row-actions :deep(.el-button-group .el-button:disabled) {
  opacity: 0.4;
  cursor: not-allowed;
}

.row-actions :deep(.el-button--danger) {
  background: linear-gradient(135deg, var(--ag-danger-bg) 0%, rgba(239, 68, 68, 0.2) 100%);
  color: #dc2626;
  border: none;
  transition: all 0.3s ease;
}

[data-theme="dark"] .row-actions :deep(.el-button--danger) {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.3) 100%);
  color: #fca5a5;
}

.row-actions :deep(.el-button--danger:hover) {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(220, 38, 38, 0.4);
}

.empty-state {
  padding: 60px 20px;
  text-align: center;
  background: linear-gradient(135deg, var(--ag-bg-tertiary) 0%, var(--ag-bg-secondary) 100%);
  border-radius: 12px;
  border: 2px dashed var(--ag-border-color);
}

[data-theme="dark"] .empty-state {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-color: #475569;
}

.empty-state :deep(.el-empty__description) {
  color: var(--ag-text-secondary);
}

/* 生成设置卡片 */
.settings-card :deep(.el-card__header) {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-bottom-color: #f59e0b;
}

[data-theme="dark"] .settings-card :deep(.el-card__header) {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%);
  border-bottom-color: #d97706;
}

.settings-card :deep(.card-header) {
  color: #92400e;
}

[data-theme="dark"] .settings-card :deep(.card-header) {
  color: #fde68a;
}

/* 输出区域卡片 */
.output-card :deep(.el-card__header) {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border-bottom-color: #475569;
}

[data-theme="dark"] .output-card :deep(.el-card__header) {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-bottom-color: #64748b;
}

.output-card :deep(.card-header) {
  color: white;
}

.output-card :deep(.card-header .el-button) {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
}

.output-card :deep(.card-header .el-button:hover) {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.code-output {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 20px;
  max-height: 500px;
  overflow-y: auto;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}

[data-theme="dark"] .code-output {
  background: linear-gradient(135deg, #0f172a 0%, #020617 100%);
  border-color: #1e293b;
}

.code-output pre {
  margin: 0;
}

.code-output code {
  color: #10b981;
  font-size: 14px;
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-all;
}

[data-theme="dark"] .code-output code {
  color: #34d399;
}

.code-output::-webkit-scrollbar {
  width: 8px;
}

.code-output::-webkit-scrollbar-track {
  background: #0f172a;
  border-radius: 4px;
}

.code-output::-webkit-scrollbar-thumb {
  background: #10b981;
  border-radius: 4px;
}

.code-output::-webkit-scrollbar-thumb:hover {
  background: #059669;
}

/* 响应式 */
@media (max-width: 1024px) {
  .attribute-generator {
    padding: 16px;
  }

  .row-grid {
    grid-template-columns: 1fr 1fr;
  }

  .tool-header h2 {
    font-size: 24px;
  }
}

@media (max-width: 768px) {
  .attribute-generator {
    padding: 12px;
  }

  .row-grid {
    grid-template-columns: 1fr;
  }

  .row-content {
    flex-direction: column;
  }

  .row-actions {
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
  }

  .row-header {
    flex-direction: row;
    align-items: center;
  }

  .tool-header {
    padding: 20px;
  }

  .tool-header h2 {
    font-size: 20px;
  }

  .tool-desc {
    font-size: 14px;
  }
}
</style>