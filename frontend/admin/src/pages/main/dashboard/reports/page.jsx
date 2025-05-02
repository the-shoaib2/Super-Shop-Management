import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Calendar, FileText, BarChart2, PieChart, LineChart } from "lucide-react";

export default function StoreReports() {
  return (
    <div className="space-y-6">
      {/* Report Types */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Report Types</CardTitle>
          <CardDescription className="text-sm">Select and generate different types of reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-primary/5 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-sm font-medium">Sales Report</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-3">Detailed analysis of sales performance</p>
              <Button variant="outline" size="sm" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BarChart2 className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-sm font-medium">Inventory Report</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-3">Stock levels and product performance</p>
              <Button variant="outline" size="sm" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <PieChart className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-sm font-medium">Customer Report</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-3">Customer behavior and demographics</p>
              <Button variant="outline" size="sm" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Report Generator */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Custom Report Generator</CardTitle>
          <CardDescription className="text-sm">Create custom reports with specific parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales Report</SelectItem>
                  <SelectItem value="inventory">Inventory Report</SelectItem>
                  <SelectItem value="customer">Customer Report</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Time Period</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Format</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">&nbsp;</label>
              <Button className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Reports */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Scheduled Reports</CardTitle>
          <CardDescription className="text-sm">Automatically generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Last Generated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Daily Sales Summary</TableCell>
                <TableCell>Sales Report</TableCell>
                <TableCell>Daily</TableCell>
                <TableCell>Today, 8:00 AM</TableCell>
                <TableCell>
                  <Badge variant="success">Completed</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Weekly Inventory</TableCell>
                <TableCell>Inventory Report</TableCell>
                <TableCell>Weekly</TableCell>
                <TableCell>Last Monday, 9:00 AM</TableCell>
                <TableCell>
                  <Badge variant="success">Completed</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Monthly Customer Analysis</TableCell>
                <TableCell>Customer Report</TableCell>
                <TableCell>Monthly</TableCell>
                <TableCell>Last Month, 1st</TableCell>
                <TableCell>
                  <Badge variant="success">Completed</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}