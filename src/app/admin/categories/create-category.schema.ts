import { z } from 'zod';

export const createCategorySchema = z.object({
    image: z.any().optional().refine((file) => {
        // If intent is 'create', image is required
        // If intent is 'update', image is optional
        return !file || file.length === 1;
    }, { message: 'Invalid image file' }),
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    intent: z.enum(['create', 'update'], { message: 'Intent must be either create or update' }).optional(),
    slug: z.string().min(1, { message: 'Slug is required' }).optional(),
}).refine((data) => {
    // If creating, image is required
    if (data.intent === 'create' || !data.intent) {
        return data.image && data.image.length === 1;
    }
    return true;
}, { message: 'Image is required for creating categories', path: ['image'] })

export type CreateCategorySchema = z.infer<typeof createCategorySchema>;

export const createCategorySchemaServer = z.object({
  imageUrl: z.string().min(1, { message: 'Image is required' }),
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' }),
});
export type CreateCategorySchemaServer = z.infer<
  typeof createCategorySchemaServer
>;

export const updateCategorySchema = z.object({
  imageUrl: z.string().min(1, { message: 'Image is required' }),
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' }),
  intent: z.enum(['create', 'update'], {
    message: 'Intent must be either create or update',
  }),
  slug: z.string().min(1, { message: 'Slug is required' }),
});

export type UpdateCategorySchema = z.infer<typeof updateCategorySchema>;

