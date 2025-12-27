package org.example.utils;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> badRequest(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<?> badCredentials(BadCredentialsException e) {
        return ResponseEntity.status(401).body(Map.of("error", "bad credentials"));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<?> forbidden(AccessDeniedException e) {
        return ResponseEntity.status(403).body(Map.of("error", "forbidden"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> internal(Exception e) {
        return ResponseEntity.status(500).body(Map.of("error", "internal error"));
    }
}
