"use client";
import { DragDropProvider, SetupEditor } from '@/components/Setup';

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-theme-background">
      <DragDropProvider>
        <SetupEditor />
      </DragDropProvider>
    </div>
  );
}
