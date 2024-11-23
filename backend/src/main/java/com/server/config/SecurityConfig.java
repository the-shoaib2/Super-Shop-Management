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

import com.server.filter.JwtAuthenticationFilter;
import com.server.util.TokenUtil;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
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
                // Static resources
                .requestMatchers("/favicon.ico").permitAll()
                .requestMatchers("/static/**").permitAll()
                .requestMatchers("/uploads/**").permitAll()
                
                // Public endpoints
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/ping").permitAll()
                .requestMatchers("/error").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/stores").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/stores/*").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/products").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/products/*").permitAll()
                
                // Profile endpoints
                .requestMatchers(HttpMethod.PUT,"/api/profile/me").authenticated()
                .requestMatchers(HttpMethod.GET,"/api/profile/me").authenticated()
                .requestMatchers(HttpMethod.PUT,"/api/profile/me/avatar").authenticated()
                .requestMatchers(HttpMethod.GET,"/api/profile/me/avatar").authenticated()

                // Store management
                .requestMatchers(HttpMethod.POST, "/api/stores/*").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/stores/*").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/stores/*").authenticated()
                
                // Product management
                .requestMatchers("/api/products/create").authenticated()
                .requestMatchers("/api/products/update/*").authenticated()
                .requestMatchers("/api/products/delete/*").authenticated()
                
                // Order management
                .requestMatchers("/api/orders/*").authenticated()
                
                // Catch all
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Allow all origins during development
        configuration.setAllowedOrigins(Arrays.asList("*"));
        // Or use specific origins
        /*
        configuration.setAllowedOrigins(Arrays.asList(
            adminFrontendUrl,
            storeFrontendUrl,
            "http://localhost:8080"
        ));
        */
        
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
        
        // Temporarily disable credentials requirement for development
        configuration.setAllowCredentials(false);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
} 