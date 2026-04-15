import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { categories, tools } from '@/data/tools'
import {
  Lock, QrCode, ImageIcon, Palette, Calculator, FileJson
} from 'lucide-react'

const iconMap: Record<string, React.ReactNode> = {
  json: <FileJson className="h-5 w-5" />,
  encrypt: <Lock className="h-5 w-5" />,
  qrcode: <QrCode className="h-5 w-5" />,
  image: <ImageIcon className="h-5 w-5" />,
  color: <Palette className="h-5 w-5" />,
  'tax-personal': <Calculator className="h-5 w-5" />,
  'tax-invoice': <Calculator className="h-5 w-5" />,
}

export default function HomePage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold mb-2">欢迎使用工具箱</h2>
        <p className="text-muted-foreground">简洁高效的在线工具集，无需下载，注册即可使用</p>
      </div>

      {categories.filter(c => c.id !== 'home').map(cat => {
        const catTools = getToolsByCategory(cat.id)
        if (catTools.length === 0) return null
        return (
          <div key={cat.id} className="mb-8">
            <h3 className="text-lg font-medium mb-4">{cat.name}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {catTools.map(tool => (
                <Link key={tool.id} to={'/' + tool.id}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        {iconMap[tool.id]}
                        {tool.name}
                      </CardTitle>
                      <CardDescription>{tool.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function getToolsByCategory(cat: string) {
  return tools.filter(t => t.category === cat)
}
