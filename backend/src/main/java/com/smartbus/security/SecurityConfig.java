package com.smartbus.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final CorsConfigurationSource corsConfigurationSource;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(CorsConfigurationSource corsConfigurationSource, JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.corsConfigurationSource = corsConfigurationSource;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint((request, response, authException) ->
                    response.sendError(jakarta.servlet.http.HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized"))
                .accessDeniedHandler((request, response, accessDeniedException) ->
                    response.sendError(jakarta.servlet.http.HttpServletResponse.SC_FORBIDDEN, "Forbidden: Access denied"))
            )
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/health/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/uploads/**").permitAll()
                .requestMatchers("/error").permitAll()

                // Student self-service endpoints (own profile & stop selection)
                .requestMatchers("/api/students/me", "/api/students/me/**").hasAnyRole("STUDENT", "ADMIN")
                .requestMatchers("/api/student/**").hasAnyRole("STUDENT", "ADMIN")

                // Driver self-service endpoints (own profile)
                .requestMatchers("/api/drivers/me", "/api/drivers/me/**").hasAnyRole("DRIVER", "ADMIN")
                .requestMatchers("/api/driver/**").hasAnyRole("DRIVER", "ADMIN")

                // Trip operational actions: only authorized DRIVER or ADMIN can start/end trips or post live GPS
                .requestMatchers(HttpMethod.POST, "/api/trips/*/start", "/api/trips/*/end", "/api/trips/*/location").hasAnyRole("DRIVER", "ADMIN")

                // Admin-only endpoints (system administration, listing all records or accessing arbitrary IDs)
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/students", "/api/students/*").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/drivers", "/api/drivers/*").hasRole("ADMIN")

                // Live transit tracking read endpoints (routes, stops, schedules, buses, and trips) for all authenticated users
                .requestMatchers("/api/buses/**", "/api/routes/**", "/api/stops/**", "/api/schedules/**", "/api/trips/**").authenticated()

                // All other endpoints require authentication
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
