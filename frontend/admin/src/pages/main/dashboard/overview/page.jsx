import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowUp, ArrowDown, ShoppingCart, Users, Package, DollarSign } from "lucide-react";

export default function StoreOverview({ stats }) {
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
              <p className="text-xl font-bold g">${stats?.totalSales?.toFixed(2) || '0.00'}</p>
              <Badge variant="success" className="h-5">
                <ArrowUp className="h-3 w-3 mr-1" />
                {stats?.salesGrowth?.toFixed(1) || '0'}%
              </Badge>
            </div>
            <div className="bg-primary/5 p-3 rounded-lg">
              <h3 className="text-xs font-medium text-muted-foreground">Total Orders</h3>
              <p className="text-xl font-bold ">{stats?.totalOrders || 0}</p>
              <Badge variant="success" className="h-5">
                <ArrowUp className="h-3 w-3 mr-1" />
                {stats?.ordersGrowth?.toFixed(1) || '0'}%
              </Badge>
            </div>
            <div className="bg-primary/5 p-3 rounded-lg">
              <h3 className="text-xs font-medium text-muted-foreground">Total Products</h3>
              <p className="text-xl font-bold">{stats?.totalProducts || 0}</p>
              <Badge variant="success" className="h-5">
                <ArrowUp className="h-3 w-3 mr-1" />
                {stats?.productsGrowth?.toFixed(1) || '0'}%
              </Badge>
            </div>
            <div className="bg-primary/5 p-3 rounded-lg">
              <h3 className="text-xs font-medium text-muted-foreground">Total Customers</h3>
              <p className="text-xl font-bold">{stats?.totalCustomers || 0}</p>
              <Badge variant="success" className="h-5">
                <ArrowUp className="h-3 w-3 mr-1" />
                {stats?.customersGrowth?.toFixed(1) || '0'}%
              </Badge>
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
                <span className="font-medium">${stats?.avgOrderValue?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Conversion Rate</span>
                <span className="font-medium">{stats?.conversionRate?.toFixed(1) || '0'}%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Customer Retention</span>
                <span className="font-medium">{stats?.customerRetention?.toFixed(1) || '0'}%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Inventory Turnover</span>
                <span className="font-medium">{stats?.inventoryTurnover?.toFixed(1) || '0'}x</span>
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
                <span className="font-medium">{stats?.grossProfitMargin?.toFixed(1) || '0'}%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Operating Expenses</span>
                <span className="font-medium">${stats?.operatingExpenses?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Net Profit</span>
                <span className="font-medium">${stats?.netProfit?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Cash Flow</span>
                <span className="font-medium">${stats?.cashFlow?.toFixed(2) || '0.00'}</span>
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
            {stats?.recentActivities?.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  {activity.type === 'order' && <ShoppingCart className="h-4 w-4 text-primary" />}
                  {activity.type === 'customer' && <Users className="h-4 w-4 text-primary" />}
                  {activity.type === 'product' && <Package className="h-4 w-4 text-primary" />}
                  {activity.type === 'payment' && <DollarSign className="h-4 w-4 text-primary" />}
                </div>
                <div>
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
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
                <Package className="h-5 w-5 text-primary" />
                <span className="text-xs font-medium">Add Product</span>
              </div>
            </button>
            <button className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
              <div className="flex flex-col items-center space-y-1">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <span className="text-xs font-medium">View Orders</span>
              </div>
            </button>
            <button className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
              <div className="flex flex-col items-center space-y-1">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-xs font-medium">Manage Customers</span>
              </div>
            </button>
            <button className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
              <div className="flex flex-col items-center space-y-1">
                <DollarSign className="h-5 w-5 text-primary" />
                <span className="text-xs font-medium">View Reports</span>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}