sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(Controller) {
    "use strict";
    
    /**
     * Simple demonstration controller to show properly formatted amounts
     * This follows OpenUI5 framework best practices
     */
    return Controller.extend("nxt.ap.release.controller.Amount", {
        /**
         * Initialize the controller
         */
        onInit: function() {
            // Using standard OpenUI5 currency formatting
            var oAmountFormat = sap.ui.core.format.NumberFormat.getCurrencyInstance({
                currencyCode: false,
                showMeasure: false
            });
            
            // Get sample data from the mockdata.json file
            var oModel = this.getOwnerComponent().getModel();
            var oData = oModel.getData();
            
            if (oData && oData.Invoices && oData.Invoices.length > 0) {
                var oInvoice = oData.Invoices[0];
                var fAmount = oInvoice.Header.InvoiceTotalAmount;
                var sCurrency = oInvoice.Header.InvoiceCurrency;
                
                // Format and display the amount
                var sFormattedAmount = oAmountFormat.format(fAmount);
                this.byId("amountValue").setText(sFormattedAmount);
                this.byId("currencyCode").setText(sCurrency);
            }
        }
    });
});
