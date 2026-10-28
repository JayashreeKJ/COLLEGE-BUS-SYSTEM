package com.smartbus.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${smartbus.cors.allowed-origins:http://localhost:5173,http://localhost:3000,https://college-bus-system.vercel.app}")
    private String allowedOriginsConfig;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        List<String> originPatterns = new ArrayList<>();
        // Default allowed origin patterns
        originPatterns.add("http://localhost:*");
        originPatterns.add("http://127.0.0.1:*");
        originPatterns.add("https://*.vercel.app");
        originPatterns.add("https://*.onrender.com");
        originPatterns.add("https://college-bus-system.vercel.app");

        // Parse custom origins from environment / properties if provided
        if (allowedOriginsConfig != null && !allowedOriginsConfig.isBlank()) {
            String[] customOrigins = allowedOriginsConfig.split(",");
            for (String origin : customOrigins) {
                String trimmed = origin.trim();
                if (!trimmed.isEmpty() && !originPatterns.contains(trimmed)) {
                    originPatterns.add(trimmed);
                }
            }
        }

        configuration.setAllowedOriginPatterns(originPatterns);
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"));
        configuration.setAllowedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "X-Requested-With",
                "Accept",
                "Origin",
                "Access-Control-Request-Method",
                "Access-Control-Request-Headers"
        ));
        configuration.setExposedHeaders(List.of("Authorization", "Link", "X-Total-Count"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Override
    public void addResourceHandlers(org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry registry) {
        String uploadDir = java.nio.file.Paths.get("uploads").toAbsolutePath().toUri().toString();
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadDir);
    }
}
