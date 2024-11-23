import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { FiPlus, FiPackage, FiDollarSign, FiGrid, FiLayout, FiTag, FiBox } from 'react-icons/fi'
import CreateProductDialog from '@/components/dialogs/CreateProductDialog'

// Components for different sections
const ProductsSection = () => {
  // Your existing product management code
  return <div>Products Management</div>
}

const ColorsSection = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Colors</h2>
        <Button>
          <FiPlus className="mr-2 h-4 w-4" />
          Add Color
        </Button>
      </div>
      {/* Color management content */}
    </div>
  )
}

const SizesSection = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Sizes</h2>
        <Button>
          <FiPlus className="mr-2 h-4 w-4" />
          Add Size
        </Button>
      </div>
      {/* Size management content */}
    </div>
  )
}

const BillboardsSection = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Billboards</h2>
        <Button>
          <FiPlus className="mr-2 h-4 w-4" />
          Add Billboard
        </Button>
      </div>
      {/* Billboard management content */}
    </div>
  )
}

const CategoriesSection = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Categories</h2>
        <Button>
          <FiPlus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>
      {/* Category management content */}
    </div>
  )
}

const PricesSection = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Prices</h2>
        <Button>
          <FiPlus className="mr-2 h-4 w-4" />
          Add Price Range
        </Button>
      </div>
      {/* Price management content */}
    </div>
  )
}

const SECTIONS = [
  { id: 'products', label: 'Products', icon: FiPackage, component: ProductsSection },
  { id: 'colors', label: 'Colors', icon: FiGrid, component: ColorsSection },
  { id: 'sizes', label: 'Sizes', icon: FiBox, component: SizesSection },
  { id: 'billboards', label: 'Billboards', icon: FiLayout, component: BillboardsSection },
  { id: 'categories', label: 'Categories', icon: FiTag, component: CategoriesSection },
  { id: 'prices', label: 'Prices', icon: FiDollarSign, component: PricesSection }
]

export default function Products() {
  const { currentStore } = useAuth()
  const [activeSection, setActiveSection] = useState('products')
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const ActiveComponent = SECTIONS.find(section => section.id === activeSection)?.component || ProductsSection

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="border-b">
        <h1 className="text-2xl font-bold px-6 py-4">Product Management</h1>
        <nav className="flex space-x-4 px-6" aria-label="Tabs">
          {SECTIONS.map(section => {
            const Icon = section.icon
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`
                  flex items-center px-3 py-4 text-sm font-medium border-b-2 
                  ${activeSection === section.id 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                <Icon className="h-4 w-4 mr-2" />
                {section.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {SECTIONS.find(section => section.id === activeSection)?.label}
          </h1>
          {activeSection === 'products' && (
            <Button onClick={() => setShowCreateDialog(true)}>
              <FiPlus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          )}
        </div>

        <ActiveComponent />
      </div>

      {/* Dialogs */}
      <CreateProductDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
      />
    </div>
  )
} 