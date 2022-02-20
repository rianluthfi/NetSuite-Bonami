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
		
		var name 		= rec.getValue('custrecord_name');
		var line		= rec.getValue('custrecord_line');
		var unitName 	= rec.getValue('custrecord_unit_name');
		var unitNames 	= rec.getValue('custrecord_unit_name_plural');
		var abbrName 	= rec.getValue('custrecord_abbr_name');
		var abbrNames 	= rec.getValue('custrecord_abbr_name_plural');
		var rate 		= rec.getValue('custrecord_rate');
		var isBaseUnit 	= rec.getValue('custrecord_is_base_unit');
		var internalIDUoM=rec.getValue('custrecord_internaliduom');

		log.debug(internalIDUoM+';'+name+';'+line+';'+unitName+';'+unitNames+';'+abbrName+';'+abbrNames+';'+rate+';'+isBaseUnit);
		
		if (internalIDUoM !== ''){
			
			log.debug('Update UoM Parent ID : '+internalIDUoM);
			
			var netSuiteUOM = record.load({
				type: 'unitstype',
				id: internalIDUoM,
				isDynamic: false                       
			});
			
			netSuiteUOM.setSublistValue({
				sublistId	: 'uom',
				fieldId		: 'unitname',
				line		: line,
				value		: unitName
			});
			netSuiteUOM.setSublistValue({
				sublistId	: 'uom',
				fieldId		: 'pluralname',
				line		: line,
				value		: unitNames
			});
			netSuiteUOM.setSublistValue({
				sublistId	: 'uom',
				fieldId		: 'abbreviation',
				line		: line,
				value		: abbrName
			});
			netSuiteUOM.setSublistValue({
				sublistId	: 'uom',
				fieldId		: 'pluralabbreviation',
				line		: line,
				value		: abbrNames
			});
			netSuiteUOM.setSublistValue({
				sublistId	: 'uom',
				fieldId		: 'conversionrate',
				line		: line,
				value		: rate
			});
			netSuiteUOM.setSublistValue({
				sublistId	: 'uom',
				fieldId		: 'baseunit',
				line		: line,
				value		: isBaseUnit
			});
			netSuiteUOM.save();
		}
		else{
			log.debug('Meninput Master UOM : '+name);
			
			if (context.type == context.UserEventType.CREATE){
				
				var netSuiteUOM = record.create({
					type : 'unitstype',
					isDynamic : false
				});
				
				netSuiteUOM.setValue({
					fieldId		: 'name',
					value		: name
				});
				
				netSuiteUOM.setSublistValue({
					sublistId	: 'uom',
					fieldId		: 'unitname',
					line		: line,
					value		: unitName
				});
				netSuiteUOM.setSublistValue({
					sublistId	: 'uom',
					fieldId		: 'pluralname',
					line		: line,
					value		: unitNames
				});
				netSuiteUOM.setSublistValue({
					sublistId	: 'uom',
					fieldId		: 'abbreviation',
					line		: line,
					value		: abbrName
				});
				netSuiteUOM.setSublistValue({
					sublistId	: 'uom',
					fieldId		: 'pluralabbreviation',
					line		: line,
					value		: abbrNames
				});
				netSuiteUOM.setSublistValue({
					sublistId	: 'uom',
					fieldId		: 'conversionrate',
					line		: line,
					value		: rate
				});
				netSuiteUOM.setSublistValue({
					sublistId	: 'uom',
					fieldId		: 'baseunit',
					line		: line,
					value		: isBaseUnit
				});
				netSuiteUOM.save();
			}
			else{
				
			}
		}
		
		/*
		if (context.type == context.UserEventType.CREATE){
			var netSuiteUOM = record.create.promise({
				type : 'unitstype',
				isDynamic : false
			});
			
			var i = line;
			netSuiteUOM.then(function(objRecord){
				objRecord.setValue({
					fieldId		: 'name',
					value		: name
				});
				objRecord.setSublistValue({
					sublistId	: 'uom',
					fieldId		: 'unitname',
					line		: line,
					value		: unitName
				});
				objRecord.setSublistValue({
					sublistId	: 'uom',
					fieldId		: 'pluralname',
					line		: i,
					value		: unitNames
				});
				objRecord.setSublistValue({
					sublistId	: 'uom',
					fieldId		: 'abbreviation',
					line		: i,
					value		: abbrName
				});
				objRecord.setSublistValue({
					sublistId	: 'uom',
					fieldId		: 'pluralabbreviation',
					line		: i,
					value		: abbrNames
				});
				objRecord.setSublistValue({
					sublistId	: 'uom',
					fieldId		: 'conversionrate',
					line		: i,
					value		: rate
				});
				objRecord.setSublistValue({
					sublistId	: 'uom',
					fieldId		: 'baseunit',
					line		: i,
					value		: isBaseUnit
				});
				
				var recordId = objRecord.save();
			});
		}
		else{
			
		}
		
		*/
		
		
		
		// ==========================================================//
		// CHECK POINT 1//
		// ==========================================================//
		/*
		if (context.type == context.UserEventType.CREATE){
			var netSuiteUOM = record.create({
				type : 'unitstype',
				isDynamic : false
			});
			netSuiteUOM.setValue({
				fieldId		: 'name',
				value		: name
			});
			var i = line;
			
			netSuiteUOM.setSublistValue({
				sublistId	: 'uom',
				fieldId		: 'unitname',
				line		: i,
				value		: unitName
			});
			netSuiteUOM.setSublistValue({
				sublistId	: 'uom',
				fieldId		: 'pluralname',
				line		: i,
				value		: unitNames
			});
			netSuiteUOM.setSublistValue({
				sublistId	: 'uom',
				fieldId		: 'abbreviation',
				line		: i,
				value		: abbrName
			});
			netSuiteUOM.setSublistValue({
				sublistId	: 'uom',
				fieldId		: 'pluralabbreviation',
				line		: i,
				value		: abbrNames
			});
			netSuiteUOM.setSublistValue({
				sublistId	: 'uom',
				fieldId		: 'conversionrate',
				line		: i,
				value		: rate
			});
			netSuiteUOM.setSublistValue({
				sublistId	: 'uom',
				fieldId		: 'baseunit',
				line		: i,
				value		: isBaseUnit
			});
			netSuiteUOM.save();
			
			// ==========================================================//
			// END CHECK POINT 1//
			// ==========================================================//
			*/
			
			/*
			for (var i = 0; i < numLines; i++){
				log.debug('ritasi ke : '+i);
				netSuiteUOM.setSublistValue({
					sublistId	: 'uom',
					fieldId		: 'unitname',
					line		: i,
					value		: unitName
				});
				netSuiteUOM.setSublistValue({
					sublistId	: 'uom',
					fieldId		: 'pluralname',
					line		: i,
					value		: unitNames
				});
				netSuiteUOM.setSublistValue({
					sublistId	: 'uom',
					fieldId		: 'abbreviation',
					line		: i,
					value		: abbrName
				});
				netSuiteUOM.setSublistValue({
					sublistId	: 'uom',
					fieldId		: 'pluralabbreviation',
					line		: i,
					value		: abbrNames
				});
				netSuiteUOM.setSublistValue({
					sublistId	: 'uom',
					fieldId		: 'conversionrate',
					line		: i,
					value		: rate
				});
				netSuiteUOM.setSublistValue({
					sublistId	: 'uom',
					fieldId		: 'baseunit',
					line		: i,
					value		: isBaseUnit
				});
				netSuiteUOM.save();
			}
			netSuiteUOM.save();
			*/
		/*	
		}
		else{
			
		}
		*/
    }
	
    return {
        // beforeLoad: beforeLoad,
        // beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    };
    
});
