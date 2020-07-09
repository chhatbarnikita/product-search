const express = require('express')
const app = express()
const request = require('request')
const cors = require('cors')

app.use(cors());

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*"); 
  res.setHeader("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS"); 
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/getProducts', function (req, res) {
	var filterNameCount = 0
	var filterStr = ''

	// url formation
	var keywords = req.param('keywords').replace(' ', '%20');

	if(req.param('minPrice')) {
		filterStr += '&itemFilter('+ filterNameCount +').name=MinPrice&itemFilter('+ filterNameCount +').value=' + req.param("minPrice") +'&itemFilter('+ filterNameCount +').paramName=Currency&itemFilter('+ filterNameCount +').paramValue=USD';
		filterNameCount += 1;
	}

	if(req.param('maxPrice')) {
		filterStr += '&itemFilter('+ filterNameCount +').name=MaxPrice&itemFilter('+ filterNameCount +').value=' + req.param("maxPrice") +'&itemFilter('+ filterNameCount +').paramName=Currency&itemFilter('+ filterNameCount +').paramValue=USD';
		filterNameCount += 1;
	}

	if(req.param('condition')) {
		var ls = req.param('condition').split(',');
		var filterValueCount = 0;
		filterStr += '&itemFilter(' + filterNameCount + ').name=Condition';

		for(var i=0; i < ls.length; i++) {
			filterStr += '&itemFilter('+ filterNameCount +').value('+ filterValueCount +')=' + ls[i];
			filterValueCount += 1;
		}

		filterNameCount +=1;
	}

	if(req.param('seller')) {
		filterStr += '&itemFilter('+ filterNameCount +').name=ReturnsAcceptedOnly&itemFilter('+ filterNameCount +').value=true';
		filterNameCount += 1;
	}

	if(req.param('shipping')) {
		if((req.param('shipping')).search('Free') > -1) {
			filterStr += '&itemFilter('+ filterNameCount +').name=FreeShippingOnly&itemFilter('+ filterNameCount +').value=true';
			filterNameCount += 1;
		}

		if((req.param('shipping')).search('Expedited') > -1) {
			filterStr += '&itemFilter('+ filterNameCount +').name=ExpeditedShippingType&itemFilter('+ filterNameCount +').value=Expedited';
			filterNameCount += 1;
		}
	}

	var sortOrder = req.param('sortCategory');

	var url = 'https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=NikitaCh-productS-PRD-72eb84eea-e6ce535f&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords='+ keywords +'&sortOrder=' + sortOrder + filterStr;

	request.get(url, function (error, response, body) {
		if(error || response.statusCode != 200) {
			res.send('No results found');
		}
		res.send(body);
	});
});

app.get('/getSingleProduct', function (req, res) {
	var productId = req.param('productId');
	var url = 'https://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=NikitaCh-productS-PRD-72eb84eea-e6ce535f&siteid=0&version=967&ItemID='+ productId +'&IncludeSelector=Details,ItemSpecifics'

	request.get(url, function (error, response, body) {
		if(error || response.statusCode != 200) {
			res.send('No resultsfound');
		}
		res.send(body);
	})
});

// specifying port to run app
app.listen(process.env.PORT || 8080);