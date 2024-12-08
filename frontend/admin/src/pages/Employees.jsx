import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from '../components/ui/label.jsx';
import { employeesService } from '../services/api/employees/employeesService';
import { motion } from 'framer-motion';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const employeesData = await employeesService.getAllEmployees();
      console.log('Fetched Employees Data:', employeesData);
      
      // Ensure employeesData is an array
      const employeesArray = Array.isArray(employeesData) ? employeesData : 
                              employeesData.data ? employeesData.data : 
                              employeesData.employees ? employeesData.employees : 
                              [];
      
      setEmployees(employeesArray);
      setLoading(false);
    } catch (err) {
      console.error('Employees Fetch Error:', err);
      setError('Failed to fetch employees');
      setLoading(false);
    }
  };

  const handleCreateEmployee = async (employeeData) => {
    try {
      const newEmployee = await employeesService.createEmployee(employeeData);
      setEmployees([...employees, newEmployee]);
    } catch (err) {
      setError('Failed to create employee');
    }
  };

  if (loading) return <div>Loading employees...</div>;
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
          <CardTitle>Employee Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Add New Employee</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Employee</DialogTitle>
              </DialogHeader>
              {/* Employee Creation Form */}
            </DialogContent>
          </Dialog>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.id}</TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSelectedEmployee(employee)}
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

export default Employees;