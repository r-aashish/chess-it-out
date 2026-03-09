import React from 'react';
import { AlertCircle } from './icons';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="ui-panel-subtle mt-4 flex items-start gap-3 rounded-2xl border-rose-300/50 bg-rose-50/70 p-4 text-rose-700 dark:border-rose-500/40 dark:bg-rose-950/35 dark:text-rose-200">
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};
