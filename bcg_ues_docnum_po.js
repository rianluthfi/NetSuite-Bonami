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
		
		var totalLine = newRecord.getLineCount('item');
		var vendor = newRecord.getValue('entity');

		if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.EDIT){
			var recordPO = record.load({
				type : record.Type.PURCHASE_ORDER,
				id : newRecord.id,
				isDynamic : true
			});
			
			var location = newRecord.getValue('location');
			
			if (location == ''){
				log.debug('Location Kosong !');
				var location = validationContract(recordPO, totalLine);
				log.debug('Location from PR '+location);
			}
			
			var docNum = setPrefix(recordPO, location);
			log.debug ('docNum '+docNum);
			recordPO.setValue('location', location);
			recordPO.setValue('tranid', docNum);
			
			// if (location != ''){
				// log.debug('Location Tidak Kosong ! '+location);
				// var docNum = setPrefix(recordPO, location);
				// recordPO.setValue('tranid', docNum);
			// }
			// // saat location kosong
			// else{
				// log.debug('Location Kosong !');
				// var recLocation = validationContract(recordPO, totalLine);
				// recordPO.setValue('location', recLocation);
				
				// var docNum = setPrefix(recordPO, recLocation);
				// recordPO.setValue('tranid', docNum);
				
			// }
			
			// var docNum = setPrefix(recordPO, location);
			// recordPO.setValue('tranid', docNum);
			
			// if(location == ''){
				// log.debug('Location Kosong !'+docNum);
			// }
			
			recordPO.save();
		}
    }
	
	function nameVendor(idVendor){
		var mRecord = record.load({
			type: record.Type.VENDOR, 
			id: idVendor,
			isDynamic: true,
		});
		
		var vendor_name = mRecord.getValue('companyname');
		log.debug('vendor_name '+vendor_name);
	}
	
	function setPrefix(recordPO, location){
			
		var tranId = recordPO.getValue({
			fieldId : 'tranid'
		});
		
		var tranDate = recordPO.getValue({
			fieldId : 'trandate'
		});
		
		var DD = tranDate.getDate();
		var MM = ('0' + (tranDate.getMonth() + 1)).slice(-2);
		var YYYY = tranDate.getFullYear();
		var YY = YYYY.toString().substr(-2);
		
		var sliceTranId = tranId.slice(-5);
		
		var tranPrefix = getPrefixLocation(location);
		
		var docValue = '';
		
		if (tranPrefix == ''){
			docValue = 'PO/'+'XXX'+'/'+DD+MM+YY+'/'+sliceTranId;
			log.debug('Prefix nya kosong !');
		}else{
			docValue = 'PO/'+tranPrefix+'/'+DD+MM+YY+'/'+sliceTranId;
		}
		
		log.debug('created docNum '+docValue);
		
		return docValue;
	}
	
	function getPrefixLocation(location){
		var masterLocation = record.load({
			type: record.Type.LOCATION, 
			id: location,
			isDynamic: true,
		});
		
		var tranPrefix = masterLocation.getValue('tranprefix');
		log.debug('tranPrefix '+tranPrefix);
		
		return tranPrefix;
	}
	
	function validationContract(recordPO, totalLine){		
		var purchaseContract = recordPO.getValue('purchasecontract');
		if (purchaseContract != ''){
			log.debug('purchaseContract '+ purchaseContract);
			
			if (totalLine > 0){
				log.debug('Total Line : '+totalLine);
				var linkOrder = recordPO.getSublistValue({
					sublistId : 'item',
					fieldId : 'linkedorder',
					line : 0
				});
				var temp_link = linkOrder[0];
				log.debug('temp_link '+temp_link);
				if (linkOrder != ''){
					log.debug({
						title : 'Link Order',
						details : linkOrder
					});
					var recLocation = getLocationRequisition(temp_link);
					log.debug('recLocation (val Contract) '+recLocation);
					return recLocation;
				}else{
					log.debug('Link Order Kosong ! (Return Null Location)');
					var recLocation = '';
					return recLocation;
				}
			}
		}
	}
	
	function getLocationRequisition(idLoc){
		log.debug('idLoc '+idLoc);
		var mRecord = record.load({
			type: record.Type.PURCHASE_REQUISITION, 
			id: idLoc,
			isDynamic: true,
		});
		
		var location = mRecord.getValue('location');
		log.debug('reclocation (getLocation) '+location);
		
		return location;
	}

    return {
        // beforeLoad: beforeLoad,
        // beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    };
    
});
