import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"

export default function StoreOverview() {
  return (
    <div className="space-y-4">
      {/* Key Performance Indicators */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Key Performance Indicators</CardTitle>
          <CardDescription className="text-sm">Overview of your store's key metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-primary/5 p-3 rounded-lg">
              <h3 className="text-xs font-medium text-muted-foreground">Total Sales</h3>
              <p className="text-xl font-bold">$24,567</p>
              <span className="text-xs text-green-500">↑ 12.5%</span>
            </div>
            <div className="bg-primary/5 p-3 rounded-lg">
              <h3 className="text-xs font-medium text-muted-foreground">Total Orders</h3>
              <p className="text-xl font-bold">1,234</p>
              <span className="text-xs text-green-500">↑ 8.2%</span>
            </div>
            <div className="bg-primary/5 p-3 rounded-lg">
              <h3 className="text-xs font-medium text-muted-foreground">Total Products</h3>
              <p className="text-xl font-bold">567</p>
              <span className="text-xs text-green-500">↑ 3.1%</span>
            </div>
            <div className="bg-primary/5 p-3 rounded-lg">
              <h3 className="text-xs font-medium text-muted-foreground">Total Customers</h3>
              <p className="text-xl font-bold">4,321</p>
              <span className="text-xs text-green-500">↑ 5.7%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Store Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Store Performance</CardTitle>
            <CardDescription className="text-sm">Detailed metrics about your store's performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Average Order Value</span>
                <span className="font-medium">$89.45</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Conversion Rate</span>
                <span className="font-medium">3.2%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Customer Retention</span>
                <span className="font-medium">78%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Inventory Turnover</span>
                <span className="font-medium">4.5x</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Financial Overview</CardTitle>
            <CardDescription className="text-sm">Key financial metrics for your store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Gross Profit Margin</span>
                <span className="font-medium">45.2%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Operating Expenses</span>
                <span className="font-medium">$12,345</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Net Profit</span>
                <span className="font-medium">$8,765</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Cash Flow</span>
                <span className="font-medium">$6,543</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Recent Activity</CardTitle>
          <CardDescription className="text-sm">Latest events and updates in your store</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">New order received</p>
                <p className="text-xs text-muted-foreground">Order #1234 for $89.99 was placed by John Doe</p>
                <p className="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">Inventory update</p>
                <p className="text-xs text-muted-foreground">Product "Premium Widget" stock level is low (5 remaining)</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">New customer registered</p>
                <p className="text-xs text-muted-foreground">Jane Smith created a new account</p>
                <p className="text-xs text-muted-foreground">3 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription className="text-sm">Common tasks and operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
              <div className="flex flex-col items-center space-y-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-xs font-medium">Add Product</span>
              </div>
            </button>
            <button className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
              <div className="flex flex-col items-center space-y-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-xs font-medium">View Orders</span>
              </div>
            </button>
            <button className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
              <div className="flex flex-col items-center space-y-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-xs font-medium">Manage Customers</span>
              </div>
            </button>
            <button className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
              <div className="flex flex-col items-center space-y-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-xs font-medium">View Reports</span>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}