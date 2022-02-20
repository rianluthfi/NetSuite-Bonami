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
		objRecord.setValue('custrecord_bcg_status_inspection', 2); // 1 = Complete | 2 = On Progress
		objRecord.save();
	}
	
    return {
        // beforeLoad: beforeLoad,
        // beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    };
    
});
