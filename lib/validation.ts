import { z } from 'zod';
const text = (max: number) => z.string().trim().max(max);
const url = z.string().trim().max(2048).refine(v => !v || (/^https:\/\//i.test(v) && (() => { try { new URL(v); return true; } catch { return false; } })()), 'Use a valid HTTPS URL.');
const image = z.string().trim().max(2048).refine(v => !v || /^\/(work|uploads|api\/media)\/[a-zA-Z0-9/_.-]+$/.test(v) || /^https:\/\//i.test(v), 'Use an uploaded image or HTTPS URL.');
export const projectSchema = z.object({
  videoUrl: image.default(''), documentUrl: image.default(''), seoTitle: text(160).default(''), seoDescription: text(500).default(''), socialImage: image.default(''), results: text(4000).default(''), deleted: z.boolean().default(false), title: text(140).min(2), slug: text(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), category: z.enum(['web','design','app','data','it','other']), description: text(1200).min(10),
  coverImage: image, coverAlt: text(300), liveUrl: url.nullable(), repoUrl: url.nullable(), tech: text(500), year: text(20), featured: z.boolean(), published: z.boolean(), order: z.number().int().min(0).max(10000),
  client: text(140), role: text(200), challenge: text(8000), solution: text(12000), outcome: text(8000), gallery: z.array(image).max(16),
});
export const inquirySchema = z.object({
  project: text(200).default(''), source: text(240).regex(/^\/(?:[a-zA-Z0-9_/-]*)$/).default('/contact'), name: text(100).min(2), email: text(254).email(), company: text(150).default(''), service: z.enum(['Development','Design','Data science','IT & security','A little of everything']),
  budget: z.enum(['Exploring options','Under AED 5,000','AED 5,000–15,000','AED 15,000–40,000','AED 40,000+']), message: text(6000).min(20), consent: z.literal(true), website: text(200).default(''), requestId: z.string().uuid(),
});
export type InquiryInput = z.infer<typeof inquirySchema>;
