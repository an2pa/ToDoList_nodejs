exports.getDatum= function (){
const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var todaay = new Date();
    var currentDay = todaay.getDay();
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }
    var day = todaay.toLocaleDateString("en-US", options)
    return day;
}

exports.getDay= function (){
    var todaay = new Date();
    var currentDay = todaay.getDay();
    return currentDay;
}