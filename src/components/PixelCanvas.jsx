import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { Loader2, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';

const CANVAS_SIZE = 100;
const DEFAULT_PIXEL_SIZE = 4; // pixels
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;

export const PixelCanvas = ({ 
  selectedColor, 
  onPixelClick, 
  isTransactionPending,
  pixelData = {},
  isConnected 
}) => {
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hoveredPixel, setHoveredPixel] = useState(null);

  const pixelSize = DEFAULT_PIXEL_SIZE * zoom;
  const canvasWidth = CANVAS_SIZE * pixelSize;
  const canvasHeight = CANVAS_SIZE * pixelSize;

  // Handle mouse events for dragging
  const handleMouseDown = useCallback((e) => {
    if (e.button === 0) { // Left mouse button
      setIsDragging(true);
      setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  }, [offset]);

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle pixel click
  const handlePixelClick = useCallback((x, y, e) => {
    e.stopPropagation();
    if (!isConnected || isTransactionPending) return;
    onPixelClick(x, y);
  }, [isConnected, isTransactionPending, onPixelClick]);

  // Handle zoom
  const handleZoom = useCallback((direction) => {
    setZoom(prev => {
      const newZoom = direction === 'in' ? prev * 1.2 : prev / 1.2;
      return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));
    });
  }, []);

  // Reset view
  const resetView = useCallback(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  // Add event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Generate pixel grid
  const pixelGrid = useMemo(() => {
    const pixels = [];
    for (let y = 0; y < CANVAS_SIZE; y++) {
      for (let x = 0; x < CANVAS_SIZE; x++) {
        const pixelKey = `${x}-${y}`;
        const pixel = pixelData[pixelKey];
        const pixelColor = pixel?.color || '#FFFFFF';
        
        pixels.push(
          <div
            key={pixelKey}
            className={`absolute border border-gray-200 cursor-pointer transition-all hover:border-gray-400 ${
              isTransactionPending ? 'cursor-not-allowed opacity-50' : ''
            } ${hoveredPixel === pixelKey ? 'ring-2 ring-blue-500' : ''}`}
            style={{
              left: x * pixelSize,
              top: y * pixelSize,
              width: pixelSize,
              height: pixelSize,
              backgroundColor: pixelColor,
              borderWidth: zoom > 1.5 ? '1px' : '0.5px'
            }}
            onClick={(e) => handlePixelClick(x, y, e)}
            onMouseEnter={() => setHoveredPixel(pixelKey)}
            onMouseLeave={() => setHoveredPixel(null)}
            title={`(${x}, ${y}) - ${pixelColor}${pixel?.painter ? ` by ${pixel.painter.slice(0, 6)}...` : ''}`}
          />
        );
      }
    }
    return pixels;
  }, [pixelSize, pixelData, isTransactionPending, hoveredPixel, handlePixelClick]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Pixel Canvas (100x100)</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleZoom('out')}
              disabled={zoom <= MIN_ZOOM}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-mono">{Math.round(zoom * 100)}%</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleZoom('in')}
              disabled={zoom >= MAX_ZOOM}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetView}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!isConnected && (
          <Alert className="mb-4">
            <AlertDescription>
              Connect your wallet to start painting pixels
            </AlertDescription>
          </Alert>
        )}

        {isTransactionPending && (
          <Alert className="mb-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>
              Transaction pending... Please wait.
            </AlertDescription>
          </Alert>
        )}

        <div className="relative overflow-hidden border-2 border-gray-300 rounded-lg bg-white">
          <div
            className="relative cursor-grab active:cursor-grabbing"
            style={{
              width: '100%',
              height: '600px', // Fixed viewport height
              overflow: 'hidden'
            }}
            onMouseDown={handleMouseDown}
          >
            <div
              className="relative"
              style={{
                width: canvasWidth,
                height: canvasHeight,
                transform: `translate(${offset.x}px, ${offset.y}px)`,
                transformOrigin: '0 0'
              }}
            >
              {pixelGrid}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <div>
            Selected Color: 
            <span 
              className="inline-block w-4 h-4 ml-2 border border-gray-300 rounded"
              style={{ backgroundColor: selectedColor }}
            />
            <span className="ml-1 font-mono">{selectedColor}</span>
          </div>
          {hoveredPixel && (
            <div>
              Hover: ({hoveredPixel.split('-').join(', ')})
            </div>
          )}
        </div>

        <div className="mt-2 text-xs text-gray-500">
          <p>• Click on any pixel to paint it with the selected color</p>
          <p>• Drag to pan around the canvas</p>
          <p>• Use zoom controls to get a closer look</p>
        </div>
      </CardContent>
    </Card>
  );
};

