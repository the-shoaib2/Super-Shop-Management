import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from '../components/ui/label.jsx';
import { suppliersService } from '../services/suppliersService';
import { motion } from 'framer-motion';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const suppliersData = await suppliersService.getAllSuppliers();
      console.log('Fetched Suppliers Data:', suppliersData);
      
      // Ensure suppliersData is an array
      const suppliersArray = Array.isArray(suppliersData) ? suppliersData : 
                              suppliersData.data ? suppliersData.data : 
                              suppliersData.suppliers ? suppliersData.suppliers : 
                              [];
      
      setSuppliers(suppliersArray);
      setLoading(false);
    } catch (err) {
      console.error('Suppliers Fetch Error:', err);
      setError('Failed to fetch suppliers');
      setLoading(false);
    }
  };

  const handleCreateSupplier = async (supplierData) => {
    try {
      const newSupplier = await suppliersService.createSupplier(supplierData);
      setSuppliers([...suppliers, newSupplier]);
    } catch (err) {
      setError('Failed to create supplier');
    }
  };

  if (loading) return <div>Loading suppliers...</div>;
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
          <CardTitle>Supplier Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Add New Supplier</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Supplier</DialogTitle>
              </DialogHeader>
              {/* Supplier Creation Form */}
            </DialogContent>
          </Dialog>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier ID</TableHead>
                <TableHead>Company Name</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>{supplier.id}</TableCell>
                  <TableCell>{supplier.companyName}</TableCell>
                  <TableCell>{supplier.contactPerson}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSelectedSupplier(supplier)}
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

export default Suppliers;