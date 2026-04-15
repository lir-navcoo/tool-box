export interface Tool {
  id: string
  name: string
  description: string
  category: string
}

export interface Category {
  id: string
  name: string
  icon: string
}

export const categories: Category[] = [
  { id: 'home', name: '首页', icon: 'Home' },
  { id: 'dev', name: '开发工具', icon: 'Code' },
  { id: 'util', name: '实用工具', icon: 'Wrench' },
  { id: 'finance', name: '财务工具', icon: 'Calculator' },
]

export const tools: Tool[] = [
  // 开发工具
  { id: 'json', name: 'JSON 格式化', description: '格式化、压缩、校验 JSON', category: 'dev' },
  { id: 'encrypt', name: '加密解密', description: 'Base64、MD5、AES 加密解密', category: 'dev' },
  // 实用工具
  { id: 'qrcode', name: '二维码生成', description: '生成文本/URL 二维码', category: 'util' },
  { id: 'image', name: '图片转换', description: '图片格式互转、压缩', category: 'util' },
  { id: 'color', name: '颜色工具', description: '颜色格式转换、取色器', category: 'util' },
  // 财务工具
  { id: 'tax-personal', name: '个税计算器', description: '计算个人所得税', category: 'finance' },
  { id: 'tax-invoice', name: '税额计算器', description: '计算含税/不含税金额', category: 'finance' },
]

export const getToolById = (id: string) => tools.find(t => t.id === id)
export const getToolsByCategory = (cat: string) => tools.filter(t => t.category === cat)
