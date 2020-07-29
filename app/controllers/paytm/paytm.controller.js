var checksum = require('./checksum');
var request = require('request');
module.exports = {
    getRequest: (req, res) => {
        res.render("paytm/index.ejs");
    },
    request: (req, res) => {
        var paramlist = req.body;
        var paramarray = new Array();

        for (name in paramlist) {
            if(name === "PAYTM_MERCHANT_KEY"){
                var PAYTM_MERCHANT_KEY = paramlist[name];
            } else {
                paramarray[name] = paramlist[name]
            }
        }
        paramarray["CALLBACK_URL"] = "http://ec2-3-14-86-69.us-east-2.compute.amazonaws.com/api/paytm/response";
        checksum.genchecksum(paramarray, PAYTM_MERCHANT_KEY, (err, result) => {
            if(err) throw err;
            res.render("paytm/request", { result });
        })
    },

    response: (req, res) => {
        // console.log(req.body); 
        if(req.body.RESPCODE === '01'){
            request({
                url: 'http://ec2-3-14-86-69.us-east-2.compute.amazonaws.com/paytmresult',
                method:'POST',
                json: {
                    "body": req.body
                }
            });
            res.render("paytm/response", {
                status: true,
                result: req.body
            });
        } else {
            res.render("paytm/response", {
                status: false,
                result: req.body
            });
        }
    }
}; 
