import { GridView, ListView, DetailsView } from '../ProductViews'

const renderBillboardContent = (billboard) => (
  <>
    <div className="aspect-[16/9] w-full relative mb-3">
      <img
        src={billboard.imageUrl}
        alt={billboard.label}
        className="w-full h-full object-cover rounded-md"
      />
    </div>
    <div className="text-center">
      <h3 className="font-medium">{billboard.label}</h3>
      <p className="text-sm text-gray-500">{billboard.description}</p>
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

export const BillboardGridView = (props) => (
  <GridView {...props} renderItemContent={renderBillboardContent} />
)

export const BillboardListView = (props) => (
  <ListView {...props} renderItemContent={renderBillboardContent} />
)

export const BillboardDetailsView = (props) => (
  <DetailsView 
    {...props} 
    renderItemContent={renderBillboardContent}
    renderItemDetails={renderBillboardDetails}
  />
) 