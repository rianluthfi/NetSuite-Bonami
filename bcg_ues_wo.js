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
		var rec = context.newRecord;
		
		var dateWO			= rec.getValue('custrecord_bcg_date_wo');
		var assemblyWO		= rec.getValue('custrecord_bcg_assembly_wo');
		var subsidiaryWO 	= rec.getValue('custrecord_bcg_subsidiary_wo');
		var quantityWO 		= rec.getValue('custrecord_bcg_quantity_wo');
		var statusWO 		= rec.getValue('custrecord_bcg_status_wo');
		var locationWO 		= rec.getValue('custrecord_bcg_location_wo');
		var memoWO 			= rec.getValue('custrecord_bcg_memo_wo');
		
		// log.debug(orderWO+assemblyWO+subsidiaryWO+quantityWO+statusWO);
		
		if (context.type == context.UserEventType.CREATE){
				
			var netSuiteWO = record.create({
				type : record.Type.WORK_ORDER,
				isDynamic : true
			});
			
			netSuiteWO.setText({
				fieldId		: 'subsidiary',
				text		: subsidiaryWO
			});
			
			netSuiteWO.setValue({
				fieldId		: 'trandate',
				value		: dateWO
			});
			
			netSuiteWO.setText({
				fieldId		: 'assemblyitem',
				text		: assemblyWO
			});
			
			netSuiteWO.setValue({
				fieldId		: 'quantity',
				value		: quantityWO
			});
			
			netSuiteWO.setText({
				fieldId		: 'orderstatus',
				text		: statusWO
			});
			
			netSuiteWO.setText({
				fieldId		: 'location',
				text		: locationWO
			});
			
			netSuiteWO.setText({
				fieldId		: 'memo',
				text		: memoWO
			});
			
			netSuiteWO.selectLine({
				sublistId : 'item',
				line : 0
			});
			
			netSuiteWO.cancelLine({
				sublistId : 'item'
			});
			
			netSuiteWO.save();
		}
    }
	
    return {
        // beforeLoad: beforeLoad,
        // beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    };
    
});
