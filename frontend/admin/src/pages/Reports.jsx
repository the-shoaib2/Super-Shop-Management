import React, { useState, useEffect, useMemo, useRef } from 'react';
import { format, addDays } from 'date-fns';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "../components/ui/card.jsx";
import { Button } from "../components/ui/button.jsx";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from '../components/ui/tabs.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu.jsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover.jsx";
import { Calendar } from "../components/ui/calendar.jsx";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../components/ui/table.jsx";
import { reportsService } from '../services/api/reports/reportsService.js';
import { 
  AlertCircle, 
  BarChart2, 
  RefreshCw, 
  TrendingUp,
  ChevronDown,
  Calendar as CalendarIcon
} from 'lucide-react';
import { cn } from "../lib/utils.js";
import { useReactToPrint } from 'react-to-print';

// Utility function for safe number formatting
const formatNumber = (value, options = {}) => {
  const defaultOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  };
  return ((value ?? 0).toLocaleString('en-US', { ...defaultOptions, ...options }));
};

// Utility function for safe array rendering
const safeRender = (data, renderFn, emptyMessage = 'No data available') => {
  const safeData = Array.isArray(data) ? data : [];
  return safeData.length > 0 
    ? safeData.map(renderFn) 
    : (
      <TableRow>
        <TableCell colSpan={100} className="text-center text-muted-foreground">
          {emptyMessage}
        </TableCell>
      </TableRow>
    );
};

const REPORT_PERIODS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' }
];

const PrintableReport = React.forwardRef(({ 
  reportData, 
  reportSummaries, 
  selectedPeriod, 
  dateRange 
}, ref) => {
  return (
    <div ref={ref} className="p-8 print:p-4 print:text-xs">
      <div className="mb-6 print:mb-2">
        <h1 className="text-2xl print:text-lg font-bold mb-2">
          Super Shop Management Report
        </h1>
        <div className="grid grid-cols-2 gap-2 print:text-xs">
          <p>
            <strong>Period:</strong> {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}
          </p>
          <p>
            <strong>Date Range:</strong> {format(dateRange.from, 'MMM dd, yyyy')} - {format(dateRange.to, 'MMM dd, yyyy')}
          </p>
          <p>
            <strong>Generated On:</strong> {format(new Date(), 'MMM dd, yyyy HH:mm:ss')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6 print:mb-2">
        {[
          { 
            title: 'Total Revenue', 
            value: `$${reportSummaries.totalRevenue}` 
          },
          { 
            title: 'Total Expenses', 
            value: `$${reportSummaries.totalExpenses}` 
          },
          { 
            title: 'Net Profit', 
            value: `$${reportSummaries.netProfit}` 
          },
          { 
            title: 'Profit Margin', 
            value: `${reportSummaries.profitMargin}%` 
          }
        ].map(({ title, value }) => (
          <div key={title} className="border p-4 print:p-2 rounded-lg text-center">
            <h3 className="font-semibold print:text-xs mb-2">{title}</h3>
            <p className="text-xl print:text-sm font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 print:gap-2">
          <div className="border p-4 print:p-2 rounded-lg">
            <h2 className="text-lg print:text-sm font-semibold mb-4 print:mb-2">Detailed Sales Report</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Total Sales</TableHead>
                  <TableHead>Quantity Sold</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {safeRender(
                  reportData.salesReport, 
                  (item) => (
                    <TableRow key={item.category || Math.random()}>
                      <TableCell>{item.category || 'Unknown Category'}</TableCell>
                      <TableCell>
                        ${formatNumber(item.totalSales)}
                      </TableCell>
                      <TableCell>{item.quantitySold || 0}</TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>

          <div className="border p-4 print:p-2 rounded-lg">
            <h2 className="text-lg print:text-sm font-semibold mb-4 print:mb-2">Detailed Profitability Report</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Total Revenue</TableHead>
                  <TableHead>Total Expenses</TableHead>
                  <TableHead>Net Profit</TableHead>
                  <TableHead>Profit Margin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {safeRender(
                  reportData.profitabilityReport, 
                  (item) => (
                    <TableRow key={item.category || Math.random()}>
                      <TableCell>{item.category || 'Unknown Category'}</TableCell>
                      <TableCell>
                        ${formatNumber(item.totalRevenue)}
                      </TableCell>
                      <TableCell>
                        ${formatNumber(item.totalExpenses)}
                      </TableCell>
                      <TableCell>
                        ${formatNumber(item.netProfit)}
                      </TableCell>
                      <TableCell>
                        {formatNumber(item.profitMargin * 100, { suffix: '%' })}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <div className="mt-6 print:mt-2 text-center print:text-xs">
        <p> {new Date().getFullYear()} Super Shop Management. All rights reserved.</p>
      </div>
    </div>
  );
});

const Reports = () => {
  const [reportData, setReportData] = useState({
    salesReport: null,
    inventoryReport: null,
    profitabilityReport: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  
  // Date range state
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date()
  });

  // Ref for printable report
  const printReportRef = useRef(null);

  // Print report handler
  const handlePrintReport = useReactToPrint({
    content: () => printReportRef.current,
    documentTitle: `Super Shop Report - ${format(new Date(), 'yyyy-MM-dd')}`,
    pageStyle: `
      @media print {
        @page { 
          size: A4; 
          margin: 10mm; 
        }
        body { 
          font-size: 12pt; 
        }
      }
    `
  });

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [salesData, inventoryData, profitabilityData] = await Promise.all([
        reportsService.generateSalesReport({ 
          period: selectedPeriod,
          startDate: dateRange.from,
          endDate: dateRange.to
        }),
        reportsService.generateInventoryReport({ 
          period: selectedPeriod,
          startDate: dateRange.from,
          endDate: dateRange.to
        }),
        reportsService.generateProfitabilityReport({
          period: selectedPeriod,
          startDate: dateRange.from,
          endDate: dateRange.to
        })
      ]);
      
      setReportData({
        salesReport: salesData,
        inventoryReport: inventoryData,
        profitabilityReport: profitabilityData
      });
    } catch (err) {
      console.error('Reports fetch error:', err);
      setError('Failed to fetch reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [selectedPeriod, dateRange]);

  // Memoized report summaries
  const reportSummaries = useMemo(() => {
    const { profitabilityReport } = reportData;
    return {
      totalRevenue: formatNumber(profitabilityReport?.totalRevenue),
      totalExpenses: formatNumber(profitabilityReport?.totalExpenses),
      netProfit: formatNumber(profitabilityReport?.netProfit),
      profitMargin: formatNumber(
        (profitabilityReport?.profitMargin ?? 0) * 100, 
        { suffix: '%' }
      )
    };
  }, [reportData]);

  // Render loading or error states
  if (loading) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-center items-center h-full"
    >
      <RefreshCw className="animate-spin text-primary" size={48} />
    </motion.div>
  );

  if (error) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col justify-center items-center h-full text-destructive"
    >
      <AlertCircle size={48} />
      <p className="mt-4 text-lg">{error}</p>
      <Button onClick={fetchReports} className="mt-4">
        Retry Fetch
      </Button>
    </motion.div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center">
          <BarChart2 className="mr-2" /> Business Reports
        </h1>
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[180px] justify-between">
                {REPORT_PERIODS.find(period => period.value === selectedPeriod)?.label || 'Select Period'}
                <ChevronDown className="ml-2" size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Report Periods</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {REPORT_PERIODS.map(period => (
                <DropdownMenuItem 
                  key={period.value} 
                  onSelect={() => setSelectedPeriod(period.value)}
                >
                  {period.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          <Button 
            variant="outline" 
            onClick={fetchReports} 
            disabled={loading}
          >
            <RefreshCw className="mr-2" size={16} /> 
            Refresh Reports
          </Button>
          <Button 
            variant="outline" 
            onClick={handlePrintReport}
          >
            Print Report
          </Button>
        </div>
      </div>

      <PrintableReport 
        ref={printReportRef} 
        reportData={reportData} 
        reportSummaries={reportSummaries} 
        selectedPeriod={selectedPeriod} 
        dateRange={dateRange} 
      />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="profitability">Profitability</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-4 gap-4">
            {[
              { 
                icon: TrendingUp, 
                title: 'Total Revenue', 
                value: `$${reportSummaries.totalRevenue}` 
              },
              { 
                icon: BarChart2, 
                title: 'Total Expenses', 
                value: `$${reportSummaries.totalExpenses}` 
              },
              { 
                icon: TrendingUp, 
                title: 'Net Profit', 
                value: `$${reportSummaries.netProfit}` 
              },
              { 
                icon: BarChart2, 
                title: 'Profit Margin', 
                value: `${reportSummaries.profitMargin}%` 
              }
            ].map(({ icon: Icon, title, value }) => (
              <Card key={title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{title}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Sales Report</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Total Sales</TableHead>
                    <TableHead>Quantity Sold</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {safeRender(
                    reportData.salesReport, 
                    (item) => (
                      <TableRow key={item.category || Math.random()}>
                        <TableCell>{item.category || 'Unknown Category'}</TableCell>
                        <TableCell>
                          ${formatNumber(item.totalSales)}
                        </TableCell>
                        <TableCell>{item.quantitySold || 0}</TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Report</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Reorder Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {safeRender(
                    reportData.inventoryReport, 
                    (item) => (
                      <TableRow key={item.product || Math.random()}>
                        <TableCell>{item.product || 'Unknown Product'}</TableCell>
                        <TableCell>{item.currentStock || 0}</TableCell>
                        <TableCell>{item.reorderLevel || 0}</TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profitability">
          <Card>
            <CardHeader>
              <CardTitle>Profitability Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { 
                    title: 'Total Revenue', 
                    value: `$${reportSummaries.totalRevenue}` 
                  },
                  { 
                    title: 'Total Expenses', 
                    value: `$${reportSummaries.totalExpenses}` 
                  },
                  { 
                    title: 'Net Profit', 
                    value: `$${reportSummaries.netProfit}` 
                  },
                  { 
                    title: 'Profit Margin', 
                    value: `${reportSummaries.profitMargin}%` 
                  }
                ].map(({ title, value }) => (
                  <div 
                    key={title} 
                    className="border rounded-lg p-4 text-center hover:bg-accent transition-colors"
                  >
                    <h3 className="text-sm text-muted-foreground mb-2">{title}</h3>
                    <p className="text-xl font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Reports;