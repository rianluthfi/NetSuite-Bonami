/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */

define(['N/record', 'N/ui/serverWidget', 'N/runtime', 'N/search'],

function(record, serverWidget, runtime, search) {
   
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

		if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.EDIT){
			var mRecord = record.load({
				type : record.Type.PURCHASE_ORDER,
				id : context.newRecord.id,
				isDynamic : true
			});
			
			var numLines = mRecord.getLineCount({
				sublistId: 'item'
			});
			
			for (var i = 0; i < numLines; i++){
				mRecord.selectLine({
					sublistId : 'item',
					line : i
				});
				
				var quantity = mRecord.getCurrentSublistValue({
					sublistId : 'item',
					fieldId : 'quantity'
				});
				
				log.debug('quantity '+quantity);
				
				if (quantity != ''){
					log.debug('expectedReceiptDate kosong pada '+newRecord.id);
					mRecord.setCurrentSublistValue({
						sublistId : 'item',
						fieldId : 'custcol_bcg_quantity_order',
						value : quantity
					});
					mRecord.commitLine({
						 sublistId:'item'
					});
				}
			}
			mRecord.save();
		}
	}

    return {
        // beforeLoad: beforeLoad,
        // beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    };
    
});
