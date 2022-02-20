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
		var sublistName = context.sublistId;
		var fieldName = context.fieldId;
		
		var idTransaction = newRecord.getValue('createdfrom');
		
		var typeTransaction = getTransactionType(idTransaction);
		
		log.debug('Created : '+getTransactionType(idTransaction));
		
		if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.EDIT){
			if(typeTransaction == 'TrnfrOrd'){
				log.debug('Ini Transfer Order');
				var objRecord = record.load({
					type: record.Type.TRANSFER_ORDER, 
					id: idTransaction,
					isDynamic: true,
				});
				
				var subsidiaryTransaction = objRecord.getValue('subsidiary');
				
				log.debug('subdidiary nya : '+subsidiaryTransaction);
				
				var objRecordIF = record.load({
					type: record.Type.ITEM_FULFILLMENT, 
					id: newRecord.id,
					isDynamic: true,
				});
				objRecordIF.setValue('custbody_bcg_subsidiary_if', subsidiaryTransaction);
				objRecordIF.save();
			}
			if(typeTransaction == 'SalesOrd'){
				log.debug('Ini Sales Order');
				var objRecord = record.load({
					type: record.Type.SALES_ORDER, 
					id: idTransaction,
					isDynamic: true,
				});
				
				var subsidiaryTransaction = objRecord.getValue('subsidiary');
				
				log.debug('subdidiary nya : '+subsidiaryTransaction);
				
				var objRecordIF = record.load({
					type: record.Type.ITEM_FULFILLMENT, 
					id: newRecord.id,
					isDynamic: true,
				});
				objRecordIF.setValue('custbody_bcg_subsidiary_if', subsidiaryTransaction);
				objRecordIF.save();
			}
			
		}
    }

    return {
        // beforeLoad: beforeLoad,
        // beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    };
	
	function getTransactionType(recordId) {
		var recTypeLookup = search.lookupFields({
			type: search.Type.TRANSACTION,
			id: recordId,
			columns: 'type'
		});
		return recTypeLookup['type'][0].value;
	}
    
});
