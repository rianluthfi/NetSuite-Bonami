/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */

define(['N/record', 'N/ui/serverWidget', 'N/runtime', 'N/search', 'N/error'],

function(record, serverWidget, runtime, search, error) {
   
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
		// log.debug('beforeSubmit');
		
		var newRecord = context.newRecord;
		
		var recType = newRecord.type;
		
		log.debug('recType '+recType);
		
		if (recType == 'salesorder' || recType == 'invoice' || recType == 'purchaseorder'){
			var location = newRecord.getValue('location');
			checkLocationUse(location);
		}
		
		if (recType == 'inventoryadjustment'){
			var adjLocation = newRecord.getValue('adjlocation');
			if (adjLocation != ''){
				checkLocationUse(adjLocation);
			}
			
			var numLines = newRecord.getLineCount({
				sublistId: 'inventory'
			});
			
			log.debug('numLines Adj '+numLines);
			
			// for (var i = 0; i < numLines; i++){
				// var lineLocation = newRecord.getSublistValue({
					// sublistId: 'inventory',
					// fieldId: 'location',
					// line: i
				// });
				
				// checkLocationUse(lineLocation);
			// }
		}
		
		if (recType == 'inventorytransfer' || recType == 'transferorder'){
			var fromLocation = newRecord.getValue('location');
			var toLocation = newRecord.getValue('transferlocation');
			
			checkLocationUse(fromLocation);
			checkLocationUse(toLocation);
		}
		
		if (recType == 'itemreceipt'){
			var numLines = newRecord.getLineCount({
				sublistId: 'item'
			});
			
			for (var i = 0; i < numLines; i++){
				var lineLocation = newRecord.getSublistValue({
					sublistId: 'item',
					fieldId: 'location',
					line: i
				});
				
				checkLocationUse(lineLocation);
			}
		}
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
		
    }
	
	function checkLocationUse(location){
		masterLocation = record.load({
			type: record.Type.LOCATION,
			id: location,
			isDynamic: true
		});
		
		var dontUseLocation = masterLocation.getValue('custrecord_bcg_lock_loc_intrans');
		var locationName = masterLocation.getValue('name');
		
		if (dontUseLocation){
			var locError = error.create({
				name: 'Dont Use This Location',
				message: 'Location '+locationName+' can not use because it is not for store Inventory, Ask Administrator for futher action',
				notifyOff: false
			});
			
			throw locError;
		}
	}
	
    return {
        // beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit,
        // afterSubmit: afterSubmit
    };
    
});