"use server";

import { put, del, list } from "@vercel/blob";
import { v4 as uuidv4 } from "uuid";

/**
 * Function to upload PDF files to Vercel Blob
 * @param file PDF file to upload
 * @param folderName Folder name (default: 'pdfs')
 * @param filePath File path (if not specified, a UUID-based filename will be generated)
 * @returns Upload result (includes path when successful)
 */
export async function uploadPdfToVercelBlob(
  file: File,
  folderName: string = "pdfs",
  filePath?: string
): Promise<{ url: string | null; error: Error | null }> {
  try {
    // Check file format
    if (!file.type.includes("pdf")) {
      throw new Error("Only PDF files can be uploaded.");
    }

    // Check file size (20MB limit)
    const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File size exceeds the 20MB limit. Please upload a smaller file.");
    }

    // Generate filename using UUID if filePath not specified
    const path = filePath || `${folderName}/${uuidv4()}_${file.name}`;

    // Upload file to Vercel Blob
    const { url } = await put(path, file, {
      access: "public",
    });

    console.log("url", url);

    return { url, error: null };
  } catch (error) {
    console.error("PDF upload error:", error);
    return {
      url: null,
      error: error instanceof Error ? error : new Error("An unknown error occurred"),
    };
  }
}

/**
 * Function to upload image files to Vercel Blob
 * @param file Image file to upload
 * @param folderName Folder name (default: 'images')
 * @param filePath File path (if not specified, a UUID-based filename will be generated)
 * @returns Upload result (includes path when successful)
 */
export async function uploadImageToVercelBlob(
  file: File,
  folderName: string = "images",
  filePath?: string
): Promise<{ url: string | null; error: Error | null }> {
  try {
    // Check file format
    const validImageTypes = ["image/jpeg", "image/png"];
    if (!validImageTypes.includes(file.type)) {
      throw new Error("Only image files (JPEG, PNG) can be uploaded.");
    }

    // Check file size (20MB limit)
    const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File size exceeds the 20MB limit. Please upload a smaller file.");
    }

    // Generate filename using UUID if filePath not specified
    const path = filePath || `${folderName}/${uuidv4()}_${file.name}`;

    // Upload file to Vercel Blob
    const { url } = await put(path, file, {
      access: "public",
    });

    return { url, error: null };
  } catch (error) {
    console.error("Image upload error:", error);
    return {
      url: null,
      error: error instanceof Error ? error : new Error("An unknown error occurred"),
    };
  }
}

/**
 * Function to get the public URL of an image file
 * @param path File path
 * @returns Public URL
 */
export async function getImagePublicUrl(path: string): Promise<string> {
  // Vercel Blob URLs are already public when created with access: 'public'
  return `https://${
    process.env.BLOB_READ_WRITE_TOKEN?.split(":")[1]
  }.public.blob.vercel-storage.com/${path}`;
}

/**
 * Function to delete a file from Vercel Blob
 * @param path File path
 * @returns Delete result
 */
export async function deleteFileFromVercelBlob(
  path: string
): Promise<{ success: boolean; error: Error | null }> {
  try {
    await del(path);
    return { success: true, error: null };
  } catch (error) {
    console.error("File deletion error:", error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error("An unknown error occurred"),
    };
  }
}

/**
 * Function to list files in a folder
 * @param prefix Folder prefix
 * @returns List of files
 */
export async function listFilesInVercelBlob(
  prefix: string
): Promise<{ files: string[]; error: Error | null }> {
  try {
    const { blobs } = await list({ prefix });
    return {
      files: blobs.map((blob) => blob.pathname),
      error: null,
    };
  } catch (error) {
    console.error("File listing error:", error);
    return {
      files: [],
      error: error instanceof Error ? error : new Error("An unknown error occurred"),
    };
  }
}