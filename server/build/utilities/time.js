"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var formatedTime = function () {
    //https://www.toptal.com/software/definitive-guide-to-datetime-manipulation
    var currentDate = new Date();
    var hours = currentDate.getHours();
    var minutes = currentDate.getMinutes();
    var seconds = currentDate.getSeconds();
    var formattedTime = hours + ':' + minutes + ':' + seconds;
    return formattedTime;
};
exports.default = formatedTime;
