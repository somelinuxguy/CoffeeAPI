var convertToArray = function(data, orderList) {
    Object.values(data).forEach(function(order) {
        console.log('Push order to order list: ' + order.emailAddress)
        orderList.push(order);
    });
    console.log('Converted to array...');
    console.log(orderList);
}

var loadOrders = function(orderList) {
    orderList= [];
    console.log('loading saved orders...');
    $.ajax(apiURL,
    {
        success: function(data) {
            console.log(data);
            convertToArray(data, orderList);
            populateOrderPage(orderList);
        },
        error: function() {
            console.log("NO COFFEE 4 U! API server error.");
        }
    });
}

var removeOrderAPI = function(order) {
    $.ajax({
        method: "DELETE",
        url: `${apiURL}${order.emailAddress}`
    })
    .done(function() {
        console.log('Order deleted: ' + order.emailAddress);
        loadOrders(orderList);
    });
}

var saveOrder = function(orderInfo) {
    console.log('saving order: ' + orderInfo.emailAddress);
    $.ajax({
        method: "POST",
        url: `${apiURL}`,
        data: orderInfo
    })
    .done(function() {
        loadOrders();
    });
}

var clearDisplay = function() {
    console.log("Clearing Display");
    var container = document.querySelector(".currentOrders");
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
}

var populateOrderPage = function(orderList) {
    console.log(orderList);
    console.log("Populating Orders Page");
    clearDisplay();

    var container = document.querySelector(".currentOrders");
    // write the orders in to the new currentOrders div (named container)
    orderList.forEach(function(order) {
        var orderDIV = document.createElement('div');
        var orderP = document.createElement('p');
        orderDIV.classList.add('order');
        //fill the elements
        const templateStr = `Email: ${order.emailAddress} Strength: ${order.strength} Size: ${order.size} Adulterants: ${order.flavor} Coffee: ${order.coffee}`;
        orderP.textContent = templateStr;
        // add them to the DOM
        orderDIV.appendChild(orderP);
        container.appendChild(orderDIV);
        // remove order event handler

        var removeOrder = function(event) {
            removeOrderAPI(order);
        };

        orderDIV.addEventListener('click',removeOrder);
    });
}

// TODO: out of spec for the API
var newOrder = function(event) {
    event.preventDefault();
    console.log('New Order In.');
    var myEmail = document.querySelector('[name="emailAddress"]');
    var myCoffee = document.querySelector('[name="coffee"]');
    var myFlavor = document.querySelector('[name="flavor"]');
    var myStrength = document.querySelector('[name="strength"]');
    var mySize = document.querySelector('[name="size"]:checked');
    var orderInfo = {
        emailAddress: myEmail.value,
        coffee: myCoffee.value,
        flavor: myFlavor.value,
        strength: myStrength.value,
        size: mySize.value
        };
    console.log(orderInfo);
    saveOrder(orderInfo);
}
// -- main -- //
var orderList = [];
const apiURL="http://dc-coffeerun.herokuapp.com/api/coffeeorders/";
var myForm = document.querySelector(".formBox");

loadOrders();

myForm.addEventListener('submit', newOrder);