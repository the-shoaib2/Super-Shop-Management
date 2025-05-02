import { useState } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FiPackage, FiDollarSign, FiGrid, FiLayout, FiTag, FiBox } from 'react-icons/fi'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

// Import section components
import ProductsList from '@/components/store/products/products-list'
import ColorsList from '@/components/store/products/colors-list'
import SizesList from '@/components/store/products/sizes-list'
import BillboardsList from '@/components/store/products/billboards-list'
import CategoriesList from '@/components/store/products/categories-list'
import PricesList from '@/components/store/products/prices-list'

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
  const navigate = useNavigate()
  const currentSection = SECTIONS.find(section => 
    location.pathname.includes(section.id)
  ) || SECTIONS[0]

  return (
    <div className="space-y-6">
      {/* Product Management Section */}
      <div className="border-b">
        <h1 className="text-2xl font-bold px-6 py-4">Product Management</h1>
      </div>
      
      {/* Tabs Navigation and Content */}
      <div className="px-6 py-4">
        <Tabs 
          defaultValue={currentSection.id} 
          onValueChange={(value) => {
            const section = SECTIONS.find(s => s.id === value)
            if (section) navigate(section.path)
          }}
          className="w-full"
        >
          {/* Tab Navigation */}
          <TabsList className="w-full justify-start mb-6">
            {SECTIONS.map(section => {
              const Icon = section.icon
              return (
                <TabsTrigger 
                  key={section.id} 
                  value={section.id}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {section.label}
                </TabsTrigger>
              )
            })}
          </TabsList>

          {/* Tab Content */}
          <TabsContent value="products">
            <Routes>
              <Route path="products/*" element={<ProductsList />} />
              <Route path="*" element={<ProductsList />} />
            </Routes>
          </TabsContent>
          <TabsContent value="colors">
            <Routes>
              <Route path="colors/*" element={<ColorsList />} />
            </Routes>
          </TabsContent>
          <TabsContent value="sizes">
            <Routes>
              <Route path="sizes/*" element={<SizesList />} />
            </Routes>
          </TabsContent>
          <TabsContent value="categories">
            <Routes>
              <Route path="categories/*" element={<CategoriesList />} />
            </Routes>
          </TabsContent>
          <TabsContent value="billboards">
            <Routes>
              <Route path="billboards/*" element={<BillboardsList />} />
            </Routes>
          </TabsContent>
          <TabsContent value="prices">
            <Routes>
              <Route path="prices/*" element={<PricesList />} />
            </Routes>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}