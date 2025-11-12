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

const UPI = () => {
  const navigate = useNavigate();
  const [upiId, setUpiId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!upiId) {
      toast.error("Please enter your UPI ID");
      return;
    }

    toast.success("UPI ID connected successfully!");
    navigate("/dashboard");
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
            <CardTitle>Connect UPI</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="upiId">UPI ID</Label>
                <Input
                  id="upiId"
                  placeholder="e.g., rahul@paytm"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Enter your UPI ID to link it with your account for faster transactions
                </p>
              </div>

              <Button type="submit" className="w-full h-12 text-lg">
                Connect UPI
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <MobileNav />
    </div>
  );
};

export default UPI;
