import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUp, ArrowDown, TrendingUp, ShoppingCart, Users, DollarSign, Package } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { DEMO_SALES_DATA, DEMO_CATEGORY_STATS, DEMO_PRODUCT_STATS, DEMO_SALES_TREND_DATA } from '@/constants/dashboard-data';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF4560', '#775DD0'];

export default function StoreAnalytics() {
  return (
    <div className="space-y-6">
      {/* Sales Performance Overview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Sales Performance Overview</CardTitle>
          <CardDescription className="text-sm">Key metrics and trends for your store's sales performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
              <p className="text-2xl font-bold">$24,567</p>
              <Badge variant="success" className="h-5">
                <ArrowUp className="h-3 w-3 mr-1" />
                12.5%
              </Badge>
            </div>
            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground">Average Order Value</h3>
              <p className="text-2xl font-bold">$89.45</p>
              <Badge variant="success" className="h-5">
                <ArrowUp className="h-3 w-3 mr-1" />
                5.2%
              </Badge>
            </div>
            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground">Conversion Rate</h3>
              <p className="text-2xl font-bold">3.2%</p>
              <Badge variant="destructive" className="h-5">
                <ArrowDown className="h-3 w-3 mr-1" />
                0.8%
              </Badge>
            </div>
            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground">Customer Retention</h3>
              <p className="text-2xl font-bold">78%</p>
              <Badge variant="success" className="h-5">
                <ArrowUp className="h-3 w-3 mr-1" />
                2.3%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sales Trend Analysis */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Sales Trend Analysis</CardTitle>
          <CardDescription className="text-sm">Daily sales performance over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={DEMO_SALES_TREND_DATA}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#82ca9d" 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Product Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Top Selling Products</CardTitle>
            <CardDescription className="text-sm">Revenue distribution by product</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={DEMO_PRODUCT_STATS}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="sales"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {DEMO_PRODUCT_STATS.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`$${value}`, 'Sales']}
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Category Performance</CardTitle>
            <CardDescription className="text-sm">Sales distribution across product categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={DEMO_CATEGORY_STATS}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="sales" fill="#8884d8" name="Sales" />
                  <Bar dataKey="orders" fill="#82ca9d" name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Analysis */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Customer Analysis</CardTitle>
          <CardDescription className="text-sm">Customer behavior and demographics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Acquisition</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={DEMO_SALES_TREND_DATA}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="newCustomers" 
                      stackId="1"
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.6}
                      name="New Customers"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Segments</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="20%"
                    outerRadius="80%"
                    data={DEMO_CATEGORY_STATS}
                  >
                    <RadialBar
                      minAngle={15}
                      label={{ position: 'insideStart', fill: '#fff' }}
                      background
                      dataKey="value"
                    >
                      {DEMO_CATEGORY_STATS.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </RadialBar>
                    <Legend />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}