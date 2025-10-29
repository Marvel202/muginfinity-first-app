import { z } from "zod";

export const createOrUpdateProductSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  price: z.string().min(1, { message: 'price is required' }),
  maxQuantity: z.string().min(1, { message: 'maxQuantity is required' }),
  category: z.string().min(1, { message: 'Category is required' }),
  heroImage: z.any().optional(),
  images: z
    .any()
    .transform((files: FileList | null | File[]) => {
      if (!files) return [];
      if (Array.isArray(files)) return files;
      return Array.from(files);
    })
    .pipe(z.array(z.instanceof(File))),
  intent: z
    .enum(['create', 'update'], {
      message: 'Intent must be either create or update',
    })
    .optional(),
  slug: z.string().optional(),
}).superRefine((data, ctx) => {
  // Only require images for create intent
  if (data.intent === 'create' || !data.intent) {
    if (!data.heroImage || data.heroImage.length !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Hero image is required for new products',
        path: ['heroImage'],
      });
    }
    if (!data.images || data.images.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one image is required for new products',
        path: ['images'],
      });
    }
  }
});

export type CreateOrUpdateProductSchema = z.infer<
  typeof createOrUpdateProductSchema
>;

export const createProductSchemaServer = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  price: z.number().positive({ message: 'price is required' }),
  maxQuantity: z.number().positive({ message: 'maxQuantity is required' }),
  category: z.number().positive({ message: 'Category is required' }),
  heroImage: z.string().url({ message: 'Hero image is required' }),
  images: z.array(z.string().url({ message: 'Images are required' })),
});

export type CreateProductSchemaServer = z.infer<
  typeof createProductSchemaServer
>;

