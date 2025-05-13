sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"./model/models"
], function(UIComponent, Device, models) {
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
			// Create and set the i18n model BEFORE base init
			var oI18nModel = new sap.ui.model.resource.ResourceModel({
				bundleName: "nxt.ap.release.i18n.i18n"
			});
			this.setModel(oI18nModel, "i18n");

			// --- BEGIN: Set mock data model globally ---
			/**
			 * Register the mockdata.json as a named model ("mock") at the Component level for global access.
			 * This ensures all views can access mock data via the "mock" model name.
			 */
			var oMockModel = models.createMockModel();
			this.setModel(oMockModel); // Set as default model
			this.setModel(oMockModel, "mock"); // Also set as named model for explicit access
			// --- END: Set mock data model globally ---

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// create the views based on the url/hash
			this.getRouter().initialize();

			// Explicitly set i18n model on all views if not already present
			this.getRouter().attachRouteMatched(function(oEvent) {
				var oView = oEvent.getParameter("view");
				if (oView && !oView.getModel("i18n")) {
					oView.setModel(this.getModel("i18n"), "i18n");
				}
			}.bind(this));
		}
	});
});