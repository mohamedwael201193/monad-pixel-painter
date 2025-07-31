import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { DEFAULT_COLORS } from '../config/web3.js';

export const ColorPalette = ({ selectedColor, onColorSelect }) => {
  const [customColor, setCustomColor] = useState('#000000');
  const [showCustom, setShowCustom] = useState(false);

  const handleCustomColorChange = (e) => {
    const color = e.target.value;
    setCustomColor(color);
    onColorSelect(color);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Color Palette</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Default Colors Grid */}
        <div className="grid grid-cols-5 gap-2">
          {DEFAULT_COLORS.map((color, index) => (
            <button
              key={index}
              className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                selectedColor === color 
                  ? 'border-gray-800 ring-2 ring-blue-500' 
                  : 'border-gray-300 hover:border-gray-500'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => onColorSelect(color)}
              title={color}
            />
          ))}
        </div>

        {/* Custom Color Section */}
        <div className="space-y-2">
          <Button
            variant="outline"
            onClick={() => setShowCustom(!showCustom)}
            className="w-full"
          >
            {showCustom ? 'Hide' : 'Show'} Custom Color
          </Button>

          {showCustom && (
            <div className="space-y-2">
              <Label htmlFor="custom-color">Custom Color</Label>
              <div className="flex space-x-2">
                <Input
                  id="custom-color"
                  type="color"
                  value={customColor}
                  onChange={handleCustomColorChange}
                  className="w-16 h-10 p-1 border rounded"
                />
                <Input
                  type="text"
                  value={customColor}
                  onChange={(e) => {
                    const color = e.target.value;
                    if (/^#[0-9A-F]{6}$/i.test(color)) {
                      setCustomColor(color);
                      onColorSelect(color);
                    }
                  }}
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
            </div>
          )}
        </div>

        {/* Selected Color Display */}
        <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
          <div
            className="w-8 h-8 rounded border-2 border-gray-300"
            style={{ backgroundColor: selectedColor }}
          />
          <div>
            <p className="text-sm font-medium">Selected Color</p>
            <p className="text-xs text-gray-600 font-mono">{selectedColor}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

