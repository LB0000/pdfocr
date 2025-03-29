"use client";

import { useState, useRef, useCallback } from "react";
import { uploadPdfToVercelBlob, uploadImageToVercelBlob } from "./action/storage";
import { processMistralOcr, processMistralImageOcr } from "./action/mistral";
import { OCRResponse } from "@mistralai/mistralai/src/models/components/ocrresponse.js";
import OcrResultView from "./components/OcrResultView";
import UploadResult from "./components/UploadResult";
import Header from "./components/Header";
import { useDropzone } from "react-dropzone";
import Footer from "./components/Footer";

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message: string;
    url?: string;
    fileType?: "pdf" | "image";
  } | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [ocrResult, setOcrResult] = useState<
    OCRResponse | { success: false; error: string } | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState<"upload" | "analyze" | "result">("upload");

  // Supported file types
  const acceptedFileTypes = {
    "application/pdf": [".pdf"],
  };

  // Check if file type is valid
  const isValidFileType = (file: File): boolean => {
    return file.type === "application/pdf";
  };

  // Check if file size is valid (under 20MB)
  const isValidFileSize = (file: File): boolean => {
    const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB in bytes
    return file.size <= MAX_FILE_SIZE;
  };

  // Get file type
  const getFileType = (file: File): "pdf" | null => {
    if (file.type === "application/pdf") return "pdf";
    return null;
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const newFile = acceptedFiles[0];
      if (!isValidFileType(newFile)) {
        alert("Only PDF files can be uploaded");
        return;
      }

      if (!isValidFileSize(newFile)) {
        alert("File size exceeds the 20MB limit. Please upload a smaller file.");
        return;
      }

      setFile(newFile);
      setUploadResult(null);
      setOcrResult(null);
      handleUpload(newFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxFiles: 1,
    noClick: false,
    noKeyboard: false,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (!isValidFileType(selectedFile)) {
        alert("Only PDF files can be uploaded");
        return;
      }

      if (!isValidFileSize(selectedFile)) {
        alert("File size exceeds the 20MB limit. Please upload a smaller file.");
        return;
      }

      setFile(selectedFile);
      setUploadResult(null);
      setOcrResult(null);
      handleUpload(selectedFile);
    }
  };

  const handleUpload = async (selectedFile?: File) => {
    const fileToUpload = selectedFile || file;
    if (!fileToUpload) return;

    setUploading(true);
    setUploadResult(null);
    setOcrResult(null);
    setCurrentStep("upload");

    try {
      const fileType = getFileType(fileToUpload);
      if (!fileType) {
        throw new Error("Unsupported file format");
      }

      let result;
      let publicUrl;

      // Upload based on file type
      if (fileType === "pdf") {
        result = await uploadPdfToVercelBlob(fileToUpload);
        if (result.error) throw result.error;
        if (result.url) publicUrl = result.url;
      } else {
        result = await uploadImageToVercelBlob(fileToUpload);
        if (result.error) throw result.error;
        if (result.url) publicUrl = result.url;
      }

      if (!publicUrl) throw new Error("Could not get file URL");

      setUploadResult({
        success: true,
        message: `${fileType === "pdf" ? "PDF" : "Image"} upload successful!`,
        url: publicUrl,
        fileType: fileType,
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setCurrentStep("analyze");
      handleAnalyze(publicUrl, fileType);
    } catch (error) {
      setUploadResult({
        success: false,
        message: "Error during upload" + (error instanceof Error ? `: ${error.message}` : ""),
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async (fileUrl?: string, fileType?: "pdf" | "image") => {
    const urlToAnalyze = fileUrl || uploadResult?.url;
    const typeToAnalyze = fileType || uploadResult?.fileType;

    if (!urlToAnalyze || !typeToAnalyze) return;

    setAnalyzing(true);
    setOcrResult(null);
    setCurrentStep("analyze");

    try {
      let response;

      if (typeToAnalyze === "pdf") {
        response = await processMistralOcr(urlToAnalyze, true);
      } else {
        response = await processMistralImageOcr(urlToAnalyze, true);
      }

      console.log(`${typeToAnalyze === "pdf" ? "PDF" : "Image"} analysis result:`, response);
      setOcrResult(response);
      setCurrentStep("result");
    } catch (error) {
      console.error(`${typeToAnalyze === "pdf" ? "PDF" : "Image"} analysis error:`, error);
      setOcrResult({
        success: false,
        error: error instanceof Error ? error.message : "Error during analysis",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setUploadResult(null);
    setOcrResult(null);
    setCurrentStep("upload");
  };

  // Initial upload state
  if (currentStep === "upload" && !file) {
    return (
      <div className="flex flex-col w-full h-screen">
        <Header isInitialUpload={true} />

        <div
          {...getRootProps()}
          className={`flex-1 flex flex-col items-center justify-center p-8 m-6 mt-0 border-2 border-dashed rounded-xl transition-all duration-200 ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-gray-50 hover:border-orange-400 hover:bg-orange-50"
          } cursor-pointer`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input {...getInputProps()} ref={fileInputRef} onChange={handleFileChange} />
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">
              {isDragActive ? "Drop here" : "Drag & Drop PDF"}
            </h2>

            <p className="text-gray-500 max-w-md mx-auto">
              Drop or click to upload PDF
              <span className="block text-xs mt-1">(JPEG, PNG supported)</span>
            </p>

            <button
              type="button"
              className="mt-2 inline-flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl shadow-sm transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Select File
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Upload, analysis, or result display state
  return (
    <div className="flex flex-col h-screen w-full">
      <Header currentStep={currentStep} onReset={handleReset} />

      {/* Main content: 2-column layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left side: File preview */}
        <div className="w-full md:w-1/2 p-4 overflow-auto bg-gray-100 border-r border-gray-200">
          {uploadResult?.url ? (
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">
                  Uploaded {uploadResult.fileType === "pdf" ? "PDF" : "Image"}
                </h2>

                {/* File information */}
                {file && (
                  <div className="text-xs bg-white px-2 py-1 rounded-md text-gray-600 border border-gray-200">
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
              </div>
              <div className="flex-1 relative bg-white rounded-lg shadow-sm overflow-hidden">
                {uploadResult.fileType === "pdf" ? (
                  <iframe
                    src={uploadResult.url}
                    className="w-full h-full border-0"
                    title="PDF Preview"
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src={uploadResult.url}
                      alt="Uploaded Image"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              {uploading ? (
                <div className="text-center">
                  <svg
                    className="animate-spin h-10 w-10 text-orange-500 mx-auto mb-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <p className="font-medium">Uploading...</p>
                </div>
              ) : (
                <p>No File</p>
              )}
            </div>
          )}
        </div>

        {/* Right side: OCR results */}
        <div className="w-full md:w-1/2 p-4 overflow-auto">
          {analyzing ? (
            <div className="h-full flex flex-col items-center justify-center">
              <svg
                className="animate-spin h-12 w-12 text-orange-500 mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Converting...</h3>
              <p className="text-gray-500 text-center max-w-md">Converting PDF to text</p>
            </div>
          ) : ocrResult ? (
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-auto">
                <OcrResultView ocrResult={ocrResult} analyzing={false} />
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <p>No Conversion Result</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload result (displayed only for errors) */}
      {uploadResult && !uploadResult.success && (
        <div className="fixed bottom-4 right-4 max-w-md">
          <UploadResult
            uploadResult={uploadResult}
            analyzing={analyzing}
            onAnalyze={() => handleAnalyze()}
          />
        </div>
      )}
      <Footer />
    </div>
  );
}