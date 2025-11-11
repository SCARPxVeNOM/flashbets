'use client';

import { Play, X } from 'lucide-react';
import { useDemoStore } from '@/store/demo-store';

export function DemoButton() {
  const { isDemoMode, startDemo, stopDemo } = useDemoStore();

  if (isDemoMode) {
    return (
      <button
        onClick={stopDemo}
        className="px-6 py-3 bg-white border-4 border-black text-black font-black uppercase flex items-center gap-2 shadow-[6px_6px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
      >
        <X className="w-4 h-4" />
        Exit Demo
      </button>
    );
  }

  return (
    <button
      onClick={startDemo}
      className="px-6 py-3 bg-white border-4 border-black text-black font-black uppercase flex items-center gap-2 shadow-[6px_6px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
    >
      <Play className="w-4 h-4" />
      See Example →
    </button>
  );
}

