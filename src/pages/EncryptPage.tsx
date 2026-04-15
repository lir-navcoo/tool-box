import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function EncryptPage() {
  const [type, setType] = useState<'base64' | 'md5' | 'aes'>('base64')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [key, setKey] = useState('')

  const handleEncode = () => {
    try {
      if (type === 'base64') {
        setOutput(btoa(unescape(encodeURIComponent(input))))
        toast.success('Base64 编码成功')
      } else if (type === 'md5') {
        // @ts-ignore
        import('crypto-js/md5').then((CryptoJS: any) => {
          setOutput(CryptoJS.MD5(input).toString())
          toast.success('MD5 加密成功')
        })
      } else if (type === 'aes') {
        if (!key) { toast.error('请输入 AES 密钥'); return }
        import('crypto-js/aes').then((CryptoJS: any) => {
          setOutput(CryptoJS.AES.encrypt(input, key).toString())
          toast.success('AES 加密成功')
        })
      }
    } catch {
      toast.error('加密失败')
    }
  }

  const handleDecode = () => {
    try {
      if (type === 'base64') {
        setOutput(decodeURIComponent(escape(atob(input))))
        toast.success('Base64 解码成功')
      } else if (type === 'aes') {
        if (!key) { toast.error('请输入 AES 密钥'); return }
        import('crypto-js/aes').then((CryptoJS: any) => {
          const bytes = CryptoJS.AES.decrypt(input, key)
          setOutput(bytes.toString(CryptoJS.enc.Utf8))
          toast.success('AES 解码成功')
        })
      }
    } catch {
      toast.error('解密失败，请检查输入和密钥')
    }
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">加密解密</h2>
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex gap-2">
              <Label className="mt-1.5">算法</Label>
              <Select value={type} onValueChange={v => { if (v) { setType(v); setOutput('') } }}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="base64">Base64</SelectItem>
                  <SelectItem value="md5">MD5</SelectItem>
                  <SelectItem value="aes">AES</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {type === 'aes' && (
              <div className="flex gap-2 items-center">
                <Label>密钥</Label>
                <Input className="w-48" placeholder="输入密钥..." value={key} onChange={e => setKey(e.target.value)} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">输入</CardTitle></CardHeader>
          <CardContent>
            <Textarea className="font-mono text-sm min-h-64" placeholder="输入原文..." value={input} onChange={e => setInput(e.target.value)} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">输出</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Textarea className="font-mono text-sm min-h-64 bg-muted/30" readOnly placeholder="结果..." value={output} />
            <div className="flex gap-2">
              <Button onClick={handleEncode} size="sm">加密 / 编码</Button>
              {type !== 'md5' && <Button onClick={handleDecode} size="sm" variant="outline">解密 / 解码</Button>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
