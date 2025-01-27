import React from 'react';
import { AlertCircle } from './icons';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="flex items-center p-4 mb-4 text-red-800 bg-red-50 dark:bg-red-900/50 dark:text-red-200 rounded-lg">
      <AlertCircle className="w-5 h-5 mr-2" />
      <span>{message}</span>
    </div>
  );
};