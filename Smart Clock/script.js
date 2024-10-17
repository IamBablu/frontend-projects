let hr = document.getElementById("hour");
let min = document.getElementById("min");
let sec = document.getElementById("sec");

function showTime(){
    let date = new Date();
    let hh = date.getHours();
    let mm = date.getMinutes();
    let ss = date.getSeconds();
    
    let hrot = (hh*30)+(mm/2);
    let mrot = mm*6;
    let srot = ss*6;
    hr.style.transform = `rotate(${hrot}deg)`;
    min.style.transform = `rotate(${mrot}deg)`;
    sec.style.transform = `rotate(${srot}deg)`;
    // console.log(date.g);
    // console.log(date.getMinutes());
    // console.log(date.getSeconds());
}
setInterval(showTime,1000);
