package com.pizzaChain.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.servers.Server;

import io.swagger.v3.oas.models.OpenAPI;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "🍕 PizzaChain API 🍕",
                version = "1.0",
                description = "This API provides access to PizzaChain services for customer registration.",
                contact = @Contact(
                        name = "PizzaChain",
                        email = "imvgame1@gmail.com",
                        url = "https://pizzachainfe.netlify.app/"
                ),
                license = @License(
                        name = "Apache 2.0",
                        url = "http://www.apache.org/licenses/LICENSE-2.0.html"
                )
        ),
        servers = {
                @Server(url = "${SERVER_URL:http://localhost:8080}", description = "Default Server")
        }
)

public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new io.swagger.v3.oas.models.info.Info()
                        .title("Pizza Chain API")
                        .version("1.0")
                        .description("API documentation for Pizza Chain backend"));
    }
}
