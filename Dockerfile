FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /repo
COPY package.json package-lock.json ./
COPY apps/app/package.json apps/app/package.json
COPY apps/public/package.json apps/public/package.json
COPY apps/viewer/package.json apps/viewer/package.json
COPY packages/ packages/
RUN npm ci

FROM base AS build
WORKDIR /repo
COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/packages ./packages
# Nested workspace installs (vite, etc.) — root node_modules alone is not enough
COPY --from=deps /repo/apps/app/node_modules ./apps/app/node_modules
COPY --from=deps /repo/apps/viewer/node_modules ./apps/viewer/node_modules
COPY . .
RUN npm run build --workspace=viewer
RUN npm run build --workspace=app

FROM base AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV DATA_DIR=/data
ENV PUBLISH_DIR=/publish
ENV VIEWER_DIST_DIR=/app/viewer-dist
ENV PORT=3000
COPY --from=build /repo/apps/app/.next/standalone ./
COPY --from=build /repo/apps/app/.next/static ./apps/app/.next/static
COPY --from=build /repo/apps/app/public ./apps/app/public
COPY --from=build /repo/apps/viewer/dist ./viewer-dist

EXPOSE 3000
VOLUME ["/data", "/publish"]
CMD ["node", "apps/app/server.js"]
