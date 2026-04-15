import { Link, useLocation } from 'react-router-dom'
import { categories } from '@/data/tools'
import { cn } from '@/lib/utils'
import { Home } from 'lucide-react'

export function Sidebar() {
  const location = useLocation()

  const isActive = (id: string) => {
    if (id === 'home') return location.pathname === '/'
    return location.pathname.startsWith('/' + id)
  }

  // 按路由精确匹配高亮
  const linkIsActive = (path: string) => location.pathname === path

  return (
    <aside className="w-52 min-h-screen border-r bg-background flex flex-col py-6 px-3">
      <div className="mb-8 px-3">
        <h1 className="text-lg font-semibold text-foreground">🛠️ 工具箱</h1>
      </div>
      <nav className="flex flex-col gap-1">
        {categories.map(cat => {
          const active = isActive(cat.id)
          return (
            <div key={cat.id}>
              {cat.id === 'home' ? (
                <Link
                  to="/"
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
                    active
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <span><Home className="h-4 w-4" /></span>
                  <span>{cat.name}</span>
                </Link>
              ) : (
                <div className="mt-2">
                  <div className="px-3 py-1 text-xs text-muted-foreground uppercase tracking-wider">{cat.name}</div>
                  {cat.id === 'dev' && (
                    <>
                      <Link to="/json" className={cn('nav-link', linkIsActive('/json') && 'active')}>JSON 格式化</Link>
                      <Link to="/encrypt" className={cn('nav-link', linkIsActive('/encrypt') && 'active')}>加密解密</Link>
                    </>
                  )}
                  {cat.id === 'util' && (
                    <>
                      <Link to="/qrcode" className={cn('nav-link', linkIsActive('/qrcode') && 'active')}>二维码生成</Link>
                      <Link to="/image" className={cn('nav-link', linkIsActive('/image') && 'active')}>图片转换</Link>
                      <Link to="/color" className={cn('nav-link', linkIsActive('/color') && 'active')}>颜色工具</Link>
                    </>
                  )}
                  {cat.id === 'finance' && (
                    <>
                      <Link to="/tax-personal" className={cn('nav-link', linkIsActive('/tax-personal') && 'active')}>个税计算器</Link>
                      <Link to="/tax-invoice" className={cn('nav-link', linkIsActive('/tax-invoice') && 'active')}>税额计算器</Link>
                    </>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
