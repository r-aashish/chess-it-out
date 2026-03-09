import React from 'react';
import { X } from './icons';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '←', description: 'Previous move' },
    { key: '→', description: 'Next move' },
    { key: 'F', description: 'Flip board orientation' },
    { key: 'Shift + ?', description: 'Open shortcuts' },
    { key: 'Esc', description: 'Close modal or analysis' },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 px-4" onClick={onClose}>
      <div className="analysis-card w-full max-w-md p-6" onClick={(event) => event.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-100">Keyboard Shortcuts</h3>
          <button onClick={onClose} className="analysis-control-btn rounded-lg p-2" type="button" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3">
          {shortcuts.map((shortcut) => (
            <div key={shortcut.key} className="flex items-center justify-between rounded-xl bg-slate-900/45 px-3 py-2">
              <span className="text-sm text-slate-300">{shortcut.description}</span>
              <kbd className="rounded-md border border-slate-500/50 bg-slate-800 px-2 py-1 text-xs font-semibold text-slate-100">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
