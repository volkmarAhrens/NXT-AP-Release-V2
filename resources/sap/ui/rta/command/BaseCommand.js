/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/ManagedObject","sap/ui/core/Element"],function(e,t){"use strict";var n=e.extend("sap.ui.rta.command.BaseCommand",{metadata:{library:"sap.ui.rta",properties:{name:{type:"string"},runtimeOnly:{type:"boolean"},relevantForSave:{type:"boolean",defaultValue:true}},associations:{element:{type:"sap.ui.core.Element"}},events:{}}});n.prototype.getElement=function(){var e=this.getAssociation("element");return t.getElementById(e)};n.prototype.prepare=function(){return true};n.prototype.execute=function(){return Promise.resolve()};n.prototype.getVariantChange=function(){return this._oVariantChange};n.prototype.undo=function(){return Promise.resolve()};n.prototype.isEnabled=function(){return true};return n});
//# sourceMappingURL=BaseCommand.js.map