# Multi-stage Dockerfile for Employee Management System
# Stage 1: Build Vue 3 Frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/client

# Copy frontend package files
COPY client/package*.json ./

# Copy vendor folder (needed for local xlsx package)
COPY client/vendor ./vendor

# Install dependencies (use --legacy-peer-deps for zod version conflict)
RUN npm install --legacy-peer-deps

# Copy frontend source
COPY client/ ./

# Build production frontend (outputs to ../dist)
RUN npm run build

# Stage 2: Python Backend + Built Frontend
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install Python dependencies
COPY server/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY server/ ./

# Copy built frontend from Stage 1
COPY --from=frontend-builder /app/dist ./dist

# Expose port
EXPOSE 8000

# Set production environment
ENV ENVIRONMENT=production

# Start FastAPI server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

