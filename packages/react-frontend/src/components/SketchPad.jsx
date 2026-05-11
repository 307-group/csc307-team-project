import { useRef, useEffect, useState } from "react";
import { Trash2, Pencil, Eraser, RotateCcw } from "lucide-react";

export function SketchPad({ initialDataUrl, onSave, onDelete }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState("pen");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = 400;

    if (initialDataUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = initialDataUrl;
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [initialDataUrl]);

  const getPointerPosition = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getPointerPosition(e);

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getPointerPosition(e);

    ctx.lineWidth = tool === "pen" ? 2 : 20;
    ctx.lineCap = "round";
    ctx.strokeStyle = tool === "pen" ? "#000000" : "#ffffff";

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasChanges(true);
  };

  const saveSketch = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    onSave(canvas.toDataURL());
    setHasChanges(false);
  };

  const stopDrawing = () => {
    setIsDrawing(false);

    if (hasChanges) {
      saveSketch();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    onSave(canvas.toDataURL());
    setHasChanges(false);
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="flex items-center gap-2 p-3 border-b bg-gray-50">
        <button
          onClick={() => setTool("pen")}
          className={`p-2 rounded transition-colors ${
            tool === "pen"
              ? "bg-blue-100 text-blue-600"
              : "text-gray-600 hover:bg-gray-100"
          }`}
          title="Pen"
        >
          <Pencil className="size-4" />
        </button>

        <button
          onClick={() => setTool("eraser")}
          className={`p-2 rounded transition-colors ${
            tool === "eraser"
              ? "bg-blue-100 text-blue-600"
              : "text-gray-600 hover:bg-gray-100"
          }`}
          title="Eraser"
        >
          <Eraser className="size-4" />
        </button>

        <button
          onClick={clearCanvas}
          className="p-2 rounded text-gray-600 hover:bg-gray-100 transition-colors"
          title="Clear"
        >
          <RotateCcw className="size-4" />
        </button>

        <div className="flex-1" />

        <button
          onClick={onDelete}
          className="p-2 rounded text-red-500 hover:bg-red-50 transition-colors"
          title="Delete sketch"
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="w-full cursor-crosshair touch-none"
        style={{ height: "400px" }}
      />
    </div>
  );
}
