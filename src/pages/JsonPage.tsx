import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

export default function JsonPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  const format = () => {
    try {
      const obj = JSON.parse(input)
      setOutput(JSON.stringify(obj, null, 2))
      toast.success('格式化成功')
    } catch {
      toast.error('JSON 格式错误')
    }
  }

  const compress = () => {
    try {
      const obj = JSON.parse(input)
      setOutput(JSON.stringify(obj))
      toast.success('压缩成功')
    } catch {
      toast.error('JSON 格式错误')
    }
  }

  // JSON 转义（压缩后转义，特殊字符不丢失）
  const escapeJson = () => {
    try {
      const obj = JSON.parse(input)
      // 先压缩，再对结果做转义
      const compressed = JSON.stringify(obj)
      // 转义 \ " 和控制字符
      const escaped = compressed.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t')
      setOutput(`"${escaped}"`)
      toast.success('JSON 转义成功')
    } catch {
      toast.error('JSON 格式错误')
    }
  }

  // 去除 JSON 转义（还原被转义的字符串）
  const unescapeJson = () => {
    try {
      const raw = input.trim()
      // 去掉外层引号
      let s = raw.startsWith('"') && raw.endsWith('"') ? raw.slice(1, -1) : raw
      // 还原转义
      s = s.replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\t/g, '\t').replace(/\\"/g, '"').replace(/\\\\/g, '\\')
      const obj = JSON.parse(s)
      setOutput(JSON.stringify(obj, null, 2))
      toast.success('去转义成功')
    } catch {
      toast.error('转义 JSON 格式错误')
    }
  }

  const validate = () => {
    try {
      JSON.parse(input)
      toast.success('JSON 格式正确')
    } catch (e: any) {
      toast.error('JSON 格式错误')
    }
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">JSON 格式化</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">输入</CardTitle>
            <Badge variant="secondary">JSON</Badge>
          </CardHeader>
          <CardContent>
            <Textarea
              className="font-mono text-sm min-h-80"
              placeholder="粘贴 JSON 内容..."
              value={input}
              onChange={e => setInput(e.target.value)}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">输出</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={format}>格式化</Button>
              <Button size="sm" variant="outline" onClick={compress}>压缩</Button>
              <Button size="sm" variant="outline" onClick={escapeJson}>压缩转义</Button>
              <Button size="sm" variant="outline" onClick={unescapeJson}>去转义</Button>
              <Button size="sm" variant="outline" onClick={validate}>校验</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              className="font-mono text-sm min-h-80 bg-muted/30"
              readOnly
              placeholder="结果..."
              value={output}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
