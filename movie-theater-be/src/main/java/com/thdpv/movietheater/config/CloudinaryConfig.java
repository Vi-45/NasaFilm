package com.thdpv.movietheater.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Configuration
public class CloudinaryConfig {

    private static final String CLOUDINARY_PLACEHOLDER_PREFIX = "your_cloudinary";

    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @Value("${cloudinary.api-key}")
    private String apiKey;

    @Value("${cloudinary.api-secret}")
    private String apiSecret;

    @Bean
    public Cloudinary cloudinary() {
        validateCloudinarySettings();
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true
        ));
    }

    private void validateCloudinarySettings() {
        if (!StringUtils.hasText(cloudName) || !StringUtils.hasText(apiKey) || !StringUtils.hasText(apiSecret)) {
            throw new IllegalStateException("Cloudinary configuration is missing. " +
                    "Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in the environment or .env file.");
        }
        if (isPlaceholder(cloudName) || isPlaceholder(apiKey) || isPlaceholder(apiSecret)) {
            throw new IllegalStateException("Cloudinary configuration contains placeholder values. " +
                    "Replace placeholders in .env or environment variables with real Cloudinary credentials.");
        }
    }

    private boolean isPlaceholder(String value) {
        if (!StringUtils.hasText(value)) {
            return true;
        }
        String normalized = value.trim().toLowerCase();
        return normalized.startsWith(CLOUDINARY_PLACEHOLDER_PREFIX) || normalized.contains("your_cloudinary");
    }
}