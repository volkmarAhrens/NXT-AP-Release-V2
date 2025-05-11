/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/MultiInput","sap/ui/mdc/field/FieldMultiInputRenderer","sap/ui/base/ManagedObjectObserver"],function(e,t,i){"use strict";const r=e.extend("sap.ui.mdc.field.FieldMultiInput",{metadata:{library:"sap.ui.mdc",properties:{ariaAttributes:{type:"object",defaultValue:{},byValue:true}}},renderer:t});r.prototype.init=function(){e.prototype.init.apply(this,arguments);this._oObserver=new i(a.bind(this));this._oObserver.observe(this,{properties:["ariaAttributes"]})};r.prototype.exit=function(){e.prototype.exit.apply(this,arguments);this._oObserver.disconnect();this._oObserver=undefined};function a(e){if(e.name==="ariaAttributes"){if(e.current.aria?.activedescendant!==e.old.aria?.activedescendant){const t=this.getFocusDomRef();if(!e.current.aria?.activedescendant){t.removeAttribute("aria-activedescendant")}else{t.setAttribute("aria-activedescendant",e.current.aria.activedescendant)}}}}return r});
//# sourceMappingURL=FieldMultiInput.js.map