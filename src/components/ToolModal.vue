<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">
          <span class="modal-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="url(#tool-gradient)" />
              <text x="12" y="16" text-anchor="middle" font-size="12" font-weight="bold" fill="white">
                {{ getToolInitial(tool.name) }}
              </text>
              <defs>
                <linearGradient id="tool-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#6366f1" />
                  <stop offset="100%" stop-color="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <h2>{{ tool.name }}</h2>
        </div>
        <el-button circle @click="close" :icon="Close" />
      </div>

      <div class="modal-body">
        <!-- JSON 格式化 -->
        <div v-if="tool.name === 'JSON 格式化'" class="tool-content">
          <div class="input-section">
            <div class="section-header">
              <label>输入 JSON</label>
              <div class="actions">
                <el-button type="primary" @click="formatJSON('format')" :icon="MagicStick">格式化</el-button>
                <el-button @click="formatJSON('minify')" :icon="Minus">压缩</el-button>
                <el-button @click="clearInput" :icon="Delete">清空</el-button>
              </div>
            </div>
            <el-input
              v-model="input"
              type="textarea"
              :rows="8"
              placeholder='{"name": "test", "value": 123}'
              resize="none"
            />
          </div>
          <div class="output-section">
            <div class="section-header">
              <label>输出结果</label>
              <el-button @click="copyOutput" :icon="CopyDocument">复制</el-button>
            </div>
            <el-input
              v-model="output"
              type="textarea"
              :rows="8"
              readonly
              :class="{ error: error }"
              resize="none"
            />
            <el-alert v-if="error" :title="error" type="error" :closable="false" />
          </div>
        </div>

        <!-- Base64 编解码 -->
        <div v-else-if="tool.name === 'Base64 编解码'" class="tool-content">
          <div class="input-section">
            <div class="section-header">
              <label>输入文本</label>
              <div class="actions">
                <el-button type="primary" @click="base64Encode" :icon="ArrowUp">编码</el-button>
                <el-button @click="base64Decode" :icon="ArrowDown">解码</el-button>
                <el-button @click="clearInput" :icon="Delete">清空</el-button>
              </div>
            </div>
            <el-input
              v-model="input"
              type="textarea"
              :rows="6"
              placeholder="输入要编码或解码的文本"
              resize="none"
            />
          </div>
          <div class="output-section">
            <div class="section-header">
              <label>输出结果</label>
              <el-button @click="copyOutput" :icon="CopyDocument">复制</el-button>
            </div>
            <el-input
              v-model="output"
              type="textarea"
              :rows="6"
              readonly
              :class="{ error: error }"
              resize="none"
            />
            <el-alert v-if="error" :title="error" type="error" :closable="false" />
          </div>
        </div>

        <!-- 哈希生成器 -->
        <div v-else-if="tool.name === '哈希生成器'" class="tool-content">
          <div class="input-section">
            <div class="section-header">
              <label>输入文本</label>
              <div class="actions">
                <el-select v-model="hashAlgorithm" placeholder="选择算法" style="width: 120px">
                  <el-option label="SHA-256" value="SHA-256" />
                  <el-option label="SHA-1" value="SHA-1" />
                  <el-option label="MD5" value="MD5" />
                </el-select>
                <el-button type="primary" @click="generateHash" :icon="Key">生成</el-button>
                <el-button @click="clearInput" :icon="Delete">清空</el-button>
              </div>
            </div>
            <el-input
              v-model="input"
              type="textarea"
              :rows="6"
              placeholder="输入要生成哈希的文本"
              resize="none"
            />
          </div>
          <div class="output-section">
            <div class="section-header">
              <label>哈希结果</label>
              <el-button @click="copyOutput" :icon="CopyDocument">复制</el-button>
            </div>
            <el-input
              v-model="output"
              type="textarea"
              :rows="6"
              readonly
              :class="{ error: error }"
              resize="none"
            />
            <el-alert v-if="error" :title="error" type="error" :closable="false" />
          </div>
        </div>

        <!-- XML 格式化 -->
        <div v-else-if="tool.name === 'XML 格式化'" class="tool-content">
          <div class="input-section">
            <div class="section-header">
              <label>输入 XML</label>
              <div class="actions">
                <el-button type="primary" @click="formatXML('format')" :icon="MagicStick">格式化</el-button>
                <el-button @click="formatXML('minify')" :icon="Minus">压缩</el-button>
                <el-button @click="clearInput" :icon="Delete">清空</el-button>
              </div>
            </div>
            <el-input
              v-model="input"
              type="textarea"
              :rows="8"
              placeholder="<root><item>test</item></root>"
              resize="none"
            />
          </div>
          <div class="output-section">
            <div class="section-header">
              <label>输出结果</label>
              <el-button @click="copyOutput" :icon="CopyDocument">复制</el-button>
            </div>
            <el-input
              v-model="output"
              type="textarea"
              :rows="8"
              readonly
              :class="{ error: error }"
              resize="none"
            />
            <el-alert v-if="error" :title="error" type="error" :closable="false" />
          </div>
        </div>

        <!-- URL 编解码 -->
        <div v-else-if="tool.name === 'URL 编解码'" class="tool-content">
          <div class="input-section">
            <div class="section-header">
              <label>输入 URL</label>
              <div class="actions">
                <el-button type="primary" @click="urlEncode" :icon="ArrowUp">编码</el-button>
                <el-button @click="urlDecode" :icon="ArrowDown">解码</el-button>
                <el-button @click="clearInput" :icon="Delete">清空</el-button>
              </div>
            </div>
            <el-input
              v-model="input"
              type="textarea"
              :rows="6"
              placeholder="https://example.com/?key=值"
              resize="none"
            />
          </div>
          <div class="output-section">
            <div class="section-header">
              <label>输出结果</label>
              <el-button @click="copyOutput" :icon="CopyDocument">复制</el-button>
            </div>
            <el-input
              v-model="output"
              type="textarea"
              :rows="6"
              readonly
              :class="{ error: error }"
              resize="none"
            />
            <el-alert v-if="error" :title="error" type="error" :closable="false" />
          </div>
        </div>

        <!-- 颜色转换器 -->
        <div v-else-if="tool.name === '颜色转换器'" class="tool-content color-tool">
          <div class="color-inputs">
            <div class="color-input-group">
              <label>HEX</label>
              <el-input v-model="hexColor" @input="fromHex" placeholder="6366f1">
                <template #prepend>#</template>
              </el-input>
            </div>
            <div class="color-input-group">
              <label>RGB</label>
              <div class="rgb-inputs">
                <el-input-number v-model="rgb.r" @change="fromRgb" :min="0" :max="255" placeholder="R" />
                <el-input-number v-model="rgb.g" @change="fromRgb" :min="0" :max="255" placeholder="G" />
                <el-input-number v-model="rgb.b" @change="fromRgb" :min="0" :max="255" placeholder="B" />
              </div>
            </div>
            <div class="color-input-group">
              <label>HSL</label>
              <div class="hsl-inputs">
                <el-input-number v-model="hsl.h" @change="fromHsl" :min="0" :max="360" placeholder="H" />
                <el-input-number v-model="hsl.s" @change="fromHsl" :min="0" :max="100" placeholder="S" />
                <el-input-number v-model="hsl.l" @change="fromHsl" :min="0" :max="100" placeholder="L" />
              </div>
            </div>
          </div>
          <div class="color-preview-section">
            <label>颜色预览</label>
            <div class="color-preview" :style="{ backgroundColor: previewColor }"></div>
            <div class="color-values">
              <el-tag type="info">HEX: #{{ hexColor || '6366f1' }}</el-tag>
              <el-tag type="info">RGB: {{ rgb.r || 99 }}, {{ rgb.g || 102 }}, {{ rgb.b || 241 }}</el-tag>
              <el-tag type="info">HSL: {{ hsl.h || 238 }}°, {{ hsl.s || 85 }}%, {{ hsl.l || 67 }}%</el-tag>
            </div>
          </div>
        </div>

        <!-- Cron 表达式生成 -->
        <div v-else-if="tool.name === 'Cron 表达式生成'" class="tool-content">
          <div class="cron-builder">
            <div class="cron-field">
              <label>分钟</label>
              <el-input v-model="cron.minute" placeholder="*" />
            </div>
            <div class="cron-field">
              <label>小时</label>
              <el-input v-model="cron.hour" placeholder="*" />
            </div>
            <div class="cron-field">
              <label>日期</label>
              <el-input v-model="cron.day" placeholder="*" />
            </div>
            <div class="cron-field">
              <label>月份</label>
              <el-input v-model="cron.month" placeholder="*" />
            </div>
            <div class="cron-field">
              <label>星期</label>
              <el-input v-model="cron.weekday" placeholder="*" />
            </div>
          </div>
          <div class="cron-result">
            <label>Cron 表达式</label>
            <div class="cron-expression">
              <el-input v-model="cronExpression" readonly>
                <template #append>
                  <el-button @click="copyCron" :icon="CopyDocument" />
                </template>
              </el-input>
            </div>
            <label>中文描述</label>
            <el-alert :title="cronDescription" type="info" :closable="false" />
          </div>
        </div>

        <!-- UUID 生成器 -->
        <div v-else-if="tool.name === 'UUID 生成器'" class="tool-content">
          <div class="uuid-options">
            <div class="option-group">
              <label>版本</label>
              <el-select v-model="uuidVersion" placeholder="选择版本">
                <el-option label="UUID v4" value="v4" />
                <el-option label="UUID v1" value="v1" />
              </el-select>
            </div>
            <div class="option-group">
              <label>数量</label>
              <el-input-number v-model="uuidCount" :min="1" :max="100" />
            </div>
            <el-button type="primary" @click="generateUUID" :icon="Key">生成 UUID</el-button>
          </div>
          <div class="output-section">
            <div class="section-header">
              <label>生成结果</label>
              <el-button @click="copyOutput" :icon="CopyDocument">复制</el-button>
            </div>
            <el-input
              v-model="output"
              type="textarea"
              :rows="8"
              readonly
              resize="none"
            />
          </div>
        </div>

        <!-- 二维码生成 -->
        <div v-else-if="tool.name === '二维码生成'" class="tool-content">
          <div class="qr-options">
            <div class="option-group">
              <label>内容</label>
              <el-input
                v-model="qrContent"
                type="textarea"
                :rows="4"
                placeholder="输入要生成二维码的内容"
                resize="none"
              />
            </div>
            <div class="option-group">
              <label>尺寸</label>
              <el-select v-model="qrSize" placeholder="选择尺寸">
                <el-option label="100x100" value="100" />
                <el-option label="200x200" value="200" />
                <el-option label="300x300" value="300" />
                <el-option label="400x400" value="400" />
              </el-select>
            </div>
            <el-button type="primary" @click="generateQR" :icon="Picture">生成二维码</el-button>
          </div>
          <div class="qr-result" v-if="qrUrl">
            <img :src="qrUrl" alt="QR Code" />
            <div class="qr-actions">
              <el-button type="primary" :icon="Download" @click="downloadQR">下载</el-button>
              <el-button @click="copyQRUrl" :icon="CopyDocument">复制链接</el-button>
            </div>
          </div>
        </div>

        <!-- 单位转换器 -->
        <div v-else-if="tool.name === '单位转换器'" class="tool-content">
          <div class="unit-options">
            <div class="option-group">
              <label>类型</label>
              <el-select v-model="unitType" placeholder="选择类型" @change="handleUnitTypeChange">
                <el-option label="长度" value="length" />
                <el-option label="重量" value="weight" />
                <el-option label="温度" value="temperature" />
              </el-select>
            </div>
            <div class="option-group">
              <label>数值</label>
              <el-input-number v-model="unitValue" placeholder="输入数值" :precision="6" />
            </div>
            <div class="unit-converter">
              <el-select v-model="unitFrom" placeholder="从">
                <el-option v-for="u in availableUnits" :key="u" :label="getUnitLabel(u)" :value="u" />
              </el-select>
              <span class="unit-equals">=</span>
              <el-select v-model="unitTo" placeholder="到">
                <el-option v-for="u in availableUnits" :key="u" :label="getUnitLabel(u)" :value="u" />
              </el-select>
            </div>
            <el-button type="primary" @click="convertUnit" :icon="Refresh">转换</el-button>
          </div>
          <div class="output-section">
            <label>结果</label>
            <el-alert :title="unitResult" type="success" :closable="false" />
          </div>
        </div>

        <!-- 正则表达式测试 -->
        <div v-else-if="tool.name === '正则表达式测试'" class="tool-content">
          <div class="regex-options">
            <div class="option-group">
              <label>正则表达式</label>
              <el-input v-model="regexPattern" placeholder="\d+" />
            </div>
            <div class="option-group">
              <label>标志</label>
              <el-select v-model="regexFlags" placeholder="选择标志">
                <el-option label="全局 (g)" value="g" />
                <el-option label="全局 + 忽略大小写 (gi)" value="gi" />
                <el-option label="无" value="" />
              </el-select>
            </div>
            <div class="option-group">
              <label>测试文本</label>
              <el-input
                v-model="regexText"
                type="textarea"
                :rows="6"
                placeholder="输入要测试的文本"
                resize="none"
              />
            </div>
            <el-button type="primary" @click="testRegex" :icon="Search">测试</el-button>
          </div>
          <div class="regex-result">
            <el-alert :title="`匹配结果：${regexMatchCount} 处`" type="info" :closable="false" />
            <div class="regex-matches" v-if="regexMatches.length > 0">
              <el-tag v-for="(match, i) in regexMatches" :key="i" type="success" class="match-tag">
                {{ match }}
              </el-tag>
            </div>
            <el-alert v-if="regexError" :title="regexError" type="error" :closable="false" />
          </div>
        </div>

        <!-- Markdown 预览 -->
        <div v-else-if="tool.name === 'Markdown 预览'" class="tool-content">
          <div class="markdown-editor">
            <div class="editor-pane">
              <label>Markdown</label>
              <el-input
                v-model="markdownInput"
                type="textarea"
                :rows="12"
                placeholder="# 标题&#10;&#10;**粗体** *斜体*&#10;&#10;- 列表项 1&#10;- 列表项 2"
                resize="none"
              />
            </div>
            <div class="preview-pane">
              <label>预览</label>
              <div class="markdown-preview" v-html="markdownOutput"></div>
            </div>
          </div>
        </div>

        <!-- YAML 格式化 -->
        <div v-else-if="tool.name === 'YAML 格式化'" class="tool-content">
          <div class="input-section">
            <div class="section-header">
              <label>输入 YAML</label>
              <div class="actions">
                <el-button type="primary" @click="formatYAML('format')" :icon="MagicStick">格式化</el-button>
                <el-button @click="formatYAML('minify')" :icon="Minus">压缩</el-button>
                <el-button @click="clearInput" :icon="Delete">清空</el-button>
              </div>
            </div>
            <el-input
              v-model="input"
              type="textarea"
              :rows="8"
              placeholder="name: test&#10;value: 123"
              resize="none"
            />
          </div>
          <div class="output-section">
            <div class="section-header">
              <label>输出结果</label>
              <el-button @click="copyOutput" :icon="CopyDocument">复制</el-button>
            </div>
            <el-input
              v-model="output"
              type="textarea"
              :rows="8"
              readonly
              :class="{ error: error }"
              resize="none"
            />
            <el-alert v-if="error" :title="error" type="error" :closable="false" />
          </div>
        </div>

        <!-- JWT 解码 -->
        <div v-else-if="tool.name === 'JWT 解码'" class="tool-content">
          <div class="input-section">
            <div class="section-header">
              <label>输入 JWT Token</label>
              <el-button type="primary" @click="decodeJWTToken" :icon="Key">解码</el-button>
            </div>
            <el-input
              v-model="input"
              type="textarea"
              :rows="4"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              resize="none"
            />
          </div>
          <div class="jwt-result" v-if="jwtResult">
            <div class="jwt-part">
              <label>Header</label>
              <pre>{{ JSON.stringify(jwtResult.header, null, 2) }}</pre>
            </div>
            <div class="jwt-part">
              <label>Payload</label>
              <pre>{{ JSON.stringify(jwtResult.payload, null, 2) }}</pre>
            </div>
            <div class="jwt-part">
              <label>Signature</label>
              <code>{{ jwtResult.signature }}</code>
            </div>
          </div>
        </div>

        <!-- 时间戳转换 -->
        <div v-else-if="tool.name === '时间戳转换'" class="tool-content">
          <div class="timestamp-options">
            <div class="option-group">
              <label>时间戳转日期</label>
              <div class="timestamp-input-group">
                <el-input v-model="timestampInput" placeholder="输入时间戳" style="flex: 1">
                  <template #append>
                    <el-button @click="getCurrentTimestamp" :icon="Clock">当前</el-button>
                  </template>
                </el-input>
                <el-button type="primary" @click="timestampToDate" :icon="Refresh">转换</el-button>
              </div>
              <el-alert v-if="timestampResult" :title="timestampResult" type="success" :closable="false" />
            </div>
            <div class="option-group">
              <label>日期转时间戳</label>
              <div class="timestamp-input-group">
                <el-date-picker
                  v-model="dateInput"
                  type="datetime"
                  placeholder="选择日期和时间"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  style="flex: 1"
                />
                <el-button type="primary" @click="dateToTimestamp" :icon="Refresh">转换</el-button>
              </div>
              <el-alert v-if="dateResult" :title="`时间戳：${dateResult}`" type="success" :closable="false" />
            </div>
          </div>
          <div class="timestamp-examples">
            <el-alert title="示例时间戳" type="info" :closable="false">
              <div class="example-timestamps">
                <el-tag v-for="ts in exampleTimestamps" :key="ts.value" @click="timestampInput = ts.value" class="timestamp-tag">
                  {{ ts.label }}
                </el-tag>
              </div>
            </el-alert>
          </div>
        </div>

        <!-- CSS 压缩 -->
        <div v-else-if="tool.name === 'CSS 压缩'" class="tool-content">
          <div class="input-section">
            <div class="section-header">
              <label>输入 CSS</label>
              <div class="actions">
                <el-button type="primary" @click="minifyCSS" :icon="Minus">压缩</el-button>
                <el-button @click="formatCSS" :icon="MagicStick">格式化</el-button>
                <el-button @click="clearInput" :icon="Delete">清空</el-button>
              </div>
            </div>
            <el-input
              v-model="input"
              type="textarea"
              :rows="8"
              placeholder=".container { width: 100%; }"
              resize="none"
            />
          </div>
          <div class="output-section">
            <div class="section-header">
              <label>输出结果</label>
              <el-button @click="copyOutput" :icon="CopyDocument">复制</el-button>
            </div>
            <el-input
              v-model="output"
              type="textarea"
              :rows="8"
              readonly
              :class="{ error: error }"
              resize="none"
            />
            <el-alert v-if="error" :title="error" type="error" :closable="false" />
          </div>
        </div>

        <!-- 默认内容 -->
        <div v-else class="tool-content">
          <el-empty description="工具实现中..." />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import * as tools from '../utils/tools'
import { ElMessage } from 'element-plus'
import {
  Close,
  MagicStick,
  Minus,
  Delete,
  CopyDocument,
  ArrowUp,
  ArrowDown,
  Key,
  Picture,
  Download,
  Refresh,
  Search,
  Clock
} from '@element-plus/icons-vue'

const props = defineProps({
  visible: Boolean,
  tool: Object
})

const emit = defineEmits(['close'])

// 获取工具名称的首字母
const getToolInitial = (toolName) => {
  if (!toolName) return '?'
  // 如果是中文，取第一个字符
  if (/[\u4e00-\u9fa5]/.test(toolName)) {
    return toolName.charAt(0)
  }
  // 如果是英文，取第一个单词的首字母
  return toolName.charAt(0).toUpperCase()
}

const close = () => {
  emit('close')
  resetState()
}

const resetState = () => {
  input.value = ''
  output.value = ''
  error.value = ''
}

const input = ref('')
const output = ref('')
const error = ref('')

// 通用复制功能
const copyOutput = async () => {
  if (output.value) {
    await navigator.clipboard.writeText(output.value)
    ElMessage.success('已复制到剪贴板')
  }
}

const clearInput = () => {
  input.value = ''
  output.value = ''
  error.value = ''
}

// JSON 格式化
const formatJSON = (action) => {
  const result = tools.formatJSON(input.value, action)
  if (result.success) {
    output.value = result.result
    error.value = ''
  } else {
    error.value = result.error
  }
}

// Base64
const base64Encode = () => {
  const result = tools.base64Encode(input.value)
  if (result.success) {
    output.value = result.result
    error.value = ''
  } else {
    error.value = result.error
  }
}

const base64Decode = () => {
  const result = tools.base64Decode(input.value)
  if (result.success) {
    output.value = result.result
    error.value = ''
  } else {
    error.value = result.error
  }
}

// 哈希生成
const hashAlgorithm = ref('SHA-256')
const generateHash = async () => {
  const result = await tools.generateHash(input.value, hashAlgorithm.value)
  if (result.success) {
    output.value = result.result
    error.value = ''
  } else {
    error.value = result.error
  }
}

// XML 格式化
const formatXML = (action) => {
  const result = tools.formatXML(input.value, action)
  if (result.success) {
    output.value = result.result
    error.value = ''
  } else {
    error.value = result.error
  }
}

// URL 编解码
const urlEncode = () => {
  const result = tools.urlEncode(input.value)
  if (result.success) {
    output.value = result.result
    error.value = ''
  } else {
    error.value = result.error
  }
}

const urlDecode = () => {
  const result = tools.urlDecode(input.value)
  if (result.success) {
    output.value = result.result
    error.value = ''
  } else {
    error.value = result.error
  }
}

// 颜色转换
const hexColor = ref('6366f1')
const rgb = ref({ r: 99, g: 102, b: 241 })
const hsl = ref({ h: 238, s: 85, l: 67 })
const previewColor = computed(() => `#${hexColor.value}`)

const fromHex = () => {
  const result = tools.hexToRgb(`#${hexColor.value}`)
  if (result.success) {
    rgb.value = result.result
    const hslResult = tools.rgbToHsl(result.result.r, result.result.g, result.result.b)
    hsl.value = hslResult.result
  }
}

const fromRgb = () => {
  const hex = tools.rgbToHex(rgb.value.r, rgb.value.g, rgb.value.b)
  hexColor.value = hex.replace('#', '')
  const hslResult = tools.rgbToHsl(rgb.value.r, rgb.value.g, rgb.value.b)
  hsl.value = hslResult.result
}

const fromHsl = () => {
  const rgbResult = tools.hslToRgb(hsl.value.h, hsl.value.s, hsl.value.l)
  rgb.value = rgbResult.result
  hexColor.value = tools.rgbToHex(rgbResult.result.r, rgbResult.result.g, rgbResult.result.b).replace('#', '')
}

// Cron 表达式
const cron = ref({ minute: '*', hour: '*', day: '*', month: '*', weekday: '*' })
const cronExpression = computed(() => {
  return `${cron.value.minute} ${cron.value.hour} ${cron.value.day} ${cron.value.month} ${cron.value.weekday}`
})
const cronDescription = computed(() => {
  const result = tools.parseCron(cronExpression.value)
  return result.success ? result.result : ''
})
const copyCron = async () => {
  await navigator.clipboard.writeText(cronExpression.value)
  ElMessage.success('已复制 Cron 表达式')
}

// UUID 生成
const uuidVersion = ref('v4')
const uuidCount = ref(1)
const generateUUID = () => {
  const result = tools.generateUUIDs(uuidCount.value, uuidVersion.value)
  output.value = result.result.join('\n')
}

// 二维码生成
const qrContent = ref('')
const qrSize = ref('200')
const qrUrl = ref('')
const generateQR = () => {
  if (qrContent.value) {
    const result = tools.generateQRCode(qrContent.value, qrSize.value)
    qrUrl.value = result.result
  }
}

const downloadQR = () => {
  if (qrUrl.value) {
    const link = document.createElement('a')
    link.href = qrUrl.value
    link.download = 'qrcode.png'
    link.click()
  }
}

const copyQRUrl = async () => {
  if (qrUrl.value) {
    await navigator.clipboard.writeText(qrUrl.value)
    ElMessage.success('已复制二维码链接')
  }
}

// 单位转换
const unitType = ref('length')
const unitValue = ref(1)
const unitFrom = ref('m')
const unitTo = ref('km')
const unitResult = ref('')

const availableUnits = computed(() => {
  if (unitType.value === 'length') return ['m', 'km', 'cm', 'mm', 'ft', 'in', 'mi']
  if (unitType.value === 'weight') return ['kg', 'g', 'mg', 'lb', 'oz']
  if (unitType.value === 'temperature') return ['c', 'f', 'k']
  return []
})

const getUnitLabel = (unit) => {
  const labels = {
    m: '米 (m)', km: '千米 (km)', cm: '厘米 (cm)', mm: '毫米 (mm)',
    ft: '英尺 (ft)', in: '英寸 (in)', mi: '英里 (mi)',
    kg: '千克 (kg)', g: '克 (g)', mg: '毫克 (mg)',
    lb: '磅 (lb)', oz: '盎司 (oz)',
    c: '摄氏度 (°C)', f: '华氏度 (°F)', k: '开尔文 (K)'
  }
  return labels[unit] || unit
}

const handleUnitTypeChange = () => {
  if (unitType.value === 'length') {
    unitFrom.value = 'm'
    unitTo.value = 'km'
  } else if (unitType.value === 'weight') {
    unitFrom.value = 'kg'
    unitTo.value = 'g'
  } else {
    unitFrom.value = 'c'
    unitTo.value = 'f'
  }
  unitResult.value = ''
}

const convertUnit = () => {
  const result = tools.convertUnit(unitValue.value, unitFrom.value, unitTo.value, unitType.value)
  if (result.success) {
    unitResult.value = `${unitValue.value} ${getUnitLabel(unitFrom.value)} = ${result.result} ${getUnitLabel(unitTo.value)}`
  } else {
    unitResult.value = result.error
  }
}

// 正则测试
const regexPattern = ref('')
const regexFlags = ref('g')
const regexText = ref('')
const regexMatches = ref([])
const regexMatchCount = ref(0)
const regexError = ref('')

const testRegex = () => {
  const result = tools.testRegex(regexPattern.value, regexText.value, regexFlags.value)
  if (result.success) {
    regexMatches.value = result.result.matches
    regexMatchCount.value = result.result.count
    regexError.value = ''
  } else {
    regexError.value = result.error
    regexMatches.value = []
    regexMatchCount.value = 0
  }
}

// Markdown 预览
const markdownInput = ref('')
const markdownOutput = computed(() => {
  const result = tools.markdownToHtml(markdownInput.value)
  return result.result
})

// YAML 格式化
const formatYAML = (action) => {
  const result = tools.formatYAML(input.value, action)
  if (result.success) {
    output.value = result.result
    error.value = ''
  } else {
    error.value = result.error
  }
}

// JWT 解码
const jwtResult = ref(null)
const decodeJWTToken = () => {
  const result = tools.decodeJWT(input.value)
  if (result.success) {
    jwtResult.value = result.result
    error.value = ''
  } else {
    error.value = result.error
    jwtResult.value = null
  }
}

// 时间戳转换
const timestampInput = ref('')
const timestampResult = ref('')
const dateInput = ref('')
const dateResult = ref('')
const exampleTimestamps = ref([
  { label: '当前时间戳', value: Math.floor(Date.now() / 1000).toString() },
  { label: '1小时前', value: Math.floor((Date.now() - 3600000) / 1000).toString() },
  { label: '1天前', value: Math.floor((Date.now() - 86400000) / 1000).toString() },
  { label: '2023-01-01', value: '1672531200' },
  { label: '2030-01-01', value: '1893456000' }
])

const getCurrentTimestamp = () => {
  timestampInput.value = Math.floor(Date.now() / 1000).toString()
}

const timestampToDate = () => {
  const result = tools.timestampToDate(timestampInput.value)
  if (result.success) {
    timestampResult.value = result.result
  } else {
    timestampResult.value = result.error
  }
}

const dateToTimestamp = () => {
  const result = tools.dateToTimestamp(dateInput.value)
  if (result.success) {
    dateResult.value = result.result.toString()
  } else {
    dateResult.value = result.error
  }
}

// CSS 压缩/格式化
const minifyCSS = () => {
  const result = tools.minifyCSS(input.value)
  if (result.success) {
    output.value = result.result
    error.value = ''
  } else {
    error.value = result.error
  }
}

const formatCSS = () => {
  const result = tools.formatCSS(input.value)
  if (result.success) {
    output.value = result.result
    error.value = ''
  } else {
    error.value = result.error
  }
}
</script>

<style scoped>
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

:deep(.el-input-number__decrease),
:deep(.el-input-number__increase) {
  background: var(--bg-tertiary) !important;
  border-color: var(--border-color) !important;
  color: var(--text-secondary) !important;
}

:deep(.el-input-number__decrease:hover),
:deep(.el-input-number__increase:hover) {
  background: var(--accent-primary) !important;
  color: white !important;
}

:deep(.el-select) {
  --el-select-input-focus-border-color: var(--accent-primary) !important;
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

:deep(.el-date-editor) {
  --el-date-editor-bg-color: var(--bg-primary) !important;
  --el-date-editor-border-color: var(--border-color) !important;
  --el-date-editor-text-color: var(--text-primary) !important;
}

:deep(.el-date-picker) {
  --el-date-picker-bg-color: var(--bg-secondary) !important;
  --el-date-picker-border-color: var(--border-color) !important;
  --el-date-picker-header-text-color: var(--text-primary) !important;
}

:deep(.el-date-table td) {
  color: var(--text-primary) !important;
}

:deep(.el-date-table td.current:not(.disabled) .el-date-table-cell__text) {
  background: var(--accent-primary) !important;
  color: white !important;
}

:deep(.el-date-table td.available:hover) {
  background: var(--bg-tertiary) !important;
}

:deep(.el-empty) {
  --el-empty-text-color: var(--text-secondary) !important;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.modal {
  background: var(--bg-secondary);
  border-radius: 20px;
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-xl);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--accent-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.modal-title h2 {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.tool-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-section,
.output-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header label {
  font-weight: 600;
  color: var(--text-primary);
}

.actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

/* 颜色工具 */
.color-tool {
  gap: 24px;
}

.color-inputs {
  display: grid;
  gap: 20px;
}

.color-input-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.rgb-inputs,
.hsl-inputs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.color-preview-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.color-preview {
  height: 100px;
  border-radius: 12px;
  border: 2px solid var(--border-color);
}

.color-values {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* Cron 构建器 */
.cron-builder {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.cron-field label {
  display: block;
  text-align: center;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-secondary);
  font-size: 13px;
}

.cron-result {
  background: var(--bg-tertiary);
  padding: 20px;
  border-radius: 12px;
}

.cron-expression {
  margin-bottom: 12px;
}

/* UUID 选项 */
.uuid-options,
.qr-options,
.unit-options,
.regex-options,
.timestamp-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: var(--bg-tertiary);
  padding: 20px;
  border-radius: 12px;
}

.option-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.unit-converter {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 12px;
  align-items: center;
}

.unit-equals {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: var(--accent-primary);
}

/* 正则匹配 */
.regex-matches {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.match-tag {
  cursor: pointer;
}

.match-tag:hover {
  opacity: 0.8;
}

/* Markdown 编辑器 */
.markdown-editor {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  min-height: 400px;
}

.editor-pane,
.preview-pane {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.markdown-preview {
  flex: 1;
  padding: 16px;
  background: var(--bg-primary);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  overflow-y: auto;
}

.markdown-preview h1,
.markdown-preview h2,
.markdown-preview h3 {
  margin-top: 0;
}

.markdown-preview code {
  background: var(--bg-tertiary);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
}

.markdown-preview pre {
  background: var(--bg-tertiary);
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
}

/* JWT 结果 */
.jwt-result {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.jwt-part {
  background: var(--bg-tertiary);
  padding: 16px;
  border-radius: 12px;
}

.jwt-part label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-secondary);
}

.jwt-part pre,
.jwt-part code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  white-space: pre-wrap;
  word-break: break-all;
}

/* 二维码结果 */
.qr-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--bg-tertiary);
  border-radius: 12px;
}

.qr-result img {
  max-width: 300px;
  border-radius: 8px;
}

.qr-actions {
  display: flex;
  gap: 12px;
}

/* 时间戳转换 */
.timestamp-input-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.timestamp-examples {
  margin-top: 20px;
}

.example-timestamps {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.timestamp-tag {
  cursor: pointer;
}

.timestamp-tag:hover {
  background: var(--accent-primary);
  color: white;
}

/* 响应式 */
@media (max-width: 1024px) {
  .cron-builder {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .cron-builder {
    grid-template-columns: repeat(2, 1fr);
  }

  .markdown-editor {
    grid-template-columns: 1fr;
  }

  .modal {
    max-height: 95vh;
  }

  .modal-body {
    padding: 16px;
  }

  .rgb-inputs,
  .hsl-inputs {
    grid-template-columns: 1fr;
  }

  .unit-converter {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
  }

  .unit-equals {
    text-align: center;
  }
}
</style>