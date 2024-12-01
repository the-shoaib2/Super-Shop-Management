import { VariantButton } from '../shared/VariantButton'

export const ProductVariantsStep = ({ 
  formData, 
  setFormData, 
  errors, 
  setErrors, 
  options,
  showAllColors,
  setShowAllColors,
  showAllSizes,
  setShowAllSizes 
}) => {
  const MAX_VISIBLE = 5;
  const visibleColors = showAllColors ? options.colors : options.colors.slice(0, MAX_VISIBLE);
  const visibleSizes = showAllSizes ? options.sizes : options.sizes.slice(0, MAX_VISIBLE);
  
  return (
    <div className="space-y-8">
      {/* Colors Section - Only show if colors exist */}
      {options.colors.length > 0 ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <label className="text-base font-medium">Colors</label>
              <p className="text-sm text-muted-foreground mt-1">Choose available product colors</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium">{formData.colors.length} selected</span>
              <p className="text-xs text-muted-foreground mt-0.5">Minimum 1 required</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {visibleColors.map(color => (
              <VariantButton
                key={color.id}
                selected={formData.colors.includes(color.id)}
                error={errors.colors && !formData.colors.includes(color.id)}
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    colors: prev.colors.includes(color.id)
                      ? prev.colors.filter(id => id !== color.id)
                      : [...prev.colors, color.id]
                  }))
                  if (errors.colors) setErrors(prev => ({ ...prev, colors: null }));
                }}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <div 
                    className="w-7 h-7 rounded-full border-2 border-white shadow-md mb-2"
                    style={{ backgroundColor: color.value }}
                  />
                  <span className="text-sm font-medium leading-tight">{color.name}</span>
                  <span className="text-[10px] text-muted-foreground mt-0.5 font-medium tracking-wider uppercase">
                    {color.value}
                  </span>
                </div>
              </VariantButton>
            ))}
            
            {options.colors.length > MAX_VISIBLE && (
              <button
                onClick={() => setShowAllColors(!showAllColors)}
                className="w-full h-[68px] flex flex-col items-center justify-center rounded-lg 
                  border-2 border-dashed border-gray-200 hover:border-primary/30 hover:bg-gray-50/80
                  transition-colors group"
              >
                <span className="text-sm font-medium text-muted-foreground group-hover:text-primary">
                  {showAllColors ? 'Show Less' : 'View All Colors'}
                </span>
                {!showAllColors && (
                  <span className="text-xs text-muted-foreground mt-1">
                    +{options.colors.length - MAX_VISIBLE} more options
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No colors available. Please add colors in the store settings first.
          </p>
        </div>
      )}

      {/* Sizes Section - Only show if sizes exist */}
      {options.sizes.length > 0 ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <label className="text-base font-medium">Sizes</label>
              <p className="text-sm text-muted-foreground mt-1">Choose available product sizes</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium">{formData.sizes.length} selected</span>
              <p className="text-xs text-muted-foreground mt-0.5">Minimum 1 required</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {visibleSizes.map(size => (
              <VariantButton
                key={size.id}
                selected={formData.sizes.includes(size.id)}
                error={errors.sizes && !formData.sizes.includes(size.id)}
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    sizes: prev.sizes.includes(size.id)
                      ? prev.sizes.filter(id => id !== size.id)
                      : [...prev.sizes, size.id]
                  }))
                  if (errors.sizes) setErrors(prev => ({ ...prev, sizes: null }));
                }}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <span className="text-base font-medium leading-tight">{size.name}</span>
                  {size.value && (
                    <span className="text-xs text-muted-foreground mt-1.5 font-medium tracking-wider">
                      {size.value}
                    </span>
                  )}
                </div>
              </VariantButton>
            ))}
            
            {options.sizes.length > MAX_VISIBLE && (
              <button
                onClick={() => setShowAllSizes(!showAllSizes)}
                className="w-full h-[68px] flex flex-col items-center justify-center rounded-lg 
                  border-2 border-dashed border-gray-200 hover:border-primary/30 hover:bg-gray-50/80
                  transition-colors group"
              >
                <span className="text-sm font-medium text-muted-foreground group-hover:text-primary">
                  {showAllSizes ? 'Show Less' : 'View All Sizes'}
                </span>
                {!showAllSizes && (
                  <span className="text-xs text-muted-foreground mt-1">
                    +{options.sizes.length - MAX_VISIBLE} more options
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No sizes available. Please add sizes in the store settings first.
          </p>
        </div>
      )}
    </div>
  )
} 