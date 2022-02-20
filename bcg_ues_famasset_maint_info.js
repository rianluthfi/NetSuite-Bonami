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
		// var newRecord = context.newRecord;

		// if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.EDIT){
			// var maintInfo = '';
			// var ID = newRecord.getText('name');
			// var name = newRecord.getText('altname');
			// var statusInspection = newRecord.getText('custrecord_bcg_status_inspection');
			// var lastInspection = newRecord.getText('custrecord_assetmaintlastdate');
			// var inspectionInterval = newRecord.getValue('custrecord_assetmaintinspinterval');
			// var nextInspection = newRecord.getText('custrecord_assetmaintnextdate');
			// var warrantyStart = newRecord.getText('custrecord_assetmaintwarrantystart');
			// var warrantyPeriod = newRecord.getValue('custrecord_assetmaintwarrantyperiod');
			// var warrantyEnd = newRecord.getText('custrecord_assetmaintwarrantyend');
			
			// var mRecord = record.load({
				// type: 'customrecord_ncfar_asset', 
				// id: newRecord.id,
				// isDynamic: true,
			// });
			
			// maintInfo = 'Asset Name : '+ID+' '+name+'; '+
						// 'Status Inspection : '+statusInspection+'; '+
						// 'Last Inspection : '+lastInspection+'; '+
						// 'Inspection Interval : '+inspectionInterval+'; '+
						// 'Next Inspection : '+nextInspection+'; '+
						// 'Warranty Start Date : '+warrantyStart+'; '+
						// 'Warranty Period : '+warrantyPeriod+'; '+
						// 'Warranty End Date : '+warrantyEnd+'; ';
			
			// if (statusInspection != ''){
				// maintInfo += 'Status Inspection : '+statusInspection+'; ';
			// }
			// if (lastInspection != ''){
				// maintInfo += 'Last Inspection : '+lastInspection+'; ';
			// }
			// if (inspectionInterval != ''){
				// maintInfo += 'Inspection Interval : '+inspectionInterval+'; ';
			// }
			// if (nextInspection != ''){
				// maintInfo += 'Next Inspection : '+nextInspection+'; ';
			// }
			// if (warrantyStart != ''){
				// maintInfo += 'Warranty Start Date : '+warrantyStart+'; ';
			// }
			// if (warrantyPeriod != ''){
				// maintInfo += 'Warranty Period : '+warrantyPeriod+'; ';
			// }
			// if (warrantyEnd != ''){
				// maintInfo += 'Warranty End Date : '+warrantyEnd+'; ';
			// }
			
			// mRecord.setValue('custrecord_bcg_asset_maint_information', maintInfo);
			// mRecord.save();
		// }
    }

    return {
        // beforeLoad: beforeLoad,
        // beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    };
    
});
