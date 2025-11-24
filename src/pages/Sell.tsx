import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  placeholder="Enter bank name"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  placeholder="Enter account number"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ifscCode">IFSC Code</Label>
                <Input
                  id="ifscCode"
                  placeholder="Enter IFSC code"
                  value={formData.ifscCode}
                  onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full h-12 text-lg">
                Submit Withdrawal Request
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <MobileNav />
    </div>
  );
};

export default Sell;
