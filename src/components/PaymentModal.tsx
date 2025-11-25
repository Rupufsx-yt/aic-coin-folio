import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import defaultQR from "@/assets/payment-qr.jpg";
import { supabase } from "@/integrations/supabase/client";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  pack: {
    name: string;
    amount: number;
    total: number;
  };
}

const PaymentModal = ({ open, onClose, pack }: PaymentModalProps) => {
  const [upiId, setUpiId] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [qrCode, setQrCode] = useState<string>(defaultQR);

  useEffect(() => {
    loadQRCode();
  }, []);

  const loadQRCode = async () => {
    const { data } = await supabase
      .from("app_settings")
      .select("setting_value")
      .eq("setting_key", "payment_qr")
      .single();

    if (data?.setting_value) {
      setQrCode(data.setting_value);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshot(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!upiId) {
      toast.error("Please enter your UPI ID");
      return;
    }
    
    if (!screenshot) {
      toast.error("Please upload payment screenshot");
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (!currentUser.id) {
      toast.error("User not found");
      return;
    }

    // Convert screenshot to base64 for storage
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Screenshot = reader.result as string;

      const { error } = await supabase
        .from("orders")
        .insert([
          {
            user_id: currentUser.id,
            pack_name: pack.name,
            amount: pack.amount,
            total_return: pack.total,
            upi_id: upiId,
            payment_screenshot: base64Screenshot,
            status: "Pending",
          },
        ]);

      if (error) {
        toast.error("Failed to submit payment details");
        return;
      }

      toast.success("Payment submitted successfully! Order is now pending approval.");
      onClose();
      setUpiId("");
      setScreenshot(null);
      setPreviewUrl("");
    };

    reader.readAsDataURL(screenshot);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Payment - {pack.name}</DialogTitle>
        </DialogHeader>

        <div className="bg-card border border-border rounded-lg p-4 mb-4 text-center">
          <h3 className="font-bold text-foreground mb-3">Scan QR Code to Pay</h3>
          <img 
            src={qrCode} 
            alt="Payment QR Code" 
            className="w-full max-w-sm mx-auto rounded-lg"
          />
          <p className="text-sm text-muted-foreground mt-3">
            Scan and pay with any BHIM UPI app
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="upiId">Your UPI ID</Label>
            <Input
              id="upiId"
              placeholder="e.g., rahul@paytm"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Upload Payment Screenshot</Label>
            <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="screenshot-upload"
              />
              <label htmlFor="screenshot-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </p>
              </label>
            </div>
            {previewUrl && (
              <div className="mt-3">
                <img
                  src={previewUrl}
                  alt="Payment screenshot"
                  className="max-w-full h-auto rounded-lg shadow-md"
                />
              </div>
            )}
          </div>

          <Button type="submit" className="w-full h-12 text-lg">
            Confirm Payment
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
