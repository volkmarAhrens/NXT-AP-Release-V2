sap.ui.define([], function() {
    "use strict";
    
    /**
     * NumberFormat utility for OpenUI5
     * Provides reliable number and currency formatting functions
     * that work consistently across all OpenUI5 versions and browsers
     */
    return {
        /**
         * Format a number with proper thousand separators and decimal places
         * according to the current UI5 locale
         * 
         * @param {number} value The number to format
         * @returns {string} Formatted number string
         */
        formatNumber: function(value) {
            if (value === null || value === undefined) {
                return "";
            }
            
            // Create a properly configured number formatter
            var oFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
                minFractionDigits: 2,
                maxFractionDigits: 2,
                groupingEnabled: true
            });
            
            return oFormat.format(value);
        },
        
        /**
         * Format a currency value with the proper currency symbol
         * 
         * @param {number} value The number to format
         * @param {string} currency Currency code (e.g., "EUR", "USD")
         * @returns {string} Formatted currency string
         */
        formatCurrency: function(value, currency) {
            if (value === null || value === undefined) {
                return "";
            }
            
            // Handle missing currency
            if (!currency) {
                currency = "EUR"; // Default currency
            }
            
            // Use UI5's built-in currency formatter
            var oCurrencyFormat = sap.ui.core.format.NumberFormat.getCurrencyInstance({
                showMeasure: true
            });
            
            return oCurrencyFormat.format(value, currency);
        }
    };
});
