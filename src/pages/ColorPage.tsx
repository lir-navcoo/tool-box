import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
}

export default function ColorPage() {
  const [hex, setHex] = useState('#3B82F6')
  const [rgb, setRgb] = useState('59, 130, 246')
  const [preview, setPreview] = useState('#3B82F6')

  const fromHex = (val: string) => {
    setHex(val)
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      const { r, g, b } = hexToRgb(val)
      setRgb(`${r}, ${g}, ${b}`)
      setPreview(val)
    }
  }

  const fromRgb = (val: string) => {
    setRgb(val)
    const m = val.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
    if (m) {
      const r = Math.min(255, Math.max(0, Number(m[1])))
      const g = Math.min(255, Math.max(0, Number(m[2])))
      const b = Math.min(255, Math.max(0, Number(m[3])))
      const h = rgbToHex(r, g, b)
      setHex(h)
      setPreview(h)
    }
  }

  const copy = (text: string) => {
    // 优先用 Clipboard API，失败后用 execCommand 回退
    const doCopy = () => {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      return ok
    }

    if (typeof navigator.clipboard?.writeText === 'function') {
      navigator.clipboard.writeText(text).then(() => toast.success('已复制: ' + text)).catch(() => {
        if (doCopy()) toast.success('已复制: ' + text)
        else toast.error('复制失败，请手动选择复制')
      })
    } else {
      if (doCopy()) toast.success('已复制: ' + text)
      else toast.error('复制失败，请手动选择复制')
    }
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">颜色工具</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">颜色预览</CardTitle></CardHeader>
          <CardContent>
            <div className="aspect-square rounded-lg border" style={{ backgroundColor: preview }} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-sm font-medium">格式转换</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>HEX</Label>
                <Input className="mt-1 font-mono" value={hex} onChange={e => fromHex(e.target.value)} />
                <button className="text-xs text-muted-foreground mt-1 underline" onClick={() => copy(hex)}>复制</button>
              </div>
              <div>
                <Label>RGB</Label>
                <Input className="mt-1 font-mono" value={rgb} onChange={e => fromRgb(e.target.value)} />
                <button className="text-xs text-muted-foreground mt-1 underline" onClick={() => copy(rgb)}>复制</button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {['#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899', '#64748B'].map(c => (
                <button
                  key={c}
                  className="w-10 h-10 rounded border-2 border-transparent hover:border-foreground transition-all"
                  style={{ backgroundColor: c }}
                  onClick={() => fromHex(c)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
