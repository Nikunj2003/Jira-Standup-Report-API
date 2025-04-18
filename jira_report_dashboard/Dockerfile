################################################################################
# Use node image for base image for all stages.
FROM node:22.14.0-alpine as base

################################################################################
# Install dependencies in a separate stage to reduce Docker image size.
FROM base as deps
WORKDIR /app
COPY package*.json ./
RUN npm install --frozen-lockfile

################################################################################
# Build the Next.js project in a separate stage to reduce Docker image size.
FROM deps as build
WORKDIR /app
COPY . .
RUN npm run build

################################################################################
# Production stage.
FROM base as production
WORKDIR /app
COPY --from=build /app/next-static ./
COPY --from=build /app/public ./public
RUN npm install --only=production
CMD ["npm", "start"]