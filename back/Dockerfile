# ================================================
# Dockerfile - VitalFlow HIS Backend
# Node.js/NestJS with FHIR R4 Facade
# ================================================

FROM node:26-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependencias
RUN npm ci --only=production && \
    npm ci --only=development

# Copiar source code
COPY src ./src

# Compilar TypeScript
RUN npm run build

# ================================================
# Runtime stage
# ================================================
FROM node:26-alpine

ARG NODE_ENV=development

WORKDIR /app

# Instalar curl para healthcheck
RUN apk add --no-cache curl

# Copiar package files
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production && \
    npm cache clean --force

# Copiar código compilado
COPY --from=builder /app/dist ./dist

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

EXPOSE 3001

HEALTHCHECK --interval=15s --timeout=5s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

CMD ["node", "dist/main.js"]
