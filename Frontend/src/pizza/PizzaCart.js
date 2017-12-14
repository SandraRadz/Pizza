/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var $clientPhone=$("#inputNumber");
var phoneCheck =$(".phone-help-block");

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

//HTML едемент куди будуть додаватися піци
var $cart = $(".main-part");


function addToCart(pizza, size) {
    document.getElementById("text_sum").style.display='inline-block';
    document.getElementById("count").style.display='inline-block';
    //Додавання однієї піци в кошик покупок
    console.log(pizza);

    for (var i = 0; i < Cart.length; i++) {
        if (Cart[i].pizza.id== pizza.id && Cart[i].size == size) { //додавання кількості, якщо натискати на вже замовлену піцу
            Cart[i].quantity++;
            updateCart();
            return;
        }

    }

    //Приклад реалізації, можна робити будь-яким іншим способом
    Cart.push({
        pizza: pizza,
        size: size,
        quantity: 1
    });


    //Оновити вміст кошика на сторінці
    updateCart();

}

function removeFromCart(cart_item) {
    //Видалити піцу з кошика
    //TODO: треба зробити
    var i;

    for (i = 0; i < Cart.length; i++) {
        if (Cart[i].pizza.id == cart_item.pizza.id&&Cart[i].size == cart_item.size) {
            Cart.splice(i,1);
            n_orders=-1;
            break;
        }
    }

    //Після видалення оновити відображення
    if(Cart.length==0){
        $(".no-orders").removeClass("none");
        $(".order-header").addClass("none");
        $('.btn-order').attr('disabled','disabled');
        document.getElementById("text_sum").style.display='none';
        document.getElementById("count").style.display='none';
        // document.getElementsByClassName("order_pizza").style.backgroundColor = '#ec222e';
        // document.getElementsByClassName("order_pizza").disabled = false;
    }
    updateCart();
}

function initialiseCart() {
    //Функція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його
    //TODO: ...
    Cart = JSON.parse(localStorage.getItem("pizzaCartData"));

    if(Cart==null) Cart=[];

    if(Cart.length==0){
        $(".no-orders").removeClass("none");
        $(".order-header").addClass("none");
        $('.btn-order').attr('disabled','disabled');
        document.getElementById("text_sum").style.display='none';
        document.getElementById("count").style.display='none';
    }
    updateCart();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function updateCart() {
    if (Cart.length!=0){
        document.getElementById("text_sum").style.display='inline-block';
        document.getElementById("count").style.display='inline-block';
        //  document.getElementsByClassName("order_pizza").style.backgroundColor = '#ec890e';
    }
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage
    localStorage.setItem("pizzaCartData", JSON.stringify(Cart));
    //Очищаємо старі піци в кошику
    $cart.html("");

    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);
        //шукаємо суму
        self.total+=cart_item.pizza.price;

        $node.find(".count-clear").click(function(){
            //Зменшуємо кількість замовлених піц
            removeFromCart(cart_item);
            updateCart();
        });

        $node.find(".plus").click(function(){
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;
            //Оновлюємо відображення
            updateCart();
        });

        $node.find(".minus").click(function(){
            //Зменшуємо кількість замовлених піц
            cart_item.quantity -= 1;
            //Оновлюємо відображення
            if ( cart_item.quantity == 0) removeFromCart(cart_item);
            updateCart();
        });



        $(".clean").click(function () {
            //Зменшуємо кількість замовлених піц
            Cart=[];
            removeFromCart();
            //Оновлюємо відображення
            updateCart();
        });
        $cart.append($node);
    }



    Cart.forEach(showOnePizzaInCart);
    $(".count_pizza").text('').append(Cart.length); //при кожній появі піци, стираємо текст з кружечка і записуємо довжину масиву
    $("#count").text("").append(total);//стираємо суму, записуємо суму
}
$(".order_pizza").click(function () {
    if(Cart.length>0){
        location.href="http://localhost:5050/orderPage.html";}
});

$(".correct").click(function () {
    location.href="http://localhost:5050/index.html";

});

$(".next-step-button").click(function () {

var val = $("#inputName").val().trim();
    if(val.length<2) {
        $(".name-group").removeClass(".form-group has-error").addClass(".form-group has-error");
    document.getElementById("help name-help-block").style.display='inline-block';

   // $("#inputName").style.borderColor="red";
      //  document.getElementsByClassName("col-sm-2 controle-label nl").style.color='red';
    }
else{
        document.getElementById("help name-help-block").style.display='none';
       $(".name-group").removeClass(".form-group has-error").addClass(".form-group has-success");
    }

        var value = $("#inputNumber").val().trim();
    if (value == "" || (value.charAt(0) != '+' && value.charAt(0) != '0') || (value.charAt(0) == '+' && value.length != 13) || (value.charAt(0) == '0' && value.length != 10)) {
            document.getElementById("help phone-help-block").style.display='inline-block';
       // $("#nl").background='#ec890e';
        $(".phone-group").removeClass(".form-group has-success").addClass(".form-group has-error");
        }
else{ document.getElementById("help phone-help-block").style.display='none';
        $(".phone-group").removeClass(".form-group has-error").addClass(".form-group has-success");
    }

    var value1 = $("#inputAdress").val().trim();
    if (value1 == "") {
        document.getElementById("help adress-help-block").style.display='inline-block';
        $(".adress-group").removeClass(".form-group has-success").addClass(".form-group has-error");
    }
 else{document.getElementById("help adress-help-block").style.display='none';
    $(".adress-group").removeClass(".form-group has-error").addClass(".form-group has-success");}

});

var total=function(){
    var t=0;
    for (var i = 0; i < Cart.length; i++) {
        var size=Cart[i]['size'];
        t+=(Cart[i].pizza[size].price*Cart[i].quantity);
    }
    return t+" грн";
}

/*function	initialize()	{
//Тут починаємо працювати з картою
    varmapProp =	{
        center:	new	google.maps.LatLng(50.464379,30.519131),
        zoom:	11
    };
    var html_element =	document.getElementById("googleMap");
    varmap	=	new	google.maps.Map(html_element,	 mapProp);
//Карта створена і показана
}
//Коли сторінка завантажилась
google.maps.event.addDomListener(window,	 'load',	initialize);

var point	=	new	google.maps.LatLng(50.464379,30.519131);
var marker	=	new	google.maps.Marker({
    position:	point,
//map	- це змінна карти створена за допомогою new
   // google.maps.Map(...)
map:	map,
    icon:	"assets/images/map-icon.png"
});

google.maps.event.addListener(map,
    'click',function(me){
        var coordinates	=	me.latLng;
//coordinates	- такий самий об’єкт як створений new
     //   google.maps.LatLng(...)
    });
*/
exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;