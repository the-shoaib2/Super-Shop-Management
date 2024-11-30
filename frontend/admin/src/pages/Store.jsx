import { useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FiPackage, FiDollarSign, FiGrid, FiLayout, FiTag, FiBox } from 'react-icons/fi'

// Import section components
import ProductsList from '@/components/store/products/ProductsList'
import ColorsList from '@/components/store/products/ColorsList'
import SizesList from '@/components/store/products/SizesList'
import BillboardsList from '@/components/store/products/BillboardsList'
import CategoriesList from '@/components/store/products/CategoriesList'
import PricesList from '@/components/store/products/PricesList'

const SECTIONS = [
  { 
    id: 'products', 
    label: 'Products', 
    icon: FiPackage,
    path: '/store/products'
  },
  { 
    id: 'colors', 
    label: 'Colors', 
    icon: FiGrid,
    path: '/store/colors'
  },
  { 
    id: 'sizes', 
    label: 'Sizes', 
    icon: FiBox,
    path: '/store/sizes'
  },
  { 
    id: 'categories', 
    label: 'Categories', 
    icon: FiTag,
    path: '/store/categories'
  },  
  { 
    id: 'billboards', 
    label: 'Billboards', 
    icon: FiLayout,
    path: '/store/billboards'
  },
  { 
    id: 'prices', 
    label: 'Prices', 
    icon: FiDollarSign,
    path: '/store/prices'
  }
]

export default function Products() {
  const location = useLocation()
  const currentSection = SECTIONS.find(section => 
    location.pathname.includes(section.id)
  ) || SECTIONS[0]

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="border-b">
        <h1 className="text-2xl font-bold px-6 py-4">Product Management</h1>
        <nav className="flex space-x-4 px-6" aria-label="Tabs">
          {SECTIONS.map(section => {
            const Icon = section.icon
            const isActive = location.pathname.includes(section.id)
            
            return (
              <Link
                key={section.id}
                to={section.path}
                className={`
                  flex items-center px-3 py-4 text-sm font-medium border-b-2 
                  ${isActive 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                <Icon className="h-4 w-4 mr-2" />
                {section.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="px-6">
        <Routes>
          <Route path="products/*" element={<ProductsList />} />
          <Route path="colors/*" element={<ColorsList />} />
          <Route path="sizes/*" element={<SizesList />} />
          <Route path="categories/*" element={<CategoriesList />} />
          <Route path="billboards/*" element={<BillboardsList />} />
          <Route path="prices/*" element={<PricesList />} />
          <Route path="*" element={<ProductsList />} />
        </Routes>
      </div>
    </div>
  )
} 