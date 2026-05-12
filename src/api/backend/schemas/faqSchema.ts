import z from 'zod';

import { localizedSchema } from './localizedSchema';
import { locales, defaultLocale } from '../const';

// Optional locales (all locales except the default one)
const optionalLocales = locales.filter((locale) => locale !== defaultLocale);

export const faqSchema = z
  .object({
    question: localizedSchema,
    answer: localizedSchema,
  })
  .superRefine((data, ctx) => {
    for (const locale of optionalLocales) {
      const question = data.question[locale]?.trim();
      const answer = data.answer[locale]?.trim();

      const hasQuestion = !!question;
      const hasAnswer = !!answer;

      if (hasQuestion && !hasAnswer) {
        ctx.addIssue({
          code: 'custom',
          path: ['answer', locale],
          message: `Answer (${locale}) is required when question (${locale}) is provided`,
        });
      }

      if (!hasQuestion && hasAnswer) {
        ctx.addIssue({
          code: 'custom',
          path: ['question', locale],
          message: `Question (${locale}) is required when answer (${locale}) is provided`,
        });
      }
    }
  });

export type FAQSchema = z.infer<typeof faqSchema>;
