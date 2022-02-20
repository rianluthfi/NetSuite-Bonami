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
		var curRec = context.newRecord;
		
		var relatedIR = curRec.getValue('custbody_bcg_related_item_receipt');
		
		if (relatedIR.length > 0){
			var mRecordBill = record.load({
				type: record.Type.VENDOR_BILL, 
				id: curRec.id,
				isDynamic: true,
			});
			var mRecordIR = record.load({
				type: record.Type.ITEM_RECEIPT, 
				id: relatedIR[0],
				isDynamic: true,
			});
			
			var nameIR = mRecordIR.getText('tranid');
			
			if (relatedIR.length == 1){
				mRecordBill.setValue('tranid', nameIR);
				mRecordBill.save();
			}
			else if (relatedIR.length > 1){
				mRecordBill.setValue('tranid', (nameIR+' & Others'));
				mRecordBill.save();
			}
			
			for (var i = 0; i < relatedIR.length; i++){
				var idIR = relatedIR[i];
				
				var mRecord = record.load({
					type: record.Type.ITEM_RECEIPT, 
					id: idIR,
					isDynamic: true,
				});
				
				mRecord.setValue('custbody_bcg_related_transaction', curRec.id);
				mRecord.save();
			}
		}
		
		
    }
	
    return {
        // beforeLoad: beforeLoad,
        // beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    };
    
});