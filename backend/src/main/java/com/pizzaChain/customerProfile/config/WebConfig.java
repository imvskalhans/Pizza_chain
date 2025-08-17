package com.pizzaChain.customerProfile.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // Allow frontend to access backend (local + Netlify + chatbot)
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                        "http://localhost:3000",
                        "http://localhost:3001",  // In case React runs on 3001
                        "http://127.0.0.1:3000",
                        "https://pizzachainfe.netlify.app"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);  // This might be needed for some requests
    }

    @Override
    public void configurePathMatch(PathMatchConfigurer configurer) {
        // This makes app less strict about trailing slashes
        configurer.setUseTrailingSlashMatch(true);
    }

    // Serve uploaded images via /uploads/**
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploadDir = Paths.get("uploads");
        String uploadPath = uploadDir.toFile().getAbsolutePath();

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadPath + "/");
    }
}