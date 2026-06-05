import { Trash2, X } from 'lucide-react';

export default function DeleteModal({
  title,
  message,
  confirmText = 'Delete',
  onConfirm,
  onCancel,
}) {
  return (
    <div
      className="backdrop-blur-[8px] bg-[rgba(10,10,10,0.7)] flex items-center justify-center px-4 fixed inset-0 z-50"
      onClick={onCancel}
    >
      <div
        className="bg-white flex flex-col rounded-[12px] shadow-[0px_20px_24px_-4px_rgba(0,0,0,0.1),0px_8px_8px_-4px_rgba(0,0,0,0.04)] w-full max-w-[340px] relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          className="absolute right-[10px] top-[10px] p-2 rounded-[6px] hover:bg-gray-100 transition-colors"
        >
          <X size={20} className="text-[#737373]" />
        </button>

        <div className="flex flex-col gap-[10px] pt-[16px] px-[14px]">
          <div className="bg-[#f5e6e6] relative rounded-[20px] size-[40px] flex items-center justify-center">
            <div className="absolute border-4 border-[#faf0f0] inset-[-3px] rounded-[23px]" />
            <Trash2
              className="size-[20px] text-red-600 relative z-10"
              strokeWidth={2}
            />
          </div>

          <div>
            <p className="font-semibold leading-[22px] text-[#171717] text-[16px]">
              {title}
            </p>
            <p className="font-normal leading-[18px] text-[#525252] text-[13px] mt-[2px]">
              {message}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-[8px] pt-[16px] pb-[14px] px-[14px]">
          <button
            onClick={onConfirm}
            className="bg-[#171717] rounded-[6px] w-full px-[14px] py-[8px] text-white text-[14px] font-semibold hover:opacity-90 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
          >
            {confirmText}
          </button>

          <button
            onClick={onCancel}
            className="bg-white rounded-[6px] w-full px-[14px] py-[8px] text-[#404040] text-[14px] font-semibold border border-[#d4d4d4] hover:opacity-90 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
