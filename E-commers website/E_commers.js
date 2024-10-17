// E_Commers.html
const bar = document.getElementById('bar');
const nav = document.getElementById('navbar');
const cl = document.getElementById('close');

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    })
}
if (cl) {
    cl.addEventListener('click', () => {
        nav.classList.remove('active');
    })
}

// Sprocut.html
var maiImg = document.getElementById("main-img");
var samImgbox = document.getElementsByClassName("small-img-color");
var samImg = document.getElementsByClassName("small-img");

// Type one 
for (let i = 0; i < samImg.length; i++) {
  samImgbox[i].onclick = function(){
    let img = maiImg.src;
    maiImg.src = samImg[i].src; 
    samImg[i].src = img;
  }
}


// //{ ONE ANOTHER TYPE OF SCRIPT

// samImg[0].onclick = function () {
//     maiImg.src = samIm[0].src;
// }
// samImg[1].onclick = function () {
//     maiImg.src = samIm[1].src;
// }
// samImg[2].onclick = function () {
//     maiImg.src = samIm[2].src;
// }
// samImg[3].onclick = function () {
//     maiImg.src = samIm[3].src;
// }
// samImg[4].onclick = function () {
//     maiImg.src = samIm[4].src;
// }
// // }

