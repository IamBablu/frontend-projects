let singup = document.getElementById("singup")
let singin = document.getElementById("singin")
let nameFiled = document.getElementById("nameFiled")
let tital= document.getElementById("tital")

singin.onclick=function(){
    nameFiled.style.maxHeight = "0";
    tital.innerHTML = "Sign In";
    singup.classList.add("disable");
    singin.classList.remove("disable");

}
singup.onclick=function(){
    nameFiled.style.maxHeight = "65px";
    tital.innerHTML = "Sign Up";
    singin.classList.add("disable");
    singup.classList.remove("disable");

}