package com.example.bookstorebackend.configuration;

import com.example.bookstorebackend.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Missing or invalid Authorization header");
            return;
        }

        String token = authHeader.substring(7); // Remove "Bearer "


        if (JwtUtil.isTokenExpired(token)) {
            System.out.println("token is expired, refreshing");
            try {
                String newToken = JwtUtil.refreshTokenIfExpired(token);

                // Attach new token in response header
                response.setHeader("X-Refreshed-Token", newToken);

                // Continue the request without breaking flow
                filterChain.doFilter(request, response);
                return;


            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Token expired and could not be refreshed");
                return;
            }
        }

        System.out.println("token is correct");
        // Token is valid, continue the request
        filterChain.doFilter(request, response);
    }
}
