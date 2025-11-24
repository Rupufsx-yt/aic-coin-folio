import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { ArrowLeft, IndianRupee } from "lucide-react";
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
  { name: "Pack E", amount: 945, fixedReward: 27, commission: 27, total: 999 },
  { name: "Pack F", amount: 970, fixedReward: 29, commission: 29, total: 1028 },
];

const Buy = () => {
  const navigate = useNavigate();
  const [selectedPack, setSelectedPack] = useState<TokenPack | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"INR" | "USDT">("INR");

  const handleBuyPack = (pack: TokenPack) => {
    setSelectedPack(pack);
    setShowPaymentModal(true);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
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

        <h1 className="text-3xl font-bold mb-6 text-center">Buy</h1>

        {/* Currency Tabs */}
        <div className="flex justify-center gap-8 mb-6">
          <button
            onClick={() => setActiveTab("INR")}
            className={`text-xl pb-2 transition-all ${
              activeTab === "INR"
                ? "text-foreground font-semibold border-b-2 border-primary"
                : "text-muted-foreground"
            }`}
          >
            INR
          </button>
          <button
            onClick={() => setActiveTab("USDT")}
            className={`text-xl pb-2 transition-all ${
              activeTab === "USDT"
                ? "text-foreground font-semibold border-b-2 border-primary"
                : "text-muted-foreground"
            }`}
          >
            USDT
          </button>
        </div>

        {/* Income Banner */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 mb-6 text-center text-primary-foreground">
          <div className="text-3xl font-bold mb-1">
            2.9% + 6 <span className="text-lg font-normal">income per each order</span>
          </div>
          <div className="text-sm opacity-90">(Higher level, Higher income per order)</div>
        </div>

        {/* Token Pack List */}
        <div className="space-y-3">
          {tokenPacks.map((pack) => {
            const incomePercent = ((pack.fixedReward + pack.commission) / pack.amount * 100).toFixed(1);
            
            return (
              <div
                key={pack.name}
                className="bg-card rounded-xl p-4 flex items-center justify-between border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* Rupee Icon */}
                  <div className="w-14 h-14 rounded-full bg-foreground flex items-center justify-center flex-shrink-0">
                    <IndianRupee className="w-7 h-7 text-background" />
                  </div>

                  {/* Pack Details */}
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-2xl font-bold">{pack.amount.toFixed(2)} INR</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      <span>Bank</span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <div className="text-sm text-muted-foreground">Income</div>
                        <div className="font-semibold">
                          ₹{(pack.fixedReward + pack.commission).toFixed(2)}{" "}
                          <span className="text-success text-sm">({incomePercent}%+6)</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Balance</div>
                        <div className="font-semibold">+ {pack.total.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Buy Button */}
                <Button
                  className="ml-4 bg-primary hover:bg-primary/90 text-primary-foreground px-8 rounded-full"
                  onClick={() => handleBuyPack(pack)}
                >
                  Buy
                </Button>
              </div>
            );
          })}
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
