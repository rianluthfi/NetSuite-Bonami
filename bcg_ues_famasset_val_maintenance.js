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
		
		var warrantyPeriod = newRecord.getValue({
			fieldId : 'custrecord_assetmaintwarrantyperiod'
		});
		var warrantyStart = newRecord.getValue({
			fieldId : 'custrecord_assetmaintwarrantystart'
		});
		
		if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.EDIT){
			if (warrantyPeriod === '' || warrantyStart === ''){
				log.debug('No Period here and No Waaranty info start');
			}
			if (warrantyPeriod !== '' && warrantyStart !== ''){
				
				log.debug('Warranty Start on '+warrantyStart+' with period '+warrantyPeriod);
				
				var warrantyEnd = addMonths(warrantyStart, warrantyPeriod);
				
				var idAsset = context.newRecord.id;
				
				var objRecord = record.load({
					type: 'customrecord_ncfar_asset', 
					id: idAsset,
					isDynamic: true,
				});
				objRecord.setValue({
					fieldId : 'custrecord_assetmaintwarrantyend',
					value : warrantyEnd
				});
				objRecord.save();
				
				log.debug('end warranty : '+warrantyEnd);
				
				log.debug('Warranty Start in +'+warrantyStart+' then Interval for '+warrantyPeriod+'month, so End Warranty will on '+warrantyEnd);
			}
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
