package com.server.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.annotation.PostConstruct;
import javax.crypto.SecretKey;

import com.server.model.accounts.Owner;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Date;

@Component
public class TokenUtil {
    private static final Logger logger = LoggerFactory.getLogger(TokenUtil.class);

    @Value("${jwt.access-secret}")
    private String accessSecret;
    
    @Value("${jwt.refresh-secret}")
    private String refreshSecret;

    @Value("${jwt.access-expiration}")
    private Long accessExpiration;
    
    @Value("${jwt.refresh-expiration}")
    private Long refreshExpiration;

    private SecretKey accessKey;
    private SecretKey refreshKey;

    @PostConstruct
    private void init() {
        try {
            // Generate secure keys using the provided secrets as seeds
            this.accessKey = generateSecureKey(accessSecret);
            this.refreshKey = generateSecureKey(refreshSecret);
            System.out.println("Access key: " + accessKey);
            System.out.println("Refresh key: " + refreshKey);
        } catch (Exception e) {
            logger.error("Error initializing JWT secrets", e);
            throw new RuntimeException("Could not initialize JWT secrets", e);
        }
    }

    private SecretKey generateSecureKey(String seed) throws Exception {
        // Use SHA-512 to generate a 512-bit hash from the seed
        MessageDigest digest = MessageDigest.getInstance("SHA-512");
        byte[] hash = digest.digest(seed.getBytes(StandardCharsets.UTF_8));
        return Keys.hmacShaKeyFor(hash);
    }

    public String generateAccessToken(Owner owner) {
        try {
            return Jwts.builder()
                    .setSubject(owner.getEmail())
                    .claim("userId", owner.getId())
                    .claim("fullName", owner.getFullName())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + accessExpiration))
                    .signWith(accessKey, SignatureAlgorithm.HS512)
                    .compact();
        } catch (Exception e) {
            logger.error("Error generating access token: ", e);
            throw e;
        }
    }

    public String generateRefreshToken(Owner owner) {
        try {
            return Jwts.builder()
                    .setSubject(owner.getEmail())
                    .claim("userId", owner.getId())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + refreshExpiration))
                    .signWith(refreshKey, SignatureAlgorithm.HS512)
                    .compact();
        } catch (Exception e) {
            logger.error("Error generating refresh token: ", e);
            throw e;
        }
    }

    public Claims getClaimsFromToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(accessKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            logger.error("Error parsing token claims: ", e);
            throw e;
        }
    }

    public String getUserIdFromToken(String token) {
        try {
            Claims claims = getClaimsFromToken(token);
            return claims.get("userId", String.class);
        } catch (Exception e) {
            logger.error("Error getting user ID from token: ", e);
            throw e;
        }
    }

    public String getEmailFromToken(String token) {
        try {
            Claims claims = getClaimsFromToken(token);
            return claims.getSubject();
        } catch (Exception e) {
            logger.error("Error getting email from token: ", e);
            throw e;
        }
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(accessKey)
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            logger.error("Token validation failed: ", e);
            return false;
        }
    }

    public String generateToken(Owner owner) {
        return Jwts.builder()
            .setSubject(owner.getEmail())
            .claim("fullName", owner.getFullName())
            .claim("userId", owner.getId())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000))
            .signWith(accessKey, SignatureAlgorithm.HS512)
            .compact();
    }

    public String validateTokenAndGetUserId(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                .setSigningKey(accessKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
            return claims.getSubject();
        } catch (Exception e) {
            return null;
        }
    }

    public boolean validateRefreshToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(refreshKey)
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String getEmailFromRefreshToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(refreshKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }
}