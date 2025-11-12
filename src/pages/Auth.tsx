import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Coins } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    referral: "",
  });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      if (!formData.phone || !formData.password) {
        toast.error("Please enter your phone number and password");
        return;
      }
      toast.success("Login successful!");
      localStorage.setItem("user", JSON.stringify({ phone: formData.phone, id: "DT4710" }));
      navigate("/dashboard");
    } else {
      if (!formData.name || !formData.phone || !formData.password) {
        toast.error("Please fill in all required fields");
        return;
      }
      if (formData.referral) {
        toast.success("Referral bonus of ₹50 credited to the referrer!");
      }
      toast.success("Account created successfully!");
      localStorage.setItem("user", JSON.stringify({ phone: formData.phone, id: "DT4710", name: formData.name }));
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Coins className="w-10 h-10 text-primary" />
            <h1 className="text-3xl font-bold text-primary">AIC Coin Wallet</h1>
          </div>
          <p className="text-muted-foreground">Buy, Sell & Earn with AIC Tokens</p>
        </div>

        <div className="flex border-b mb-8">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 pb-3 font-semibold transition-colors relative ${
              isLogin ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Login
            {isLogin && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />}
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 pb-3 font-semibold transition-colors relative ${
              !isLogin ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Sign Up
            {!isLogin && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder={isLogin ? "Enter your password" : "Create a password"}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="referral">Referral Code (Optional)</Label>
              <Input
                id="referral"
                placeholder="Enter referral code"
                value={formData.referral}
                onChange={(e) => setFormData({ ...formData, referral: e.target.value })}
              />
            </div>
          )}

          <Button type="submit" className="w-full h-12 text-lg">
            {isLogin ? "Login" : "Sign Up"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
