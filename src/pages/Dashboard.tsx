import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, HandCoins, Plus, Gift, GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const navigate = useNavigate();
  const [uid, setUid] = useState("");
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.id) {
      setUid(user.id);
      
      // Fetch latest balance from database
      const { data } = await supabase
        .from("users")
        .select("balance")
        .eq("id", user.id)
        .single();

      if (data) {
        setBalance(data.balance || 0);
        // Update localStorage with latest balance
        user.balance = data.balance;
        localStorage.setItem("user", JSON.stringify(user));
      }
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* Balance Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">My Balance</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">UID: {uid}</p>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary mb-6">₹{balance.toFixed(2)} INR</div>
            
            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <Button
                className="flex-col h-auto py-4 bg-success hover:bg-success/90 text-success-foreground"
                onClick={() => navigate("/buy")}
              >
                <ShoppingCart className="w-5 h-5 mb-1" />
                <span>Buy</span>
              </Button>
              <Button
                className="flex-col h-auto py-4 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                onClick={() => navigate("/sell")}
              >
                <HandCoins className="w-5 h-5 mb-1" />
                <span>Sell</span>
              </Button>
              <Button
                className="flex-col h-auto py-4 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                onClick={() => navigate("/upi")}
              >
                <Plus className="w-5 h-5 mb-1" />
                <span>UPI</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Promo Banner */}
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <CardContent className="p-6 text-center">
            <Gift className="w-12 h-12 mx-auto mb-3" />
            <div className="text-xl font-bold mb-2">Buy your First order get ₹300 reward</div>
            <div className="text-sm opacity-90">Start trading now and earn instant rewards!</div>
          </CardContent>
        </Card>

        {/* Feature Cards */}
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground">
              <Gift className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="font-semibold">HOT Newbie Rewards</div>
              <div className="text-sm text-muted-foreground">Get special rewards for new users</div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-secondary-foreground">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="font-semibold">Learn Tutorial</div>
              <div className="text-sm text-muted-foreground">Learn how to maximize your earnings</div>
            </div>
          </CardContent>
        </Card>
      </main>

      <MobileNav />
    </div>
  );
};

export default Dashboard;
