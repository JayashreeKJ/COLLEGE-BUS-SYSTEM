# ===================================================================
# Root Dockerfile for SmartBus Spring Boot Backend
# Supports Render deployment directly from repository root
# ===================================================================

FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Cache backend dependencies
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B

# Copy backend source code and compile jar
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN addgroup -S smartbus && adduser -S smartbus -G smartbus
USER smartbus:smartbus

COPY --from=builder --chown=smartbus:smartbus /app/target/*.jar app.jar

ENV PORT=8080
EXPOSE 8080

# Configure JVM for Render container memory limits
ENTRYPOINT ["sh", "-c", "java -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Dserver.port=${PORT:-8080} -jar app.jar"]
