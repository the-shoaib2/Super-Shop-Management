package com.server.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.server.model.accounts.Owner;

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

    public String generateAccessToken(Owner owner) {
        try {
            return Jwts.builder()
                    .setSubject(owner.getEmail())
                    .claim("userId", owner.getId())
                    .claim("fullName", owner.getFullName())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + accessExpiration))
                    .signWith(Keys.hmacShaKeyFor(accessSecret.getBytes()), SignatureAlgorithm.HS512)
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
                    .signWith(Keys.hmacShaKeyFor(refreshSecret.getBytes()), SignatureAlgorithm.HS512)
                    .compact();
        } catch (Exception e) {
            logger.error("Error generating refresh token: ", e);
            throw e;
        }
    }

    public Claims getClaimsFromToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(accessSecret.getBytes()))
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
                .setSigningKey(Keys.hmacShaKeyFor(accessSecret.getBytes()))
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
            .signWith(Keys.hmacShaKeyFor(accessSecret.getBytes()), SignatureAlgorithm.HS512)
            .compact();
    }

    public String validateTokenAndGetUserId(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(accessSecret.getBytes()))
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
                .setSigningKey(Keys.hmacShaKeyFor(refreshSecret.getBytes()))
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String getEmailFromRefreshToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(refreshSecret.getBytes()))
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }
} 