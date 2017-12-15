/**
 * Created by chaika on 25.01.16.
 */

var $client=$("#inputName");
var $clientPhone=$("#inputNumber");
var $clientAddress=$("#inputAdress");

$(function(){
    //This code will execute when the page is ready

    var PizzaMenu = require('./pizza/PizzaMenu');

    var PizzaCart = require('./pizza/PizzaCart');

    var Pizza_List = require('./Pizza_List');

    PizzaCart.initialiseCart();
    PizzaMenu.initialiseMenu();


    var GoogleMap=require('./googleMaps');
    var map=GoogleMap.map;
    var point=GoogleMap.point;
    var directionsDisplay=GoogleMap.directionsDisplay;
    var newMarker=GoogleMap.newMarker;
    var Pay=require('./payment');
    var API=require('./API');

    $clientAddress.bind("keydown", function(event){
        window.setTimeout(function() {
            GoogleMap.geocodeAddress($clientAddress.val(), function(err, data){
                if(!err){
                    if(newMarker)newMarker.setMap(null);
                    newMarker	=	new	google.maps.Marker({
                        position: data,
                        map: map,
                        icon: {
                            url:"assets/images/home-icon.png",
                            anchor: new google.maps.Point(30, 30)
                        }
                    });
                    GoogleMap.calculateRoute(point, data, function(err, data2){
                        directionsDisplay.setDirections(data2.route);
                        $(".order-summery-time").text(data2.duration);
                    });
                    $clientAddress.css("box-shadow", "0 0 3px #006600");
                    $(".order-summery-adress").text($clientAddress.val());
                }
                else {
                    $(".order-summery-time").text("невідома");
                    $(".order-summery-adress").text("невідомий");
                    $clientAddress.css("box-shadow", "0 0 3px #CC0000");
                }
            });
        });
    });
    $("#submit").click(function () {
        event.preventDefault();
        var suc=true;
        var name = $client.val();
        if(name==""){
            $client.css("box-shadow", "0 0 3px #CC0000");
            suc=false;
        }
        else $client.css("box-shadow", "0 0 3px #006600");
        var phone = $clientPhone.val();
        if(phone==="" || (phone.charAt(0)==='+' && phone.length<13) || (phone.charAt(0)==='0' && phone.length<10)){
            $clientPhone.css("box-shadow", "0 0 3px #CC0000");
            suc=false;
        }
        else $clientPhone.css("box-shadow", "0 0 3px #006600");
        var address = $clientAddress.val();
        if(address===""){
            $clientAddress.css("box-shadow", "0 0 3px #CC0000");
            suc=false;
        }
        else $clientAddress.css("box-shadow", "0 0 3px #006600");
        if(suc) {
            var pizzas=require('./pizza/PizzaCart').getPizzaInCart();
            var pizzasLine="";
            for(var i=0;i<pizzas.length;i++){
                pizzasLine+="- "+pizzas[i].quantity+"шт. ["+(pizzas[i].size==='big_size'?"Велика":"Мала")+"] "+pizzas[i].pizza.title+";\n"
            }
            var order_info = {
                name: name,
                phone: phone,
                address: address,
                cost: parseFloat($("#count").text().split(" ")[0])*1.00,
                pizzas:pizzasLine
            };
            API.createOrder(order_info, function (error, data) {
                if (error) alert(error);
                else {
                    window.LiqPayCheckoutCallback=Pay.create(data.data, data.signature);
                }
            });

        }
    });
});