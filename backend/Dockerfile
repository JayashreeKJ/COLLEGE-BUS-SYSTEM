# ===================================================================
# Dockerfile for SmartBus Spring Boot Backend (Java 21)
# Optimized multi-stage build for Render, Railway, Fly.io, etc.
# ===================================================================

# Stage 1: Build stage with Maven and Eclipse Temurin JDK 21
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and package application
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Production runtime with Eclipse Temurin JRE 21
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Run as non-privileged service user
RUN addgroup -S smartbus && adduser -S smartbus -G smartbus
USER smartbus:smartbus

# Copy executable jar from builder stage
COPY --from=builder --chown=smartbus:smartbus /app/target/*.jar app.jar

# Render assigns dynamic PORT environment variable (default: 8080)
ENV PORT=8080
EXPOSE 8080

# Configure JVM memory limits for Render free tier (512MB RAM)
ENTRYPOINT ["sh", "-c", "java -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Dserver.port=${PORT:-8080} -jar app.jar"]
