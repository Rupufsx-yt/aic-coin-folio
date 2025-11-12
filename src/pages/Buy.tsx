import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import PaymentModal from "@/components/PaymentModal";

interface TokenPack {
  name: string;
  amount: number;
  fixedReward: number;
  commission: number;
  total: number;
}

const tokenPacks: TokenPack[] = [
  { name: "Pack A", amount: 200, fixedReward: 14, commission: 14, total: 228 },
  { name: "Pack B", amount: 300, fixedReward: 20, commission: 21, total: 341 },
  { name: "Pack C", amount: 400, fixedReward: 30, commission: 28, total: 458 },
  { name: "Pack D", amount: 500, fixedReward: 50, commission: 35, total: 585 },
];

const Buy = () => {
  const navigate = useNavigate();
  const [selectedPack, setSelectedPack] = useState<TokenPack | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleBuyPack = (pack: TokenPack) => {
    setSelectedPack(pack);
    setShowPaymentModal(true);
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

        <h1 className="text-2xl font-bold mb-4">Buy Token Packs</h1>

        <div className="space-y-4">
          {tokenPacks.map((pack) => (
            <Card key={pack.name} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{pack.name}</h3>
                    <p className="text-2xl font-bold text-primary">₹{pack.amount}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Buy Amount:</span>
                    <span className="font-semibold">₹{pack.amount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Fixed Reward:</span>
                    <span className="font-semibold">₹{pack.fixedReward}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">7% Commission:</span>
                    <span className="font-semibold">₹{pack.commission}</span>
                  </div>
                </div>

                <div className="bg-success/10 rounded-lg p-3 mb-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Total Return</p>
                  <p className="text-2xl font-bold text-success">₹{pack.total}</p>
                </div>

                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => handleBuyPack(pack)}
                >
                  Buy Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <MobileNav />
      
      {selectedPack && (
        <PaymentModal
          open={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          pack={selectedPack}
        />
      )}
    </div>
  );
};

export default Buy;
