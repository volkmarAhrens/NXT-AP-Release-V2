sap.ui.define([], function() {
    "use strict";
    
    /**
     * Simple formatter utility for reliable currency formatting
     * Uses standard UI5 patterns for maximum compatibility
     */
    return {
        /**
         * Format a number value using fixed decimal places and comma separators
         * This is a very simple, reliable implementation
         * @param {number} value The number to format
         * @returns {string} Formatted number string
         */
        number: function(value) {
            if (value === undefined || value === null) {
                return "";
            }
            
            try {
                // Simple and reliable formatting 
                return parseFloat(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            } catch (e) {
                return value || "";
            }
        },
        
        /**
         * Format a currency value with its currency code
         * @param {number} value The amount to format
         * @param {string} currency The currency code (EUR, USD, etc.)
         * @returns {string} Formatted string with currency
         */
        currency: function(value, currency) {
            if (!value) {
                return "";
            }
            
            var formattedValue = this.number(value);
            return formattedValue + " " + (currency || "EUR");
        }
    };
});
