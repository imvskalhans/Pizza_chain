package com.pizzaChain;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.pizzaChain")
public class PizzaChainApplication {
	public static void main(String[] args) {
		SpringApplication.run(PizzaChainApplication.class, args);
	}
}
