import React from 'react';
import { X } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#fcfbf9] border border-[#e4dcce] max-w-lg w-full p-8 relative shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-[#736b63] hover:text-black transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="text-[10px] uppercase tracking-[0.25em] text-[#965438] font-semibold">
          ACCURATE SIZING
        </span>
        <h3 className="font-serif text-2xl text-[#28221e] mt-1 mb-2">Shirt Measurements (Inches)</h3>
        <p className="text-xs text-[#736b63] mb-6 font-light">
          Measurements taken with garment lying flat. We recommend comparing with your favorite fitting shirt.
        </p>

        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-[#e6dfd5] text-[#28221e] uppercase tracking-wider text-[11px]">
              <th className="py-2.5">Size</th>
              <th className="py-2.5">Chest</th>
              <th className="py-2.5">Length</th>
              <th className="py-2.5">Shoulder</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eee7de] text-[#554b44]">
            <tr>
              <td className="py-2.5 font-bold text-[#28221e]">S (Small)</td>
              <td className="py-2.5">38"</td>
              <td className="py-2.5">27.5"</td>
              <td className="py-2.5">17.5"</td>
            </tr>
            <tr>
              <td className="py-2.5 font-bold text-[#28221e]">M (Medium)</td>
              <td className="py-2.5">40"</td>
              <td className="py-2.5">28.5"</td>
              <td className="py-2.5">18.5"</td>
            </tr>
            <tr>
              <td className="py-2.5 font-bold text-[#28221e]">L (Large)</td>
              <td className="py-2.5">42"</td>
              <td className="py-2.5">29.5"</td>
              <td className="py-2.5">19.5"</td>
            </tr>
            <tr>
              <td className="py-2.5 font-bold text-[#28221e]">XL</td>
              <td className="py-2.5">44"</td>
              <td className="py-2.5">30.5"</td>
              <td className="py-2.5">20.5"</td>
            </tr>
          </tbody>
        </table>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-[#965438] text-white py-3 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#80442c] transition cursor-pointer"
        >
          GOT IT, RETURN TO SHIRT
        </button>
      </div>
    </div>
  );
};

