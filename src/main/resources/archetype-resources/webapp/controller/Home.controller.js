sap.ui.define([
	"${packageInPathFormat}/core/BaseController"
], function (
	BaseController
) {
	"use strict";
	return BaseController.extend("${package}.controller.Home", {

		onInit: function () {
			this.setModel({
				"version": "0.1.0"
			}, "view");

			this.attachPatternMatched("Home", this.onRefresh);
		},

		onRefresh: function (oEvent) {}
	});
});