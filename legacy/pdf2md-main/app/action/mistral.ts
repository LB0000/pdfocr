"use server";

import { Mistral } from "@mistralai/mistralai";
import { OCRResponse } from "@mistralai/mistralai/src/models/components/ocrresponse.js";

/**
 * MistralAI OCR Processor
 * Performs OCR processing on a document at the specified URL
 *
 * @param documentUrl URL of the document to perform OCR on
 * @param includeImageBase64 Whether to include Base64 encoded image data
 * @returns Results of OCR processing
 */
export async function processMistralOcr(
  documentUrl: string,
  includeImageBase64: boolean = true
): Promise<OCRResponse> {
  if (!documentUrl) {
    throw new Error("Document URL is not specified");
  }

  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    throw new Error("MISTRAL_API_KEY is not set in environment variables");
  }

  const client = new Mistral({ apiKey });

  try {
    const ocrResponse = await client.ocr.process({
      model: "mistral-ocr-latest",
      document: {
        type: "document_url",
        documentUrl,
      },
      includeImageBase64,
    });

    return ocrResponse;
  } catch (error) {
    console.error("Error occurred during OCR processing:", error);
    throw error;
  }
}

/**
 * MistralAI OCR Processor (Image URL version)
 * Performs OCR processing on the specified image URL
 *
 * @param imageUrl URL of the image to perform OCR on
 * @param includeImageBase64 Whether to include Base64 encoded image data
 * @returns Results of OCR processing
 */
export async function processMistralImageOcr(
  imageUrl: string,
  includeImageBase64: boolean = true
): Promise<OCRResponse> {
  if (!imageUrl) {
    throw new Error("Image URL is not specified");
  }

  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    throw new Error("MISTRAL_API_KEY is not set in environment variables");
  }

  const client = new Mistral({ apiKey });

  try {
    const ocrResponse = await client.ocr.process({
      model: "mistral-ocr-latest",
      document: {
        type: "image_url",
        imageUrl,
      },
      includeImageBase64,
    });

    return ocrResponse;
  } catch (error) {
    console.error("Error occurred during OCR processing:", error);
    throw error;
  }
}

// Usage example
// const ocrResult = await processMistralOcr("https://arxiv.org/pdf/2201.04234");
// console.log(ocrResult);

// Image version usage example
// const imageOcrResult = await processMistralImageOcr("https://raw.githubusercontent.com/mistralai/cookbook/refs/heads/main/mistral/ocr/receipt.png");
// console.log(imageOcrResult);