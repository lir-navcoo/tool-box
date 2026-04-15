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

  const linkIsActive = (path: string) => location.pathname === path

  return (
    <aside className="w-52 min-h-screen border-r bg-background flex flex-col py-6 px-3">
      <div className="mb-8 px-3">
        <Link to="/" className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logoGrad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <path d="M9.5 3C7.01 3 5 5.01 5 7.5V9H4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h1v1.5C5 17.43 7.57 20 10.5 20H12v-1h1.5c2.48 0 4.5-2.02 4.5-4.5V15h1a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-1v-1.5C17 7.57 14.43 5 11.5 5H10V4a1 1 0 0 0-1-1H8V7.5C8 5.01 9.5 3 9.5 3Z" fill="url(#logoGrad)"/>
            <path d="M11 7.5C11 6.67 10.33 6 9.5 6S8 6.67 8 7.5 8.67 9 9.5 9 11 8.33 11 7.5Z" fill="white" fillOpacity="0.6"/>
            <rect x="10" y="20" width="4" height="2" rx="1" fill="url(#logoGrad)" fillOpacity="0.5"/>
            <rect x="11" y="22" width="2" height="3" rx="1" fill="url(#logoGrad)" fillOpacity="0.3"/>
          </svg>
          <span className="text-lg font-semibold text-foreground">工具箱</span>
        </Link>
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
