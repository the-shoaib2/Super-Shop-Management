package com.server.security;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.server.repository.store.StoreRepository;


@Service("storeSecurityService")
public class StoreSecurityService {

    @Autowired
    private StoreRepository storeRepository;

    public boolean isStoreOwner(String storeId, Object principal) {
        if (!(principal instanceof UserPrincipal)) {
            return false;
        }

        UserPrincipal userPrincipal = (UserPrincipal) principal;
        String userEmail = userPrincipal.getEmail();

        return storeRepository.findById(storeId)
            .map(store -> store.getOwnerEmail().equals(userEmail))
            .orElse(false);
    }
} 