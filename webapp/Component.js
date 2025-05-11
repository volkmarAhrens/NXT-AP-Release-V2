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
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			// --- BEGIN: Set default data model globally ---
			// Register the mockdata.json as the default model at the Component level for global access.
			var oMockModel = new sap.ui.model.json.JSONModel();
			oMockModel.loadData("model/mockdata.json", null, false); // synchronous load
			this.setModel(oMockModel); // Default model, no name
			// --- END: Set default data model globally ---

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