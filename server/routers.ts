import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { orchardSpecies } from "../drizzle/schema";
import {
  createObservation,
  getPublicScanUserId,
  getObservationById,
  listObservationMapPoints,
  listObservations,
} from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { PlantIdRequestError, requestPlantAnalysis } from "./plantId";
import { storagePut } from "./storage";

const speciesSchema = z.enum(orchardSpecies);
const visitorIdSchema = z.string().regex(/^cg_[A-Za-z0-9_-]{24,92}$/, "Invalid local visitor identifier.");
const imageSchema = z
  .string()
  .min(32)
  .max(10_500_000)
  .regex(/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=\s]+$/, "Use a JPEG, PNG, or WebP image.");

function parseImageDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=\s]+)$/);
  if (!match) throw new TRPCError({ code: "BAD_REQUEST", message: "Unsupported image format." });
  const [, mimeType, encoded] = match;
  const bytes = Buffer.from(encoded.replace(/\s/g, ""), "base64");
  if (bytes.length === 0 || bytes.length > 7 * 1024 * 1024) {
    throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "Please select an image under 7 MB." });
  }
  return { mimeType, encoded: encoded.replace(/\s/g, ""), bytes };
}

function safeFileName(name: string, mimeType: string) {
  const cleaned = name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 100) || "leaf-scan";
  const extension = mimeType === "image/png" ? "png" : mimeType === "image/webp" ? "webp" : "jpg";
  return cleaned.includes(".") ? cleaned : `${cleaned}.${extension}`;
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  observation: router({
    analyze: publicProcedure
      .input(
        z.object({
          imageDataUrl: imageSchema,
          detailImageDataUrls: z.array(imageSchema).max(1).optional(),
          fileName: z.string().max(255).optional(),
          visitorId: visitorIdSchema,
          species: speciesSchema,
          latitude: z.number().min(-90).max(90).optional(),
          longitude: z.number().min(-180).max(180).optional(),
          capturedAt: z.number().int().positive().optional(),
        }),
      )
      .mutation(async ({ input }) => {
        const image = parseImageDataUrl(input.imageDataUrl);
        const detailImages = (input.detailImageDataUrls ?? []).map(parseImageDataUrl);
        const totalImageBytes = image.bytes.length + detailImages.reduce((total, detail) => total + detail.bytes.length, 0);
        if (totalImageBytes > 10 * 1024 * 1024) {
          throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "CropGuide could not prepare this field photo within the mobile analysis limit." });
        }
        const fileName = safeFileName(input.fileName ?? "leaf-scan", image.mimeType);
        const publicUserId = await getPublicScanUserId();
        const storage = await storagePut(
          `field-observations/visitors/${input.visitorId}/${Date.now()}-${fileName}`,
          image.bytes,
          image.mimeType,
        );
        let analysis;
        try {
          analysis = await requestPlantAnalysis({ imageBase64s: [image.encoded, ...detailImages.map(detail => detail.encoded)] });
        } catch (error) {
          console.error("[Plant.id] analysis request failed", error);
          if (error instanceof PlantIdRequestError && error.status >= 400 && error.status < 500) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "CropGuide could not process this field photo. Try a different JPEG, PNG, or WebP file.",
            });
          }
          throw new TRPCError({
            code: "BAD_GATEWAY",
            message: "The analysis service is unavailable. Your scan can be retried when the connection returns.",
          });
        }
        const id = await createObservation({
          userId: publicUserId,
          visitorId: input.visitorId,
          species: input.species,
          imageKey: storage.key,
          imageUrl: storage.url,
          imageName: fileName,
          mimeType: image.mimeType,
          latitude: input.latitude,
          longitude: input.longitude,
          capturedAt: new Date(input.capturedAt ?? Date.now()),
          apiResponse: analysis.raw,
          summary: analysis.summary,
        });
        const observation = await getObservationById(id, input.visitorId);
        if (!observation) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Unable to save scan." });
        return observation;
      }),
    get: publicProcedure.input(z.object({ id: z.number().int().positive(), visitorId: visitorIdSchema })).query(async ({ input }) => {
      const observation = await getObservationById(input.id, input.visitorId);
      if (!observation) throw new TRPCError({ code: "NOT_FOUND", message: "Scan not found." });
      return observation;
    }),
    history: publicProcedure
      .input(
        z.object({
          species: speciesSchema.optional(),
          cursor: z.number().int().positive().optional(),
          limit: z.number().int().min(1).max(24).default(10),
          visitorId: visitorIdSchema,
        }),
      )
      .query(async ({ input }) => {
        const rows = await listObservations(input);
        const hasNextPage = rows.length > input.limit;
        const items = hasNextPage ? rows.slice(0, -1) : rows;
        return { items, nextCursor: hasNextPage ? items.at(-1)?.id ?? null : null };
      }),
    mapPoints: publicProcedure.input(z.object({ visitorId: visitorIdSchema })).query(({ input }) => listObservationMapPoints(input.visitorId)),
  }),
});

export type AppRouter = typeof appRouter;
