import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Copy } from 'lucide-react'

// 中文大写转换
function toChineseUppercase(num: number): string {
  const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  if (num === 0) return '零元整'
  const parts = num.toFixed(2).split('.')
  const intPart = parseInt(parts[0])
  const decPart = parts[1]

  let result = ''
  const intStr = intPart.toString()
  const len = intStr.length
  for (let i = 0; i < len; i++) {
    const n = parseInt(intStr[i])
    const unitIndex = len - i - 1
    if (n !== 0) {
      result += digits[n]
      if (unitIndex === 3) result += '仟'
      else if (unitIndex === 2) result += '佰'
      else if (unitIndex === 1) result += '拾'
      else if (unitIndex === 0) result += '元'
    } else if (i === len - 4) {
      result += '仟'
    } else if (i === len - 3) {
      result += '佰'
    } else if (i === len - 2) {
      result += '拾'
    } else if (i === len - 1) {
      if (result.endsWith('元') || result.endsWith('仟') || result.endsWith('佰') || result.endsWith('拾')) {
        // skip
      } else {
        result += '元'
      }
    }
  }

  if (decPart) {
    const jiao = parseInt(decPart[0])
    const fen = parseInt(decPart[1])
    if (jiao !== 0) result += digits[jiao] + '角'
    if (fen !== 0) result += digits[fen] + '分'
    if (jiao === 0 && fen === 0) result += '整'
  } else {
    result += '整'
  }

  result = result.replace(/零仟|零佰|零拾/g, '零').replace(/零+/g, '零').replace(/零元/g, '元').replace(/元整/g, '元整')
  if (result.startsWith('元')) result = result.slice(1)
  return result
}

export default function TaxPersonalPage() {
  const [income, setIncome] = useState('')
  const [socialInsurance, setSocialInsurance] = useState(0)
  const [result, setResult] = useState<any>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const calculate = () => {
    const total = parseFloat(income) || 0
    const insurance = socialInsurance
    const taxable = Math.max(0, total - 60000 - insurance)
    const rates = [
      { limit: 36000, rate: 0.03, deduction: 0 },
      { limit: 144000, rate: 0.10, deduction: 2520 },
      { limit: 300000, rate: 0.20, deduction: 16920 },
      { limit: 420000, rate: 0.25, deduction: 31920 },
      { limit: 660000, rate: 0.30, deduction: 52920 },
      { limit: 960000, rate: 0.35, deduction: 85920 },
      { limit: Infinity, rate: 0.45, deduction: 181920 },
    ]
    const bracket = rates.find(r => taxable <= r.limit)!
    const tax = taxable * bracket.rate - bracket.deduction
    const afterTax = total - tax
    setResult({ total, insurance, taxable, tax, afterTax, effective: ((tax / total) * 100).toFixed(2) })
  }

  const handleCopy = (label: string, value: string) => {
    // 优先用 Clipboard API，失败后用 execCommand 回退
    const doCopy = () => {
      const ta = document.createElement('textarea')
      ta.value = value
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      return ok
    }

    const succeed = () => {
      setCopiedField(label)
      toast.success('已复制')
      setTimeout(() => setCopiedField(null), 1500)
    }

    if (typeof navigator.clipboard?.writeText === 'function') {
      navigator.clipboard.writeText(value).then(succeed).catch(() => {
        if (doCopy()) succeed()
        else toast.error('复制失败，请手动选择复制')
      })
    } else {
      if (doCopy()) succeed()
      else toast.error('复制失败，请手动选择复制')
    }
  }

  const fmt = (v: number) => v.toLocaleString('en', { minimumFractionDigits: 2 })

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">个税计算器</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">输入</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>年度收入 (元)</Label>
              <Input className="mt-1" type="number" placeholder="如：120000" value={income} onChange={e => setIncome(e.target.value)} />
            </div>
            <div>
              <Label>社保/公积金 (元/年)</Label>
              <Input className="mt-1" type="number" placeholder="如：15000" value={socialInsurance} onChange={e => setSocialInsurance(Number(e.target.value))} />
            </div>
            <Button className="w-full" onClick={calculate}>计算</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">结果</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {result ? (
              <>
                <div className="flex justify-between text-sm items-center"><span className="text-muted-foreground">年度收入</span><span className="font-medium">¥{result.total.toLocaleString()}</span></div>
                <Separator />
                <div className="flex justify-between text-sm items-center"><span className="text-muted-foreground">社保/公积金</span><span>¥{result.insurance.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm items-center"><span className="text-muted-foreground">减除费用 (6万)</span><span>¥60,000</span></div>
                <Separator />
                <div className="flex justify-between text-sm font-medium items-center"><span>应纳税所得额</span><span>¥{result.taxable.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-muted-foreground">应缴税额</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-primary">¥{fmt(result.tax)}</span>
                    <Button size="icon" variant="ghost" className="h-6 w-6 cursor-pointer" onClick={() => handleCopy('tax', `¥${fmt(result.tax)}`)}>
                      {copiedField === 'tax' ? <span className="text-xs text-green-500">✓</span> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between text-sm items-center"><span className="text-muted-foreground">实际税率</span><span>{result.effective}%</span></div>
                <Separator />
                <div className="flex justify-between text-sm items-center">
                  <span className="text-muted-foreground">税后年收入</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">¥{fmt(result.afterTax)}</span>
                    <Button size="icon" variant="ghost" className="h-6 w-6 cursor-pointer" onClick={() => handleCopy('afterTax', `¥${fmt(result.afterTax)}`)}>
                      {copiedField === 'afterTax' ? <span className="text-xs text-green-500">✓</span> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between text-sm items-center">
                  <span className="text-muted-foreground">大写</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{toChineseUppercase(result.afterTax)}</span>
                    <Button size="icon" variant="ghost" className="h-6 w-6 cursor-pointer" onClick={() => handleCopy('uppercase', toChineseUppercase(result.afterTax))}>
                      {copiedField === 'uppercase' ? <span className="text-xs text-green-500">✓</span> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">输入数据后点击计算</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
