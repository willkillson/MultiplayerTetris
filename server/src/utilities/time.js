const formatedTime = () =>{
    //https://www.toptal.com/software/definitive-guide-to-datetime-manipulation
    let currentDate = new Date();
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    let seconds = currentDate.getSeconds();
  
    let formattedTime = hours +':'+ minutes+':'+ seconds;
    return formattedTime
}

export default formatedTime;