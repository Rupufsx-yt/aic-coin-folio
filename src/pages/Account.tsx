import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Share2, Copy, Shield, Facebook, Twitter, Instagram, Send } from "lucide-react";
import { toast } from "sonner";

const Account = () => {
  const referralLink = "https://aiccoinwallet.com/signup?ref=2PWAZC";
  const referralCode = "2PWAZC";

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground font-semibold">Phone Number</span>
              <span className="font-bold">7576894710</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground font-semibold">UID</span>
              <span className="font-bold">DT4710</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground font-semibold">Country Code</span>
              <span className="font-bold">+91</span>
            </div>
          </CardContent>
        </Card>

        {/* Earnings */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-1">₹14.00</div>
                <div className="text-sm text-muted-foreground">Today's Earnings</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-1">₹14.00</div>
                <div className="text-sm text-muted-foreground">Total Earnings</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Referral Program */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Referral Program
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted rounded-lg p-3 flex items-center gap-3">
              <div className="flex-1 text-sm font-mono break-all">{referralLink}</div>
              <Button
                size="sm"
                onClick={() => copyToClipboard(referralLink, "Referral link")}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>

            <div className="bg-muted rounded-lg p-4 flex justify-between items-center">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Your Referral Code</div>
                <div className="text-2xl font-bold font-mono">{referralCode}</div>
              </div>
              <Button onClick={() => copyToClipboard(referralCode, "Referral code")}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground font-semibold">Change Password</span>
              <Button
                variant="outline"
                onClick={() => toast.warning("Password change feature coming soon!")}
              >
                Change
              </Button>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground font-semibold">Two-Factor Authentication</span>
              <Button
                variant="outline"
                onClick={() => toast.warning("2FA feature coming soon!")}
              >
                Enable
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Follow Us */}
        <Card>
          <CardHeader>
            <CardTitle>Follow Us</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-around py-3">
              <button className="text-primary hover:text-primary/80 transition-colors">
                <Facebook className="w-7 h-7" />
              </button>
              <button className="text-primary hover:text-primary/80 transition-colors">
                <Twitter className="w-7 h-7" />
              </button>
              <button className="text-primary hover:text-primary/80 transition-colors">
                <Instagram className="w-7 h-7" />
              </button>
              <button className="text-primary hover:text-primary/80 transition-colors">
                <Send className="w-7 h-7" />
              </button>
            </div>
          </CardContent>
        </Card>
      </main>

      <MobileNav />
    </div>
  );
};

export default Account;
