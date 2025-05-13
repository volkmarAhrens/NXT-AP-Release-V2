sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(JSONModel, Device) {
	"use strict";

	return {
    /**
     * Creates and returns a JSONModel loaded with mock data from the correct path.
     * Adds robust logging for success and failure. Use as a named model ("mock").
     * @returns {sap.ui.model.json.JSONModel}
     */
    /**
     * DEBUG: Set static test data to isolate model/view binding issues.
     * Remove this after debugging!
     */
    createMockModel: function() {
        var oModel = new JSONModel();
        // Load real mock data from mockdata.json
        oModel.loadData("resources/mockdata.json", null, false);
        oModel.attachRequestCompleted(function() {
            window._debugModelData = oModel.getData();
            console.log("[models.js] DEBUG: Loaded mockdata.json:", oModel.getData());
        });
        return oModel;
    },

		createDeviceModel: function() {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		}

	};
});