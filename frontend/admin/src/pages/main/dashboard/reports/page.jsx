import React from 'react';
import { DEMO_SALES_DATA, DEMO_CATEGORY_STATS, DEMO_PRODUCT_STATS, DEMO_SALES_TREND_DATA } from '@/constants/dashboard-data';

export default function StoreReports() {
  return (
    <div className="space-y-4">
      <div className="bg-white/80 rounded-lg shadow p-4">
        <h2 className="text-lg font-bold mb-3">Store Reports</h2>
        
        {/* Available Reports Section */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Sales Report Card */}
            <div className="border border-border rounded-lg p-3 hover:bg-secondary/5 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-medium">Sales Report</h4>
                  <p className="text-xs text-muted-foreground mt-1">Detailed breakdown of sales by product, category, and time period.</p>
                </div>
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Last updated: Today</span>
                <button className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                  Download
                </button>
              </div>
            </div>
            
            {/* Inventory Report Card */}
            <div className="border border-border rounded-lg p-3 hover:bg-secondary/5 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-medium">Inventory Report</h4>
                  <p className="text-xs text-muted-foreground mt-1">Current stock levels, low stock alerts, and inventory valuation.</p>
                </div>
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Last updated: Yesterday</span>
                <button className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                  Download
                </button>
              </div>
            </div>
            
            {/* Customer Report Card */}
            <div className="border border-border rounded-lg p-3 hover:bg-secondary/5 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-medium">Customer Report</h4>
                  <p className="text-xs text-muted-foreground mt-1">Customer demographics, purchase history, and loyalty metrics.</p>
                </div>
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Last updated: 3 days ago</span>
                <button className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Custom Report Generator */}
        <div className="bg-secondary/10 p-4 rounded-lg">
          <h3 className="text-sm font-semibold mb-3">Generate Custom Report</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium mb-1" htmlFor="report-type">
                Report Type
              </label>
              <select 
                id="report-type"
                className="w-full px-2 py-1.5 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="sales">Sales Report</option>
                <option value="inventory">Inventory Report</option>
                <option value="customer">Customer Report</option>
                <option value="financial">Financial Report</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium mb-1" htmlFor="date-range">
                Date Range
              </label>
              <select 
                id="date-range"
                className="w-full px-2 py-1.5 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="last7days">Last 7 Days</option>
                <option value="last30days">Last 30 Days</option>
                <option value="thisMonth">This Month</option>
                <option value="lastMonth">Last Month</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium mb-1" htmlFor="format">
                Format
              </label>
              <select 
                id="format"
                className="w-full px-2 py-1.5 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
              Generate Report
            </button>
          </div>
        </div>
        
        {/* Scheduled Reports */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-3">Scheduled Reports</h3>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-secondary/10">
                <tr>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Report Name
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Frequency
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Recipients
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Next Delivery
                  </th>
                  <th scope="col" className="relative px-4 py-2">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-border">
                <tr className="hover:bg-secondary/5 transition-colors">
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                    Weekly Sales Summary
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-muted-foreground">
                    Weekly (Monday)
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-muted-foreground">
                    3 recipients
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-muted-foreground">
                    Next Monday
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary hover:text-primary/80 transition-colors">
                      Edit
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-secondary/5 transition-colors">
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                    Monthly Financial Report
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-muted-foreground">
                    Monthly (1st)
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-muted-foreground">
                    2 recipients
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-muted-foreground">
                    1st of next month
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary hover:text-primary/80 transition-colors">
                      Edit
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}