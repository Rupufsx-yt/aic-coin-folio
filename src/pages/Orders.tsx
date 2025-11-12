import { useState } from "react";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string;
  amount: number;
  type: "Buy" | "Sell";
  status: "Pending" | "Approved" | "Rejected";
  date: string;
}

const mockOrders: Order[] = [];

const Orders = () => {
  const [filter, setFilter] = useState<"All" | "Pending" | "Approved" | "Rejected">("All");

  const filteredOrders = filter === "All" 
    ? mockOrders 
    : mockOrders.filter(order => order.status === filter);

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
                    <div className="text-xl font-bold mb-1">₹{order.amount}</div>
                    <div className="text-sm text-muted-foreground mb-1">Type: {order.type}</div>
                    <div className="text-xs text-muted-foreground mb-1">Order ID: {order.id}</div>
                    <div className="text-xs text-muted-foreground">Date: {order.date}</div>
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
