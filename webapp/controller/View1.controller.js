sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator'
], function (Controller, JSONModel, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("sample.SVMFilterBar.controller.View1", {
		onInit: function () {
			this.oFilterModel = new JSONModel({
				name: {
					value: void 0,
					visibleInFB: true
				},
				classification: {
					selectedKeys: void 0,
					visibleInFB: true
				},
				createdAt: {
					value: void 0,
					visibleInFB: true
				}
			});
			this.getView().setModel(this.oFilterModel, "filterModel");

			//initialize SVMFilterBar
			this._fnFilterPropertyChange = function (oEvt) {
				var oVariantManagement = this.getView().byId("filterBar").getVariantManagement();
				if (oVariantManagement) {
					oVariantManagement.currentVariantSetModified(true);
				}
			};
			this.oFilterModel.attachPropertyChange(this._fnFilterPropertyChange.bind(this));
			this.getView().byId("filterBar").fireInitialise();
			this.getView().byId("filterBar").registerFetchData(this.onFetchData.bind(this));
			this.getView().byId("filterBar").registerApplyData(this.onApplyData.bind(this));
		},
		/** 
		 * @description return the variant representation - send to system
		 * @returns {object} JSON object - FilterModelData
		 */
		onFetchData: function () {
			return this.oFilterModel.getData();
		},
		/** 
		 * @description applying the variant data to the filtermodel - retrieve from system
		 * @param {object} oVariantContext
		 */
		onApplyData: function (oVariantContext) {
			var oApplyData = this._adjustDatesForSVM(oVariantContext);
			this.oFilterModel.setData(oApplyData);
		},
		/** 
		 * @description convert date string to date
		 * @param {object} oVariantContext
		 */
		_adjustDatesForSVM: function (oVariantContext) {
			if (oVariantContext.createdAt.value) {
				oVariantContext.createdAt.value = new Date(oVariantContext.createdAt.value);
			}
			return oVariantContext;
		},
		/** 
		 * @description This event is fired when the Go button is pressed. Execute the search
		 */
		onSearch: function () {
			var oFilterModel = this.getView().getModel("filterModel");
			var aFilters = [];

			//input
			var oNameFilter = oFilterModel.getProperty("/name");
			if (oNameFilter.visibleInFB && oNameFilter.value) {
				aFilters.push(new Filter("Name", FilterOperator.Contains, oNameFilter.value));
			}

			//multiinput
			var oClassificationFilter = oFilterModel.getProperty("/classification");
			if (oClassificationFilter.visibleInFB && oClassificationFilter.selectedKeys) {
				var aClassificationFilters = [];
				var aSelectedKeys = oClassificationFilter.selectedKeys;
				aSelectedKeys.forEach(function (sKey) {
					aClassificationFilters.push(new Filter("ClassKey", FilterOperator.EQ, sKey));
				});
				if (aClassificationFilters.length > 0) {
					aFilters.push(new Filter({
						filters: aClassificationFilters,
						and: false
					}));
				}
			}

			//date
			var oCreatedAtFilter = oFilterModel.getProperty("/createdAt");
			if (oCreatedAtFilter.visibleInFB && oCreatedAtFilter.value) {
				aFilters.push(new Filter("CreatedAt", FilterOperator.EQ, oCreatedAtFilter.value));
			}

			console.log(aFilters);
		}
	});
});