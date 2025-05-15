sap.ui.define([
    "sap/ui/model/resource/ResourceModel",
    "sap/base/Log",
    "sap/ui/core/Component",
    "sap/ui/core/format/NumberFormat"
], function (ResourceModel, Log, Component, NumberFormat) {
    "use strict";
    
    // Global cache for resource bundles to improve performance
    var mResourceBundles = {};
    
    // Track loaded bundles by language for debugging
    var aLoadedLanguages = [];
    
    return {
        /**
         * Formats an amount with its currency symbol based on the currency code
         * Uses the built-in sap.ui.model.type.Currency formatter for proper localization
         * @public
         * @param {number} fAmount - The amount value to format
         * @param {string} sCurrency - The currency code (EUR, USD, etc.)
         * @returns {string} The formatted amount with currency symbol
         */
        /**
         * Format a number value with proper thousand separators and decimals
         * @public
         * @param {number} value - The number to format
         * @returns {string} Formatted number string
         */
        formatNumber: function(value) {
            if (value === undefined || value === null) {
                return "";
            }
            
            // Simple number formatting with fixed decimal places
            return parseFloat(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        
        /**
         * Format a currency value with its currency code
         * Uses a direct approach that guarantees reliability
         * @public 
         * @param {number} value - Amount to format
         * @param {string} currency - Currency code
         * @returns {string} Formatted amount with currency
         */
        formatCurrency: function(value, currency) {
            if (value === undefined || value === null) {
                return "";
            }
            
            // Format the number first
            var formattedAmount = this.formatNumber(value);
            
            // Append currency if available
            if (currency) {
                return formattedAmount + " " + currency;
            }
            
            return formattedAmount;
        },
        
        /**
         * Reliably gets a translated text from the i18n model and adds a colon
         * Uses a cache optimization for better performance
         * @param {string} sKey - The i18n key to translate
         * @returns {string} The translated text with a colon suffix
         */
        i18nWithColon: function(sKey) {
            if (!sKey) {
                return "";
            }
            
            try {
                // Direct approach using global models
                var oCoreI18n = sap.ui.getCore().getModel("i18n");
                var sText = "";
                
                if (oCoreI18n) {
                    var oBundle = oCoreI18n.getResourceBundle();
                    if (oBundle) {
                        sText = oBundle.getText(sKey);
                        if (sText && sText !== sKey) {
                            // Log successful translation for debugging
                            console.log("[Formatter] Translated " + sKey + " -> " + sText);
                            return sText + ":";
                        }
                    }
                }
                
                // If nothing worked, try hardcoded mapping for critical labels
                var mFallbackTexts = {
                    "requester": "Requester",
                    "approver": "Approver",
                    "natureOfInvoice": "Nature of Invoice",
                    "totalAmount": "Total Amount",
                    "discountAmount": "Discount",
                    "invoiceDate": "Invoice Date",
                    "activity": "Activity",
                    "invoiceDueDate": "Due Date",
                    "apTime": "AP Time (D)"
                };
                
                if (mFallbackTexts[sKey]) {
                    console.log("[Formatter] Using fallback for " + sKey);
                    return mFallbackTexts[sKey] + ":";
                }
                
                // Last resort - use the key itself
                return sKey + ":";
            } catch (e) {
                // Log error but return key as fallback
                console.error("Error retrieving i18n text: " + e);
                return sKey + ":";
            }
        },
        
        /**
         * Formats a number with 2 decimal places
         * @param {string|number} value - The value to format
         * @returns {string} Formatted number with 2 decimal places
         */
        float2: function(value) {
            if (value == null || value === "") return "";
            var num = Number(value);
            if (isNaN(num)) return value;
            return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        },
        
        /**
         * Gets a translated text from any resource bundle
         * @param {string} sKey - The i18n key to translate
         * @param {boolean} [bAddColon=false] - Whether to add a colon after the text
         * @returns {string} The translated text
         */
        i18n: function(sKey, bAddColon) {
            try {
                // Try to get bundle from component or core
                var oResourceBundle;
                var sLanguage = sap.ui.getCore().getConfiguration().getLanguage();
                
                // Use cached bundle if available for performance
                if (mResourceBundles[sLanguage]) {
                    oResourceBundle = mResourceBundles[sLanguage];
                } else {
                    // Try different ways to get the bundle
                    try {
                        var oModel = sap.ui.getCore().getModel("i18n");
                        if (oModel) {
                            oResourceBundle = oModel.getResourceBundle();
                        }
                    } catch (e) {
                        Log.warning("Could not get i18n model from core: " + e.message);
                    }
                    
                    // Create new bundle as fallback
                    if (!oResourceBundle) {
                        try {
                            var oResourceModel = new ResourceModel({
                                bundleUrl: "i18n/i18n.properties"
                            });
                            oResourceBundle = oResourceModel.getResourceBundle();
                        } catch (e) {
                            Log.error("Could not create i18n bundle: " + e.message);
                        }
                    }
                    
                    // Cache for future use
                    if (oResourceBundle) {
                        mResourceBundles[sLanguage] = oResourceBundle;
                    }
                }
                
                // Get the text or return the key as fallback
                var sText = oResourceBundle ? oResourceBundle.getText(sKey, [], true) : sKey;
                
                // If text wasn't found, just use the key
                if (!sText || sText === sKey) {
                    Log.debug("Missing translation for key: " + sKey);
                    sText = sKey;
                }
                
                // Add colon if requested
                return bAddColon ? sText + ":" : sText;
            } catch (e) {
                Log.error("Error in i18n formatter: " + e.message);
                return sKey;
            }
        }
    };
});
