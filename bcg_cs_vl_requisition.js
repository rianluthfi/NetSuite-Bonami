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
			var curRec = context.currentRecord;
			
			var linkOrder = curRec.getCurrentSublistValue({
				sublistId : 'item',
				fieldId : 'linkedorder'
			});
			
			if (linkOrder != ''){
				alert('Transaksi sudah tidak dapat di Delete, karena sudah diproses !');
				return false;
			}else{
				return true;
			}
        }
        function validateInsert(context) {
			
        }
        function validateLine(context) {
			var curRec = context.currentRecord;
			var sublistName = context.sublistId;
			
			var transactionType = curRec.getValue('cseg1');
			
			if (sublistName == 'item'){
				// Internal ID	ID Production	Name (Non Inventory Item) - Service Asset
				// 2836			2941			FAS001 Service Bangunan
				// 2835			2942			FAS002 Service Kendaraan
				// 2837			2943			FAS003 Service Mesin & Peralatan
				// 2838			2944			FAS004 Service Inventaris
				var serviceAssetItem = ['2941', '2942', '2943', '2944'];
				
				// Internal ID	ID Production	Name (Non Inventory Item) - New Asset
				// 2839			2936			FA001 Asset Tanah
				// 2840			2937			FA002 Asset Bangunan
				// 2841			2938			FA003 Asset Kendaraan
				// 2842			2939			FA004 Asset Mesin & Peralatan
				// 2843			2940			FA005 Asset Inventaris
				var newAssetItem = ['2936', '2937', '2938', '2939', '2940'];
				
				var item = curRec.getCurrentSublistValue({
					sublistId : 'item',
					fieldId : 'item'
				});
				
				if (transactionType == 4){
					var relatedAsset = curRec.getCurrentSublistValue({
						sublistId : 'item',
						fieldId : 'custcol_far_trn_relatedasset'
					});
					var assetType = curRec.getCurrentSublistValue({
						sublistId : 'item',
						fieldId : 'custcol_bcg_asset_type_related_asset'
					});
					
					// Create New Asset
					if (newAssetItem.includes(item)){
						if (relatedAsset != ''){
							alert('Tidak perlu isi Related Asset saat akan mengajukan Asset Baru !');
							return false;
						}else{
							setEstimatedAmount(curRec);
							return true;
						}
					}
					// Service Asset
					else if (serviceAssetItem.includes(item)){
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
							
							if (item == 2941 && assetType == 1){ 								// Bangunan
								setEstimatedAmount(curRec);
								return checkStatusInspection(curRec);
							} else if (item == 2942 && (assetType == 5 || assetType == 6)){		// Kendaraan
								setEstimatedAmount(curRec);
								return checkStatusInspection(curRec);
							} else if (item == 2943 && (assetType == 4 || assetType == 7)){		// Mesin & Peralatan
								setEstimatedAmount(curRec);
								return checkStatusInspection(curRec);
							} else if (item == 2944 && (assetType == 2 || assetType == 3)){		// Inventaris
								setEstimatedAmount(curRec);
								return checkStatusInspection(curRec);
							} else {
								alert('Asset Type Related Asset dengan Item Service yang digunakan, tidak sesuai !');
								return false;
							}
						}else{
							alert('Silahkan Input Related Asset yang sesuai !');
							return false;
						}
					}
					else{
						alert('Bukan Item untuk Transaksi Fixed Asset !');
						return false;
					}
				}
				else{
					// alert('Transaction Type seharusnya Fixed Asset ');
					if (newAssetItem.includes(item) || serviceAssetItem.includes(item)){
						alert('Item ini hanya dapat digunakan pada Transaksi Fixed Asset !');
						return false;
					}else{
						// alert('masuk Else !');
						setEstimatedAmount(curRec);
						return true;
					}
				}
			}
			else if (sublistName == 'expense'){
				// alert('Transaksi Expense !');
				return true;
			}
			
        }
        function sublistChanged(context) {

        }
		
		// Validasi Status Inspection yang boleh diinput adalah status COMPLETE
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
		
		function setEstimatedAmount(record){
			var estimateAmount = record.getCurrentSublistValue({
				sublistId : 'item',
				fieldId : 'estimatedamount'
			});
			
			if (estimateAmount == 0){
				record.setCurrentSublistValue({
					sublistId: 'item',
					fieldId: 'estimatedamount',
					value: 1,
					ignoreFieldChange: true
				});
			}
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