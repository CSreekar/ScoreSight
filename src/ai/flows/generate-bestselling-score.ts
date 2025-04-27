// This file is machine-generated - changes may be overwritten.
'use server';
/**
 * @fileOverview Generates a bestselling score for a given document.
 *
 * - generateBestsellingScore - A function that handles the bestselling score generation process.
 * - GenerateBestsellingScoreInput - The input type for the generateBestsellingScore function.
 * - GenerateBestsellingScoreOutput - The return type for the generateBestsellingScore function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateBestsellingScoreInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A document (PDF or DOC), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateBestsellingScoreInput = z.infer<typeof GenerateBestsellingScoreInputSchema>;

const GenerateBestsellingScoreOutputSchema = z.object({
  bestsellingScore: z
    .number()
    .describe("A score (0-100) representing the document's potential to become a bestseller."),
  rationale: z
    .string()
    .describe('The rationale behind the assigned bestselling score.'),
});
export type GenerateBestsellingScoreOutput = z.infer<typeof GenerateBestsellingScoreOutputSchema>;

export async function generateBestsellingScore(
  input: GenerateBestsellingScoreInput
): Promise<GenerateBestsellingScoreOutput> {
  return generateBestsellingScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBestsellingScorePrompt',
  input: {
    schema: z.object({
      documentDataUri: z
        .string()
        .describe(
          "A document (PDF or DOC), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
        ),
    }),
  },
  output: {
    schema: z.object({
      bestsellingScore: z
        .number()
        .describe("A score (0-100) representing the document's potential to become a bestseller."),
      rationale: z
        .string()
        .describe('The rationale behind the assigned bestselling score.'),
    }),
  },
  prompt: `You are an AI expert in predicting the commercial success of written works.

  Analyze the provided document and estimate its potential to become a bestseller. Provide a score between 0 and 100, where 100 represents the highest potential.

  Explain the rationale behind the assigned score.

  Document: {{media url=documentDataUri}}`,
});

const generateBestsellingScoreFlow = ai.defineFlow<
  typeof GenerateBestsellingScoreInputSchema,
  typeof GenerateBestsellingScoreOutputSchema
>(
  {
    name: 'generateBestsellingScoreFlow',
    inputSchema: GenerateBestsellingScoreInputSchema,
    outputSchema: GenerateBestsellingScoreOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
