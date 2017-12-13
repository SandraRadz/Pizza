/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');

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

var total=function(){
    var t=0;
    for (var i = 0; i < Cart.length; i++) {
        var size=Cart[i]['size'];
        t+=(Cart[i].pizza[size].price*Cart[i].quantity);
    }
    return t+" грн";
}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;