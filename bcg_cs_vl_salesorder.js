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
			
			var entity = curRec.getValue('entity');
			
			var item = curRec.getCurrentSublistValue({
				sublistId : 'item',
				fieldId : 'item'
			});
			var relatedAsset = curRec.getCurrentSublistValue({
				sublistId : 'item',
				fieldId : 'custcol_far_trn_relatedasset'
			});
			var assetType = curRec.getCurrentSublistValue({
				sublistId : 'item',
				fieldId : 'custcol_bcg_asset_type_related_asset'
			});
			var assetAccount = curRec.getCurrentSublistValue({
				sublistId : 'item',
				fieldId : 'custcol_bcg_asset_accout'
			});
			
			// Internal ID	ID Production	Name (Non Inventory Item)
			// 2844			2945			FAS005 Service Bangunan
			// 2845			2946			FAS006 Service Kendaraan
			// 2846			2947			FAS007 Service Mesin & Peralatan
			// 2847			2948			FAS008 Service Inventaris
			var serviceAssetItem = ['2945', '2946', '2947', '2948'];
			
			// Internal Maintenance (Asset) ID 1058 - SandBox
			// Internal Maintenance (Asset) ID 1123 - SandBox
			
			// Asset Account 120.05 PERSEDIAAN : Barang MRO (Maintenance, Repair, Operation) ID 330
			if (entity == 1123){
				if (serviceAssetItem.includes(item) || assetAccount == 330){
					// Item Service Asset && Item MRO
					if (serviceAssetItem.includes(item)){
						if (relatedAsset != ''){
							// Internal ID 	ID Production	AssetType
							// 2			1				Bangunan
							// 102			2				Furniture
							// 103			3				IT
							// 3			4				Mesin
							// 4			5				Mobil
							// 5			6				Motor
							// 6			7				Peralatan
							// 7			8				Tanah
							
							if (item == 2945 && assetType == 1){ 								// Bangunan
								setRatetoZero(curRec);
								return checkStatusInspection(curRec);
							} else if (item == 2946 && (assetType == 5 || assetType == 6)){		// Kendaraan
								setRatetoZero(curRec);
								return checkStatusInspection(curRec);
							} else if (item == 2947 && (assetType == 4 || assetType == 7)){		// Mesin & Peralatan
								setRatetoZero(curRec);
								return checkStatusInspection(curRec);
							} else if (item == 2948 && (assetType == 2 || assetType == 3)){		// Inventaris
								setRatetoZero(curRec);
								return checkStatusInspection(curRec);
							} else {
								alert('Asset Type Related Asset dengan Item Service yang digunakan, tidak sesuai !');
								return false;
							}
						}else{
							alert('Silahkan Input Related Asset yang sesuai !');
							return false;
						}
					// Eksekusi Item MRO
					}else if (assetAccount == 330){
						if (relatedAsset != ''){
							setRatetoZero(curRec);
							return true;
						}else{
							alert('Silahkan Input Related Asset yang sesuai !');
							return false;
						}
					}
				}else{
					//alert('Entity Internal Maintenance (Asset) hanya digunakan untuk transaksi Maintenance Order Fixed Asset !');
					//return false;
				}
			}else{
				// alert('Bukan Transaksi Maintenance Order !');
				return true;
			}
        }
        function sublistChanged(context) {

        }
		
		function checkStatusInspection(record){
			var statusInspection = record.getCurrentSublistValue({
				sublistId : 'item',
				fieldId : 'custcol_bcg_inspection_status'
			});
			if (statusInspection == 2){
				alert('Asset ini sudah diproses pada transaksi lainnya, tunggu hingga proses tersebut selesai !');
				return false;
			} else if(statusInspection == 1){
				return true;
			}
		}
		
		function setRatetoZero(record){
			record.setCurrentSublistValue({
				sublistId: 'item',
				fieldId: 'rate',
				value: 0,
				ignoreFieldChange: true
			});
			record.setCurrentSublistValue({
				sublistId: 'item',
				fieldId: 'amount',
				value: 0,
				ignoreFieldChange: true
			});
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