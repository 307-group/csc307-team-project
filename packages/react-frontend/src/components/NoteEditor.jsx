import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  ChevronLeft,
  X,
  Image as ImageIcon,
  PenTool,
  Trash2,
} from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { SketchPad } from "./SketchPad";

export function NoteEditor({
  note,
  labels,
  onUpdateTitle,
  onUpdateContent,
  onUpdateLabel,
  onUpdateNote,
  onBack,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!note) {
    return (
      <div className="flex-1 flex flex-col bg-gray-50">
        {onBack && (
          <div className="lg:hidden border-b bg-white px-4 py-3">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
              type="button"
            >
              <ChevronLeft className="size-4" />
              Notes
            </button>
          </div>
        )}

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p className="text-lg">Select a note to start editing</p>
            <p className="text-sm mt-2">or create a new one</p>
          </div>
        </div>
      </div>
    );
  }

  const activeLabel = labels.find((l) => l.id === note.labelId);

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !note) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const dataUrl = event.target?.result;

      const newImage = {
        id: Date.now().toString(),
        dataUrl,
      };

      const updatedNote = {
        ...note,
        images: [...(note.images || []), newImage],
      };

      onUpdateNote(updatedNote);
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleDeleteImage = (imageId) => {
    const updatedNote = {
      ...note,
      images: note.images?.filter((img) => img.id !== imageId) || [],
    };

    onUpdateNote(updatedNote);
  };

  const handleAddSketch = () => {
    const newSketch = {
      id: Date.now().toString(),
      dataUrl: "",
    };

    const updatedNote = {
      ...note,
      sketches: [...(note.sketches || []), newSketch],
    };

    onUpdateNote(updatedNote);
  };

  const handleUpdateSketch = (sketchId, dataUrl) => {
    const updatedNote = {
      ...note,
      sketches:
        note.sketches?.map((s) =>
          s.id === sketchId ? { ...s, dataUrl } : s
        ) || [],
    };

    onUpdateNote(updatedNote);
  };

  const handleDeleteSketch = (sketchId) => {
    const updatedNote = {
      ...note,
      sketches: note.sketches?.filter((s) => s.id !== sketchId) || [],
    };

    onUpdateNote(updatedNote);
  };

  return (
    <div className="flex-1 flex flex-col bg-white min-w-0">
      {onBack && (
        <div className="lg:hidden border-b px-4 py-3 flex items-center">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
            type="button"
          >
            <ChevronLeft className="size-4" />
            Notes
          </button>
        </div>
      )}

      <div className="px-6 pt-6 pb-4 border-b">
        <Input
          value={note.title}
          onChange={(e) => onUpdateTitle(e.target.value)}
          placeholder="Note title..."
          className="text-2xl font-bold border-none shadow-none px-4 focus-visible:ring-0"
        />

        <div className="mt-3 px-4 flex items-center gap-2">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center gap-1.5 text-sm rounded-full px-3 py-1 border transition-colors"
              style={
                activeLabel
                  ? {
                      backgroundColor: `${activeLabel.color}1a`,
                      borderColor: `${activeLabel.color}66`,
                      color: activeLabel.color,
                    }
                  : {
                      borderStyle: "dashed",
                      borderColor: "#d1d5db",
                      color: "#9ca3af",
                    }
              }
              type="button"
            >
              {activeLabel ? (
                <>
                  <span
                    className="size-2 rounded-full shrink-0"
                    style={{ backgroundColor: activeLabel.color }}
                  />
                  {activeLabel.name}
                </>
              ) : (
                "Add label"
              )}

              <ChevronDown className="size-3.5 ml-0.5 opacity-60" />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[180px]">
                {labels.length === 0 ? (
                  <p className="px-3 py-2 text-xs text-gray-400">
                    No labels yet — create one in the sidebar.
                  </p>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        onUpdateLabel(undefined);
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                      type="button"
                    >
                      <span className="size-2 rounded-full bg-gray-300 shrink-0" />
                      No label
                    </button>

                    <div className="border-t border-gray-100 my-1" />

                    {labels.map((label) => (
                      <button
                        key={label.id}
                        onClick={() => {
                          onUpdateLabel(label.id);
                          setDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        type="button"
                      >
                        <span
                          className="size-2 rounded-full shrink-0"
                          style={{ backgroundColor: label.color }}
                        />
                        {label.name}

                        {note.labelId === label.id && (
                          <span
                            className="ml-auto"
                            style={{ color: label.color }}
                          >
                            ✓
                          </span>
                        )}
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {activeLabel && (
            <button
              onClick={() => onUpdateLabel(undefined)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Remove label"
              type="button"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <Textarea
          value={note.content}
          onChange={(e) => onUpdateContent(e.target.value)}
          placeholder="Start typing your note..."
          className="min-h-[200px] resize-none border-none shadow-none px-4 py-2 focus-visible:ring-0"
        />

        <div className="mt-4 flex gap-2 px-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            type="button"
          >
            <ImageIcon className="size-4" />
            Add Image
          </button>

          <button
            onClick={handleAddSketch}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            type="button"
          >
            <PenTool className="size-4" />
            Add Sketch
          </button>
        </div>

        {note.images && note.images.length > 0 && (
          <div className="mt-6 px-4 space-y-4">
            {note.images.map((image) => (
              <div
                key={image.id}
                className="relative group border rounded-lg overflow-hidden"
              >
                <img
                  src={image.dataUrl}
                  alt="Note attachment"
                  className="w-full"
                />

                <button
                  onClick={() => handleDeleteImage(image.id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:bg-red-50"
                  type="button"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {note.sketches && note.sketches.length > 0 && (
          <div className="mt-6 px-4 space-y-4">
            {note.sketches.map((sketch) => (
              <SketchPad
                key={sketch.id}
                initialDataUrl={sketch.dataUrl || undefined}
                onSave={(dataUrl) =>
                  handleUpdateSketch(sketch.id, dataUrl)
                }
                onDelete={() => handleDeleteSketch(sketch.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}