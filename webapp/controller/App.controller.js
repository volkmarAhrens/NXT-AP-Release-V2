sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("nxt.ap.release.controller.App", {

		onInit: function () {
			// Get browser language
			var sLanguage = navigator.language || navigator.userLanguage || 'en';
			// Get user name (placeholder, replace with real auth if available)
			var sUserName = window.sap && sap.ushell && sap.ushell.Container && sap.ushell.Container.getUser ? sap.ushell.Container.getUser().getFullName() : 'Guest';
			var oAppModel = new sap.ui.model.json.JSONModel({
				userName: sUserName,
				language: sLanguage
			});
			this.getView().setModel(oAppModel, "app");
		}
	});
});