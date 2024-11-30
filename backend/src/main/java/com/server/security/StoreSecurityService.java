package com.server.security;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
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

    public boolean hasStoreAccess(String storeId, Object principal) {
        // First check if user is store owner
        if (isStoreOwner(storeId, principal)) {
            return true;
        }

        // If not owner, check if user has any other valid access
        if (!(principal instanceof UserPrincipal)) {
            return false;
        }

        UserPrincipal userPrincipal = (UserPrincipal) principal;
        String userEmail = userPrincipal.getEmail();

        return storeRepository.findById(storeId)
            .map(store -> {
                // Add additional access checks here if needed
                // For example, check if user is store staff or has specific role
                return store.getOwnerEmail().equals(userEmail); // For now, same as isStoreOwner
            })
            .orElse(false);
    }

    // Helper method to check if user is authenticated and has access
    public boolean hasStoreAccess(String storeId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        return hasStoreAccess(storeId, authentication.getPrincipal());
    }
} 