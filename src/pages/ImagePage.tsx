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
    const url = URL.createObjectURL(f)
    setPreview(url || '')
  }

  const convert = () => {
    if (!file) return
    const img = new Image()
    img.onload = () => {
      const canvas = canvasRef.current!
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      const mime = format === 'image/webp' ? 'image/webp' : 'image/png'
      const dataUrl = canvas.toDataURL(mime, quality)
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = 'converted.' + (mime === 'image/webp' ? 'webp' : 'png')
      a.click()
      toast.success('图片转换完成')
    }
    img.src = preview
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
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>
            <div>
              <Label>目标格式</Label>
              <Select value={format} onValueChange={v => { if (v) setFormat(v) }}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image/png">PNG</SelectItem>
                  <SelectItem value="image/jpeg">JPEG</SelectItem>
                  <SelectItem value="image/webp">WebP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {format !== 'image/png' && (
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
