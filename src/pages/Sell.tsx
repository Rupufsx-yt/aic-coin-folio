import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const Sell = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const currentUser = users.find((u: any) => u.id === user.id);
  const balance = currentUser?.balance || 0;
  const hasPurchased = currentUser?.hasPurchased || false;
  
  const [formData, setFormData] = useState({
    amount: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
  });

  const [withdrawals, setWithdrawals] = useState<any[]>([]);

  useEffect(() => {
    loadWithdrawals();
  }, []);

  const loadWithdrawals = async () => {
    try {
      const { data, error } = await supabase
        .from("withdrawals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setWithdrawals(data || []);
    } catch (error) {
      console.error("Error loading withdrawals:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hasPurchased) {
      toast.error("Buy at least 1 order first to enable withdrawals");
      return;
    }
    
    const amount = Number(formData.amount);
    
    if (balance < 500) {
      toast.error("Minimum balance of ₹500 required for withdrawal");
      return;
    }
    
    if (amount < 500 || amount > 3000) {
      toast.error("Withdrawal amount must be between ₹500 and ₹3000");
      return;
    }
    
    if (amount > balance) {
      toast.error("Insufficient balance");
      return;
    }

    if (!formData.bankName || !formData.accountNumber || !formData.ifscCode) {
      toast.error("Please fill in all bank details");
      return;
    }

    toast.success("Withdrawal request submitted successfully! Status: Pending");
    navigate("/orders");
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 py-4">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Withdraw Funds</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6 border-orange-500 bg-orange-50 dark:bg-orange-950/20">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertTitle className="text-orange-800 dark:text-orange-400">Maintenance Notice</AlertTitle>
              <AlertDescription className="text-orange-700 dark:text-orange-300">
                Withdrawal feature is under maintenance for 7 days. You will be able to withdraw after the maintenance period ends.
              </AlertDescription>
            </Alert>

            <div className="mb-6">
              <Label className="text-base">Current Balance</Label>
              <div className="text-3xl font-bold text-primary mt-2">₹{balance.toFixed(2)}</div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Withdrawal Amount (₹500 - ₹3000)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  min="500"
                  max="3000"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  placeholder="Enter bank name"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  placeholder="Enter account number"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ifscCode">IFSC Code</Label>
                <Input
                  id="ifscCode"
                  placeholder="Enter IFSC code"
                  value={formData.ifscCode}
                  onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                  disabled
                />
              </div>

              <Button type="submit" className="w-full h-12 text-lg" disabled>
                Submit Withdrawal Request
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Withdrawal History</CardTitle>
          </CardHeader>
          <CardContent>
            {withdrawals.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No withdrawals yet</p>
            ) : (
              <div className="space-y-3">
                {withdrawals.map((withdrawal) => (
                  <div
                    key={withdrawal.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-lg">₹{Number(withdrawal.amount).toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(withdrawal.created_at), "dd MMM yyyy, hh:mm a")}
                      </div>
                    </div>
                    <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                      {withdrawal.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <MobileNav />
    </div>
  );
};

export default Sell;
