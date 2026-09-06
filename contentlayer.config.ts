import { defineDocumentType, makeSource } from "contentlayer2/source-files";

export const Guide = defineDocumentType(() => ({
  name: "Guide",
  filePathPattern: "guides/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    publishedAt: { type: "date", required: true },
    updatedAt: { type: "date", required: false },
    coverImage: { type: "string", required: false },
    tags: { type: "list", of: { type: "string" }, default: [] },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.replace(/^guides\//, ""),
    },
    url: {
      type: "string",
      resolve: (doc) => `/guides/${doc._raw.flattenedPath.replace(/^guides\//, "")}`,
    },
  },
}));

export default makeSource({
  contentDirPath: "src/content",
  documentTypes: [Guide],
});
