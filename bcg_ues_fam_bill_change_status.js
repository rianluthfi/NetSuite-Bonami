/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */

define(['N/record', 'N/ui/serverWidget', 'N/runtime'],

function(record, serverWidget, runtime) {
   
    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {string} scriptContext.type - Trigger type
     * @param {Form} scriptContext.form - Current form
     * @Since 2015.2
     */
    function beforeLoad(context) {

    }

    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
    function beforeSubmit(context) {
		
    }

    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
    function afterSubmit(context) {
		var newRecord = context.newRecord;
		
		var transType = newRecord.getValue('cseg1');
		var tranDate = newRecord.getValue('trandate');
		
		var numLines = newRecord.getLineCount({
			sublistId: 'item'
		});
		
		if (context.type === context.UserEventType.CREATE){
			if (transType == 4 && numLines > 0){
				for (var i = 0; i < numLines; i++){
					var relatedAsset = newRecord.getSublistValue({
						sublistId: 'item',
						fieldId: 'custcol_far_trn_relatedasset',
						line: i
					});
					if (relatedAsset != ''){
						changeStatusInspection(relatedAsset);
						setLastAssetMaintenance(relatedAsset, tranDate);
						setLastInspectionTransaction(relatedAsset, newRecord.id);
						recalculateInspectionInfo(relatedAsset);
					}
				}
			}
		}
    }
	
	function changeStatusInspection(idAsset){
		var objRecord = record.load({
			type: 'customrecord_ncfar_asset', 
			id: idAsset,
			isDynamic: true,
		});
		objRecord.setValue('custrecord_bcg_status_inspection', 1); // 1 = Complete | 2 = On Progress
		objRecord.save();
	}
	function setLastAssetMaintenance(idAsset, billDate){
		var objRecord = record.load({
			type: 'customrecord_ncfar_asset', 
			id: idAsset,
			isDynamic: true,
		});
		objRecord.setValue('custrecord_assetmaintlastdate', billDate);
		objRecord.save();
	}
	
	function setLastInspectionTransaction(idAsset, idTrans){
		var objRecord = record.load({
			type: 'customrecord_ncfar_asset', 
			id: idAsset,
			isDynamic: true,
		});
		objRecord.setValue('custrecord_bcg_inspection_transaction', idTrans);
		objRecord.save();
	}
	
	function updateMaintenanceInfo(idAsset){
		var mRecord = record.load({
			type: 'customrecord_ncfar_asset', 
			id: idAsset,
			isDynamic: true,
		});
		
		var maintInfo = '';
		var ID = mRecord.getText('name');
		var name = mRecord.getText('altname');
		var statusInspection = mRecord.getText('custrecord_bcg_status_inspection');
		var lastInspection = mRecord.getText('custrecord_assetmaintlastdate');
		var inspectionInterval = mRecord.getValue('custrecord_assetmaintinspinterval');
		var nextInspection = mRecord.getText('custrecord_assetmaintnextdate');
		var warrantyStart = mRecord.getText('custrecord_assetmaintwarrantystart');
		var warrantyPeriod = mRecord.getValue('custrecord_assetmaintwarrantyperiod');
		var warrantyEnd = mRecord.getText('custrecord_assetmaintwarrantyend');

		maintInfo = 'Asset Name : '+ID+' '+name+'; '+
					'Status Inspection : '+statusInspection+'; '+
					'Last Inspection : '+lastInspection+'; '+
					'Inspection Interval : '+inspectionInterval+'; '+
					'Next Inspection : '+nextInspection+'; '+
					'Warranty Start Date : '+warrantyStart+'; '+
					'Warranty Period : '+warrantyPeriod+'; '+
					'Warranty End Date : '+warrantyEnd+'; ';

		mRecord.setValue('custrecord_bcg_asset_maint_information', maintInfo);
		mRecord.save();
	}
	
	function recalculateInspectionInfo(idAsset){
		var mRecord = record.load({
			type: 'customrecord_ncfar_asset', 
			id: idAsset,
			isDynamic: true,
		});
		
		var inspectionInterval = mRecord.getValue('custrecord_assetmaintinspinterval');
		var inspectionLastDate = mRecord.getValue('custrecord_assetmaintlastdate');
		
		if (inspectionInterval !== '' && inspectionLastDate !== ''){
	
			var nextInspection = addMonths(inspectionLastDate, inspectionInterval);
			
			var objRecord = record.load({
				type: 'customrecord_ncfar_asset', 
				id: idAsset,
				isDynamic: true,
			});
			objRecord.setValue({
				fieldId : 'custrecord_assetmaintnextdate',
				value : nextInspection
			});
			objRecord.save();
			
			updateMaintenanceInfo(idAsset);
		}
	}
	
	function isLeapYear(year) { 
		return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)); 
	}

	function getDaysInMonth(year, month) {
		return [31, (isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
	}

	function addMonths(date, value) {
		var d = new Date(date),
			n = date.getDate();
		d.setDate(1);
		d.setMonth(d.getMonth() + value);
		d.setDate(Math.min(n, getDaysInMonth(d.getFullYear(), d.getMonth())));
		return d;
	}
	
    return {
        // beforeLoad: beforeLoad,
        // beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    };
    
});
