import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function QrcodePage() {
  const [text, setText] = useState('')
  const [size, setSize] = useState(200)
  const [qrDataUrl, setQrDataUrl] = useState('')

  const generate = () => {
    if (!text) { toast.error('请输入内容'); return }
    import('qrcode').then(({ default: QRCode }) => {
      QRCode.toDataURL(text, { width: size, margin: 2 }).then((url: string) => {
        setQrDataUrl(url)
      })
    })
  }

  const download = () => {
    if (!qrDataUrl) return
    const a = document.createElement('a')
    a.href = qrDataUrl
    a.download = 'qrcode.png'
    a.click()
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">二维码生成</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle className="text-sm font-medium">参数</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>内容 / URL</Label>
              <Input className="mt-1" placeholder="输入文本或网址..." value={text} onChange={e => setText(e.target.value)} />
            </div>
            <div>
              <Label>尺寸 (px)</Label>
              <Input className="mt-1" type="number" value={size} onChange={e => setSize(Number(e.target.value))} />
            </div>
            <Button className="w-full" onClick={generate}>生成二维码</Button>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">预览</CardTitle>
            {qrDataUrl && <Button size="sm" variant="outline" onClick={download}>下载</Button>}
          </CardHeader>
          <CardContent className="flex items-center justify-center min-h-64">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="QR Code" className="border rounded" />
            ) : (
              <p className="text-muted-foreground text-sm">点击生成后在右侧预览</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
