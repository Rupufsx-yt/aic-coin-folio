import { useState, useEffect } from "react";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface Order {
  id: string;
  pack_name: string;
  amount: number;
  total_return: number;
  status: string;
  created_at: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<"All" | "Pending" | "Approved" | "Rejected">("All");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) return;

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load orders:", error);
      return;
    }

    if (data) {
      setOrders(data);
    }
  };

  const filteredOrders = filter === "All" 
    ? orders 
    : orders.filter(order => order.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-warning/20 text-warning-foreground";
      case "Approved":
        return "bg-success/20 text-success-foreground";
      case "Rejected":
        return "bg-destructive/20 text-destructive-foreground";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold mb-4">My Orders</h1>

        {/* Filters */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {["All", "Pending", "Approved", "Rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-colors ${
                filter === status
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-semibold mb-1">{order.pack_name}</div>
                    <div className="text-sm text-muted-foreground mb-1">Amount: ₹{order.amount.toFixed(2)}</div>
                    <div className="text-sm text-success mb-1">Total Return: ₹{order.total_return.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">
                      Date: {new Date(order.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No orders found</p>
          </div>
        )}
      </main>

      <MobileNav />
    </div>
  );
};

export default Orders;
