import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Plus, Minus, Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface User {
  id: string;
  name: string;
  phone: string;
  password: string;
  balance?: number;
}

const AdminPanel = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [amounts, setAmounts] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    // Initialize balance if not present
    const usersWithBalance = storedUsers.map((user: User) => ({
      ...user,
      balance: user.balance || 0,
    }));
    setUsers(usersWithBalance);
  };

  const updateUserBalance = (userId: string, operation: "increase" | "decrease") => {
    const amount = parseFloat(amounts[userId] || "0");
    
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = storedUsers.map((user: User) => {
      if (user.id === userId) {
        const currentBalance = user.balance || 0;
        const newBalance = operation === "increase" 
          ? currentBalance + amount 
          : Math.max(0, currentBalance - amount);
        return { ...user, balance: newBalance };
      }
      return user;
    });

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);

    toast.success(`Balance ${operation === "increase" ? "increased" : "decreased"} by ₹${amount.toFixed(2)}`);
    setAmounts({ ...amounts, [userId]: "" });
    
    // Refresh the user list to show updated balance
    loadUsers();
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/auth")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">Admin Panel</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Manage User Balances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell className="font-semibold text-success">
                          ₹{user.balance?.toFixed(2) || "0.00"}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            placeholder="Enter amount"
                            value={amounts[user.id] || ""}
                            onChange={(e) =>
                              setAmounts({ ...amounts, [user.id]: e.target.value })
                            }
                            className="w-32"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => updateUserBalance(user.id, "increase")}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateUserBalance(user.id, "decrease")}
                            >
                              <Minus className="w-4 h-4 mr-1" />
                              Deduct
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
