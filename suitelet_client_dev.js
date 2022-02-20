/**
 * @NApiVersion 2.0
 * @NScriptType ClientScript
 * @NModuleScope Public
 */
 
define(['N/search', 'N/currentRecord'], function(search,currentRecord) {
    var record = currentRecord.get();
 
    function fieldChanged(context) {
      if(context.fieldId == 'custpage_account') {
        var account = record.getValue('custpage_account');
		alert('account '+account);
		return account;
		
		// if (account == ''){
			// alert('Tidak ada Account yang terpilih !');
		// }
		// else if (account != ''){
			// alert('ID Account : '+account);
			
			
			// var data = findTransaction();
			
			// var dataLength = data.length;
			// alert('dataLength : '+dataLength);
			
			// var numLines = record.getLineCount({
				// sublistId: 'custpage_table'
			// });
			
			// alert('numLines '+numLines);
			
			// return renderList(record, translate(findTransaction()));
			
				
			// if (data.length != 0){
				// for (var i in data){
					// var id = data[i].id;
					// var trandate = data[i].getValue('trandate');
					
					// alert('id : '+id+' | trandate : '+trandate);
				// }
			// }
		}
 
        // if(location == '') return;
         
        // var vendorSearch = search.create({
          // type: 'vendor',
          // filters: [['custentity_location','is',location]],
          // columns: ['entityid']
        // });
 
        // var vendorSearchResults = vendorSearch.run().getRange({ start: 0, end: 1000 });
 
        // var vendfield = record.getField('custpage_vendor');
        // vendfield.removeSelectOption({value : null});
        // if(vendorSearchResults.length != 0) {
          // for(var i in vendorSearchResults) {
            // vendfield.insertSelectOption({
                // value : vendorSearchResults[i].id,
                // text : vendorSearchResults[i].getValue('entityid')
            // });
          // }
        // }
      // }
    }
	
	function renderList(record, results){
		// var sublist = record.getSublistField({
			// sublistId : 'custpage_table'
		// });
		for (var i = 0; i < results.length; i++){
			alert('loop on '+i);
			record.selectLine({
				sublistId: 'custpage_table',
				line: i
			});
			
			record.setCurrentSublistValue({
				sublistId: 'custpage_table',
				fieldId: 'custpage_trandate',
				value: results[i].date,
				ignoreFieldChange: true
			});
			// sublist.setSublistValue({
				// id : 'custpage_view',
				// line : i,
				// value : '/app/accounting/transactions/vendpymt.nl?id='+results[i].internalid+'&whence='
			// });
			// sublist.setSublistValue({
				// id : 'custpage_trandate',
				// line : i,
				// value : results[i].date
			// });
			// sublist.setSublistValue({
				// id : 'custpage_internal_id',
				// line : i,
				// value : results[i].internalid
			// });
			// sublist.setSublistValue({
				// id : 'custpage_rec_id',
				// line : i,
				// value : results[i].tranid
			// });
			// sublist.setSublistValue({
				// id : 'custpage_entity',
				// line : i,
				// value : results[i].entity
			// });
			// sublist.setSublistValue({
				// id : 'custpage_subsidiary',
				// line : i,
				// value : results[i].subsidiary
			// });
		}
	}
	
	function translate(results){
		return results.map(resultToObject);
	}
	
	function resultToObject(result){
		return{
			date : result.getValue({name:'trandate'}),
			tranid : result.getValue({name:'tranid'}),
			// transtype : result.getText({name:'cseg1'}),
			memo : result.getValue({name:'memo'}),
			entity : result.getText({name:'entity'}),
			subsidiary : result.getText({name:'subsidiary'}),
			account : result.getText({name:'account'}),
			total : result.getValue({name:'amount'}),
			approvalstatus : result.getText({name:'approvalstatus'}),
			internalid : result.id
		};
	}
	
	function findTransaction(){
		var mySearch = search.load({
			id: 'customsearch201'
		});
		
		var data = mySearch.run().getRange({start:0, end:3});
		
		return data;
	}
 
    return { fieldChanged : fieldChanged };
 
});