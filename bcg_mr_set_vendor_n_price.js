/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/error', 
        'N/record', 
        'N/runtime',
        'N/search'],
/**
 * @param {email} email
 * @param {error} error
 * @param {record} record
 * @param {runtime} runtime
 * @param {search} search
 */
function(error, record, runtime, search) 
{
   
	/**
	 * Map/Reduce Script:
	 * Sample Map/Reduce script for blog post.  
	 */
	
	
    /**
     * Marks the beginning of the Map/Reduce process and generates input data.
     *
     * @typedef {Object} ObjectRef
     * @property {number} id - Internal ID of the record instance
     * @property {string} type - Record type id
     *
     * @return {Array|Object|Search|RecordRef} inputSummary
     * @since 2015.1
     */
    function getInputData() 
    {   
		var filtersSub = runtime.getCurrentScript().getParameter({name: 'custscript_filter_subsidiary'});
		// log.debug('filters '+filtersObj);
		
		// SS link	: https://5439090.app.netsuite.com/app/common/search/searchresults.nl?searchid=407&saverun=T&whence=
		// SS Name	: MR List Item on PO (Daily)
		var searchObj = search.load({
			id: 'customsearch_bcg_mr_list_item_po_daily'
		});
		
		searchObj.filters.push(
			search.createFilter({
				name : 'subsidiary',
				operator : 'is',
				values : filtersSub
			})
		);
		
		return searchObj.run().getRange({
            start: 0,
            end: 1000
        });
    }

    /**
     * Executes when the map entry point is triggered and applies to each key/value pair.
     *
     * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
     * @since 2015.1
     */
    function map(context) 
    {
		log.debug({
			title : 'Key',
			details : context.value
		});
		
		context.write({
			key: context.value,
			value: 'data'
		});
    }
	
	function reduce(context) 
    {
		var ObjJson = JSON.parse(context.key);
		
		// log.debug('Key', ObjJson);
		
		var transID				= parseInt(ObjJson['id']);
		var docNumber			= parseInt(ObjJson['values']['tranid']);
		var vendor 				= parseInt(ObjJson['values']['vendor.internalid'][0]['value']);
		var subsidiary  		= parseInt(ObjJson['values']['subsidiary'][0]['value']);
		var item 				= parseInt(ObjJson['values']['item'][0]['value']);
		var itemText 			= parseInt(ObjJson['values']['item'][0]['text']);
		var itemUnitType		= parseInt(ObjJson['values']['item.unitstype'][0]['value']);
		var rateTransaction		= parseFloat(ObjJson['values']['formulacurrency']);
		var convTransUnit		= parseFloat(ObjJson['values']['formulanumeric']);
		var purchaseUnit		= parseInt(ObjJson['values']['item.purchaseunit'][0]['value']);
		
		log.debug('INFO Transaksi', 'TransID '+transID+' | docNumber '+docNumber);
		
		var execute 			= getItemType(item);
		
		if (execute){
			var ratePurchaseUnit	= getRatePurchasePrice(itemUnitType, convTransUnit, purchaseUnit, rateTransaction);
		
			// log.debug('Reduce Stage !', 'vendor '+vendor+' | subsidiary '+subsidiary+' | item '+item+' | itemUnitType '+itemUnitType+' | rateTransaction '+rateTransaction+' | convTransUnit '+convTransUnit+' | purchaseUnit '+purchaseUnit+' | ratePurchaseUnit '+ratePurchaseUnit);
			
			
			setLastVendorAndPrice(item, vendor, subsidiary, ratePurchaseUnit);
		}else{
			log.debug('Didnt Execute !', 'Not Inventory Item');
		}
	}
	
	function setLastVendorAndPrice(item, vendor, subsidiary, ratePurchaseUnit){
		var masterItem = record.load({
			type: record.Type.INVENTORY_ITEM, 
			id: item,
			isDynamic: true,
		});
		
		var countVendorItem = masterItem.getLineCount({
			sublistId : 'itemvendor'
		});
		
		if (countVendorItem > 0){
			// Check Current Vendor Item
			var index = checkVendorItem(masterItem, countVendorItem, vendor, subsidiary, ratePurchaseUnit);
			if (index != 0){
				// log.debug('Update Current Vendor Item');
				log.debug('Update Vendor !', 'item '+item+' |index '+index+' | vendor '+vendor+' | subsidiary '+subsidiary+' | ratePurchaseUnit '+ratePurchaseUnit);
				setVendorItem(masterItem, index, vendor, subsidiary, ratePurchaseUnit);
			}else{
				// log.debug('Check Set New Vendor ! > 0');
				log.debug('New Vendor ! With Other', 'item '+item+' |vendor '+vendor+' | subsidiary '+subsidiary+' | ratePurchaseUnit '+ratePurchaseUnit);
				setNewVendorItem(masterItem, vendor, subsidiary, ratePurchaseUnit);
			}
		}else{
			// New Vendor Item! Just Add
			log.debug('New Vendor !', 'item '+item+' |vendor '+vendor+' | subsidiary '+subsidiary+' | ratePurchaseUnit '+ratePurchaseUnit);
			setNewVendorItem(masterItem, vendor, subsidiary, ratePurchaseUnit);
		}
	}
	
	function setNewVendorItem(masterItem, vendor, subsidiary, ratePurchaseUnit){
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
			value : ratePurchaseUnit
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
	
	function setVendorItem(masterItem, index, vendor, subsidiary, ratePurchaseUnit){
		masterItem.selectLine({
			sublistId : 'itemvendor',
			line : (index-1)
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
		
		if (ratePurchaseUnit > 0){
			masterItem.setCurrentSublistValue({
				sublistId : 'itemvendor',
				fieldId : 'purchaseprice',
				value : ratePurchaseUnit
			});
		}
		
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
	
	function checkVendorItem(masterItem, countVendorItem, vendor, subsidiary, ratePurchaseUnit){
		var index = 0;
		
		// eksekusi loop Vendor
		for (var j = 0; j < countVendorItem; j++){
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
			
			if ((vendor == vendorItem) && (subsidiary == subsidiaryItem)){
				index = j+1;
				// log.debug('Cocok', 'vendor '+vendor+' | '+vendorItem+' subsidiary '+subsidiary+' | '+subsidiaryItem+' Index ke-'+index);
			}
		}
		
		return index;
	}
	
	function getItemType(item){
		var fieldLookUp = search.lookupFields({
			type: search.Type.ITEM,
			id: item, //pass the id of the item here
			columns: 'type'
		});
		
		var currType = fieldLookUp.type[0].value;
		
		if (currType == 'InvtPart'){
			return true;
		}else{
			return false;
		}
	}
	
	function getRatePurchasePrice(itemUnitType, convTransUnit, purchaseUnit, rateTransaction){
		var masterUnitsType = record.load({
			type: 'unitstype', 
			id: itemUnitType,
			isDynamic: true,
		});
		countUnitsType = masterUnitsType.getLineCount('uom');
		
		var tempConvPurchaseUnit = 0;
		
		for (var k = 0; k < countUnitsType; k++){
			tempIdUOM = masterUnitsType.getSublistValue({
				sublistId : 'uom',
				fieldId : 'internalid',
				line : k
			});
			if(tempIdUOM == purchaseUnit){
				tempConvPurchaseUnit = masterUnitsType.getSublistValue({
					sublistId : 'uom',
					fieldId : 'conversionrate',
					line : k
				});
			}
		}
		
		var ratePurchaseUnit = rateTransaction * (tempConvPurchaseUnit/convTransUnit);
		
		return ratePurchaseUnit;
	}

    /**
     * Executes when the summarize entry point is triggered and applies to the result set.
     *
     * @param {Summary} summary - Holds statistics regarding the execution of a map/reduce script
     * @since 2015.1
     */
    function summarize(summary) 
    {
		log.debug('END Map Reduce!');
    	// log.debug('Summary Time','Total Seconds: '+summary.seconds);
    	// log.debug('Summary Usage', 'Total Usage: '+summary.usage);
    	// log.debug('Summary Yields', 'Total Yields: '+summary.yields);
    	
    	// log.debug('Input Summary: ', JSON.stringify(summary.inputSummary));
    	// log.debug('Map Summary: ', JSON.stringify(summary.mapSummary));
    	// log.debug('Reduce Summary: ', JSON.stringify(summary.reduceSummary));
    	
    	// //Grab Map errors
    	// summary.mapSummary.errors.iterator().each(function(key, value) {
			// log.error(key, 'ERROR String: '+value);
			
			
			// return true;
		// });
    	
    }

    return {
        getInputData: getInputData,
        map: map,
		reduce: reduce,
        summarize: summarize
    };
    
});