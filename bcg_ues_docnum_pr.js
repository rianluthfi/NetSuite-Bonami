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
		
		var totalLine = newRecord.getLineCount('item');
		var vendor = newRecord.getValue('entity');
		
		if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.EDIT){
			var purchaseOrder = record.load({
				type : record.Type.PURCHASE_REQUISITION,
				id : context.newRecord.id,
				isDynamic : true
			});
				
			var tranId = purchaseOrder.getValue({
				fieldId : 'tranid'
			});
			
			log.debug('nilai Trand Id : '+tranId);
			
			var tranDate = purchaseOrder.getValue({
				fieldId : 'trandate'
			});
			
			var DD = tranDate.getDate();
			var MM = ('0' + (tranDate.getMonth() + 1)).slice(-2);
			var YYYY = tranDate.getFullYear();
			var YY = YYYY.toString().substr(-2);	
			
			log.debug(tranId + ' '+tranDate);
			
			var location = newRecord.getValue('location');
			
			var masterLocation = record.load({
				type: record.Type.LOCATION, 
				id: location,
				isDynamic: true,
			});
			
			var tranPrefix = masterLocation.getValue('tranprefix');
			
			if (tranPrefix == ''){
				purchaseOrder.setValue({
					fieldId : 'tranid',
					value : 'PR/'+'XXX'+'/'+DD+MM+YY+'/'+tranId.slice(-5)
				});
				
				purchaseOrder.save();
			}else{
				purchaseOrder.setValue({
					fieldId : 'tranid',
					value : 'PR/'+tranPrefix+'/'+DD+MM+YY+'/'+tranId.slice(-5)
				});
				
				purchaseOrder.save();
			}
		}
    }

    return {
        // beforeLoad: beforeLoad,
        // beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    };
    
});
