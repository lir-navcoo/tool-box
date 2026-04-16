import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Upload } from 'lucide-react'

export default function ImagePage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [format, setFormat] = useState('image/png')
  const [quality, setQuality] = useState(0.92)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const getExt = (mime: string) => {
    if (mime === 'image/webp') return 'webp'
    if (mime === 'image/jpeg') return 'jpg'
    if (mime === 'image/svg+xml') return 'svg'
    return 'png'
  }

  const isSvg = (f: File) => f.type === 'image/svg+xml' || f.name.endsWith('.svg')

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })
  }

  const convert = async () => {
    if (!file) return

    try {
      if (format === 'image/svg+xml') {
        // 导出为 SVG：把源图片嵌入为 <image> 元素
        const reader = new FileReader()
        const svgText = await new Promise<string>((res) => {
          reader.onload = () => res(reader.result as string)
          reader.readAsText(file!)
        })
        // 获取源图片的 data URL
        const srcDataUrl = await new Promise<string>((res) => {
          const fr = new FileReader()
          fr.onload = () => res(fr.result as string)
          fr.readAsDataURL(file!)
        })
        // 解析 SVG 宽高
        const parser = new DOMParser()
        const doc = parser.parseFromString(svgText, 'image/svg+xml')
        const svg = doc.documentElement
        const w = svg.getAttribute('width') || '300'
        const h = svg.getAttribute('height') || '200'
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
        // 注入 image
        const imgEl = doc.createElementNS('http://www.w3.org/2000/svg', 'image')
        imgEl.setAttribute('href', srcDataUrl)
        imgEl.setAttribute('width', w)
        imgEl.setAttribute('height', h)
        imgEl.setAttribute('x', '0')
        imgEl.setAttribute('y', '0')
        svg.appendChild(imgEl)
        // 清理多余人元素
        const toRemove = Array.from(svg.children).filter(c => c.tagName !== 'svg' && c.tagName !== 'image' && c.tagName !== 'defs')
        toRemove.forEach(c => svg.removeChild(c))
        const blob = new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = 'converted.svg'
        a.click()
        toast.success('SVG 导出完成')
        return
      }

      // PNG / JPG / WebP
      let imgSrc = preview
      if (isSvg(file)) {
        // SVG → data URL via base64
        imgSrc = await new Promise<string>((res) => {
          const fr = new FileReader()
          fr.onload = () => res(fr.result as string)
          fr.readAsDataURL(file!)
        })
      }

      const img = await loadImage(imgSrc)
      const canvas = canvasRef.current!
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      const mime = format === 'image/webp' ? 'image/webp' : format === 'image/jpeg' ? 'image/jpeg' : 'image/png'
      const dataUrl = canvas.toDataURL(mime, quality)
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = 'converted.' + getExt(mime)
      a.click()
      toast.success('图片转换完成')
    } catch (e) {
      toast.error('转换失败：' + (e as Error).message)
    }
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">图片转换</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle className="text-sm font-medium">设置</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>选择图片</Label>
              <Button variant="outline" className="mt-1 w-full justify-start gap-2" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4" />
                {file ? file.name : '点击上传图片'}
              </Button>
              <input ref={fileInputRef} type="file" accept="image/*,.svg" className="hidden" onChange={handleFileChange} />
            </div>
            <div>
              <Label>目标格式</Label>
              <Select value={format} onValueChange={v => { if (v) setFormat(v) }}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image/png">PNG</SelectItem>
                  <SelectItem value="image/jpeg">JPG</SelectItem>
                  <SelectItem value="image/webp">WebP</SelectItem>
                  <SelectItem value="image/svg+xml">SVG</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {format !== 'image/png' && format !== 'image/svg+xml' && (
              <div>
                <Label>质量 ({Math.round(quality * 100)}%)</Label>
                <input type="range" min="0.1" max="1" step="0.05" value={quality} onChange={e => setQuality(Number(e.target.value))} className="mt-2 w-full" />
              </div>
            )}
            <Button className="w-full" onClick={convert} disabled={!file}>转换</Button>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-sm font-medium">预览</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-center min-h-80">
            {preview ? (
              <img src={preview} alt="Preview" className="max-w-full max-h-80 object-contain border rounded" />
            ) : (
              <p className="text-muted-foreground text-sm">选择图片后预览</p>
            )}
          </CardContent>
        </Card>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
