import React from "react";

export const TextHoverEffect = ({ text }: { text: string; duration?: number }) => {
  return (
    <div className="flex items-center justify-center py-4">
      <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-blue-600 stroke-2 stroke-gray-900" style={{ WebkitTextStroke: '1px #e5e7eb' }}>
        {text}
      </h1>
    </div>
  );
};