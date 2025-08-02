package com.pizzaChain.customerProfile.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // Allow frontend to access backend (local + Netlify)
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000", "https://pizzachainfe.netlify.app")
                .allowedMethods("*")
                .allowedHeaders("*");
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
