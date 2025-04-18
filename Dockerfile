# Install dependencies only when
FROM node:18.17.1 AS builder
WORKDIR /app

# Copy source code
COPY . .

# Install dependencies
ARG SETUP_COMMAND="npm install"
RUN ${SETUP_COMMAND}

# Build command
ARG BUILD_COMMAND="npm run build"
RUN ${BUILD_COMMAND}

# Runtime stage
FROM nginx:stable-bullseye

# Build args
ARG BUILD_DIRECTORY="dist"

COPY --from=builder /app/${BUILD_DIRECTORY} /usr/share/nginx/html
# Copying our nginx.conf
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

# Modify nginx file permissions
RUN chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

EXPOSE 80
ENV PORT 80
CMD ["nginx", "-g", "daemon off;"]
