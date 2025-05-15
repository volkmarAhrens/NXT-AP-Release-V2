sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "nxt/ap/release/util/formatter",
    "nxt/ap/release/util/NumberFormat",
    "sap/ui/model/json/JSONModel", 
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/ActionSheet",
    "sap/m/TablePersoController",
    "sap/ui/model/Sorter",
    "sap/m/PDFViewer",
    "sap/m/VBox",
    "sap/m/HBox",
    "sap/m/Text",
    "sap/m/Label",
    "sap/m/Title",
    "sap/m/Avatar",
    "sap/ui/core/HTML"
], function(Controller, formatter, NumberFormat, JSONModel, MessageToast, Dialog, Button, ActionSheet, TablePersoController, Sorter, PDFViewer, VBox, HBox, Text, Label, Title, Avatar, HTML) {
    "use strict";

    /**
     * Controller for the AP Release main view.
     * Handles data loading, PDF viewing, action buttons, and SSO user display.
     */
    return Controller.extend("nxt.ap.release.controller.APRelease", {
        formatter: formatter,
        
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
            // --- Table Personalization Controllers ---
            this._oInvoicesTablePerso = new TablePersoController({
                table: this.byId("invoicesTable"),
                componentName: "invoicesTablePerso"
            });
            this._oLineItemsTablePerso = new TablePersoController({
                table: this.byId("lineItemsTable"),
                componentName: "lineItemsTablePerso"
            });
            
            // FIRST create the viewModel for dynamic header binding
            // to ensure it's available for language handling
            var sCurrentLanguage = sap.ui.getCore().getConfiguration().getLanguage();
            var oViewModel = new JSONModel({
                selectedInvoicePath: "/Invoices/0",
                currentLanguage: sCurrentLanguage,
                availableLanguages: this._getAvailableLanguages()
            });
            this.getView().setModel(oViewModel, "viewModel");
            
            // THEN initialize language management
            this._initLanguageHandling();
            
            // Update header labels with proper translations
            this._updateHeaderLabels();
            
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
                        if (oLineItemsTable) {
                            oLineItemsTable.bindItems({
                                path: sPath,
                                template: oLineItemsTable.getBindingInfo("items").template
                            });
                            // Debug: log binding path
                            console.log("[DEBUG] LineItemsTable bound to path:", sPath);
                        } else {
                            console.error("[ERROR] lineItemsTable not found at onInit");
                        }
                    }
                }
                
                // Debug: print mock model data
                console.log("[DEBUG] Mock model data loaded:", oMockModel.getData());
                
                // Ensure i18n model is available on the view for all controls
                oView.setModel(this.getOwnerComponent().getModel("i18n"), "i18n");
                
                // Also set i18n model directly on headerVBox for explicit context
                var oHeaderVBox = this.byId("headerVBox");
                if (oHeaderVBox) {
                    oHeaderVBox.setModel(this.getOwnerComponent().getModel("i18n"), "i18n");
                }
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
        
        /**
         * Handles the "Documents" button press event.
         * Opens the current invoice's PDF document in a new browser tab.
         * The PDF URL is taken from the invoice's "InvoicePDFUrl" property in the mock data.
         * @public
         */
        onDocuments: function() {
            // Get the current invoice context from the header panel
            var oContext = this.byId("invoiceOverviewPanel").getBindingContext();
            
            if (!oContext) {
                MessageToast.show("No invoice selected.");
                return;
            }
            
            // Get the PDF URL from the invoice context
            var sPdfUrl = oContext.getProperty("Header/InvoicePDFUrl");
            
            if (!sPdfUrl) {
                MessageToast.show("No PDF document available for this invoice.");
                return;
            }
            
            // Fix case sensitivity issue - in mockdata it's "invoices" but actual folder is "Invoices"
            if (sPdfUrl.startsWith("resources/invoices/")) {
                sPdfUrl = sPdfUrl.replace("resources/invoices/", "resources/Invoices/");
            }
            
            // Get the SAP document number for PDF file name fallback
            var sSapDocNum = oContext.getProperty("Header/SAPDocumentNumber") || "";
            
            // Approach 1: Try opening directly in a new tab (simplest approach)
            try {
                console.log("Opening PDF in new tab:", sPdfUrl);
                var win = window.open(sPdfUrl, "_blank");
                
                if (!win || win.closed || typeof win.closed === "undefined") {
                    // If popup blocked or other issue, show message to user
                    MessageToast.show("PDF viewer was blocked. Please enable popups for this application.");
                } else {
                    // Success message
                    MessageToast.show("Opening invoice document in new tab");
                }
                
            } catch (err) {
                console.error("Error opening PDF:", err);
                MessageToast.show("Failed to open document. Please ensure PDF viewer is installed.");
            }
        },

        /**
         * Formats a value as a float with two decimals and thousands separators.
         * @param {string|number} value
         * @returns {string}
         */
        formatFloat2: function(value) {
            if (value == null || value === "") return "";
            var num = Number(value);
            if (isNaN(num)) return value;
            return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        },
        
        // --- Table Toolbar Handlers ---
        /**
         * Refreshes the invoices table data (reloads mock model)
         */
        onRefreshInvoices: function() {
            var oModel = this.getView().getModel();
            // If your mock data is in 'webapp/resources/mockdata.json', reload it here if needed
            // Otherwise, just refresh the model
            if (oModel && typeof oModel.loadData === "function") {
                oModel.loadData("resources/mockdata.json");
            } else if (oModel) {
                oModel.refresh(true);
            }
            MessageToast.show("Invoices refreshed.");
        },
        
        /**
         * Refreshes the line items table (rebinding to current invoice)
         */
        onRefreshLineItems: function() {
            var oTable = this.byId("lineItemsTable");
            var oContext = this.byId("invoiceOverviewPanel").getBindingContext();
            if (oTable && oContext) {
                oTable.bindItems({
                    path: oContext.getPath() + "/LineItems",
                    template: oTable.getBindingInfo("items").template
                });
                MessageToast.show("Line items refreshed.");
            }
        },

        /**
         * Filter handler for invoices table (shows column menu)
         */
        onFilterInvoices: function(oEvent) {
            this.byId("invoicesTable").openColumnMenu(0);
        },
        
        /**
         * Filter handler for line items table (shows column menu)
         */
        onFilterLineItems: function(oEvent) {
            this.byId("lineItemsTable").openColumnMenu(0);
        },
        
        /**
         * Personalize handler for invoices table
         */
        onPersonalizeInvoices: function() {
            this._oInvoicesTablePerso.openDialog();
        },
        
        /**
         * Personalize handler for line items table
         */
        onPersonalizeLineItems: function() {
            this._oLineItemsTablePerso.openDialog();
        },
        
        /**
         * DEBUG: Log the current model data to the console and expose it globally
         */
        onDebugModel: function() {
            var oData = this.getView().getModel().getData();
            console.log("DEBUG MODEL DATA:", oData);
            window._debugModelData = oData;
            MessageToast.show("Check console for model data");
        },

        /**
         * Sorts the invoices table based on the selected property from the dropdown.
         */
        onSortInvoices: function() {
            var oTable = this.byId("invoicesTable");
            var oSelect = this.byId("invoiceSortSelect");
            var sProperty = oSelect.getSelectedKey();
            if (oTable && sProperty) {
                var oBinding = oTable.getBinding("items");
                var oSorter = new Sorter(sProperty, false); // false = ascending
                oBinding.sort(oSorter);
                MessageToast.show("Sorted by: " + oSelect.getSelectedItem().getText());
            }
        },

        /**
         * Opens the column menu for the first column of the line items table for sorting.
         */
        onSortLineItems: function() {
            var oTable = this.byId("lineItemsTable");
            if (oTable) {
                oTable.openColumnMenu(0);
            }
        },
        
        /**
         * Handles the press event on the user avatar in the header.
         * Opens a dialog with detailed user information if user authenticated via SSO.
         * 
         * @param {sap.ui.base.Event} oEvent The event object
         * @public
         */
        onAvatarPress: function(oEvent) {
            var oUser = this.getOwnerComponent().getModel("user").getData();
            
            // Create and open a user profile dialog
            if (!this._oUserProfileDialog) {
                this._oUserProfileDialog = new Dialog({
                    title: "User Profile",
                    contentWidth: "400px",
                    content: new VBox({
                        items: [
                            new HBox({
                                justifyContent: "Center",
                                items: [
                                    new Avatar({
                                        src: "{user>/photoUrl}",
                                        displaySize: "L",
                                        displayShape: "Circle"
                                    }).addStyleClass("sapUiMediumMarginTopBottom")
                                ]
                            }),
                            new Title({ text: "{user>/displayName}" }).addStyleClass("sapUiTinyMarginBottom"),
                            new Label({ text: "Email" }),
                            new Text({ text: "{user>/email}" }).addStyleClass("sapUiSmallMarginBottom"),
                            new Label({ text: "Account Type" }),
                            new Text({ text: "{user>/accountType}" }).addStyleClass("sapUiSmallMarginBottom"),
                            new Label({ text: "Roles" }),
                            new Text({ text: "{= ${user>/roles}.join(', ') }" })
                        ]
                    }).addStyleClass("sapUiMediumMargin"),
                    beginButton: new Button({
                        text: "Close",
                        press: function() {
                            this._oUserProfileDialog.close();
                        }.bind(this)
                    })
                });
                
                // Set the user model on the dialog
                this._oUserProfileDialog.setModel(this.getOwnerComponent().getModel("user"), "user");
                
                // Add dialog to view for lifecycle management
                this.getView().addDependent(this._oUserProfileDialog);
            }
            
            this._oUserProfileDialog.open();
        },
        
        /**
         * Initialize language handling functionality.
         * Detects current browser language and prepares language switching capabilities.
         * @private
         */
        _initLanguageHandling: function() {
            try {
                // Get current language from browser or saved preference
                var sCurrentLanguage = sap.ui.getCore().getConfiguration().getLanguage();
                
                // Normalize language code (remove browser additions like -DE)
                sCurrentLanguage = this._normalizeLanguageCode(sCurrentLanguage);
                
                // Try to get saved language preference if available
                if (window.localStorage) {
                    var sSavedLanguage = window.localStorage.getItem("userLanguage");
                    if (sSavedLanguage) {
                        // Apply saved language if it exists
                        sCurrentLanguage = sSavedLanguage;
                        
                        // Just set the configuration language without any view updates or reloads
                        sap.ui.getCore().getConfiguration().setLanguage(sSavedLanguage);
                    }
                }
                
                // Make sure view model gets updated with current language if it exists
                var oViewModel = this.getView().getModel("viewModel");
                if (oViewModel) {
                    oViewModel.setProperty("/currentLanguage", sCurrentLanguage);
                }
                
                console.log("Current language:", sCurrentLanguage);
            } catch (e) {
                console.error("Error in language initialization:", e);
                // Don't let language errors break the application
            }
        },
        
        /**
         * Normalize language code to match our available languages
         * @private
         * @param {string} sLanguageCode - Browser language code (like en-US, de-DE)
         * @returns {string} Normalized language code (like en_US, de)
         */
        _normalizeLanguageCode: function(sLanguageCode) {
            if (!sLanguageCode) {
                return "en";
            }
            
            // Replace dash with underscore
            sLanguageCode = sLanguageCode.replace("-", "_");
            
            // Check if this language is in our available languages
            var aAvailableLanguages = this._getAvailableLanguages();
            var oFound = aAvailableLanguages.find(function(lang) {
                return lang.key === sLanguageCode;
            });
            
            if (oFound) {
                return sLanguageCode;
            }
            
            // If not found with full locale, try with just the language part
            var sMainLang = sLanguageCode.split("_")[0];
            oFound = aAvailableLanguages.find(function(lang) {
                return lang.key === sMainLang;
            });
            
            return oFound ? sMainLang : "en"; // Default to English if not found
        },
        
        /**
         * Get a list of available languages based on the i18n properties files.
         * @private
         * @returns {Array} Array of language objects with key, name and icon properties
         */
        _getAvailableLanguages: function() {
            // List of available languages based on i18n files
            // We know these from checking the i18n folder
            return [
                { key: "en", name: "English", icon: "sap-icon://globe" },
                { key: "en_US", name: "English (US)", icon: "sap-icon://globe" },
                { key: "de", name: "Deutsch", icon: "sap-icon://globe" },
                { key: "es", name: "Español", icon: "sap-icon://globe" },
                { key: "fr", name: "Français", icon: "sap-icon://globe" },
                { key: "pt", name: "Português", icon: "sap-icon://globe" }
            ];
        },
        
        /**
         * Apply a new language to the application.
         * @private
         * @param {string} sLanguage - The language code to apply (e.g., "en", "de")
         * @param {boolean} [bReload=true] - Whether to reload the page to apply language changes
         */
        _applyLanguage: function(sLanguage, bReload) {
            try {
                if (!sLanguage) {
                    console.error("No language code provided to _applyLanguage");
                    return;
                }
                
                // Normalize language code (ensure it's just the base language code)
                sLanguage = sLanguage.split('-')[0].split('_')[0].toLowerCase();
                console.log("Applying language: " + sLanguage);
                
                // Verify it's a supported language
                if (["en", "de", "fr", "es", "pt"].indexOf(sLanguage) === -1) {
                    console.warn("Unsupported language: " + sLanguage + ", falling back to English");
                    sLanguage = "en";
                }
                
                // Remember language in local storage (this is the source of truth)
                localStorage.setItem("nxt.ap.release.language", sLanguage);
                
                // Update view model language
                var oViewModel = this.getView().getModel("viewModel");
                if (oViewModel) {
                    oViewModel.setProperty("/currentLanguage", sLanguage);
                }
                
                // Get language display name
                var sLanguageName = this._getAvailableLanguages().find(function(lang) {
                    return lang.key === sLanguage || lang.key === sLanguage.split("_")[0];
                })?.name || sLanguage.toUpperCase();
                
                // First update the UI core configuration
                sap.ui.getCore().getConfiguration().setLanguage(sLanguage);
                
                // Create a new i18n model with direct file reference for the selected language
                // This ensures consistent language loading
                var sBundlePath = jQuery.sap.getModulePath("nxt.ap.release") + "/i18n/i18n_" + sLanguage + ".properties";
                
                console.log("Loading language file directly from: " + sBundlePath);
                
                var oNewI18nModel = new sap.ui.model.resource.ResourceModel({
                    bundleUrl: sBundlePath,
                    bundleLocale: sLanguage,
                    async: false // Force synchronous loading
                });
                
                // Set the model at all levels to ensure consistent language display
                this.getOwnerComponent().setModel(oNewI18nModel, "i18n");
                sap.ui.getCore().setModel(oNewI18nModel, "i18n");
                this.getView().setModel(oNewI18nModel, "i18n");
                
                // Update header labels immediately to show effect of language change
                this._updateHeaderLabels();
                
                // Schedule multiple updates to ensure language is applied thoroughly
                var that = this;
                
                setTimeout(function() {
                    // Refresh all models and update labels again
                    that.getView().invalidate();
                    that._updateHeaderLabels();
                    
                    // Force re-rendering of some key UI elements
                    var oTable = that.byId("invoicesTable");
                    if (oTable) {
                        oTable.invalidate();
                    }
                    
                    // Show success message after short delay so user can see the change
                    MessageToast.show("Language changed to " + sLanguageName);
                }, 100);
                
                setTimeout(function() {
                    // Apply the labels one more time after longer delay
                    that._updateHeaderLabels();
                }, 500);
                
            } catch (e) {
                // Log error but don't break the application
                console.error("Error during language change:", e);
                MessageToast.show("Language change failed. Please try again.");
            }
        },
        
        /**
         * Updates all header panel labels with proper translations
         * This ensures all i18n bindings are properly applied regardless of resource bundle state
         * @private
         */
        /**
         * Updates all header labels with translations based on current language
         * This provides a completely reliable solution to ensure labels display correctly
         * in all supported languages (EN, DE, FR, ES, PT) regardless of i18n bundle state
         * @private
         */
        _updateHeaderLabels: function() {
            console.log("[APRelease] Applying header label translations");
            
            try {
                // IMPORTANT: First check localStorage for explicit language preference
                // This ensures language consistency across page refreshes
                var sPreferredLang = localStorage.getItem("nxt.ap.release.language");
                
                // Get current language from configuration if no stored preference
                var sCurrentLang = sPreferredLang || sap.ui.getCore().getConfiguration().getLanguage();
                var sLangKey = sCurrentLang.split('-')[0].toLowerCase(); // Normalize to 2-char code
                
                // Map of languages to translations for key header panel labels
                var mTranslations = {
                    en: {
                        requester: "Requester",
                        approver: "Approver",
                        natureOfInvoice: "Nature of Invoice",
                        totalAmount: "Total Amount",
                        discountAmount: "Discount",
                        invoiceDate: "Invoice Date",
                        activity: "Activity",
                        invoiceDueDate: "Due Date",
                        apTime: "AP Time (D)"
                    },
                    de: {
                        requester: "Anforderer",
                        approver: "Freigeber",
                        natureOfInvoice: "Rechnungsart",
                        totalAmount: "Gesamtbetrag",
                        discountAmount: "Rabatt",
                        invoiceDate: "Rechnungsdatum",
                        activity: "Aktivität",
                        invoiceDueDate: "Fälligkeitsdatum",
                        apTime: "AP-Zeit"
                    },
                    fr: {
                        requester: "Demandeur",
                        approver: "Approbateur",
                        natureOfInvoice: "Nature de la facture",
                        totalAmount: "Montant total",
                        discountAmount: "Remise", 
                        invoiceDate: "Date de facture",
                        activity: "Activité",
                        invoiceDueDate: "Date d'échéance",
                        apTime: "Temps AP"
                    },
                    es: {
                        requester: "Solicitante",
                        approver: "Aprobador",
                        natureOfInvoice: "Naturaleza de la factura",
                        totalAmount: "Importe total",
                        discountAmount: "Descuento",
                        invoiceDate: "Fecha de factura",
                        activity: "Actividad",
                        invoiceDueDate: "Fecha de vencimiento",
                        apTime: "Tiempo AP"
                    },
                    pt: {
                        requester: "Solicitante",
                        approver: "Aprovador",
                        natureOfInvoice: "Natureza da fatura",
                        totalAmount: "Valor total",
                        discountAmount: "Desconto",
                        invoiceDate: "Data da fatura",
                        activity: "Atividade",
                        invoiceDueDate: "Data de vencimento",
                        apTime: "Tempo AP"
                    }
                };
                
                // If language not supported, default to English
                if (!mTranslations[sLangKey]) {
                    console.log("Language not supported: " + sLangKey + ", defaulting to English");
                    sLangKey = "en";
                }
                
                // Make sure UI core configuration matches our language
                // This is critical to prevent inconsistencies
                if (sap.ui.getCore().getConfiguration().getLanguage() !== sLangKey) {
                    console.log("Syncing UI configuration to match language: " + sLangKey);
                    sap.ui.getCore().getConfiguration().setLanguage(sLangKey);
                }
                
                // Ensure persistency of language preference
                localStorage.setItem("nxt.ap.release.language", sLangKey);
                
                // Get header label controls by ID
                var oLabels = {
                    requester: this.byId("requesterLabel"),
                    approver: this.byId("approverLabel"),
                    natureOfInvoice: this.byId("natureOfInvoiceLabel"),
                    totalAmount: this.byId("totalAmountLabel"),
                    discountAmount: this.byId("discountAmountLabel"),
                    invoiceDate: this.byId("invoiceDateLabel"),
                    activity: this.byId("activityLabel"),
                    invoiceDueDate: this.byId("invoiceDueDateLabel"),
                    apTime: this.byId("apTimeLabel")
                };
                
                // Apply translations based on selected language
                var oTranslations = mTranslations[sLangKey];
                var aAppliedTranslations = [];
                
                for (var sKey in oTranslations) {
                    if (oLabels[sKey]) {
                        // Add colon for field labels
                        oLabels[sKey].setText(oTranslations[sKey] + ":");
                        aAppliedTranslations.push(sKey);
                    }
                }
                
                console.log("[APRelease] Updated " + aAppliedTranslations.length + 
                    " header labels to " + sLangKey.toUpperCase());
            } catch (e) {
                console.error("[APRelease] Error updating header labels:", e);
            }
        },
            
        /**
         * Handler for language switch button press.
         * @public
         * @param {string} sLanguageKey - The language key to switch to
         */
        onSwitchLanguage: function(sLanguageKey) {
            this._applyLanguage(sLanguageKey);
        },
        
        /**
         * Updates all header panel labels with proper translations
         * This method programmatically sets the texts on all header labels
         * to ensure proper i18n without relying on XML binding
         * @private
         */
        _updateHeaderLabels: function() {
            try {
                // Get i18n resource bundle
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                if (!oResourceBundle) {
                    console.error("Failed to get resource bundle");
                    return;
                }
                
                // Get header panel elements through DOM traversal
                var oHeaderPanel = this.byId("invoiceOverviewPanel");
                if (!oHeaderPanel) {
                    console.error("Header panel not found");
                    return;
                }
                
                // Create a mapping of DOM IDs to i18n keys
                var aLabelMappings = [
                    // Column 1
                    { selector: ".sapUiSmallMargin:nth-child(1) .sapUiTinyMarginBottom:nth-child(1) .sapMLabel", key: "requester" },
                    { selector: ".sapUiSmallMargin:nth-child(1) .sapUiTinyMarginBottom:nth-child(2) .sapMLabel", key: "approver" },
                    { selector: ".sapUiSmallMargin:nth-child(1) .sapUiTinyMarginBottom:nth-child(3) .sapMLabel", key: "natureOfInvoice" },
                    
                    // Column 2
                    { selector: ".sapUiSmallMargin:nth-child(2) .sapUiTinyMarginBottom:nth-child(1) .sapMLabel", key: "totalAmount" },
                    { selector: ".sapUiSmallMargin:nth-child(2) .sapUiTinyMarginBottom:nth-child(2) .sapMLabel", key: "discountAmount" },
                    { selector: ".sapUiSmallMargin:nth-child(2) .sapUiTinyMarginBottom:nth-child(3) .sapMLabel", key: "invoiceDate" },
                    
                    // Column 3
                    { selector: ".sapUiSmallMargin:nth-child(3) .sapUiTinyMarginBottom:nth-child(1) .sapMLabel", key: "activity" },
                    { selector: ".sapUiSmallMargin:nth-child(3) .sapUiTinyMarginBottom:nth-child(2) .sapMLabel", key: "invoiceDueDate" },
                    { selector: ".sapUiSmallMargin:nth-child(3) .sapUiTinyMarginBottom:nth-child(3) .sapMLabel", key: "apTime" }
                ];
                
                // Delay to ensure DOM is rendered
                setTimeout(function() {
                    // Find all header labels and update their texts with translated values
                    aLabelMappings.forEach(function(oMapping) {
                        var oLabel = oHeaderPanel.$().find(oMapping.selector);
                        if (oLabel.length > 0) {
                            // Get translated text and append colon
                            var sText = oResourceBundle.getText(oMapping.key) + ":";
                            oLabel.text(sText);
                        }
                    });
                }, 500);
            } catch (e) {
                console.error("Error updating header labels:", e);
            }
        },
        
        /**
         * Opens language selection dialog
         * @public
         */
        onOpenLanguageDialog: function() {
            // Create and open the language selection dialog
            if (!this._oLanguageDialog) {
                // Create standard list item with language icon
                var oItemTemplate = new sap.m.StandardListItem({
                    title: "{viewModel>name}",
                    type: "Active",
                    icon: "{viewModel>icon}",
                    selected: false
                }).data("languageKey", "{viewModel>key}");
                
                var oList = new sap.m.List({
                    mode: "SingleSelectMaster", // Changed to more robust selection mode
                    selectionChange: function(oEvent) {
                        // Store the selected language key for when Save is pressed
                        var oItem = oEvent.getParameter("listItem");
                        if (oItem) {
                            this._sSelectedLanguage = oItem.data("languageKey");
                            console.log("Selected language changed to: " + this._sSelectedLanguage);
                        }
                    }.bind(this),
                    items: {
                        path: "viewModel>/availableLanguages",
                        template: oItemTemplate
                    }
                });
                
                this._oLanguageDialog = new Dialog({
                    title: "{i18n>selectLanguage}",
                    contentWidth: "400px",
                    content: oList,
                    beginButton: new Button({
                        text: "{i18n>save}",
                        type: "Emphasized",
                        press: function() {
                            if (this._sSelectedLanguage) {
                                this._applyLanguage(this._sSelectedLanguage);
                            }
                            this._oLanguageDialog.close();
                        }.bind(this)
                    }),
                    endButton: new Button({
                        text: "{i18n>cancel}",
                        press: function() {
                            this._oLanguageDialog.close();
                        }.bind(this)
                    })
                });
                
                this.getView().addDependent(this._oLanguageDialog);
            }
            
            // Always update the list selection to reflect the current language
            var oList = this._oLanguageDialog.getContent()[0];
            var aItems = oList.getItems();
            
            // Get the current language from localStorage directly for consistency
            var sCurrentLanguage = localStorage.getItem("nxt.ap.release.language") || "en";
            
            // Reset any previous selection
            oList.removeSelections();
            
            // Set up initial selection based on current language
            for (var i = 0; i < aItems.length; i++) {
                // Get the real key from the custom data
                var sKey = aItems[i].data("languageKey");
                if (typeof sKey !== "string") {
                    // Try to get the key from the binding context if custom data isn't available yet
                    var oBindingContext = aItems[i].getBindingContext("viewModel");
                    if (oBindingContext) {
                        sKey = oBindingContext.getProperty("key");
                    }
                }
                
                // Mark as selected if it matches the current language
                if (sKey === sCurrentLanguage) {
                    oList.setSelectedItem(aItems[i], true);
                    this._sSelectedLanguage = sKey; // Pre-select this language
                    console.log("Pre-selected language: " + sKey);
                }
            }
            
            this._oLanguageDialog.open();
        },

        /**
         * Formats a language code to a readable language name
         * @public
         * @param {string} sLanguageKey - The language key (e.g., "en", "de")
         * @returns {string} The readable language name
         */
        formatLanguageName: function(sLanguageKey) {
            if (!sLanguageKey) {
                return "";
            }
            
            var oLanguage = this._getAvailableLanguages().find(function(lang) {
                return lang.key === sLanguageKey || sLanguageKey.startsWith(lang.key);
            });
            
            return oLanguage ? oLanguage.name : sLanguageKey;
        },
        
        /**
         * Handles press events on the user menu button in the header.
         * Opens a menu with user-related options such as settings, support, and logout.
         * 
         * @param {sap.ui.base.Event} oEvent The event object
         * @public
         */
        onUserMenuPress: function(oEvent) {
            var oButton = oEvent.getSource();
            
            // Create the action sheet only once
            if (!this._oUserMenu) {
                this._oUserMenu = new ActionSheet({
                    placement: "Bottom",
                    showCancelButton: true,
                    buttons: [
                        new Button({
                            text: "My Profile",
                            icon: "sap-icon://person-placeholder",
                            press: this.onAvatarPress.bind(this)
                        }),
                        new Button({
                            text: "Language",
                            icon: "sap-icon://translate",
                            press: this.onOpenLanguageDialog.bind(this)
                        }),
                        new Button({
                            text: "Settings",
                            icon: "sap-icon://action-settings",
                            press: function() {
                                MessageToast.show("Settings pressed");
                            }
                        }),
                        new Button({
                            text: "Help",
                            icon: "sap-icon://sys-help",
                            press: function() {
                                MessageToast.show("Help pressed");
                            }
                        }),
                        new Button({
                            text: "Logout",
                            icon: "sap-icon://log",
                            press: function() {
                                MessageToast.show("In a real SSO implementation, this would log you out");
                            }
                        })
                    ]
                });
                
                // Add to view for lifecycle management
                this.getView().addDependent(this._oUserMenu);
            }
            
            this._oUserMenu.openBy(oButton);
        }
    });
});
