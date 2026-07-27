// llmExtractor.js
import { ChatGroq } from '@langchain/groq';
import { z } from 'zod';

// Schema mirrors your existing `data` shape exactly, so the LLM's output
// slots into the same object structure the rest of your pipeline expects.
const BusinessSchema = z.object({
    name: z.string().describe('Business name'),
    phone: z.string().describe('Phone number, empty string if not found'),
    rating: z.string().describe('Numeric rating like "4.2", empty string if not found'),
    ratingCount: z.string().describe('Number of ratings/reviews, empty string if not found'),
    address: z.string().describe('Full business address, empty string if not found'),
    website: z.string().describe('Website URL, empty string if not found'),
    gstin: z.string().describe('GSTIN number, empty string if not found'),
    categories: z.string().describe('Business categories separated by " | ", empty string if not found'),
    yearsInBusiness: z.string().describe('Years in business text, empty string if not found'),
    businessSummary: z.string().describe('Business summary/description, empty string if not found'),
});

const llm = new ChatGroq({
    model: 'llama-3.1-8b-instant',
    temperature: 0,
    apiKey:  "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",
});

const structuredLlm = llm.withStructuredOutput(BusinessSchema);

/**
 * Fallback extractor — called only when selector-based extraction
 * returns missing critical fields, suggesting JustDial's DOM changed.
 * Feeds the page's visible text to an LLM and asks it to extract the
 * same shape our selectors normally produce.
 */
export async function extractWithLLM(page, onLog) {
    try {
        // Cap the text we send — full page text can be huge and burns
        // tokens fast on a free-tier quota for little extra accuracy.
        const pageText = await page.locator('body').innerText();
        const trimmedText = pageText.slice(0, 6000);

        onLog('[justdial][llm-fallback] Selectors returned incomplete data — trying LLM extraction');

        const result = await structuredLlm.invoke(
            `Extract business listing details from this JustDial page text. ` +
            `If a field isn't present, return an empty string for it.\n\n${trimmedText}`
        );

        onLog(`[justdial][llm-fallback] LLM extracted: "${result.name || '(no name found)'}"`);
        return result;
    } catch (err) {
        onLog(`[justdial][llm-fallback] LLM extraction failed: ${err.message}`);
        return null;
    }
}