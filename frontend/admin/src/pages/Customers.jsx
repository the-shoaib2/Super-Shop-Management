import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from '../components/ui/label.jsx';
import { customersService } from '../services/api/customers/customersService';
import { motion } from 'framer-motion';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const customersData = await customersService.getAllCustomers();
      console.log('Fetched Customers Data:', customersData);
      
      // Ensure customersData is an array
      const customersArray = Array.isArray(customersData) ? customersData : 
                              customersData.data ? customersData.data : 
                              customersData.customers ? customersData.customers : 
                              [];
      
      setCustomers(customersArray);
      setLoading(false);
    } catch (err) {
      console.error('Customers Fetch Error:', err);
      setError('Failed to fetch customers');
      setLoading(false);
    }
  };

  const handleCreateCustomer = async (customerData) => {
    try {
      const newCustomer = await customersService.createCustomer(customerData);
      setCustomers([...customers, newCustomer]);
    } catch (err) {
      setError('Failed to create customer');
    }
  };

  if (loading) return <div>Loading customers...</div>;
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
          <CardTitle>Customer Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Add New Customer</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Customer</DialogTitle>
              </DialogHeader>
              {/* Customer Creation Form */}
            </DialogContent>
          </Dialog>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.id}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Customers;