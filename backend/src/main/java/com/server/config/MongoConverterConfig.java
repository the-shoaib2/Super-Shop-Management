package com.server.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;
import org.springframework.data.mongodb.core.mapping.MongoMappingContext;
import org.springframework.data.mongodb.core.mapping.MongoPersistentEntity;

import com.server.model.store.Store;
import com.server.repository.store.StoreRepository;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class MongoConverterConfig {

    private final StoreRepository storeRepository;

    public MongoConverterConfig(StoreRepository storeRepository) {
        this.storeRepository = storeRepository;
    }

    @Bean
    public MongoCustomConversions mongoCustomConversions() {
        List<Converter<?, ?>> converters = new ArrayList<>();
        
        // Converter to handle String to Store conversion
        converters.add(new Converter<String, Store>() {
            @Override
            public Store convert(String source) {
                return storeRepository.findById(source)
                    .orElseThrow(() -> new IllegalArgumentException("Store not found with ID: " + source));
            }
        });

        return new MongoCustomConversions(converters);
    }
}
