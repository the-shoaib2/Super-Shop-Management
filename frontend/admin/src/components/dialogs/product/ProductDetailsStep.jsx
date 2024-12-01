import { FormField } from '../shared/FormField'

export const ProductDetailsStep = ({ formData, setFormData, errors, setErrors, options }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <FormField label="Product Name *" error={errors.name}>
          <input
            type="text"
            className={`w-full h-11 px-4 border-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all
              ${errors.name ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'}`}
            value={formData.name}
            onChange={(e) => {
              const value = e.target.value;
              setFormData(prev => ({
                ...prev,
                name: value
              }));
              if (errors.name) {
                setErrors(prev => ({
                  ...prev,
                  name: null
                }));
              }
            }}
            placeholder="Enter product name"
          />
        </FormField>
      </div>

      <FormField label="Price *" error={errors.price}>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
          <input
            type="number"
            min="0"
            step="0.01"
            className={`w-full h-11 pl-8 pr-4 border-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all
              ${errors.price ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'}`}
            value={formData.price}
            onChange={(e) => {
              const value = e.target.value;
              setFormData(prev => ({
                ...prev,
                price: value
              }));
              if (errors.price) {
                setErrors(prev => ({
                  ...prev,
                  price: null
                }));
              }
            }}
            placeholder="0.00"
          />
        </div>
      </FormField>

      <FormField label="Category *" error={errors.category}>
        <div className="relative">
          <select
            className={`w-full h-11 px-4 border-2 rounded-lg bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all
              ${errors.category ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'}`}
            value={formData.category}
            onChange={(e) => {
              const value = e.target.value;
              setFormData(prev => ({
                ...prev,
                category: value
              }));
              if (errors.category) {
                setErrors(prev => ({
                  ...prev,
                  category: null
                }));
              }
            }}
          >
            <option value="">Select Category</option>
            {options.categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </FormField>

      <div className="md:col-span-2">
        <FormField label="Description">
          <textarea
            className="w-full px-4 py-3 border-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all
              border-gray-200 hover:border-gray-300 min-h-[100px] resize-none"
            value={formData.description}
            onChange={(e) => {
              const value = e.target.value;
              setFormData(prev => ({
                ...prev,
                description: value
              }));
            }}
            placeholder="Describe your product..."
          />
        </FormField>
      </div>
    </div>
  )
} 