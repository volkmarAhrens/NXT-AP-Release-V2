sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"./model/models",
	"sap/ui/model/json/JSONModel"
], function(UIComponent, Device, models, JSONModel) {
	"use strict";

	return UIComponent.extend("nxt.ap.release.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
            // First check for stored language preference
            var sStoredLang = localStorage.getItem("nxt.ap.release.language");
            var sLanguage;
            
            if (sStoredLang && ["en", "de", "fr", "es", "pt"].indexOf(sStoredLang) !== -1) {
                // Use the stored language preference first
                sLanguage = sStoredLang;
                sap.ui.getCore().getConfiguration().setLanguage(sStoredLang);
                console.log("Using stored language preference: " + sStoredLang);
            } else {
                // Otherwise get current UI language
                sLanguage = sap.ui.getCore().getConfiguration().getLanguage();
                
                if (!sLanguage || sLanguage === "ZZ" || sLanguage === "en_US") {
                    // Use browser language or English as fallback
                    var sBrowserLanguage = window.navigator.language || "en";
                    // Normalize to just the first two characters (language code)
                    var sNormalizedLang = sBrowserLanguage.split("-")[0].toLowerCase();
                    
                    // Only use supported languages
                    if (["en", "de", "fr", "es", "pt"].indexOf(sNormalizedLang) === -1) {
                        sNormalizedLang = "en";
                    }
                    
                    // Apply the normalized language
                    sap.ui.getCore().getConfiguration().setLanguage(sNormalizedLang);
                    sLanguage = sNormalizedLang;
                    
                    // Remember this preference
                    localStorage.setItem("nxt.ap.release.language", sNormalizedLang);
                    console.log("Set default language to: " + sNormalizedLang);
                }
            }
            
            // We've already set the language above, so just get the current language
            var sLangCode = sap.ui.getCore().getConfiguration().getLanguage().split('-')[0];
            // Double-check to make sure it's one of our supported languages
            if (["en", "de", "fr", "es", "pt"].indexOf(sLangCode) === -1) {
                sLangCode = "en";
                sap.ui.getCore().getConfiguration().setLanguage(sLangCode);
            }
            
            // Create a properly configured ResourceModel with direct file reference
            // This helps ensure reliable loading of language resources
            var sBundlePath = jQuery.sap.getModulePath("nxt.ap.release") + "/i18n/i18n_" + sLangCode + ".properties";
            
            console.log("Creating ResourceModel with direct file: " + sBundlePath);
            
            var oI18nModel = new sap.ui.model.resource.ResourceModel({
                // Use the specific properties file for this language
                bundleUrl: sBundlePath,
                bundleLocale: sLangCode,
                // Force synchronous loading to ensure availability
                async: false
            });
            
            // Log for debugging
            console.log("[Component] Setting i18n model with language: " + sLangCode);
            
            // Make the i18n model available at all levels
            // 1. Component level
            this.setModel(oI18nModel, "i18n");
            // 2. Core level for global access
            sap.ui.getCore().setModel(oI18nModel, "i18n");
            // 3. Also set as a global variable for emergency fallback
            window.i18nBundle = oI18nModel.getResourceBundle();
			
			// Initialize the invoice model
            var oInvoiceModel = new JSONModel({});
            this.setModel(oInvoiceModel);
            
            // Create mock data model (to be replaced with OData service in production)
            var oMockModel = new JSONModel("resources/mockdata.json");
            
            // Configure the model for proper currency formatting
            oMockModel.attachRequestCompleted(function() {
                // Process amount fields to ensure proper display
                var oData = oMockModel.getData();
                if (oData && oData.Invoices) {
                    oData.Invoices.forEach(function(invoice) {
                        if (invoice.Header) {
                            // Format amount fields to ensure consistent display
                            var sCurrency = invoice.Header.InvoiceCurrency || "EUR";
                            
                            // Use pre-formatted strings to ensure correct display
                            invoice.Header.InvoiceTotalAmountFormatted = 
                                parseFloat(invoice.Header.InvoiceTotalAmount).toFixed(2) + " " + sCurrency;
                                
                            invoice.Header.InvoiceNetAmountFormatted = 
                                parseFloat(invoice.Header.InvoiceNetAmount).toFixed(2) + " " + sCurrency;
                                
                            invoice.Header.InvoiceTaxAmountFormatted = 
                                parseFloat(invoice.Header.InvoiceTaxAmount).toFixed(2) + " " + sCurrency;
                                
                            invoice.Header.DiscountAmountFormatted = 
                                parseFloat(invoice.Header.DiscountAmount).toFixed(2) + " " + sCurrency;
                                
                            invoice.Header.UnplannedCostsFormatted = 
                                parseFloat(invoice.Header.UnplannedCosts).toFixed(2) + " " + sCurrency;
                        }
                        
                        // Format line item amounts too
                        if (invoice.LineItems) {
                            invoice.LineItems.forEach(function(item) {
                                if (item.Amount) {
                                    item.AmountFormatted = 
                                        parseFloat(item.Amount).toFixed(2) + " " + sCurrency;
                                }
                            });
                        }
                    });
                    
                    // Update the model with formatted data
                    oMockModel.setData(oData);
                    console.log("Amount formatting applied to all currency fields");
                }
            });
            
            this.setModel(oMockModel);
            
			// Call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// Enable routing
			this.getRouter().initialize();

			// Set the device model
			this.setModel(models.createDeviceModel(), "device");
			
			// Initialize SSO user model
			this.initializeUserModel();

			// --- BEGIN: Set mock data model globally ---
			/**
			 * Register the mockdata.json as a named model ("mock") at the Component level for global access.
			 * This ensures all views can access mock data via the "mock" model name.
			 */
			var oMockModel = models.createMockModel();
			this.setModel(oMockModel); // Set as default model
			this.setModel(oMockModel, "mock"); // Also set as named model for explicit access
			// --- END: Set mock data model globally ---
		},
		
		/**
		 * Initializes the user model with Single Sign-On (SSO) information.
		 * This method sets up a model that contains user information from external identity providers
		 * like Google or Microsoft when using SSO.
		 * 
		 * In a production environment, this data would come from the OAuth/OIDC token
		 * received during the authentication process with the identity provider.
		 * 
		 * @private
		 */
		initializeUserModel: function() {
			// Priority order for user identity:
			// 1. NXT Web App Launchpad integration
			// 2. SAP Fiori Launchpad integration
			// 3. Browser's current user (Microsoft browsers)
			// 4. URL parameters (for direct linking)
			// 5. Mock data (fallback for development)
			
			var oUserInfo = null;
			
			// Option 1: NXT Web App Launchpad integration
			if (window.nxtLaunchpad && typeof window.nxtLaunchpad.getUserInfo === "function") {
				try {
					console.log("Getting user info from NXT Web App Launchpad");
					oUserInfo = window.nxtLaunchpad.getUserInfo();
					console.log("User info from launchpad:", oUserInfo);
				} catch (e) {
					console.error("Error getting user info from NXT Web App Launchpad:", e);
				}
			}
			
			// Option 2: SAP Fiori Launchpad integration
			if (!oUserInfo && window.sap && window.sap.ushell && window.sap.ushell.Container) {
				try {
					console.log("Getting user info from SAP Fiori Launchpad");
					var oUser = window.sap.ushell.Container.getUser();
					oUserInfo = {
						displayName: oUser.getFullName(),
						email: oUser.getEmail(),
						photoUrl: "", // Typically not available in Fiori
						accountType: "SAP",
						isExternalUser: false,
						roles: oUser.getRole ? (oUser.getRole() ? [oUser.getRole()] : []) : []
					};
					console.log("User info from Fiori:", oUserInfo);
				} catch (e) {
					console.error("Error getting user info from Fiori:", e);
				}
			}
			
			// Option 3: Try to get browser identity (primarily for Microsoft browsers)
			if (!oUserInfo) {
				try {
					// For Microsoft browsers connected to Entra ID
					if (window.navigator && window.navigator.userAgent.indexOf("Edg") > -1 && 
					    document.querySelector('head meta[name="ms.lang"]')) {
						
						// This is a speculative approach - real implementation would need proper MSAL.js
						var userEmail = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)userEmail\s*\=\s*([^;]*).*$)|^.*$/, "$1"));
						var userName = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)userName\s*\=\s*([^;]*).*$)|^.*$/, "$1"));
						
						if (userEmail) {
							console.log("Getting user from browser cookies");
							oUserInfo = {
								displayName: userName || userEmail.split('@')[0],
								email: userEmail,
								photoUrl: "",
								accountType: "Microsoft",
								isExternalUser: true,
								roles: []
							};
						}
					}
				} catch (e) {
					console.warn("Error attempting to get browser identity:", e);
				}
			}
			
			// Option 4: URL parameters (for direct linking or testing)
			if (!oUserInfo && window.jQuery && window.jQuery.sap) {
				var oUriParams = jQuery.sap.getUriParameters();
				var sUserEmail = oUriParams.get("userEmail");
				var sUserName = oUriParams.get("userName");
				
				if (sUserEmail) {
					console.log("Getting user from URL parameters");
					oUserInfo = {
						displayName: sUserName ? decodeURIComponent(sUserName) : decodeURIComponent(sUserEmail).split('@')[0],
						email: decodeURIComponent(sUserEmail),
						photoUrl: decodeURIComponent(oUriParams.get("userPhoto") || ""),
						accountType: decodeURIComponent(oUriParams.get("accountType") || "Unknown"),
						isExternalUser: true,
						roles: []
					};
				}
			}
			
			// Option 5: Fallback to mock data for development
			if (!oUserInfo) {
				console.log("Using mock user data for development");
				oUserInfo = {
					displayName: "Max Mustermann",
					email: "max.mustermann@company.com", 
					photoUrl: "",
					accountType: "Mock",
					isExternalUser: true,
					roles: ["AP_Approver", "Finance_User"]
				};
			}
			
			// Set model with namespace "user"
			this.setModel(new JSONModel(oUserInfo), "user");
			
			// Store external user identity for backend calls if needed
			this._sExternalUser = oUserInfo.email;
			
			// Log the source of user info for debugging
			console.log("User identity initialized: " + oUserInfo.displayName + " <" + oUserInfo.email + ">");
		},

		// Explicitly set i18n model on all views if not already present
		attachRouteMatched: function() {
			this.getRouter().attachRouteMatched(function(oEvent) {
				var oView = oEvent.getParameter("view");
				if (oView && !oView.getModel("i18n")) {
					oView.setModel(this.getModel("i18n"), "i18n");
				}
			}.bind(this));
		}
	});
});