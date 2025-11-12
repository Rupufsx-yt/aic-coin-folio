import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload } from "lucide-react";

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshot(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!upiId) {
      toast.error("Please enter your UPI ID");
      return;
    }
    
    if (!screenshot) {
      toast.error("Please upload payment screenshot");
      return;
    }

    toast.success("Payment submitted successfully! Order is now pending approval.");
    onClose();
    setUpiId("");
    setScreenshot(null);
    setPreviewUrl("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Payment - {pack.name}</DialogTitle>
        </DialogHeader>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h3 className="font-bold text-primary mb-3">Payment Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex">
              <span className="w-32 text-muted-foreground">Name:</span>
              <span className="font-mono font-semibold">Rupu Buragohain</span>
            </div>
            <div className="flex">
              <span className="w-32 text-muted-foreground">Bank:</span>
              <span className="font-mono">India Post Payment Bank</span>
            </div>
            <div className="flex">
              <span className="w-32 text-muted-foreground">Account:</span>
              <span className="font-mono">006010146665</span>
            </div>
            <div className="flex">
              <span className="w-32 text-muted-foreground">IFSC Code:</span>
              <span className="font-mono">IPOS0000001</span>
            </div>
          </div>
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
