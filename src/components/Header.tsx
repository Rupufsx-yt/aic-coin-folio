import { Bell, LogOut, Coins } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Coins className="w-7 h-7" />
            <span>AIC Coin Wallet</span>
          </div>
          <div className="flex gap-3">
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full bg-white/20 hover:bg-white/30 text-primary-foreground"
              onClick={() => toast.warning("Notification feature coming soon!")}
            >
              <Bell className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full bg-white/20 hover:bg-white/30 text-primary-foreground"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
      <div className="bg-white/15 text-center py-2 text-sm font-medium">
        AIC Coin Wallet will replace Rex USDT/INR exchange
      </div>
    </header>
  );
};

export default Header;
