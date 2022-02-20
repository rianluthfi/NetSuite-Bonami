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
		var subsidiary = newRecord.getValue('subsidiary');
		
		if (context.type === context.UserEventType.DELETE){
			return;
		}
		
		if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.EDIT){
			if (vendor != ''){
				log.debug({
					title : 'Script Last Vendor n Last Price',
					details : 'Tran ID '+getTranId(newRecord.id)+'|Entity Name '+getVendorName(vendor)+'|Subsidiary '+getSubsidiaryName(subsidiary)
				});
			}
		
			for (var i = 0; i < totalLine; i++){
				var item = newRecord.getSublistValue({
					sublistId : 'item',
					fieldId : 'item',
					line : i
				});
				var rate = newRecord.getSublistValue({
					sublistId : 'item',
					fieldId : 'rate',
					line : i
				});
				
				var fieldLookUp = search.lookupFields({
					type: search.Type.ITEM,
					id: item, //pass the id of the item here
					columns: 'type'
				});
				
				var currType = fieldLookUp.type[0].value;

				log.debug({
					title : 'Info Item ke-'+i,
					details : 'item '+item+' | rate '+rate+' | currType '+currType
				});
				
				if (currType == 'InvtPart' && vendor != ''){
					log.debug('Inventory Item');
					var masterItem = record.load({
						type: record.Type.INVENTORY_ITEM, 
						id: item,
						isDynamic: true,
					});
					
					var countVendor = masterItem.getLineCount({
						sublistId : 'itemvendor'
					});
					
					var tempVendor = '';
					var tempVendorIndex = 0;
					var tempPreferred = false;
					
					if (countVendor > 0){
						log.debug('Ada Vendor Sebelumnya ! Total ada '+countVendor+' Vendor');
						for (var j = 0; j < countVendor; j++){
							var vendorItem = masterItem.getSublistValue({
								sublistId : 'itemvendor',
								fieldId : 'vendor',
								line : j
							});
							var subsidiaryItem = masterItem.getSublistValue({
								sublistId : 'itemvendor',
								fieldId : 'subsidiary',
								line : j
							});
							var preferred = masterItem.getSublistValue({
								sublistId : 'itemvendor',
								fieldId : 'preferredvendor',
								line : j
							});
							
							log.debug({
								title : 'Info Vendor Item',
								details : 'Vendor item ke-'+j+' : '+getVendorName(vendorItem)+'|subsidiary : '+getSubsidiaryName(subsidiaryItem)+'|status preferred '+preferred
							});
							
							if ((vendor == vendorItem) && (subsidiary == subsidiaryItem)){
								log.debug('Cocok Vendor dan Subsidiary nya !');
								tempVendor = vendorItem;
								tempVendorIndex = j;
								tempPreferred = preferred;
								log.debug({
									title : 'Vendor sama & Subsidiary Cocok !',
									details : 'Vendor Transaksi : '+getVendorName(vendor)+' | Vendor Item : '+getVendorName(tempVendor)+' | Index : '+j+' | Status : '+tempPreferred
								});
							}
						}
						
						if (tempVendor != ''){
							log.debug({
								title : 'Vendor Ada di List !',
								details : 'Akan di preferred Index : '+tempVendorIndex+' | Vendor Item : '+getVendorName(tempVendor)
							});
							masterItem.selectLine({
								sublistId : 'itemvendor',
								line : tempVendorIndex
							});
							
							if (rate > 0){
								masterItem.setCurrentSublistValue({
									sublistId : 'itemvendor',
									fieldId : 'purchaseprice',
									value : rate
								});
							}
							
							if (!tempPreferred){
								masterItem.setCurrentSublistValue({
									sublistId : 'itemvendor',
									fieldId : 'preferredvendor',
									value : true
								});
							}
							masterItem.commitLine({
								sublistId : 'itemvendor'
							});
							masterItem.save();
						}else{
							log.debug({
								title : 'Vendor Baru ! pada item ',
								details : 'Vendor : '+getVendorName(vendor)+' | Purchase Price : '+rate
							})
							masterItem.selectNewLine({
								sublistId : 'itemvendor'
							});
							masterItem.setCurrentSublistValue({
								sublistId : 'itemvendor',
								fieldId : 'vendor',
								value : vendor
							});
							masterItem.setCurrentSublistValue({
								sublistId : 'itemvendor',
								fieldId : 'subsidiary',
								value : subsidiary
							});
							masterItem.setCurrentSublistValue({
								sublistId : 'itemvendor',
								fieldId : 'purchaseprice',
								value : rate
							});
							masterItem.setCurrentSublistValue({
								sublistId : 'itemvendor',
								fieldId : 'preferredvendor',
								value : true
							});
							masterItem.commitLine({
								sublistId : 'itemvendor'
							});
							masterItem.save();
						}
					}else{
						log.debug({
							title : 'Tidak ada History Vendor !',
							details : 'Vendor : '+getVendorName(vendor)+' | Purchase Price : '+rate
						})
						masterItem.selectNewLine({
							sublistId : 'itemvendor'
						});
						masterItem.setCurrentSublistValue({
							sublistId : 'itemvendor',
							fieldId : 'vendor',
							value : vendor
						});
						masterItem.setCurrentSublistValue({
							sublistId : 'itemvendor',
							fieldId : 'purchaseprice',
							value : rate
						});
						masterItem.setCurrentSublistValue({
							sublistId : 'itemvendor',
							fieldId : 'preferredvendor',
							value : true
						});
						masterItem.commitLine({
							sublistId : 'itemvendor'
						});
						masterItem.save();
					}
				}
			}
			var trandId = newRecord.getValue('tranid');
			var id = newRecord.id;
			log.debug({
				title : 'PO Record',
				details : 'id '+id+'; trandId '+trandId
			});
		}
    }
	
	function getVendorName(id){
		var vRecord = record.load({
			type: record.Type.VENDOR, 
			id: id,
			isDynamic: true,
		});
		var tempName = vRecord.getValue('entityid');
		return tempName;
	}
	
	function getSubsidiaryName(id){
		var vRecord = record.load({
			type: record.Type.SUBSIDIARY, 
			id: id,
			isDynamic: true,
		});
		var tempName = vRecord.getValue('name');
		return tempName;
	}
	
	function getTranId(id){
		var vRecord = record.load({
			type: record.Type.PURCHASE_ORDER, 
			id: id,
			isDynamic: true,
		});
		var tempName = vRecord.getValue('tranid');
		return tempName;
	}

    return {
        // beforeLoad: beforeLoad,
        // beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    };
    
});
