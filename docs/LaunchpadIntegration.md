# NXT AP Release Application - Launchpad Integration Guide

This document outlines the integration requirements for the NXT AP Release application with both the NXT Web App Launchpad and SAP Fiori Launchpad environments.

## Overview

The AP Release application can be launched from either:
1. NXT Web App Launchpad (primary)
2. SAP Fiori Launchpad (secondary)

In both scenarios, the user should be properly identified and authenticated, with their identity context made available to the application.

## Required Launchpad Enhancements

### 1. NXT Web App Launchpad Integration

The NXT Web App Launchpad must implement the following JavaScript API to expose user identity information to embedded applications:

```javascript
// Global namespace object
window.nxtLaunchpad = {
    /**
     * Returns the authenticated user's information
     * @returns {Object} User information object
     */
    getUserInfo: function() {
        return {
            displayName: "User's Full Name",  // User's display name
            email: "user@example.com",        // User's email address
            photoUrl: "https://...",          // URL to user's profile picture (optional)
            accountType: "Microsoft",         // "Microsoft", "Google", "Local", etc.
            isExternalUser: true,             // Whether using external identity provider
            roles: ["Role1", "Role2"]         // User's roles/groups (optional)
        };
    },
    
    /**
     * For SAP backend integration (optional)
     * Returns the authentication token for SAP backend calls
     * @returns {Object} Authentication token information
     */
    getSapAuthToken: function() {
        return {
            token: "Bearer_Token_For_SAP_Access",
            type: "Bearer",
            expiresAt: new Date().getTime() + (60 * 60 * 1000) // 1 hour expiry
        };
    }
};
```

### 2. Additional Requirements for SAP Integration

When the application needs to communicate with SAP backend systems:

1. **Technical User Approach**: 
   - The NXT Web App Launchpad should handle the mapping between external users (Microsoft/Google) and technical SAP users
   - The `getSapAuthToken()` method should return a valid token for SAP Gateway calls

2. **User Context Propagation**:
   - The external user's identity should be included in all SAP calls (via custom headers)
   - SAP backend implementations should log the actual user identity for auditing purposes

## Testing the Integration

You can test the integration by:

1. **URL Parameters** - Passing user information via URL:
   ```
   http://localhost:8080/index.html?userEmail=volkmar@nxt4sap.com&userName=Volkmar%20Ahrens&accountType=Microsoft
   ```

2. **Console Testing** - Adding the `nxtLaunchpad` object directly in the browser console:
   ```javascript
   window.nxtLaunchpad = {
     getUserInfo: function() {
       return {
         displayName: "Volkmar Ahrens",
         email: "volkmar@nxt4sap.com",
         photoUrl: "",
         accountType: "Microsoft",
         isExternalUser: true,
         roles: ["AP_Approver"]
       };
     }
   };
   // Refresh the page after adding this
   ```

## Fallback Behavior

If the application is not launched from a launchpad:

1. It will attempt to detect the browser's authenticated user (Microsoft browsers only)
2. It will check for URL parameters containing user information
3. As a last resort, it will fall back to mock data for development purposes

## Implementation in AP Release App

The AP Release application has been updated to:

1. Check for user information from multiple sources in priority order
2. Use the appropriate source based on runtime environment
3. Display the user's information in the header
4. Store the external user information for backend calls

This implementation ensures a consistent user experience regardless of how the application is launched.
