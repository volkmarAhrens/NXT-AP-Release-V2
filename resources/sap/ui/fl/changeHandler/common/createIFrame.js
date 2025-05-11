/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/util/IFrame"],function(){"use strict";return function(e,t,a,n){var i=t.modifier;var s=e.getContent();var r=t.view;var g=t.appComponent;var o={_settings:{}};["url","width","height"].forEach(function(e){var t=s[e];o[e]=t;o._settings[e]=t});o.useLegacyNavigation=!!s.useLegacyNavigation;o._settings.useLegacyNavigation=!!s.useLegacyNavigation;if(s?.advancedSettings){o.advancedSettings=s.advancedSettings;o._settings.advancedSettings=s?.advancedSettings}if(n){o.renameInfo=n;o.asContainer=true}return Promise.resolve().then(function(){return i.createControl("sap.ui.fl.util.IFrame",g,r,a,o,false)})}});
//# sourceMappingURL=createIFrame.js.map