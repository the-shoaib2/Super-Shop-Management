import { Button } from '@/components/ui/button'
import { PAYMENT_METHODS, BANGLADESH_BANKS } from '../constants/settings'

export function BillingSection({ formData, setFormData }) {
  return (
    <div className="space-y-6">
      {/* Payment Methods */}
      <div>
        <h3 className="text-lg font-medium mb-4">Payment Methods</h3>
        <div className="space-y-4">
          {/* Mobile Banking */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-3">Mobile Banking</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PAYMENT_METHODS.slice(0, 4).map(method => (
                <div 
                  key={method.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                  style={{ borderColor: method.color }}
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: method.color }}
                    >
                      {method.icon}
                    </div>
                    <div>
                      <p className="font-medium">{method.name}</p>
                      {formData[`${method.id}Number`] && (
                        <p className="text-sm text-gray-500">
                          •••• {formData[`${method.id}Number`].slice(-4)}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      // Handle adding/editing mobile banking number
                    }}
                  >
                    {formData[`${method.id}Number`] ? 'Edit' : 'Add'}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Bank Transfer */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-3">Bank Account</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Select Bank</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={formData.bankName || ''}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                >
                  <option value="">Select a bank</option>
                  {BANGLADESH_BANKS.map(bank => (
                    <option key={bank.id} value={bank.id}>{bank.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Account Number</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={formData.bankAccountNumber || ''}
                  onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                  placeholder="Enter your account number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Account Holder Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={formData.bankAccountName || ''}
                  onChange={(e) => setFormData({ ...formData, bankAccountName: e.target.value })}
                  placeholder="Enter account holder name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Branch Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={formData.bankBranch || ''}
                  onChange={(e) => setFormData({ ...formData, bankBranch: e.target.value })}
                  placeholder="Enter branch name"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div>
        <h3 className="text-lg font-medium mb-4">Billing History</h3>
        <div className="space-y-4">
          {/* Example invoice */}
          <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
            <div>
              <p className="font-medium">Invoice #1234</p>
              <p className="text-sm text-gray-500">Jan 1, 2024</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-medium">৳2,999</span>
              <Button variant="ghost" size="sm">Download</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Billing Address */}
      <div>
        <h3 className="text-lg font-medium mb-4">Billing Address</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Street Address</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={formData.billingAddress || ''}
              onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
              placeholder="Enter street address"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={formData.billingCity || ''}
                onChange={(e) => setFormData({ ...formData, billingCity: e.target.value })}
                placeholder="Enter city"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Division</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={formData.billingDivision || ''}
                onChange={(e) => setFormData({ ...formData, billingDivision: e.target.value })}
                placeholder="Enter division"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Postal Code</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={formData.billingPostalCode || ''}
              onChange={(e) => setFormData({ ...formData, billingPostalCode: e.target.value })}
              placeholder="Enter postal code"
            />
          </div>
        </div>
      </div>
    </div>
  )
} 