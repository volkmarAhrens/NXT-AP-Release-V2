sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function(Controller, JSONModel, MessageToast) {
// Logging added for debugging data load

    "use strict";

    /**
     * Controller for the AP Release main view.
     * Handles data loading, PDF viewing, and action buttons.
     */
    /**
     * Controller for the AP Release main view.
     * Handles data loading, PDF viewing, and action buttons.
     * Implements Fiori master-detail invoice selection logic.
     */
    return Controller.extend("nxt.ap.release.controller.APRelease", {
        /**
         * onInit - Initializes the view, sets up the selection view model, and ensures the first invoice is selected by default.
         */
        /**
 * Formatter to print the entire row binding context as JSON for debugging.
 * Handles both value and context, and tries to extract the row object if possible.
 * @param {any} oValue - The value at the binding path (may be undefined).
 * @returns {string} JSON string of the row context or value.
 */
formatRowContext: function(oValue) {
    try {
        // Print the value if it's an object
        if (typeof oValue === "object" && oValue !== null) {
            return JSON.stringify(oValue);
        }
        // Try to get the context object from 'this' if available
        if (this && typeof this.getBindingContext === "function") {
            var ctx = this.getBindingContext();
            if (ctx && typeof ctx.getObject === "function") {
                return JSON.stringify(ctx.getObject());
            }
        }
        // Fallback to string value
        return String(oValue);
    } catch (e) {
        return "Error: " + e;
    }
},

/**
 * Logs the binding context object of the first row in the invoices table for debugging.
 */
onInvoicesTableUpdateFinished: function(oEvent) {
    var oTable = oEvent.getSource();
    var oItem = oTable.getItems()[0];
    if (oItem) {
        var oContext = oItem.getBindingContext("mock");
        if (oContext) {
            console.log("[DEBUG] First row context object:", oContext.getObject());
        } else {
            console.log("[DEBUG] No binding context on first row.");
        }
    } else {
        console.log("[DEBUG] No items in table.");
    }
},

onInit: function() {
    // Create a viewModel for dynamic header binding
    var oViewModel = new sap.ui.model.json.JSONModel({
        selectedInvoicePath: "/Invoices/0"
    });
    this.getView().setModel(oViewModel, "viewModel");
    var oView = this.getView();
    // Ensure the 'mock' model is available at the view level for binding
    var oMockModel = this.getOwnerComponent().getModel("mock");
    // Ensure mock model is set as default at the view level for proper context binding
    this.getView().setModel(oMockModel);
    if (oMockModel) {
        oView.setModel(oMockModel, "mock");
        // Set as default model (no name) on the view
        oView.setModel(oMockModel);
        console.log("[APRelease.controller.js] mock model set as default on view:", oView.getModel()?.getData());
        // Debug: Print the actual data structure at runtime
        console.log("[DEBUG] oMockModel.getData():", oMockModel.getData());
        console.log("[DEBUG] oView.getModel().getData():", oView.getModel().getData());
        var oTable = this.byId("invoicesTable");
        if (oTable) {
    var oLineItemsTable = this.byId("lineItemsTable");
    // Set initial binding context for lineItemsTable to the first invoice (if any)
    var oSelectedItem = oTable && oTable.getItems && oTable.getItems()[0];
    var oInvoiceOverviewPanel = this.getView().byId("invoiceOverviewPanel");
    console.log("[DEBUG] getView().byId('invoiceOverviewPanel') at handler start =", oInvoiceOverviewPanel);
    if (!oInvoiceOverviewPanel) {
        console.error("[ERROR] invoiceOverviewPanel HBox not found! Check the id in the XML view.");
    }
    // If no selection, fallback to first item
    if (!oSelectedItem && oTable && oTable.getItems().length > 0) {
        oSelectedItem = oTable.getItems()[0];
    }
    if (oSelectedItem) {
        var oContext = oSelectedItem.getBindingContext();
        console.log("[DEBUG] Selected context path:", oContext && oContext.getPath());
        // Dynamically bind the header HBox context using bindElement
        this.getView().byId("invoiceOverviewPanel").bindElement({
            path: oContext.getPath()
        });
        console.log("[DEBUG] invoiceOverviewPanel bound to path (default model):", oContext.getPath());
        var sPath = oContext.getPath() + "/LineItems";
        oLineItemsTable.bindItems({
            path: sPath,
            template: oLineItemsTable.getBindingInfo("items").template
        });
        // Debug: log binding path
        console.log("[DEBUG] LineItemsTable bound to path:", sPath);
    }
            // Set as default model (no name) on the view
            oView.setModel(oMockModel);
            // Debug: print mock model data
            console.log("[DEBUG] Mock model data loaded:", oMockModel.getData());
            // Do NOT rebind the table in code; let XML handle the template
            // oTable.bindItems({ path: "/Invoices" });
            console.log("[APRelease.controller.js] Model set as default on table; XML template will be used");
        }
    } else {
        console.warn("[APRelease.controller.js] mock model not found on owner component!");
    }
    // --- Selection View Model for master-detail pattern ---
    var oViewModel = new JSONModel({
        selectedInvoiceIndex: 0
    });
    oView.setModel(oViewModel, "viewModel");

    // Ensure i18n model is available on the view for all controls
    oView.setModel(this.getOwnerComponent().getModel("i18n"), "i18n");
    // Also set i18n model directly on headerVBox for explicit context
    var oHeaderVBox = this.byId("headerVBox");
    if (oHeaderVBox) {
        oHeaderVBox.setModel(this.getOwnerComponent().getModel("i18n"), "i18n");
    }

    // --- Robust mock data model setup ---
    oView.setBusy(true);
    var oModel = new JSONModel();
    // The mock data model is now loaded globally in Component.js as the named "mock" model.
    // No need to load or set it here. Only handle the view model and UI logic.
    // Ensure the busy indicator is cleared if set elsewhere.
    oView.setBusy(false);
    // Select the first invoice row by default after data is loaded (handled by table binding)
    var oTable = oView.byId("invoicesTable");
    if (oTable && oTable.getItems().length > 0) {
        oTable.setSelectedItem(oTable.getItems()[0]);
    }

},

/**
 * Handler for invoice table selection change. Updates selectedInvoiceIndex in the view model.
 */
onInvoiceSelectionChange: function(oEvent) {
    var oTable = this.byId("invoicesTable");
    var oLineItemsTable = this.byId("lineItemsTable");
    var oHeaderHBox = this.byId("invoiceOverviewPanel");
    var oSelectedItem = oEvent.getParameter("listItem") || (oTable && oTable.getSelectedItem && oTable.getSelectedItem());
    // Fallback to first item if nothing is selected
    if (!oSelectedItem && oTable && oTable.getItems().length > 0) {
        oSelectedItem = oTable.getItems()[0];
        console.log("[DEBUG] No selection, fallback to first row.");
    }
    if (oSelectedItem && oHeaderHBox) {
        var oContext = oSelectedItem.getBindingContext();
        var sPath = oContext.getPath(); // e.g. /Invoices/1
        // Bind header HBox context to selected invoice
        oHeaderHBox.unbindElement();
        oHeaderHBox.bindElement({ path: sPath });
        console.log("[DEBUG] invoiceOverviewPanel bound to path (default model):", sPath);
        // Rebind line items table to selected invoice's LineItems
        oLineItemsTable.bindItems({
            path: sPath + "/LineItems",
            template: oLineItemsTable.getBindingInfo("items").template
        });
        console.log("[DEBUG] LineItemsTable rebound to path:", sPath + "/LineItems");
        // Update viewModel for selected invoice index (for any other logic)
        var iIdx = parseInt(sPath.split("/")[2], 10);
        this.getView().getModel("viewModel").setProperty("/selectedInvoiceIndex", iIdx);
    } else {
        console.warn("[WARN] No invoice selected and no items in table.");
    }
},

    /**
     * Formatter function to provide the LineItems array for the currently selected invoice.
     * Used in the lineItemsTable binding in the XML view.
     * @param {Array} aInvoices - The array of all invoices from the mock data model.
     * @returns {Array} The LineItems array for the selected invoice, or an empty array if not available.
     */
    getSelectedInvoiceLineItems: function(aInvoices) {
        var oView = this.getView();
        var oViewModel = oView.getModel("viewModel");
        var iIdx = oViewModel ? oViewModel.getProperty("/selectedInvoiceIndex") : 0;
        if (Array.isArray(aInvoices) && aInvoices[iIdx] && Array.isArray(aInvoices[iIdx].LineItems)) {
            return aInvoices[iIdx].LineItems;
        }
        return [];
    },

        onOpenPdf: function(oEvent) {
            // Get the context of the pressed row
            var oContext = oEvent.getSource().getBindingContext();
            var sPdfUrl = oContext.getProperty("pdfUrl");
            if (sPdfUrl) {
                window.open(sPdfUrl, "_blank");
            } else {
                MessageToast.show("PDF not available.");
            }
        },

        onReleaseForPosting: function() {
            MessageToast.show("Release for Posting pressed.");
        },
        onRejectWithComment: function() {
            MessageToast.show("Reject with Comment pressed.");
        },
        onForwardWithInquiry: function() {
            MessageToast.show("Forward with Inquiry pressed.");
        },
        onDocuments: function() {
            MessageToast.show("Documents pressed.");
        },
        onProcessLog: function() {
            MessageToast.show("Process Log pressed.");
        },
        onNxtAi: function() {
            MessageToast.show("NXT AI pressed.");
        },

        /**
         * DEBUG: Log the current model data to the console and expose it globally
         */
        onDebugModel: function() {
            var oData = this.getView().getModel().getData();
            console.log("DEBUG MODEL DATA:", oData);
            window._debugModelData = oData;
            sap.m.MessageToast.show("Check console for model data");
        }
    });
});
