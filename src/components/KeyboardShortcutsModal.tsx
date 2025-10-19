import React from 'react';
import { X } from './icons';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * KeyboardShortcutsModal component displays a modal with keyboard shortcuts for the chess analysis.
 */
export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '←', description: 'Previous move' },
    { key: '→', description: 'Next move' },
    { key: 'F', description: 'Flip board orientation' },
    { key: 'Esc', description: 'Close modal or analysis' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-[#312e2b] rounded-lg p-6 max-w-md w-full mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-bold text-white mb-6">Keyboard Shortcuts</h2>
        
        <div className="space-y-4">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-gray-300">{shortcut.description}</span>
              <kbd className="px-3 py-1.5 bg-[#1b1b1b] text-white rounded border border-gray-600 font-mono text-sm">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-600">
          <p className="text-gray-400 text-sm">
            Tip: Use arrow keys to navigate through moves quickly while analyzing your games.
          </p>
        </div>
      </div>
    </div>
  );
};
