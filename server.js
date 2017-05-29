var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){
  // Let's scrape Anchorman 2
  url = 'http://www.amazon.in/gp/product/B01FM8M0XE/ref=s9_acsd_ri_bw_c_x_1_w?pf_rd_m=A1VBAL9TL5WCBF&pf_rd_s=merchandised-search-3&pf_rd_r=04Q7YG5517EDHB978V66&pf_rd_r=04Q7YG5517EDHB978V66&pf_rd_t=101&pf_rd_p=3c772674-1d2b-412a-acb2-4320299808c4&pf_rd_p=3c772674-1d2b-412a-acb2-4320299808c4&pf_rd_i=1389401031';

  request(url, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);

      var title, price, rating;
      var mobile = { title : "", price : "", rating : ""};

      $('#productTitle').filter(function(){
        var data = $(this);
        title = data.text().trim();
        // release = data.children().last().children().last().text().trim();
        mobile.title = title;
        // json.release = release;
      })
      $('#priceblock_ourprice').filter(function(){
        var data = $(this);
        price = data.text().trim();
        mobile.price = price;
        console.log(price)
      })

      $('#acrPopover').filter(function(){
        var data = $(this);
        rating = data.children().first().children().first().children().first().children().first().text().trim();
        // console.log(rating);
        var ratingArray = parseInt(rating);
        console.log(ratingArray);
        mobile.rating = rating;
      })

      // $('.ratingValue').filter(function(){
      //   var data = $(this);
      //   rating = data.text().trim();

      //   json.rating = rating;
      // })
    }

    fs.readFile('output.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        }else{
          obj = JSON.parse(data); //now it an object
          obj.mobiles.push(mobile); //add some data
          var json = JSON.stringify(obj); //convert it back to json
          console.log(json)
          fs.writeFile('output.json', json, 'utf8', function(){
              console.log('finished scraping data. Added to json file')
          }); // write it back 
        }
    });

    res.send(mobile)
  })
})

app.listen('8081');
console.log('Magic happens on port 8081');
exports = module.exports = app;
