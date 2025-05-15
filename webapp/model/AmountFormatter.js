sap.ui.define([
    "sap/ui/model/SimpleType",
    "sap/ui/model/ValidateException",
    "sap/ui/core/format/NumberFormat"
], function (SimpleType, ValidateException, NumberFormat) {
    "use strict";

    /**
     * Custom formatter for currency amounts that works reliably across all OpenUI5 versions
     * This can be used directly in XML views with proper currency formatting
     */
    return SimpleType.extend("nxt.ap.release.model.AmountFormatter", {
        /**
         * Formats the given value according to the type settings
         * @param {number} value The value to be formatted
         * @returns {string} The formatted value
         */
        formatValue: function(value, targetType) {
            if (value === undefined || value === null) {
                return "";
            }

            if (targetType === "string") {
                try {
                    // Use OpenUI5's NumberFormat API
                    var oFormat = NumberFormat.getFloatInstance({
                        maxFractionDigits: 2,
                        minFractionDigits: 2,
                        groupingEnabled: true
                    });
                    return oFormat.format(value);
                } catch (e) {
                    console.error("Error formatting number:", e);
                    return value.toFixed(2); // Simple fallback
                }
            }
            
            return value;
        },

        /**
         * Parses the given string value
         * @param {string} value The value to be parsed
         * @returns {number} The parse result
         */
        parseValue: function(value, sourceType) {
            if (sourceType === "string") {
                try {
                    var oFormat = NumberFormat.getFloatInstance();
                    return oFormat.parse(value);
                } catch (e) {
                    throw new ValidateException("Cannot parse " + value + ": " + e);
                }
            }
            return value;
        },

        /**
         * Validates the given value
         * @param {number} value The value to be validated
         */
        validateValue: function(value) {
            // Validation can be added here if needed
        }
    });
});
