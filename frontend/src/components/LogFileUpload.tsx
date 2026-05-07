import type { ChangeEvent } from "react";

type LogFileUploadProps = {
  uploadedFileName: string;
  onFileUpload: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function LogFileUpload({
  uploadedFileName,
  onFileUpload,
}: LogFileUploadProps) {
  return (
    <div className="mb-4 rounded-xl border border-slate-800 bg-slate-950 p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-300">Upload Log File</p>
          <p className="text-xs text-slate-500">
            Supported formats: .log and .txt
          </p>
        </div>

        <label className="cursor-pointer rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800">
          Choose file
          <input
            type="file"
            accept=".log,.txt"
            onChange={onFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {uploadedFileName && (
        <p className="mt-3 rounded-lg bg-slate-900 px-3 py-2 text-xs text-cyan-300">
          Loaded file: {uploadedFileName}
        </p>
      )}
    </div>
  );
}