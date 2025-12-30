"use server";

import { DocumentProps, renderToBuffer } from "@react-pdf/renderer";
import { ReactElement } from "react";

export type PDFResult = {
  buffer: Buffer;
  filename: string;
};

/**
 * Generates a PDF from a React PDF component.
 *
 * @param component - React PDF Document component
 * @param filename - Name for the generated PDF file
 * @returns Promise with PDF buffer and filename
 */
export async function generatePDF(
  component: ReactElement<DocumentProps>,
  filename: string
): Promise<PDFResult> {
  const buffer = await renderToBuffer(component);

  return {
    buffer: Buffer.from(buffer),
    filename,
  };
}
