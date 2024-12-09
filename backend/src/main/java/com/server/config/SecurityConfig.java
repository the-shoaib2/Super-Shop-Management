package com.server.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;
import java.util.Arrays;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.ComponentScan;

import com.server.security.JwtAuthenticationFilter;
import com.server.util.TokenUtil;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@ComponentScan(basePackages = "com.server.security")
public class SecurityConfig {

    private final TokenUtil tokenUtil;

    @Value("${admin.frontend.url}")
    private String adminFrontendUrl;

    @Value("${store.frontend.url}")
    private String storeFrontendUrl;

    public SecurityConfig(TokenUtil tokenUtil) {
        this.tokenUtil = tokenUtil;
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(tokenUtil);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers(HttpMethod.GET, "/api/health", "/api/ping").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/v1/store/public/**").permitAll()
                .requestMatchers("/error").permitAll()

                // Upload endpoints - require only authentication
                .requestMatchers("/api/upload/**").authenticated()
                
                // Store settings endpoints - require authentication
                .requestMatchers("/api/stores/{storeId}/colors/**").authenticated()
                .requestMatchers("/api/stores/{storeId}/sizes/**").authenticated()
                .requestMatchers("/api/stores/{storeId}/categories/**").authenticated()
                .requestMatchers("/api/stores/{storeId}/billboards/**").authenticated()
                .requestMatchers("/api/stores/{storeId}/prices/**").authenticated()
                .requestMatchers("/api/stores/{storeId}/products/**").authenticated()

                // Dashboard endpoints
                .requestMatchers("/api/**").authenticated()
                .requestMatchers("/api/store/{storeId}/dashboard").authenticated()
                .requestMatchers("/api/stores/{storeId}/analytics/**").authenticated()
                .requestMatchers("/api/stores/{storeId}/reviews/**").authenticated()
                .requestMatchers("/api/stores/{storeId}/orders/**").authenticated()
                .requestMatchers("/api/stores/{storeId}/products/**").authenticated()
                .requestMatchers("/api/stores/{storeId}/inventory/**").authenticated()
                .requestMatchers("/api/stores/{storeId}/customers/**").authenticated()
                
                // Static resources
                .requestMatchers("/favicon.ico").permitAll()
                .requestMatchers("/static/**").permitAll()
                
                // Swagger UI
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()

                // Account endpoints
                .requestMatchers("/api/accounts/me").authenticated()
                .requestMatchers("/api/accounts/**").authenticated()
                
                // Protected endpoints
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
            adminFrontendUrl,
            storeFrontendUrl,
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175",
            "https://4lnkrm5n-5173.inc1.devtunnels.ms/",
            "https://4lnkrm5n-5174.inc1.devtunnels.ms/"
        ));
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
        ));
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type",
            "Accept",
            "Origin",
            "X-Requested-With",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers"
        ));
        configuration.setExposedHeaders(Arrays.asList(
            "Authorization",
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Credentials"
        ));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
} 