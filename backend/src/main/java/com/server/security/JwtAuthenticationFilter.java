package com.server.security;

import java.io.IOException;
import java.util.Arrays;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.lang.NonNull;

import com.server.util.TokenUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final TokenUtil tokenUtil;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {
        
        try {
            String authHeader = request.getHeader("Authorization");
            log.debug("Auth header: {}", authHeader);

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                return;
            }

            String token = authHeader.substring(7);
            Claims claims = tokenUtil.getClaimsFromToken(token);
            
            if (claims != null && tokenUtil.validateToken(token)) {
                String userId = claims.get("userId", String.class);
                String email = claims.getSubject();
                String fullName = claims.get("fullName", String.class);
                String role = claims.get("role", String.class);
                
                UserPrincipal principal = new UserPrincipal(
                    userId,
                    email,
                    fullName,
                    role != null ? 
                        Arrays.asList(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase())) :
                        Arrays.asList(new SimpleGrantedAuthority("ROLE_USER"))
                );
                
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
                    
                SecurityContextHolder.getContext().setAuthentication(authentication);
                log.debug("User authenticated: {} with role: {}", email, role);
            }
        } catch (Exception e) {
            log.error("Authentication error: ", e);
            SecurityContextHolder.clearContext();
        }
        
        filterChain.doFilter(request, response);
    }
} 