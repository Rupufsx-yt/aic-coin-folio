import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Plus, Minus, Users, QrCode, Upload, CheckCircle, XCircle, ShoppingBag, Eye } from "lucide-react";
import defaultQR from "@/assets/payment-qr.jpg";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface User {
  id: string;
  name: string;
  phone: string;
  password: string;
  balance?: number;
}

interface Order {
  id: string;
  user_id: string;
  pack_name: string;
  amount: number;
  total_return: number;
  upi_id: string | null;
  payment_screenshot: string | null;
  status: string;
  created_at: string;
}

const AdminPanel = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [amounts, setAmounts] = useState<{ [key: string]: string }>({});
  const [qrCode, setQrCode] = useState<string>(defaultQR);
  const [qrPreview, setQrPreview] = useState<string>("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
    loadQRCode();
    loadOrders();
  }, []);

  const loadQRCode = async () => {
    const { data } = await supabase
      .from("app_settings")
      .select("setting_value")
      .eq("setting_key", "payment_qr")
      .single();

    if (data?.setting_value) {
      setQrCode(data.setting_value);
      setQrPreview(data.setting_value);
    } else {
      setQrPreview(defaultQR);
    }
  };

  const loadUsers = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load users");
      return;
    }

    if (data) {
      setUsers(data);
    }
  };

  const updateUserBalance = async (userId: string, operation: "increase" | "decrease") => {
    const amount = parseFloat(amounts[userId] || "0");
    
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    // Get current user balance
    const { data: userData, error: fetchError } = await supabase
      .from("users")
      .select("balance")
      .eq("id", userId)
      .single();

    if (fetchError || !userData) {
      toast.error("Failed to fetch user balance");
      return;
    }

    const currentBalance = userData.balance || 0;
    const newBalance =
      operation === "increase"
        ? currentBalance + amount
        : Math.max(0, currentBalance - amount);

    // Update in database
    const { error: updateError } = await supabase
      .from("users")
      .update({ balance: newBalance })
      .eq("id", userId);

    if (updateError) {
      toast.error("Failed to update balance");
      return;
    }

    // If the edited user is currently logged in, also update localStorage
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");
    if (currentUser && currentUser.id === userId) {
      currentUser.balance = newBalance;
      localStorage.setItem("user", JSON.stringify(currentUser));
    }

    toast.success(
      `Balance ${operation === "increase" ? "increased" : "decreased"} by ₹${amount.toFixed(2)}`
    );
    setAmounts({ ...amounts, [userId]: "" });

    // Refresh the user list
    loadUsers();
  };

  const handleQRUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setQrPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateQRCode = async () => {
    if (!qrPreview) {
      toast.error("Please upload a QR code first");
      return;
    }

    const { error } = await supabase
      .from("app_settings")
      .update({ setting_value: qrPreview, updated_at: new Date().toISOString() })
      .eq("setting_key", "payment_qr");

    if (error) {
      toast.error("Failed to update QR code");
      return;
    }

    setQrCode(qrPreview);
    toast.success("Payment QR code updated successfully");
  };

  const loadOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load orders");
      return;
    }

    if (data) {
      setOrders(data);
    }
  };

  const approveOrder = async (order: Order) => {
    // Update order status
    const { error: orderError } = await supabase
      .from("orders")
      .update({ status: "Approved" })
      .eq("id", order.id);

    if (orderError) {
      toast.error("Failed to approve order");
      return;
    }

    // Get current user balance
    const { data: userData, error: fetchError } = await supabase
      .from("users")
      .select("balance")
      .eq("id", order.user_id)
      .single();

    if (fetchError || !userData) {
      toast.error("Failed to fetch user balance");
      return;
    }

    const currentBalance = userData.balance || 0;
    const newBalance = currentBalance + order.amount;

    // Update user balance
    const { error: balanceError } = await supabase
      .from("users")
      .update({ balance: newBalance })
      .eq("id", order.user_id);

    if (balanceError) {
      toast.error("Failed to update user balance");
      return;
    }

    toast.success(`Order approved! ₹${order.amount} added to user wallet`);
    loadOrders();
  };

  const rejectOrder = async (orderId: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: "Rejected" })
      .eq("id", orderId);

    if (error) {
      toast.error("Failed to reject order");
      return;
    }

    toast.success("Order rejected");
    loadOrders();
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

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Orders Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Pack</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>UPI ID</TableHead>
                    <TableHead>Screenshot</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground">
                        No orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}</TableCell>
                        <TableCell className="font-mono text-xs">{order.user_id.slice(0, 8)}</TableCell>
                        <TableCell className="font-medium">{order.pack_name}</TableCell>
                        <TableCell className="font-semibold">₹{order.amount}</TableCell>
                        <TableCell className="text-sm">{order.upi_id || "N/A"}</TableCell>
                        <TableCell>
                          {order.payment_screenshot ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedScreenshot(order.payment_screenshot)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              order.status === "Approved"
                                ? "default"
                                : order.status === "Rejected"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(order.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {order.status === "Pending" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => approveOrder(order)}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => rejectOrder(order.id)}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              Manage Payment QR Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Current QR Code</h3>
                {qrCode && (
                  <img 
                    src={qrCode} 
                    alt="Current Payment QR" 
                    className="w-full max-w-xs rounded-lg border border-border"
                  />
                )}
              </div>
              <div>
                <h3 className="font-semibold mb-3">Upload New QR Code</h3>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleQRUpload}
                      className="hidden"
                      id="qr-upload"
                    />
                    <label htmlFor="qr-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload QR code image
                      </p>
                    </label>
                  </div>
                  {qrPreview && qrPreview !== qrCode && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                      <img 
                        src={qrPreview} 
                        alt="QR Preview" 
                        className="w-full max-w-xs rounded-lg border border-border mb-3"
                      />
                      <Button onClick={updateQRCode} className="w-full">
                        Update QR Code
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedScreenshot} onOpenChange={() => setSelectedScreenshot(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Screenshot</DialogTitle>
          </DialogHeader>
          {selectedScreenshot && (
            <img 
              src={selectedScreenshot} 
              alt="Payment Screenshot" 
              className="w-full rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel;
