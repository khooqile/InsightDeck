'use client';

import React from 'react';
import { useDropzone } from 'react-dropzone';
import { LoaderCircle, UploadCloud } from 'lucide-react';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  loading: boolean;
}

export default function FileUploader({ onFileUpload, loading }: FileUploaderProps) {
  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt']
    },
    multiple: false,
    disabled: loading
  });

  return (
    <div
      {...getRootProps()}
      className={`
        w-full h-48 border-2 border-dashed rounded-lg cursor-pointer
        transition-all duration-300 ease-in-out
        flex flex-col items-center justify-center gap-4
        ${isDragActive 
          ? 'border-emerald-500 bg-emerald-950/50 scale-105' 
          : 'border-zinc-700 bg-zinc-900/50 hover:border-zinc-500'
        }
        ${loading ? 'cursor-not-allowed opacity-70' : ''}
      `}
    >
      <input {...getInputProps()} />
      
      {loading ? (
        <>
          <LoaderCircle className="h-8 w-8 animate-spin text-zinc-400" />
          <p className="text-zinc-300 text-sm font-medium">analyzing document...</p>
        </>
      ) : (
        <>
          <UploadCloud className="h-8 w-8 text-zinc-400" />
          <p className="text-zinc-300 text-sm font-medium text-center px-4">
            {isDragActive ? 'Drop the file here!' : 'drag & drop, or click to select'}
          </p>
        </>
      )}
    </div>
  );
}
