package com.devflow.intern.config;

import com.devflow.intern.model.ProviderModel;
import com.devflow.intern.repository.ProviderRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SeedConfig {

    @Bean
    CommandLineRunner seedProviders(
            ProviderRepository providerRepository
    ) {

        return args -> {

            if (providerRepository.count() == 0) {

                for (int i = 1; i <= 8; i++) {

                    ProviderModel provider =
                            new ProviderModel();

                    provider.setName(
                            "Provider " + i
                    );

                    provider.setProviderCode(i);

                    provider.setQuota(0);

                    providerRepository.save(provider);
                }
            }
        };
    }
}