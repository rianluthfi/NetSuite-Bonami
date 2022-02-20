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
		
		var entity = newRecord.getValue('entity');
		
		var numLines = newRecord.getLineCount({
			sublistId: 'item'
		});
		
		if (context.type === context.UserEventType.CREATE){
			// ID Customer Internal Maintenance (Asset) - Production : 1123
			// ID Customer Internal Maintenance (Asset) - Sandbox	 : 1058
			if (entity == 1123 && numLines > 0){
				for (var i = 0; i < numLines; i++){
					var item = newRecord.getSublistValue({
						sublistId: 'item',
						fieldId: 'item',
						line: i
					});
					var relatedAsset = newRecord.getSublistValue({
						sublistId: 'item',
						fieldId: 'custcol_far_trn_relatedasset',
						line: i
					});
					
					// Internal ID	ID Production	Name (Non Inventory Item)
					// 2844			2945			FAS005 Service Bangunan
					// 2845			2946			FAS006 Service Kendaraan
					// 2846			2947			FAS007 Service Mesin & Peralatan
					// 2847			2948			FAS008 Service Inventaris
					
					if (relatedAsset != '' && (item == 2945 || item == 2946 || item == 2947 || item == 2948)){
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
