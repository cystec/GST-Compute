import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Percent, Receipt, DollarSign, Eraser, Info, Lightbulb, Settings } from "lucide-react";

export default function GSTCalculator() {
  const [selectedRate, setSelectedRate] = useState<number>(18);
  const [customRate, setCustomRate] = useState<string>("");
  const [isCustomRate, setIsCustomRate] = useState<boolean>(false);
  const [gstType, setGstType] = useState<'IGST' | 'CGST_SGST'>('IGST');
  const [amountWithoutGST, setAmountWithoutGST] = useState<string>("");
  const [amountWithGST, setAmountWithGST] = useState<string>("");
  const [gstAmount, setGSTAmount] = useState<number>(0);
  const [cgstAmount, setCgstAmount] = useState<number>(0);
  const [sgstAmount, setSgstAmount] = useState<number>(0);
  const [lastModified, setLastModified] = useState<'withoutGST' | 'withGST' | null>(null);

  const gstRates = [0.25, 3, 5, 12, 18, 28];

  const getCurrentRate = () => {
    return isCustomRate ? parseFloat(customRate) || 0 : selectedRate;
  };

  const calculateFromExclusiveAmount = (amount: string) => {
    if (!amount || amount === "") {
      setGSTAmount(0);
      setCgstAmount(0);
      setSgstAmount(0);
      setAmountWithGST("");
      return;
    }

    const baseAmount = parseFloat(amount);
    if (isNaN(baseAmount)) return;

    const currentRate = getCurrentRate();
    const calculatedGST = (baseAmount * currentRate) / 100;
    const totalWithGST = baseAmount + calculatedGST;

    setGSTAmount(calculatedGST);
    setAmountWithGST(totalWithGST.toFixed(2));

    // Calculate CGST and SGST breakdown for CGST_SGST type
    if (gstType === 'CGST_SGST') {
      const halfGST = calculatedGST / 2;
      setCgstAmount(halfGST);
      setSgstAmount(halfGST);
    } else {
      setCgstAmount(0);
      setSgstAmount(0);
    }
  };

  const calculateFromInclusiveAmount = (amount: string) => {
    if (!amount || amount === "") {
      setGSTAmount(0);
      setCgstAmount(0);
      setSgstAmount(0);
      setAmountWithoutGST("");
      return;
    }

    const totalAmount = parseFloat(amount);
    if (isNaN(totalAmount)) return;

    const currentRate = getCurrentRate();
    const baseAmount = totalAmount / (1 + currentRate / 100);
    const calculatedGST = totalAmount - baseAmount;

    setGSTAmount(calculatedGST);
    setAmountWithoutGST(baseAmount.toFixed(2));

    // Calculate CGST and SGST breakdown for CGST_SGST type
    if (gstType === 'CGST_SGST') {
      const halfGST = calculatedGST / 2;
      setCgstAmount(halfGST);
      setSgstAmount(halfGST);
    } else {
      setCgstAmount(0);
      setSgstAmount(0);
    }
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

  const handleRateSelection = (rate: number) => {
    setSelectedRate(rate);
    setIsCustomRate(false);
    setCustomRate("");
  };

  const handleCustomRateChange = (value: string) => {
    setCustomRate(value);
    setIsCustomRate(true);
  };

  const clearAll = () => {
    setAmountWithoutGST("");
    setAmountWithGST("");
    setGSTAmount(0);
    setCgstAmount(0);
    setSgstAmount(0);
    setLastModified(null);
  };

  // Recalculate when rate or GST type changes
  useEffect(() => {
    if (lastModified === 'withoutGST' && amountWithoutGST) {
      calculateFromExclusiveAmount(amountWithoutGST);
    } else if (lastModified === 'withGST' && amountWithGST) {
      calculateFromInclusiveAmount(amountWithGST);
    }
  }, [selectedRate, customRate, isCustomRate, gstType]);

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
          
          {/* GST Type Selector */}
          <div className="mb-6">
            <Label className="block text-sm font-medium text-text-primary mb-3">
              <Settings className="inline mr-2 text-primary" size={16} />
              GST Type
            </Label>
            <Select value={gstType} onValueChange={(value: 'IGST' | 'CGST_SGST') => setGstType(value)}>
              <SelectTrigger className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-left focus:border-primary focus:outline-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IGST">IGST (Integrated GST)</SelectItem>
                <SelectItem value="CGST_SGST">CGST + SGST (Central + State GST)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* GST Rate Selector */}
          <div className="mb-8">
            <Label className="block text-sm font-medium text-text-primary mb-4">
              <Percent className="inline mr-2 text-primary" size={16} />
              Select GST Rate
            </Label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
              {gstRates.map((rate) => (
                <Button
                  key={rate}
                  variant={selectedRate === rate && !isCustomRate ? "default" : "outline"}
                  onClick={() => handleRateSelection(rate)}
                  className={`py-3 px-4 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 ${
                    selectedRate === rate && !isCustomRate
                      ? "border-2 border-primary bg-primary text-white hover:bg-primary-dark"
                      : "border-2 border-gray-200 text-text-secondary hover:border-primary hover:text-primary"
                  }`}
                >
                  {rate}%
                </Button>
              ))}
            </div>
            
            {/* Custom Rate Input */}
            <div className="mt-4">
              <Label className="block text-sm font-medium text-text-primary mb-2">
                Or enter custom rate:
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  value={customRate}
                  onChange={(e) => handleCustomRateChange(e.target.value)}
                  placeholder="Enter custom GST rate"
                  step="0.01"
                  min="0"
                  max="100"
                  className={`w-full pr-8 pl-4 py-3 text-lg font-medium border-2 rounded-xl focus:outline-none transition-colors duration-200 ${
                    isCustomRate
                      ? "border-primary bg-blue-50 text-primary"
                      : "border-gray-200 bg-white hover:border-primary"
                  }`}
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-secondary font-medium">%</span>
              </div>
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
                {gstType === 'IGST' ? 'IGST Amount' : 'Total GST Amount'}
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary font-medium">₹</span>
                <div className="w-full pl-8 pr-4 py-4 text-lg font-semibold border-2 border-primary bg-blue-50 rounded-xl text-primary">
                  {gstAmount.toFixed(2)}
                </div>
              </div>
              <p className="text-xs text-text-secondary mt-1">This field is automatically calculated</p>
            </div>

            {/* CGST/SGST Breakdown */}
            {gstType === 'CGST_SGST' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="relative">
                  <Label className="block text-sm font-medium text-text-primary mb-2">
                    CGST Amount ({getCurrentRate()/2}%)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary font-medium">₹</span>
                    <div className="w-full pl-8 pr-4 py-3 text-base font-semibold border-2 border-accent bg-green-50 rounded-xl text-accent">
                      {cgstAmount.toFixed(2)}
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <Label className="block text-sm font-medium text-text-primary mb-2">
                    SGST Amount ({getCurrentRate()/2}%)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary font-medium">₹</span>
                    <div className="w-full pl-8 pr-4 py-3 text-base font-semibold border-2 border-accent bg-green-50 rounded-xl text-accent">
                      {sgstAmount.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            )}
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
              <p>Selected Rate: <span className="font-semibold text-primary">{getCurrentRate()}%</span></p>
              <p>GST Type: <span className="font-semibold text-primary">{gstType === 'IGST' ? 'IGST' : 'CGST + SGST'}</span></p>
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
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-text-primary mb-2">Forward Calculation</h3>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• Enter amount without GST</li>
                <li>• Select GST rate or enter custom rate</li>
                <li>• GST amount and total calculated automatically</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-text-primary mb-2">Reverse Calculation</h3>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• Enter total amount with GST</li>
                <li>• Select GST rate or enter custom rate</li>
                <li>• Base amount and GST calculated automatically</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-text-primary mb-2">GST Types</h3>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• <strong>IGST:</strong> Single integrated tax</li>
                <li>• <strong>CGST + SGST:</strong> Split equally between Central and State</li>
                <li>• Automatic breakdown calculation</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <h3 className="font-medium text-primary mb-2">
              <Lightbulb className="inline mr-2" size={16} />
              Example Calculations
            </h3>
            <div className="text-sm text-text-secondary space-y-2">
              <p><strong>IGST:</strong> ₹1000 without GST at 18% = IGST ₹180, Total ₹1180</p>
              <p><strong>CGST+SGST:</strong> ₹1000 without GST at 18% = CGST ₹90 + SGST ₹90, Total ₹1180</p>
              <p><strong>Custom Rate:</strong> Enter any rate (e.g., 7.5%) for specific calculations</p>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
