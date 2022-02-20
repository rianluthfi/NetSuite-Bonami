/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */

var PAGE_SIZE = 25;
var SEARCH_ID = 'customsearch201'; // Vendor Payment to Approve (AF & AM)
var CLIENT_SCRIPT_FILE_ID = 975; // dev_pagination_client.js

define(['N/ui/serverWidget', 'N/search', 'N/redirect'],
    function (serverWidget, search, redirect) {
    function onRequest(context) {
        if (context.request.method == 'GET') {
            var form = serverWidget.createForm({
				title : 'Transaction Amounts',
				hideNavBar : false
			});
			
			form.addField({
				id: 'custpage_subsidiary',
				type: serverWidget.FieldType.SELECT,
				label: 'Subsidiary',
				source: 'subsidiary'
			});
			
			form.addField({
				id: 'custpage_account',
				type: serverWidget.FieldType.SELECT,
				label: 'Account',
				source: 'account'
			});
			
			form.addButton({
				id : 'b_refresh',
				label : 'Refresh',
				functionName : 'testRun()'
			});

            form.clientScriptFileId = CLIENT_SCRIPT_FILE_ID;

            // Get parameters
            var pageId = parseInt(context.request.parameters.page);
            var scriptId = context.request.parameters.script;
            var deploymentId = context.request.parameters.deploy;
			
			// var subsidiaryId = context.request.parameters.subsidiary;
			// log.debug('subsidiaryId '+subsidiaryId);

            // Add sublist that will show results
            var sublist = form.addSublist({
                    id : 'custpage_table',
                    type : serverWidget.SublistType.LIST,
                    label : 'Transactions'
                });

            // Add columns to be shown on Page
			sublist.addMarkAllButtons();
			
			var check = sublist.addField({
				id: 'custpage_checkbox',
				label: 'Approve',
				type: serverWidget.FieldType.CHECKBOX
			});
			
			var viewLink = sublist.addField({
				id: 'custpage_view',
				label: '.',
				type: serverWidget.FieldType.URL
			});
			viewLink.linkText = 'View';
			
            // sublist.addField({
                // id : 'id',
                // label : 'Internal ID',
                // type : serverWidget.FieldType.TEXT
            // });
			
			sublist.addField({
				id: 'custpage_trandate',
				label: 'Date',
				type: serverWidget.FieldType.DATE
			});
			
			sublist.addField({
				id: 'custpage_rec_id',
				label: 'Bill Payment#',
				type: serverWidget.FieldType.TEXT
			});
			
			sublist.addField({
				id: 'custpage_entity',
				label: 'Vendor',
				type: serverWidget.FieldType.TEXT
			});
			
			sublist.addField({
				id: 'custpage_approvalstatus',
				label: 'Status',
				type: serverWidget.FieldType.TEXT
			});
			
			sublist.addField({
				id: 'custpage_account',
				label: 'Account',
				type: serverWidget.FieldType.TEXT
			});
			
			sublist.addField({
				id: 'custpage_subsidiary',
				label: 'subsidiary',
				type: serverWidget.FieldType.TEXT
			});
			
			sublist.addField({
                id : 'amount',
                label : 'Amount',
                type : serverWidget.FieldType.CURRENCY
            });
			
			sublist.addField({
				id: 'custpage_memo',
				label: 'Memo',
				type: serverWidget.FieldType.TEXT
			});

            // Run search and determine page count
            var retrieveSearch = runSearch(SEARCH_ID, PAGE_SIZE);
            var pageCount = Math.ceil(retrieveSearch.count / PAGE_SIZE);

            // Set pageId to correct value if out of index
            if (!pageId || pageId == '' || pageId < 0)
                pageId = 0;
            else if (pageId >= pageCount)
                pageId = pageCount - 1;

            // Add buttons to simulate Next & Previous
            if (pageId != 0) {
                form.addButton({
                    id : 'custpage_previous',
                    label : 'Previous',
                    functionName : 'getSuiteletPage(' + scriptId + ', ' + deploymentId + ', ' + (pageId - 1) + ')'
                });
            }

            if (pageId != pageCount - 1) {
                form.addButton({
                    id : 'custpage_next',
                    label : 'Next',
                    functionName : 'getSuiteletPage(' + scriptId + ', ' + deploymentId + ', ' + (pageId + 1) + ')'
                });
            }

            // Add drop-down and options to navigate to specific page
            var selectOptions = form.addField({
                    id : 'custpage_pageid',
                    label : 'Page Index',
                    type : serverWidget.FieldType.SELECT
                });

            for (i = 0; i < pageCount; i++) {
                if (i == pageId) {
                    selectOptions.addSelectOption({
                        value : 'pageid_' + i,
                        text : ((i * PAGE_SIZE) + 1) + ' - ' + ((i + 1) * PAGE_SIZE),
                        isSelected : true
                    });
                } else {
                    selectOptions.addSelectOption({
                        value : 'pageid_' + i,
                        text : ((i * PAGE_SIZE) + 1) + ' - ' + ((i + 1) * PAGE_SIZE)
                    });
                }
            }

            // Get subset of data to be shown on page
            var addResults = fetchSearchResult(retrieveSearch, pageId);

            // Set data returned to columns
            var j = 0;
            addResults.forEach(function (result) {
				sublist.setSublistValue({
					id : 'custpage_view',
					line : j,
					value : '/app/accounting/transactions/vendpymt.nl?id='+result.id+'&whence='
				});
                // sublist.setSublistValue({
                    // id : 'id',
                    // line : j,
                    // value : result.id
                // });

                sublist.setSublistValue({
                    id : 'custpage_trandate',
                    line : j,
                    value : result.trandate
                });
				
				sublist.setSublistValue({
                    id : 'custpage_rec_id',
                    line : j,
                    value : result.tranid
                });

                sublist.setSublistValue({
                    id : 'custpage_entity',
                    line : j,
                    value : result.entity
                });
				
				sublist.setSublistValue({
                    id : 'custpage_approvalstatus',
                    line : j,
                    value : result.approvalstatus
                });
				
				sublist.setSublistValue({
                    id : 'custpage_account',
                    line : j,
                    value : result.account
                });

                sublist.setSublistValue({
                    id : 'custpage_subsidiary',
                    line : j,
                    value : result.subsidiary
                });
				
				sublist.setSublistValue({
                    id : 'amount',
                    line : j,
                    value : result.amount
                });
				if(result.memo != ''){
					sublist.setSublistValue({
						id : 'custpage_memo',
						line : j,
						value : result.memo
					});
				}
				
                j++
            });

            context.response.writePage(form);
        }
    }

    return {
        onRequest : onRequest
    };
	
	function testRun(){
		log.debug('testRun Running !');
	}

    function runSearch(searchId, searchPageSize) {
		// log.debug('runSearch '+subsidiaryId);
		// var filter1 = search.createFilter({
			// name : 'subsidiary',
			// operator : search.Operator.IS,
			// values : subsidiaryId
		// });
        var searchObj = search.load({
                id : searchId
            });
		// if (subsidiaryId == undefined){
			// log.debug('subsidiary undefined');
		// }else{
			// log.debug('subsidiary defined');
			// searchObj.filters.push(filter1);
		// }
        // log.debug('searchObj', JSON.stringify(searchObj));

        return searchObj.runPaged({
            pageSize : searchPageSize
        });
    }

    function fetchSearchResult(pagedData, pageIndex) {

        var searchPage = pagedData.fetch({
                index : pageIndex
            });

        var results = new Array();

        searchPage.data.forEach(function (result) {
            var internalId = result.id;
			
			var trandate = result.getValue({
				name : 'trandate'
			});
			var tranid = result.getValue({
				name : 'tranid'
			});
			var entity = result.getText({
				name : 'entity'
			});
			var account = result.getText({
				name : 'account'
			});
			var subsidiary = result.getText({
				name : 'subsidiary'
			});
			var approvalstatus = result.getText({
				name : 'approvalstatus'
			});
			var amount = result.getValue({
				name : 'amount'
			});
			var memo = result.getValue({
				name : 'memo'
			});
			
            results.push({
                "id" : internalId,
				"trandate" : trandate,
				"tranid" : tranid,
				"entity" : entity,
				"approvalstatus" : approvalstatus,
				"account" : account,
				"subsidiary" : subsidiary,
				"amount" : amount,
				"memo" : memo
            });
        });
        return results;
    }
});