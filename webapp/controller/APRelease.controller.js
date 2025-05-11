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
    return Controller.extend("nxt.ap.release.controller.APRelease", {
        onInit: function() {
            var oView = this.getView();
            // Ensure i18n model is available on the view for all controls
            oView.setModel(this.getOwnerComponent().getModel("i18n"), "i18n");
            // Also set i18n model directly on headerVBox for explicit context
            var oHeaderVBox = this.byId("headerVBox");
            if (oHeaderVBox) {
                oHeaderVBox.setModel(this.getOwnerComponent().getModel("i18n"), "i18n");
            }
            oView.setBusy(true);
            var oModel = new JSONModel();
            var that = this;
            console.log("Attempting to load data...");
            oModel.loadData("model/mockdata.json", null, true)
                .then(function() {
                    console.log("Data loaded", oModel.getData());
                    oView.setModel(oModel);
                    oView.setBusy(false);
                })
                .catch(function() {
                    oView.setBusy(false);
                    sap.m.MessageToast.show("Failed to load data.");
                    console.error("Failed to load model/mockdata.json");
                });

            
            // Debug: Log available models and i18n bundle URL
            var oView = this.getView();
            // [DEBUG] getModelNames() is not available in OpenUI5 1.119.0
// var aModelNames = oView.getModelNames();
// console.log("[DEBUG] Models available on view:", aModelNames);
            var oI18n = oView.getModel("i18n");
            if (oI18n) {
                console.log("[DEBUG] i18n model bundleUrl:", oI18n.sBundleUrl);
            } else {
                console.warn("[DEBUG] i18n model not found on view.");
            }
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
        }
    });
});
