 /**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(['N/currentRecord', 'N/record','N/format', 'N/search'],
    function(currentRecord, record, format, search) {
        function pageInit(context) {

        }
        function saveRecord(context) {

        }
        function validateField(context) {

        }
        function fieldChanged(context) {
			var curRec = context.currentRecord;
			var sublistName = context.sublistId;
			var sublistFieldName = context.fieldId;
			
			if (sublistName == 'item'){
				if (sublistFieldName == 'custcol_bcg_asset_type_item'){
					var assetTypeItem = curRec.getCurrentSublistValue({
						sublistId : 'item',
						fieldId : 'custcol_bcg_asset_type_item'
					});
					var transactionType = curRec.getValue('cseg1');
					if(assetTypeItem != '' && transactionType != 4){
						alert('Anda Melakukan Transaksi Fixed Asset !');
						alert('transactionType '+transactionType);
					}
				}
			}
        }
        function postSourcing(context) {
			
        }
        function lineInit(context) {

        }
        function validateDelete(context) {

        }
        function validateInsert(context) {
			
        }
        function validateLine(context) {
			var curRec = context.currentRecord;
			var sublistName = context.sublistId;
			var sublistFieldName = context.fieldId;
			
			var transactionType = curRec.getValue('cseg1');
			
			var item = curRec.getCurrentSublistValue({
				sublistId : 'item',
				fieldId : 'item'
			});
			
			var itemType = getItemType(item);
			
			var subsidiary = curRec.getValue('subsidiary');
			var subsidiaryAsset = curRec.getCurrentSublistValue({
				sublistId : 'item',
				fieldId : 'custcol_bcg_subsidiary_related_asset'
			});
			var subsidiaryAsset_text = curRec.getCurrentSublistText({
				sublistId : 'item',
				fieldId : 'custcol_bcg_subsidiary_related_asset'
			});
			
			var assetTypeItem = curRec.getCurrentSublistValue({
				sublistId : 'item',
				fieldId : 'custcol_bcg_asset_type_item'
			});
			
			var assetTypeAsset = curRec.getCurrentSublistValue({
				sublistId : 'item',
				fieldId : 'custcol_bcg_asset_type_related_asset'
			});
			
			var assetTypeAsset_text = curRec.getCurrentSublistText({
				sublistId : 'item',
				fieldId : 'custcol_bcg_asset_type_related_asset'
			});
			
			if (assetTypeItem != '' && transactionType != 4){
				alert('Anda menggunakan item untuk Fixed Asset, pastikan Transaction Type terpilih adalah Fixed Asset !');
				return false;
			}
			if (assetTypeItem == '' && transactionType == 4){
				alert('Anda tidak diperkenankan menggunakan Transaction Type Fixed Asset pada transaksi normal !, silahkan pilih Transaction Type yang sesuai !');
				return false;
			}
			
			if (assetTypeItem != '' && itemType == 'NonInvtPart'){
				alert('Beli Asset Baru');
				return true;
			}
			
			if (assetTypeItem != '' && itemType == 'InvtPart'){
				alert('Beli Item Asset');
				return true;
			}
			
			// if (assetTypeItem != ''){
				// if (subsidiaryAsset != ''){
					// if (subsidiary == subsidiaryAsset){
						// if (assetTypeItem == assetTypeAsset){
							// return true;
						// }else{
							// alert('Asset Type untuk Asset ini adalah '+assetTypeAsset_text+', pastikan Item yang digunakan untuk transaksi ini memiliki Asset Type yang sama !');
							// return false;
						// }
					// }else{
						// alert('Asset ini milik '+subsidiaryAsset_text+', pastikan subsidiary Asset sesuai dengan subsidiary Transaksi !');
						// return false;
					// }
				// }else{
					// alert('Beli Asset');
					// return true;
				// }
			// }else{
				// alert('Transaksi Normal');
				// return true;
			// }
        }
        function sublistChanged(context) {

        }
		
		function getItemType(recordId) {
			var recTypeLookup = search.lookupFields({
				type: search.Type.ITEM,
				id: recordId,
				columns: 'type'
			});
			return recTypeLookup['type'][0].value;
		}
			
        return {
            // pageInit: pageInit,
            // fieldChanged: fieldChanged,
            // postSourcing: postSourcing,
            // sublistChanged: sublistChanged,
            // lineInit: lineInit,
            // validateField: validateField,
            validateLine: validateLine,
            // validateInsert: validateInsert,
            // validateDelete: validateDelete,
            // saveRecord: saveRecord
        };
    });