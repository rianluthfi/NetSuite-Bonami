/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */
define(['N/url'],
    function (url) {
    function fieldChanged(context) {
        // Navigate to selected page
        if ((context.fieldId == 'custpage_pageid')||(context.fieldId == 'custpage_subsidiary')) {
            var pageId = context.currentRecord.getValue({
                    fieldId : 'custpage_pageid'
                });

            pageId = parseInt(pageId.split('_')[1]);
			
			var subsidiary = context.currentRecord.getValue({
				fieldId : 'custpage_subsidiary'
			});

            document.location = url.resolveScript({
                    scriptId : getParameterFromURL('script'),
                    deploymentId : getParameterFromURL('deploy'),
                    params : {
                        'page' : pageId,
						'subsidiary' : subsidiary
                    }
                });
        }
		// if (context.fieldId == 'custpage_subsidiary'){
			// var subsidiary = context.currentRecord.getValue({
				// fieldId : 'custpage_subsidiary'
			// });
			// alert('subsidiary '+subsidiary);
			// document.location = url.resolveScript({
                    // scriptId : getParameterFromURL('script'),
                    // deploymentId : getParameterFromURL('deploy'),
                    // params : {
						// 'subsidiary' : subsidiary
                    // }
                // });
		// }
    }

    function getSuiteletPage(suiteletScriptId, suiteletDeploymentId, pageId) {
		var subsidiary = context.currentRecord.getValue({
			fieldId : 'custpage_subsidiary'
		});
        document.location = url.resolveScript({
                scriptId : suiteletScriptId,
                deploymentId : suiteletDeploymentId,
                params : {
                    'page' : pageId,
					'subsidiary' : subsidiary
                }
            });
    }

    function getParameterFromURL(param) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == param) {
                return decodeURIComponent(pair[1]);
            }
        }
        return (false);
    }

    return {
        fieldChanged : fieldChanged,
        getSuiteletPage : getSuiteletPage
    };

});