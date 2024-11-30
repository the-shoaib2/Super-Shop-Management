import { Button } from '@/components/ui/button'
import { FiEdit2, FiTrash2, FiGrid, FiList } from 'react-icons/fi'
import { formatDate } from '@/lib/utils'

// Base Views Components
const BaseGridView = ({ items, handleEditClick, handleDeleteClick, renderContent }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
    {items.map((item) => (
      <div key={item.id} className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow">
        <div className="flex flex-col items-center space-y-3">
          {renderContent(item)}
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={() => handleEditClick(item)}>
              <FiEdit2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(item)}>
              <FiTrash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    ))}
  </div>
)

const BaseListView = ({ items, handleEditClick, handleDeleteClick, renderContent }) => (
  <div className="space-y-2">
    {items.map((item) => (
      <div key={item.id} className="bg-white p-3 rounded-lg border hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          {renderContent(item)}
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={() => handleEditClick(item)}>
              <FiEdit2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(item)}>
              <FiTrash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    ))}
  </div>
)

const BaseDetailsView = ({ items, handleEditClick, handleDeleteClick, renderContent, renderDetails }) => (
  <div className="space-y-4">
    {items.map((item) => (
      <div key={item.id} className="bg-white p-6 rounded-lg border hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {renderContent(item)}
          {renderDetails && (
            <div className="flex-1 space-y-4">
              {renderDetails(item)}
            </div>
          )}
          <div className="flex sm:flex-col gap-2">
            <Button variant="outline" size="sm" onClick={() => handleEditClick(item)} className="flex items-center gap-2">
              <FiEdit2 className="h-4 w-4" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleDeleteClick(item)} className="flex items-center gap-2 text-red-500 hover:text-red-600">
              <FiTrash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </div>
        </div>
      </div>
    ))}
  </div>
)

// Content Renderers
const renderColorContent = (color) => (
  <>
    <div className="w-16 h-16 rounded-full border-4 shadow-inner"
      style={{ 
        backgroundColor: color.value,
        borderColor: color.value === '#FFFFFF' ? '#e2e8f0' : color.value 
      }}
    />
    <div className="text-center">
      <h3 className="font-medium">{color.name}</h3>
      <p className="text-sm text-gray-500">{color.value}</p>
    </div>
  </>
)

const renderSizeContent = (size) => (
  <div className="text-center">
    <h3 className="font-medium text-lg">{size.name}</h3>
    <p className="text-sm text-gray-500">{size.value}</p>
  </div>
)

const renderBillboardContent = (billboard) => (
  <>
    <div className="aspect-[16/9] w-full relative mb-3">
      <img src={billboard.imageUrl} alt={billboard.label} className="w-full h-full object-cover rounded-md" />
    </div>
    <div className="text-center">
      <h3 className="font-medium">{billboard.label}</h3>
      <p className="text-sm text-gray-500">{billboard.description}</p>
    </div>
  </>
)

const renderCategoryContent = (category) => (
  <>
    {category.imageUrl && (
      <div className="aspect-square w-full relative mb-3">
        <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover rounded-md" />
      </div>
    )}
    <div className="text-center">
      <h3 className="font-medium">{category.name}</h3>
      <p className="text-sm text-gray-500">{category.description}</p>
    </div>
  </>
)

// Details Renderers
const renderColorDetails = (color) => (
  <>
    <div>
      <h3 className="text-lg font-medium">{color.name}</h3>
      <p className="text-sm text-gray-500">{color.value}</p>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
      <div>
        <span className="text-gray-500">Created:</span>
        <p>{new Date(color.createdAt).toLocaleDateString()}</p>
      </div>
      <div>
        <span className="text-gray-500">Last Updated:</span>
        <p>{new Date(color.updatedAt).toLocaleDateString()}</p>
      </div>
      <div>
        <span className="text-gray-500">Products:</span>
        <p>{color.productsCount || 0}</p>
      </div>
    </div>
  </>
)

const renderSizeDetails = (size) => (
  <>
    <div>
      <h3 className="text-lg font-medium">{size.name}</h3>
      <p className="text-sm text-gray-500">{size.value}</p>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
      {Object.entries(size.dimensions || {}).map(([key, value]) => (
        <div key={key}>
          <span className="text-gray-500 capitalize">{key}:</span>
          <p>{value}</p>
        </div>
      ))}
    </div>
  </>
)

const renderBillboardDetails = (billboard) => (
  <>
    <div>
      <h3 className="text-lg font-medium">{billboard.label}</h3>
      <p className="text-sm text-gray-500">{billboard.description}</p>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
      <div>
        <span className="text-gray-500">Status:</span>
        <p>{billboard.isActive ? 'Active' : 'Inactive'}</p>
      </div>
      <div>
        <span className="text-gray-500">Created:</span>
        <p>{new Date(billboard.createdAt).toLocaleDateString()}</p>
      </div>
      <div>
        <span className="text-gray-500">Categories:</span>
        <p>{billboard.categoriesCount || 0}</p>
      </div>
    </div>
  </>
)

// Add Price Content Renderer
const renderPriceContent = (price) => (
  <div className="text-center">
    <h3 className="font-medium text-lg">{price.name}</h3>
    <p className="text-sm text-gray-500">{price.value}</p>
  </div>
)

// Add Price Details Renderer
const renderPriceDetails = (price) => (
  <>
    <div>
      <h3 className="text-lg font-medium">{price.name}</h3>
      <p className="text-sm text-gray-500">{price.value}</p>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
      <div>
        <span className="text-gray-500">Created:</span>
        <p>{new Date(price.createdAt).toLocaleDateString()}</p>
      </div>
      <div>
        <span className="text-gray-500">Last Updated:</span>
        <p>{new Date(price.updatedAt).toLocaleDateString()}</p>
      </div>
      <div>
        <span className="text-gray-500">Products:</span>
        <p>{price.productsCount || 0}</p>
      </div>
    </div>
  </>
)

const renderCategoryDetails = (category) => (
  <>
    <div>
      <h3 className="text-lg font-medium">{category.name}</h3>
      <p className="text-sm text-gray-500">{category.description}</p>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
      <div>
        <span className="text-gray-500">Products:</span>
        <p>{category.productsCount || 0}</p>
      </div>
      <div>
        <span className="text-gray-500">Created:</span>
        <p>{new Date(category.createdAt).toLocaleDateString()}</p>
      </div>
      <div>
        <span className="text-gray-500">Status:</span>
        <p>{category.active ? 'Active' : 'Inactive'}</p>
      </div>
    </div>
  </>
)

// Export View Components
export const ProductViews = {
  Colors: {
    Grid: (props) => <BaseGridView {...props} renderContent={renderColorContent} />,
    List: (props) => <BaseListView {...props} renderContent={renderColorContent} />,
    Details: (props) => <BaseDetailsView {...props} renderContent={renderColorContent} renderDetails={renderColorDetails} />
  },
  Sizes: {
    Grid: (props) => <BaseGridView {...props} renderContent={renderSizeContent} />,
    List: (props) => <BaseListView {...props} renderContent={renderSizeContent} />,
    Details: (props) => <BaseDetailsView {...props} renderContent={renderSizeContent} renderDetails={renderSizeDetails} />
  },
  Billboards: {
    Grid: (props) => <BaseGridView {...props} renderContent={renderBillboardContent} />,
    List: (props) => <BaseListView {...props} renderContent={renderBillboardContent} />,
    Details: (props) => <BaseDetailsView {...props} renderContent={renderBillboardContent} renderDetails={renderBillboardDetails} />
  },
  Categories: {
    Grid: (props) => <BaseGridView {...props} renderContent={renderCategoryContent} />,
    List: (props) => <BaseListView {...props} renderContent={renderCategoryContent} />,
    Details: (props) => <BaseDetailsView {...props} renderContent={renderCategoryContent} renderDetails={renderCategoryDetails} />
  },
  Prices: {
    Grid: (props) => <BaseGridView {...props} renderContent={renderPriceContent} />,
    List: (props) => <BaseListView {...props} renderContent={renderPriceContent} />,
    Details: (props) => <BaseDetailsView {...props} renderContent={renderPriceContent} renderDetails={renderPriceDetails} />
  }
} 