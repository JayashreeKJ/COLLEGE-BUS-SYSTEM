package com.smartbus.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

/**
 * Universal DataSource configuration for SmartBus backend.
 * Automatically adapts between:
 *  1. Cloud PaaS environment URLs like Render PostgreSQL (DATABASE_URL=postgres://...)
 *  2. Standard JDBC configurations (DB_URL / spring.datasource.url with MySQL, PostgreSQL)
 *  3. Zero-config fallback to H2 embedded database when no DB connection is supplied
 */
@Configuration
public class DataSourceConfig {

    private static final Logger logger = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${spring.datasource.url:}")
    private String configuredUrl;

    @Value("${spring.datasource.username:}")
    private String configuredUsername;

    @Value("${spring.datasource.password:}")
    private String configuredPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        String databaseUrl = System.getenv("DATABASE_URL");
        String dbUrl = System.getenv("DB_URL");

        HikariConfig config = new HikariConfig();
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setConnectionTimeout(30000);
        config.setIdleTimeout(600000);
        config.setMaxLifetime(1800000);

        // 1. Render PostgreSQL or cloud PaaS DATABASE_URL (postgres:// or postgresql://)
        if (databaseUrl != null && !databaseUrl.isBlank() &&
                (databaseUrl.startsWith("postgres://") || databaseUrl.startsWith("postgresql://"))) {
            try {
                logger.info("Configuring DataSource from cloud DATABASE_URL (PostgreSQL)...");
                URI uri = new URI(databaseUrl.replace("postgres://", "postgresql://"));
                String host = uri.getHost();
                int port = uri.getPort() > 0 ? uri.getPort() : 5432;
                String path = uri.getPath(); // includes leading '/'
                String query = uri.getQuery() != null ? "?" + uri.getQuery() : "";

                String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + path + query;
                config.setJdbcUrl(jdbcUrl);

                if (uri.getUserInfo() != null) {
                    String[] creds = uri.getUserInfo().split(":", 2);
                    config.setUsername(creds[0]);
                    if (creds.length > 1) {
                        config.setPassword(creds[1]);
                    }
                }
                config.setDriverClassName("org.postgresql.Driver");
                logger.info("Connected to cloud PostgreSQL at {}:{}", host, port);
                return new HikariDataSource(config);
            } catch (Exception e) {
                logger.error("Failed to parse cloud DATABASE_URL, attempting standard JDBC fallback", e);
            }
        }

        // 2. Standard JDBC connection (DB_URL or spring.datasource.url)
        String targetUrl = (dbUrl != null && !dbUrl.isBlank()) ? dbUrl : configuredUrl;
        if (targetUrl != null && !targetUrl.isBlank()) {
            logger.info("Configuring DataSource with JDBC URL: {}", sanitizeUrl(targetUrl));
            config.setJdbcUrl(targetUrl);
            config.setUsername(configuredUsername);
            config.setPassword(configuredPassword);
            
            // Auto-assign driver class if standard
            if (targetUrl.startsWith("jdbc:mysql:")) {
                config.setDriverClassName("com.mysql.cj.jdbc.Driver");
            } else if (targetUrl.startsWith("jdbc:postgresql:")) {
                config.setDriverClassName("org.postgresql.Driver");
            } else if (targetUrl.startsWith("jdbc:h2:")) {
                config.setDriverClassName("org.h2.Driver");
            }

            return new HikariDataSource(config);
        }

        // 3. Fallback to embedded H2 if no DB is configured
        logger.warn("No database connection specified (DB_URL or DATABASE_URL). Falling back to embedded H2 database.");
        config.setJdbcUrl("jdbc:h2:mem:smartbus_db;DB_CLOSE_DELAY=-1;MODE=MySQL");
        config.setDriverClassName("org.h2.Driver");
        config.setUsername("sa");
        config.setPassword("");
        return new HikariDataSource(config);
    }

    private String sanitizeUrl(String url) {
        return url.replaceAll(":[^/@:]+@", ":****@");
    }
}
