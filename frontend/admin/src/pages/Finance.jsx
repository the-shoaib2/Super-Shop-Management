import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs.jsx';
import { financeService } from '../services/financeService';
import { motion } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Label } from '../components/ui/label.jsx';

const Finance = () => {
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      const overview = await financeService.getFinancialOverview();
      console.log('Financial Overview:', overview);
      
      const incomeStatement = await financeService.getIncomeStatement('yearly');
      console.log('Income Statement:', incomeStatement);
      
      const balanceSheet = await financeService.getBalanceSheet();
      console.log('Balance Sheet:', balanceSheet);
      
      // Ensure each financial data is an array or object
      const financialOverview = Array.isArray(overview) || typeof overview === 'object' ? overview : {};
      const financialIncomeStatement = Array.isArray(incomeStatement) || typeof incomeStatement === 'object' ? incomeStatement : {};
      const financialBalanceSheet = Array.isArray(balanceSheet) || typeof balanceSheet === 'object' ? balanceSheet : {};
      
      setFinancialData({
        overview: financialOverview,
        incomeStatement: financialIncomeStatement,
        balanceSheet: financialBalanceSheet
      });
      setLoading(false);
    } catch (err) {
      console.error('Financial Data Fetch Error:', err);
      setError('Failed to fetch financial data');
      setLoading(false);
    }
  };

  if (loading) return <div>Loading financial data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Financial Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="income">Income Statement</TabsTrigger>
              <TabsTrigger value="balance">Balance Sheet</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3>Total Revenue</h3>
                      <p>
                        ${(financialData?.overview?.totalRevenue ?? 0).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </p>
                    </div>
                    <div>
                      <h3>Total Expenses</h3>
                      <p>
                        ${(financialData?.overview?.totalExpenses ?? 0).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </p>
                    </div>
                    <div>
                      <h3>Net Profit</h3>
                      <p>
                        ${(financialData?.overview?.netProfit ?? 0).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="income">
              <Card>
                <CardHeader>
                  <CardTitle>Income Statement</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(Array.isArray(financialData?.incomeStatement) ? financialData.incomeStatement : []).map((item) => (
                        <TableRow key={item.category || Math.random()}>
                          <TableCell>{item.category || 'Unknown Category'}</TableCell>
                          <TableCell>
                            ${((item.amount || 0).toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            }))}
                          </TableCell>
                        </TableRow>
                      ))}
                      {(Array.isArray(financialData?.incomeStatement) ? financialData.incomeStatement : []).length === 0 && (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center text-muted-foreground">
                            No income statement data available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="balance">
              <Card>
                <CardHeader>
                  <CardTitle>Balance Sheet</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Asset</TableHead>
                        <TableHead>Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(Array.isArray(financialData?.balanceSheet) ? financialData.balanceSheet : []).map((item) => (
                        <TableRow key={item.asset || Math.random()}>
                          <TableCell>{item.asset || 'Unknown Asset'}</TableCell>
                          <TableCell>
                            ${((item.value || 0).toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            }))}
                          </TableCell>
                        </TableRow>
                      ))}
                      {(Array.isArray(financialData?.balanceSheet) ? financialData.balanceSheet : []).length === 0 && (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center text-muted-foreground">
                            No balance sheet data available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Finance;