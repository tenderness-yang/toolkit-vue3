<template>
  <div v-if="visible" class="tool-modal-overlay" @click.self="close">
    <div class="tool-modal">
      <div class="tool-modal-header">
        <div class="tool-modal-title">
          <div class="tool-modal-icon" :style="{ backgroundColor: tool?.color || '#6366f1' }">
            <span>{{ tool?.icon }}</span>
          </div>
          <h2>{{ tool?.name }}</h2>
        </div>
        <el-button circle @click="close" :icon="Close" size="large" />
      </div>

      <div class="tool-modal-body">
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
            <el-input v-model="input" type="textarea" :rows="10" placeholder='{"name": "test", "value": 123}' resize="none" />
          </div>
          <div class="output-section">
            <div class="section-header">
              <label>输出结果</label>
              <el-button @click="copyOutput" :icon="CopyDocument">复制</el-button>
            </div>
            <el-input v-model="output" type="textarea" :rows="10" readonly :class="{ error: !!error }" resize="none" />
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
            <el-input v-model="input" type="textarea" :rows="10" placeholder="<root><item>test</item></root>" resize="none" />
          </div>
          <div class="output-section">
            <div class="section-header">
              <label>输出结果</label>
              <el-button @click="copyOutput" :icon="CopyDocument">复制</el-button>
            </div>
            <el-input v-model="output" type="textarea" :rows="10" readonly :class="{ error: !!error }" resize="none" />
            <el-alert v-if="error" :title="error" type="error" :closable="false" />
          </div>
        </div>

        <!-- Markdown 预览 -->
        <div v-else-if="tool.name === 'Markdown 预览'" class="tool-content">
          <div class="markdown-editor">
            <div class="editor-pane">
              <label>Markdown 输入</label>
              <el-input v-model="markdownInput" type="textarea" :rows="15" placeholder="# 标题&#10;&#10;**粗体** *斜体*&#10;&#10;- 列表项 1&#10;- 列表项 2" resize="none" />
            </div>
            <div class="preview-pane">
              <label>HTML 预览</label>
              <div class="markdown-preview" v-html="markdownOutput"></div>
            </div>
          </div>
        </div>

        <!-- 文本对比 -->
        <div v-else-if="tool.name === '文本对比'" class="tool-content">
          <div class="diff-editor">
            <div class="diff-pane">
              <label>原文本</label>
              <el-input v-model="text1" type="textarea" :rows="10" placeholder="输入第一段文本" resize="none" />
            </div>
            <div class="diff-pane">
              <label>新文本</label>
              <el-input v-model="text2" type="textarea" :rows="10" placeholder="输入第二段文本" resize="none" />
            </div>
          </div>
          <div class="diff-actions">
            <el-button type="primary" @click="compareText" :icon="Search">对比差异</el-button>
            <el-button @click="clearDiff" :icon="Delete">清空</el-button>
          </div>
          <div class="diff-result" v-if="diffResult">
            <label>对比结果</label>
            <el-input v-model="diffResult" type="textarea" :rows="8" readonly resize="none" />
          </div>
        </div>

        <!-- 正则测试 -->
        <div v-else-if="tool.name === '正则测试'" class="tool-content">
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
              <el-input v-model="regexText" type="textarea" :rows="6" placeholder="输入要测试的文本" resize="none" />
            </div>
            <el-button type="primary" @click="testRegex" :icon="Search">测试</el-button>
          </div>
          <div class="regex-result">
            <el-alert :title="`匹配结果：${regexMatchCount} 处`" type="info" :closable="false" />
            <div class="regex-matches" v-if="regexMatches.length > 0">
              <el-tag v-for="(match, i) in regexMatches" :key="i" type="success" class="match-tag">{{ match }}</el-tag>
            </div>
            <el-alert v-if="regexError" :title="regexError" type="error" :closable="false" />
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
            <el-input v-model="input" type="textarea" :rows="8" placeholder="输入要编码或解码的文本" resize="none" />
          </div>
          <div class="output-section">
            <div class="section-header">
              <label>输出结果</label>
              <el-button @click="copyOutput" :icon="CopyDocument">复制</el-button>
            </div>
            <el-input v-model="output" type="textarea" :rows="8" readonly :class="{ error: !!error }" resize="none" />
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
            <el-input v-model="input" type="textarea" :rows="6" placeholder="https://example.com/?key=值" resize="none" />
          </div>
          <div class="output-section">
            <div class="section-header">
              <label>输出结果</label>
              <el-button @click="copyOutput" :icon="CopyDocument">复制</el-button>
            </div>
            <el-input v-model="output" type="textarea" :rows="6" readonly :class="{ error: !!error }" resize="none" />
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
            <el-input v-model="input" type="textarea" :rows="4" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." resize="none" />
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

        <!-- 哈希生成 -->
        <div v-else-if="tool.name === '哈希生成'" class="tool-content">
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
            <el-input v-model="input" type="textarea" :rows="6" placeholder="输入要生成哈希的文本" resize="none" />
          </div>
          <div class="output-section">
            <div class="section-header">
              <label>哈希结果</label>
              <el-button @click="copyOutput" :icon="CopyDocument">复制</el-button>
            </div>
            <el-input v-model="output" type="textarea" :rows="6" readonly :class="{ error: !!error }" resize="none" />
            <el-alert v-if="error" :title="error" type="error" :closable="false" />
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
                <el-date-picker v-model="dateInput" type="datetime" placeholder="选择日期和时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" style="flex: 1" />
                <el-button type="primary" @click="dateToTimestamp" :icon="Refresh">转换</el-button>
              </div>
              <el-alert v-if="dateResult" :title="`时间戳：${dateResult}`" type="success" :closable="false" />
            </div>
          </div>
          <div class="timestamp-examples">
            <el-alert title="示例时间戳" type="info" :closable="false">
              <div class="example-timestamps">
                <el-tag v-for="ts in exampleTimestamps" :key="ts.value" @click="timestampInput = ts.value" class="timestamp-tag">{{ ts.label }}</el-tag>
              </div>
            </el-alert>
          </div>
        </div>

        <!-- Cron 表达式 -->
        <div v-else-if="tool.name === 'Cron 表达式'" class="tool-content">
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

        <!-- UUID 生成 -->
        <div v-else-if="tool.name === 'UUID 生成'" class="tool-content">
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
            <el-input v-model="output" type="textarea" :rows="8" readonly resize="none" />
          </div>
        </div>

        <!-- 二维码生成 -->
        <div v-else-if="tool.name === '二维码生成'" class="tool-content">
          <div class="qr-options">
            <div class="option-group">
              <label>内容</label>
              <el-input v-model="qrContent" type="textarea" :rows="4" placeholder="输入要生成二维码的内容" resize="none" />
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

        <!-- 单位转换 -->
        <div v-else-if="tool.name === '单位转换'" class="tool-content">
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
            <el-alert :title="unitResult" type="success" :closable="false" />
          </div>
        </div>

        <!-- 图片压缩 -->
        <div v-else-if="tool.name === '图片压缩'" class="tool-content">
          <div class="image-options">
            <div class="option-group">
              <label>选择图片</label>
              <el-upload drag action="#" :auto-upload="false" :on-change="handleImageChange" :show-file-list="true" accept="image/*">
                <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
                <div class="el-upload__text">拖拽图片到此处或 <em>点击上传</em></div>
              </el-upload>
            </div>
            <div class="option-group">
              <label>压缩质量 (1-100)</label>
              <el-slider v-model="imageQuality" :min="1" :max="100" :step="1" />
            </div>
            <el-button type="primary" @click="compressImage" :icon="Picture">压缩图片</el-button>
          </div>
          <div class="image-result" v-if="compressedImageUrl">
            <label>压缩结果</label>
            <div class="image-compare">
              <div class="image-item">
                <span>原图</span>
                <img :src="originalImageUrl" alt="Original" />
              </div>
              <div class="image-item">
                <span>压缩后</span>
                <img :src="compressedImageUrl" alt="Compressed" />
              </div>
            </div>
          </div>
        </div>

        <!-- 图片转 Base64 -->
        <div v-else-if="tool.name === '图片转 Base64'" class="tool-content">
          <div class="image-options">
            <div class="option-group">
              <label>选择图片</label>
              <el-upload drag action="#" :auto-upload="false" :on-change="handleImageToBase64Change" :show-file-list="true" accept="image/*">
                <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
                <div class="el-upload__text">拖拽图片到此处或 <em>点击上传</em></div>
              </el-upload>
            </div>
          </div>
          <div class="output-section" v-if="imageBase64">
            <label>Base64 结果</label>
            <el-input v-model="imageBase64" type="textarea" :rows="8" readonly resize="none" />
            <div class="image-actions">
              <el-button @click="copyOutput" :icon="CopyDocument">复制</el-button>
            </div>
          </div>
        </div>

        <!-- CSV 转 JSON -->
        <div v-else-if="tool.name === 'CSV 转 JSON'" class="tool-content">
          <div class="input-section">
            <div class="section-header">
              <label>输入 CSV</label>
              <div class="actions">
                <el-button type="primary" @click="csvToJson" :icon="Refresh">转换</el-button>
                <el-button @click="clearInput" :icon="Delete">清空</el-button>
              </div>
            </div>
            <el-input v-model="input" type="textarea" :rows="8" placeholder="name,age,city&#10;张三，25，北京&#10;李四，30，上海" resize="none" />
          </div>
          <div class="output-section">
            <div class="section-header">
              <label>输出 JSON</label>
              <el-button @click="copyOutput" :icon="CopyDocument">复制</el-button>
            </div>
            <el-input v-model="output" type="textarea" :rows="8" readonly :class="{ error: !!error }" resize="none" />
            <el-alert v-if="error" :title="error" type="error" :closable="false" />
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
            <el-input v-model="input" type="textarea" :rows="10" placeholder="name: test&#10;value: 123" resize="none" />
          </div>
          <div class="output-section">
            <div class="section-header">
              <label>输出结果</label>
              <el-button @click="copyOutput" :icon="CopyDocument">复制</el-button>
            </div>
            <el-input v-model="output" type="textarea" :rows="10" readonly :class="{ error: !!error }" resize="none" />
            <el-alert v-if="error" :title="error" type="error" :closable="false" />
          </div>
        </div>

        <!-- IP 查询 -->
        <div v-else-if="tool.name === 'IP 查询'" class="tool-content">
          <div class="ip-options">
            <div class="option-group">
              <label>输入 IP 地址</label>
              <div class="ip-input-group">
                <el-input v-model="ipAddress" placeholder="输入 IP 地址，留空查询本机 IP" />
                <el-button type="primary" @click="queryIP" :icon="Search">查询</el-button>
              </div>
            </div>
          </div>
          <div class="ip-result" v-if="ipResult">
            <el-descriptions title="IP 信息" :column="2" border>
              <el-descriptions-item label="IP 地址">{{ ipResult.ip }}</el-descriptions-item>
              <el-descriptions-item label="所在区域">{{ ipResult.region }}</el-descriptions-item>
              <el-descriptions-item label="运营商">{{ ipResult.isp }}</el-descriptions-item>
              <el-descriptions-item label="类型">{{ ipResult.type }}</el-descriptions-item>
            </el-descriptions>
          </div>
        </div>

        <!-- Ping 测试 -->
        <div v-else-if="tool.name === 'Ping 测试'" class="tool-content">
          <div class="ping-options">
            <div class="option-group">
              <label>目标地址</label>
              <div class="ping-input-group">
                <el-input v-model="pingTarget" placeholder="输入域名或 IP 地址" />
                <el-button type="primary" @click="pingTest" :icon="Connection">测试</el-button>
              </div>
            </div>
          </div>
          <div class="ping-result" v-if="pingResult">
            <el-input v-model="pingResult" type="textarea" :rows="8" readonly resize="none" />
          </div>
        </div>

        <!-- 颜色转换 -->
        <div v-else-if="tool.name === '颜色转换'" class="tool-content color-tool">
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

        <!-- 密码生成 -->
        <div v-else-if="tool.name === '密码生成'" class="tool-content">
          <div class="password-options">
            <div class="option-group">
              <label>密码长度</label>
              <el-slider v-model="passwordLength" :min="6" :max="32" :step="1" />
            </div>
            <div class="option-group">
              <el-checkbox v-model="passwordOptions.uppercase">包含大写字母 (A-Z)</el-checkbox>
              <el-checkbox v-model="passwordOptions.lowercase">包含小写字母 (a-z)</el-checkbox>
              <el-checkbox v-model="passwordOptions.numbers">包含数字 (0-9)</el-checkbox>
              <el-checkbox v-model="passwordOptions.symbols">包含特殊符号 (!@#$%)</el-checkbox>
            </div>
            <el-button type="primary" @click="generatePassword" :icon="Key">生成密码</el-button>
          </div>
          <div class="output-section">
            <div class="section-header">
              <label>生成的密码</label>
              <el-button @click="copyOutput" :icon="CopyDocument">复制</el-button>
            </div>
            <el-input v-model="output" type="text" readonly style="font-family: monospace; font-size: 18px;" />
          </div>
        </div>

        <!-- AI 代码助手 -->
        <div v-else-if="tool.name === 'AI 代码助手'" class="tool-content">
          <div class="ai-options">
            <div class="option-group">
              <label>描述你的需求</label>
              <el-input v-model="aiPrompt" type="textarea" :rows="4" placeholder="例如：写一个函数，计算两个数的和" resize="none" />
            </div>
            <div class="option-group">
              <label>编程语言</label>
              <el-select v-model="aiLanguage" placeholder="选择语言">
                <el-option label="JavaScript" value="javascript" />
                <el-option label="Python" value="python" />
                <el-option label="Java" value="java" />
                <el-option label="TypeScript" value="typescript" />
                <el-option label="Go" value="go" />
              </el-select>
            </div>
            <el-button type="primary" @click="generateAI" :icon="MagicStick">生成代码</el-button>
          </div>
          <div class="output-section" v-if="aiResult">
            <label>生成的代码</label>
            <el-input v-model="aiResult" type="textarea" :rows="10" readonly resize="none" style="font-family: monospace;" />
            <div class="image-actions">
              <el-button @click="copyOutput" :icon="CopyDocument">复制</el-button>
            </div>
          </div>
        </div>

        <!-- 文本摘要 -->
        <div v-else-if="tool.name === '文本摘要'" class="tool-content">
          <div class="ai-options">
            <div class="option-group">
              <label>输入长文本</label>
              <el-input v-model="aiPrompt" type="textarea" :rows="8" placeholder="输入需要摘要的长文本..." resize="none" />
            </div>
            <div class="option-group">
              <label>摘要长度</label>
              <el-select v-model="summaryLength" placeholder="选择长度">
                <el-option label="简短 (1-2 句)" value="short" />
                <el-option label="中等 (3-5 句)" value="medium" />
                <el-option label="详细 (5-10 句)" value="long" />
              </el-select>
            </div>
            <el-button type="primary" @click="generateSummary" :icon="Document">生成摘要</el-button>
          </div>
          <div class="output-section" v-if="aiResult">
            <label>摘要结果</label>
            <el-input v-model="aiResult" type="textarea" :rows="6" readonly resize="none" />
            <div class="image-actions">
              <el-button @click="copyOutput" :icon="CopyDocument">复制</el-button>
            </div>
          </div>
        </div>

        <!-- 属性代码生成 -->
        <div v-else-if="tool.name === '属性代码生成'" class="tool-content">
          <el-alert
            title="提示"
            type="info"
            :closable="false"
            show-icon
            class="mb-3"
          >
            请使用独立的属性代码生成器页面，该工具需要更复杂的界面和交互
          </el-alert>
          <div class="simple-attribute-generator">
            <div class="option-group">
              <label>属性类型</label>
              <el-select v-model="simpleAttr.type" placeholder="选择属性类型" class="w-100">
                <el-option label="生命值" value="health" />
                <el-option label="法力值" value="mana" />
                <el-option label="攻击力" value="attack" />
                <el-option label="防御力" value="defense" />
                <el-option label="暴击率" value="crit" />
                <el-option label="闪避率" value="dodge" />
              </el-select>
            </div>
            <div class="option-group">
              <label>基础数值</label>
              <el-input-number v-model="simpleAttr.value" :min="0" :precision="2" class="w-100" />
            </div>
            <div class="option-group">
              <label>生成条数</label>
              <el-input-number v-model="simpleAttr.count" :min="1" :max="100" class="w-100" />
            </div>
            <div class="option-group">
              <el-checkbox v-model="simpleAttr.usePrefix">使用 3# 前缀</el-checkbox>
            </div>
            <el-button type="primary" @click="generateSimpleAttribute" :icon="MagicStick">生成代码</el-button>
          </div>
          <div class="output-section" v-if="simpleAttrResult">
            <label>生成结果</label>
            <el-input v-model="simpleAttrResult" type="textarea" :rows="8" readonly resize="none" style="font-family: monospace;" />
            <div class="image-actions">
              <el-button @click="copySimpleAttr" :icon="CopyDocument">复制</el-button>
            </div>
          </div>
        </div>

        <!-- 默认提示 -->
        <div v-else class="tool-content">
          <el-empty :description="`工具「${tool?.name}」功能开发中，敬请期待...`" />
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
  Close, MagicStick, Minus, Delete, CopyDocument, ArrowUp, ArrowDown, Key, Picture, Download,
  Refresh, Search, Clock, Connection, UploadFilled, Document
} from '@element-plus/icons-vue'

const props = defineProps({
  visible: Boolean,
  tool: Object
})

const emit = defineEmits(['close'])

const close = () => emit('close')

// 通用输入输出
const input = ref('')
const output = ref('')
const error = ref('')

const clearInput = () => {
  input.value = ''
  output.value = ''
  error.value = ''
}

const copyOutput = async () => {
  if (output.value) {
    await navigator.clipboard.writeText(output.value)
    ElMessage.success('已复制到剪贴板')
  }
}

// 获取工具名称首字母
const getToolInitial = (toolName) => {
  if (!toolName) return '?'
  if (/[\u4e00-\u9fa5]/.test(toolName)) return toolName.charAt(0)
  return toolName.charAt(0).toUpperCase()
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

// Base64
const base64Encode = () => {
  const result = tools.base64Encode(input.value)
  output.value = result.success ? result.result : ''
  error.value = result.error
}

const base64Decode = () => {
  const result = tools.base64Decode(input.value)
  output.value = result.success ? result.result : ''
  error.value = result.error
}

// URL 编解码
const urlEncode = () => {
  const result = tools.urlEncode(input.value)
  output.value = result.success ? result.result : ''
  error.value = result.error
}

const urlDecode = () => {
  const result = tools.urlDecode(input.value)
  output.value = result.success ? result.result : ''
  error.value = result.error
}

// 哈希生成
const hashAlgorithm = ref('SHA-256')
const generateHash = async () => {
  const result = await tools.generateHash(input.value, hashAlgorithm.value)
  output.value = result.success ? result.result : ''
  error.value = result.error
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

// Markdown 预览
const markdownInput = ref('')
const markdownOutput = computed(() => tools.markdownToHtml(markdownInput.value).result)

// 文本对比
const text1 = ref('')
const text2 = ref('')
const diffResult = ref('')

const compareText = () => {
  const lines1 = text1.value.split('\n')
  const lines2 = text2.value.split('\n')
  const result = []
  
  const maxLen = Math.max(lines1.length, lines2.length)
  for (let i = 0; i < maxLen; i++) {
    const l1 = lines1[i] || ''
    const l2 = lines2[i] || ''
    if (l1 !== l2) {
      result.push(`第 ${i + 1} 行不同:`)
      if (l1) result.push(`  原文本：${l1}`)
      if (l2) result.push(`  新文本：${l2}`)
    }
  }
  
  diffResult.value = result.length > 0 ? result.join('\n') : '两段文本完全相同！'
}

const clearDiff = () => {
  text1.value = ''
  text2.value = ''
  diffResult.value = ''
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

// 时间戳转换
const timestampInput = ref('')
const timestampResult = ref('')
const dateInput = ref('')
const dateResult = ref('')
const exampleTimestamps = ref([
  { label: '当前时间戳', value: Math.floor(Date.now() / 1000).toString() },
  { label: '1 小时前', value: Math.floor((Date.now() - 3600000) / 1000).toString() },
  { label: '1 天前', value: Math.floor((Date.now() - 86400000) / 1000).toString() },
  { label: '2023-01-01', value: '1672531200' },
  { label: '2030-01-01', value: '1893456000' }
])

const getCurrentTimestamp = () => {
  timestampInput.value = Math.floor(Date.now() / 1000).toString()
}

const timestampToDate = () => {
  const result = tools.timestampToDate(timestampInput.value)
  timestampResult.value = result.success ? result.result : result.error
}

const dateToTimestamp = () => {
  const result = tools.dateToTimestamp(dateInput.value)
  dateResult.value = result.success ? result.result.toString() : result.error
}

// Cron 表达式
const cron = ref({ minute: '*', hour: '*', day: '*', month: '*', weekday: '*' })
const cronExpression = computed(() => `${cron.value.minute} ${cron.value.hour} ${cron.value.day} ${cron.value.month} ${cron.value.weekday}`)
const cronDescription = computed(() => tools.parseCron(cronExpression.value).success ? tools.parseCron(cronExpression.value).result : '')
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
  await navigator.clipboard.writeText(qrUrl.value)
  ElMessage.success('已复制二维码链接')
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
  if (unitType.value === 'length') { unitFrom.value = 'm'; unitTo.value = 'km' }
  else if (unitType.value === 'weight') { unitFrom.value = 'kg'; unitTo.value = 'g' }
  else { unitFrom.value = 'c'; unitTo.value = 'f' }
  unitResult.value = ''
}

const convertUnit = () => {
  const result = tools.convertUnit(unitValue.value, unitFrom.value, unitTo.value, unitType.value)
  unitResult.value = result.success ? `${unitValue.value} ${getUnitLabel(unitFrom.value)} = ${result.result} ${getUnitLabel(unitTo.value)}` : result.error
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

// YAML 格式化
const formatYAML = (action) => {
  const result = tools.formatYAML(input.value, action)
  output.value = result.success ? result.result : ''
  error.value = result.error
}

// CSV 转 JSON
const csvToJson = () => {
  try {
    const lines = input.value.trim().split('\n')
    if (lines.length < 2) {
      error.value = 'CSV 数据至少需要包含标题行和一行数据'
      return
    }
    const headers = lines[0].split(',').map(h => h.trim())
    const result = []
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      const obj = {}
      headers.forEach((header, index) => {
        obj[header] = values[index] || ''
      })
      result.push(obj)
    }
    output.value = JSON.stringify(result, null, 2)
    error.value = ''
  } catch (e) {
    error.value = `转换失败：${e.message}`
    output.value = ''
  }
}

// 图片处理
const originalImageUrl = ref('')
const compressedImageUrl = ref('')
const imageQuality = ref(75)
const imageBase64 = ref('')

const handleImageChange = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    originalImageUrl.value = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

const compressImage = () => {
  if (!originalImageUrl.value) {
    ElMessage.warning('请先选择图片')
    return
  }
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = new Image()
  img.onload = () => {
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)
    compressedImageUrl.value = canvas.toDataURL('image/jpeg', imageQuality.value / 100)
    ElMessage.success('图片压缩完成')
  }
  img.src = originalImageUrl.value
}

const handleImageToBase64Change = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    imageBase64.value = e.target.result
    ElMessage.success('图片转换成功')
  }
  reader.readAsDataURL(file.raw)
}

// IP 查询
const ipAddress = ref('')
const ipResult = ref(null)

const queryIP = async () => {
  try {
    const ip = ipAddress.value.trim() || 'auto'
    // 使用免费 IP 查询 API
    const response = await fetch(`https://ipapi.co/${ip}/json/`)
    const data = await response.json()
    ipResult.value = {
      ip: data.ip || '未知',
      region: `${data.city || ''} ${data.region || ''} ${data.country_name || ''}`.trim() || '未知',
      isp: data.org || data.isp || '未知',
      type: 'IPv4'
    }
  } catch (e) {
    ElMessage.error(`IP 查询失败：${e.message}`)
    ipResult.value = null
  }
}

// Ping 测试
const pingTarget = ref('')
const pingResult = ref('')

const pingTest = () => {
  if (!pingTarget.value) {
    ElMessage.warning('请输入目标地址')
    return
  }
  // 模拟 Ping 测试结果（浏览器无法直接执行 Ping）
  const target = pingTarget.value
  const results = []
  for (let i = 1; i <= 4; i++) {
    const time = Math.floor(Math.random() * 50) + 10
    results.push(`来自 ${target} 的回复：字节=32 时间=${time}ms TTL=${50 + i}`)
  }
  results.push('')
  results.push(`Ping 统计信息:`)
  results.push(`    数据包：已发送 = 4，已接收 = 4，丢失 = 0 (0% 丢失)`)
  pingResult.value = results.join('\n')
}

// 密码生成
const passwordLength = ref(16)
const passwordOptions = ref({
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true
})

const generatePassword = () => {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lower = 'abcdefghijklmnopqrstuvwxyz'
  const nums = '0123456789'
  const syms = '!@#$%^&*()_+-=[]{}|;:,.<>?'
  
  let chars = ''
  if (passwordOptions.value.uppercase) chars += upper
  if (passwordOptions.value.lowercase) chars += lower
  if (passwordOptions.value.numbers) chars += nums
  if (passwordOptions.value.symbols) chars += syms
  
  if (!chars) {
    ElMessage.warning('请至少选择一种字符类型')
    return
  }
  
  let password = ''
  for (let i = 0; i < passwordLength.value; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  output.value = password
  ElMessage.success('密码生成成功')
}

// AI 功能（模拟）
const aiPrompt = ref('')
const aiLanguage = ref('javascript')
const aiResult = ref('')
const summaryLength = ref('medium')

const generateAI = () => {
  if (!aiPrompt.value) {
    ElMessage.warning('请输入需求描述')
    return
  }
  // 模拟 AI 代码生成
  const templates = {
    javascript: `// 根据您的需求生成的 JavaScript 代码\n\nfunction solution() {\n  // TODO: 实现 ${aiPrompt.value.substring(0, 20)}...\n  return result;\n}\n\n// 使用示例\n// const result = solution();\nconsole.log(result);`,
    python: `# 根据您的需求生成的 Python 代码\n\ndef solution():\n    # TODO: 实现 ${aiPrompt.value.substring(0, 20)}...\n    return result\n\n# 使用示例\n# result = solution()\nprint(result)`,
    java: `// 根据您的需求生成的 Java 代码\n\npublic class Solution {\n    public static void main(String[] args) {\n        // TODO: 实现 ${aiPrompt.value.substring(0, 20)}...\n        System.out.println(result);\n    }\n}`,
    typescript: `// 根据您的需求生成的 TypeScript 代码\n\ninterface Result {\n  // 定义结果类型\n}\n\nfunction solution(): Result {\n  // TODO: 实现 ${aiPrompt.value.substring(0, 20)}...\n  return result;\n}`,
    go: `// 根据您的需求生成的 Go 代码\n\npackage main\n\nimport "fmt"\n\nfunc main() {\n    // TODO: 实现 ${aiPrompt.value.substring(0, 20)}...\n    fmt.Println(result)\n}`
  }
  aiResult.value = templates[aiLanguage.value] || '// 不支持的语言'
  ElMessage.success('代码生成成功')
}

const generateSummary = () => {
  if (!aiPrompt.value) {
    ElMessage.warning('请输入文本')
    return
  }
  // 简单文本摘要（提取前几句）
  const sentences = aiPrompt.value.split(/[.!?。！？]/).filter(s => s.trim())
  const lengths = { short: 2, medium: 4, long: 8 }
  const count = lengths[summaryLength.value] || 4
  const summary = sentences.slice(0, count).join('. ') + '.'
  aiResult.value = summary
  ElMessage.success('摘要生成成功')
}

// 简单属性代码生成
const simpleAttr = ref({
  type: 'health',
  value: 100,
  count: 5,
  usePrefix: true
})

const simpleAttrResult = ref('')

const generateSimpleAttribute = () => {
  if (!simpleAttr.value.type) {
    ElMessage.warning('请选择属性类型')
    return
  }
  
  const lines = []
  const prefix = simpleAttr.value.usePrefix ? '3#' : ''
  
  for (let i = 0; i < simpleAttr.value.count; i++) {
    const value = simpleAttr.value.value + (i * 10) // 每级增加 10
    const code = `${prefix}property_${i + 1}|${simpleAttr.value.type}=${value}`
    lines.push(code)
  }
  
  simpleAttrResult.value = lines.join('\n')
  ElMessage.success(`成功生成 ${simpleAttr.value.count} 条属性代码`)
}

const copySimpleAttr = async () => {
  if (!simpleAttrResult.value) {
    ElMessage.warning('没有可复制的内容')
    return
  }
  await navigator.clipboard.writeText(simpleAttrResult.value)
  ElMessage.success('已复制到剪贴板')
}
</script>

<style scoped>
.tool-modal-overlay {
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

.tool-modal {
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

.tool-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
}

.tool-modal-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tool-modal-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.tool-modal-title h2 {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
}

.tool-modal-body {
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

.actions {
  display: flex;
  gap: 8px;
  align-items: center;
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

/* 文本对比 */
.diff-editor {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.diff-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.diff-result {
  margin-top: 20px;
}

/* 正则测试 */
.regex-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: var(--bg-tertiary);
  padding: 20px;
  border-radius: 12px;
}

.regex-result {
  margin-top: 16px;
}

.regex-matches {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.match-tag {
  cursor: pointer;
}

/* 时间戳转换 */
.timestamp-options {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

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
  margin-top: 20px;
}

.cron-expression {
  margin-bottom: 12px;
}

/* UUID 选项 */
.uuid-options,
.qr-options,
.unit-options,
.ip-options,
.ping-options,
.password-options,
.ai-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: var(--bg-tertiary);
  padding: 20px;
  border-radius: 12px;
}

.simple-attribute-generator {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: var(--bg-tertiary);
  padding: 20px;
  border-radius: 12px;
}

.mb-3 {
  margin-bottom: 15px;
}

.w-100 {
  width: 100%;
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

/* 二维码结果 */
.qr-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--bg-tertiary);
  border-radius: 12px;
  margin-top: 20px;
}

.qr-result img {
  max-width: 300px;
  border-radius: 8px;
}

.qr-actions {
  display: flex;
  gap: 12px;
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

/* 图片处理 */
.image-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: var(--bg-tertiary);
  padding: 20px;
  border-radius: 12px;
}

.image-result {
  margin-top: 20px;
}

.image-compare {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 16px;
}

.image-item {
  text-align: center;
}

.image-item span {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--text-secondary);
}

.image-item img {
  max-width: 100%;
  border-radius: 8px;
  border: 2px solid var(--border-color);
}

.image-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

/* IP 查询结果 */
.ip-result {
  margin-top: 20px;
}

/* Ping 结果 */
.ping-result {
  margin-top: 20px;
}

/* 响应式 */
@media (max-width: 1024px) {
  .cron-builder {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .markdown-editor {
    grid-template-columns: 1fr;
  }
  
  .diff-editor {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .cron-builder {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .tool-modal {
    max-height: 95vh;
  }
  
  .tool-modal-body {
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
  
  .image-compare {
    grid-template-columns: 1fr;
  }
}
</style>
