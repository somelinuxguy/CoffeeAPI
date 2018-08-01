var loadOrders = function() {
    console.log('loading saved orders...');
    $.ajax(URL,
    {
        success: function(orderList) {
            console.log(orderList);
            clearDisplay();
            populateOrderPage(orderList);
        }
    });
}

var saveOrder = function(orderList) {
    console.log("goaway");
}

var clearDisplay = function() {
    console.log("Clearing Display");
    var container = document.querySelector(".currentOrders");
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
}

var populateOrderPage = function(orderList) {
    console.log("Populating Orders Page");
    console.log(orderList);
    var container = document.querySelector(".currentOrders");
    // nuke currentOrders div
    clearDisplay();
    // write the orders in to the new currentOrders div (named container)
    Object.values(orderList).forEach(function(order) {
        console.log("Adding order to page: " + order.emailAddress);
        var orderDIV = document.createElement('div');
        var orderP = document.createElement('p');
        orderDIV.classList.add('order');
        const templateStr = `Name: ${order.emailAddress} 
        Flavor: ${order.flavor} 
        Size: ${order.size} 
        Strength: ${order.strength}`;
        orderP.textContent = templateStr;
        orderDIV.appendChild(orderP);
        container.appendChild(orderDIV);
        // remove order event handler
        var removeOrder = function(event) {
            console.log('remove item: ' + order);
            // this doesnt find the position of the order.name KEY in the array.
            var index = orderList.indexOf(order);
            if (index !== -1) {
                orderList.splice(index, 1);
            };
            // therefore - remove order from orderList
            saveOrder(orderList);
            populateOrderPage(orderList);
        };
        orderDIV.addEventListener('click',removeOrder);
    });
}

var newOrder = function(event) {
    event.preventDefault();
    console.log('New Order In.');
    var myName = document.querySelector('[name="myName"]');
    var myLocation = document.querySelector('[name="myLocation"]');
    var mySize = document.querySelector('[name="size"]:checked');
    var orderInfo = {
        name: myName.value,
        location: myLocation.value,
        size: mySize.value,
        adulterant: myAdulterant.value,
        cultists: myCultists.value,
        };
    orderList.push(orderInfo);
    //saveOrder(orderList);
    //populateOrderPage(orderList);
}
// -- main -- //
const URL="http://dc-coffeerun.herokuapp.com/api/coffeeorders/";

var myForm = document.querySelector(".formBox");
var orderList = loadOrders();
if (orderList == null) {
    orderList = [];
}
else {
    populateOrderPage(orderList);
}

myForm.addEventListener('submit', newOrder);