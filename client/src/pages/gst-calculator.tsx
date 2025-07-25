import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, Percent, Receipt, DollarSign, Eraser, Info, Lightbulb } from "lucide-react";

export default function GSTCalculator() {
  const [selectedRate, setSelectedRate] = useState<number>(18);
  const [amountWithoutGST, setAmountWithoutGST] = useState<string>("");
  const [amountWithGST, setAmountWithGST] = useState<string>("");
  const [gstAmount, setGSTAmount] = useState<number>(0);
  const [lastModified, setLastModified] = useState<'withoutGST' | 'withGST' | null>(null);

  const gstRates = [0.25, 3, 5, 12, 18, 28];

  const calculateFromExclusiveAmount = (amount: string) => {
    if (!amount || amount === "") {
      setGSTAmount(0);
      setAmountWithGST("");
      return;
    }

    const baseAmount = parseFloat(amount);
    if (isNaN(baseAmount)) return;

    const calculatedGST = (baseAmount * selectedRate) / 100;
    const totalWithGST = baseAmount + calculatedGST;

    setGSTAmount(calculatedGST);
    setAmountWithGST(totalWithGST.toFixed(2));
  };

  const calculateFromInclusiveAmount = (amount: string) => {
    if (!amount || amount === "") {
      setGSTAmount(0);
      setAmountWithoutGST("");
      return;
    }

    const totalAmount = parseFloat(amount);
    if (isNaN(totalAmount)) return;

    const baseAmount = totalAmount / (1 + selectedRate / 100);
    const calculatedGST = totalAmount - baseAmount;

    setGSTAmount(calculatedGST);
    setAmountWithoutGST(baseAmount.toFixed(2));
  };

  const handleAmountWithoutGSTChange = (value: string) => {
    setAmountWithoutGST(value);
    setLastModified('withoutGST');
    calculateFromExclusiveAmount(value);
  };

  const handleAmountWithGSTChange = (value: string) => {
    setAmountWithGST(value);
    setLastModified('withGST');
    calculateFromInclusiveAmount(value);
  };

  const clearAll = () => {
    setAmountWithoutGST("");
    setAmountWithGST("");
    setGSTAmount(0);
    setLastModified(null);
  };

  // Recalculate when rate changes
  useEffect(() => {
    if (lastModified === 'withoutGST' && amountWithoutGST) {
      calculateFromExclusiveAmount(amountWithoutGST);
    } else if (lastModified === 'withGST' && amountWithGST) {
      calculateFromInclusiveAmount(amountWithGST);
    }
  }, [selectedRate]);

  return (
    <div className="min-h-screen py-8 px-4 bg-background">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
            <Calculator className="inline mr-3 text-primary" size={36} />
            Online Free GST Calculator
          </h1>
          <p className="text-text-secondary text-lg">Calculate GST amounts quickly and accurately</p>
        </div>

        {/* Main Calculator Card */}
        <Card className="bg-surface rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
          
          {/* GST Rate Selector */}
          <div className="mb-8">
            <Label className="block text-sm font-medium text-text-primary mb-4">
              <Percent className="inline mr-2 text-primary" size={16} />
              Select GST Rate
            </Label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {gstRates.map((rate) => (
                <Button
                  key={rate}
                  variant={selectedRate === rate ? "default" : "outline"}
                  onClick={() => setSelectedRate(rate)}
                  className={`py-3 px-4 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 ${
                    selectedRate === rate
                      ? "border-2 border-primary bg-primary text-white hover:bg-primary-dark"
                      : "border-2 border-gray-200 text-text-secondary hover:border-primary hover:text-primary"
                  }`}
                >
                  {rate}%
                </Button>
              ))}
            </div>
          </div>

          {/* Calculation Fields */}
          <div className="space-y-6 mb-8">
            {/* Amount without GST Input */}
            <div className="relative">
              <Label className="block text-sm font-medium text-text-primary mb-2">
                <DollarSign className="inline mr-2 text-accent" size={16} />
                Amount without GST
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary font-medium">₹</span>
                <Input
                  type="number"
                  value={amountWithoutGST}
                  onChange={(e) => handleAmountWithoutGSTChange(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  className="w-full pl-8 pr-4 py-4 text-lg font-medium border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors duration-200 bg-white"
                />
              </div>
            </div>

            {/* Amount with GST Input */}
            <div className="relative">
              <Label className="block text-sm font-medium text-text-primary mb-2">
                <Receipt className="inline mr-2 text-accent" size={16} />
                Amount with GST
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary font-medium">₹</span>
                <Input
                  type="number"
                  value={amountWithGST}
                  onChange={(e) => handleAmountWithGSTChange(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  className="w-full pl-8 pr-4 py-4 text-lg font-medium border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors duration-200 bg-white"
                />
              </div>
            </div>

            {/* GST Amount Display */}
            <div className="relative">
              <Label className="block text-sm font-medium text-text-primary mb-2">
                <Calculator className="inline mr-2 text-primary" size={16} />
                GST Amount
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary font-medium">₹</span>
                <div className="w-full pl-8 pr-4 py-4 text-lg font-semibold border-2 border-primary bg-blue-50 rounded-xl text-primary">
                  {gstAmount.toFixed(2)}
                </div>
              </div>
              <p className="text-xs text-text-secondary mt-1">This field is automatically calculated</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <Button
              onClick={clearAll}
              variant="secondary"
              className="w-full sm:w-auto px-8 py-3 bg-gray-100 text-text-secondary font-medium rounded-xl hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
            >
              <Eraser className="mr-2" size={16} />
              Clear All
            </Button>
            
            <div className="text-sm text-text-secondary text-center sm:text-right">
              <p>Selected Rate: <span className="font-semibold text-primary">{selectedRate}%</span></p>
              <p className="text-xs mt-1">Calculations update automatically</p>
            </div>
          </div>

        </Card>

        {/* Info Section */}
        <Card className="mt-8 bg-surface rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            <Info className="inline mr-2 text-primary" size={20} />
            How to Use This GST Calculator
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-text-primary mb-2">Forward Calculation</h3>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• Enter amount without GST</li>
                <li>• Select applicable GST rate</li>
                <li>• GST amount and total are calculated automatically</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-text-primary mb-2">Reverse Calculation</h3>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• Enter total amount with GST</li>
                <li>• Select applicable GST rate</li>
                <li>• Base amount and GST are calculated automatically</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <h3 className="font-medium text-primary mb-2">
              <Lightbulb className="inline mr-2" size={16} />
              Example Calculation
            </h3>
            <p className="text-sm text-text-secondary">
              For ₹1000 without GST at 18% rate: GST Amount = ₹180, Total with GST = ₹1180
            </p>
          </div>
        </Card>

      </div>
    </div>
  );
}
