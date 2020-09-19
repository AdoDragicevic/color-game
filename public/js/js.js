// :::::Selectors:::::

// Display
const title = document.querySelector("h1 span"),
      nav = document.querySelector("nav"),
      allButtons = document.querySelectorAll("button"),
      circle = document.querySelectorAll(".circle"),
      message = document.querySelector("#message"),
      heartsDisplay = document.querySelector("#hearts"),
      individualHeart = document.querySelectorAll("#hearts i"),
// Buttons      
      btnEasy = document.getElementsByTagName("button")[0],
      btnMedium = document.getElementsByTagName("button")[1],
      btnHard = document.getElementsByTagName("button")[2],
      btnRgbOrHex = document.getElementsByTagName("button")[3],
      btnReset = document.getElementsByTagName("button")[4];


// :::::Variables:::::
let colors,
    secretColor,
    secretColorHex,
    numOfHearts,
    numOfColors = 6,
    hex = true,
    gameOver = false;


//:::::Game:::::

// run intro animation and start() - the function that fully sets up the game - at 2.6s
intro();


//Buttons
btnEasy.addEventListener("click", function(){
    numOfColors = 3;
    btnReset.classList.remove("picked");
    start(numOfColors);
});

btnMedium.addEventListener("click", function(){
    numOfColors = 6;
    btnReset.classList.remove("picked");
    start(numOfColors);  
});

btnHard.addEventListener("click", function(){
    numOfColors = 9;
    btnReset.classList.remove("picked");
    start(numOfColors);
});

btnRgbOrHex.addEventListener("click", function(){
    if(hex){
        title.textContent = secretColor;
        btnRgbOrHex.textContent = "HEX";
        hex = false;
    } else {
        title.textContent = secretColorHex;
        btnRgbOrHex.textContent = "RGB";
        hex = true;
    }
});

btnReset.addEventListener("click", function(){
    start(numOfColors);
    this.classList.remove("picked");
});


// ::::::FUNCTIONS::::::

// Intro animation & fully set the game up with start() at 2.6s
function intro(){
    // Display random colors
    setTimeout(function() {
        generateColors(numOfColors);
        fillCircles(numOfColors);
    }, 500);
    // Display random collors once again
    setTimeout(function() {
        generateColors(numOfColors);
        fillCircles(numOfColors);
    }, 1500);
    setTimeout(function() {
        generateColors(numOfColors);
        fillCircles(numOfColors);
    }, 2500);
    // Fade in & Setup game
    setTimeout(function() {
        fadeIn();
        start(numOfColors);
    }, 3500);
    // Remove fade in
    setTimeout(function() {
        removeFadeIn();   
    }, 5000);
}
// Add fade In to intro
function fadeIn(){
    for(let i = 0; i < allButtons.length; i++){
        allButtons[i].style.color = "white";
        allButtons[i].classList.add("slowTransition");
    }
    title.classList.add("slowTransition");
    nav.classList.add("borderBottomWhite");
}
// Remove fade In
function removeFadeIn(){
    for(let i = 0; i < allButtons.length; i++){
        allButtons[i].classList.remove("slowTransition");
        nav.classList.remove("slowTransition");
        title.classList.remove("slowTransition");
    }
}

// (Re)start game
function start(numOfColors){
    gameOver = false;
    generateColors(numOfColors);
    pickSecretColor();
    fillCircles(numOfColors);  
    interactiveCircles();
    messageOrHearts();
}
// Generate Colors
function generateColors(numOfColors) {
    colors = [];
    for(let i = 0; i < numOfColors; i++){
        colors.push(generateRgb());
    }
    return colors;
}
// Generate RGB
function generateRgb(){
    let r = Math.floor(Math.random()*256);
    let g = Math.floor(Math.random()*256);
    let b = Math.floor(Math.random()*256);
    let newColor = "rgb(" + r + ", " + g + ", "+ b + ")";
    return newColor;
}
// Pick Secret color
function pickSecretColor(){
    let index = Math.floor(Math.random()* colors.length);
    secretColor = colors[index];
    rgbToHex(secretColor);
    title.style.color = "white";
    if(hex){
        title.textContent = secretColorHex;
    } else {
        title.textContent = secretColor;
    }
}
// Turn rgb into Hex - only for secret color
function rgbToHex(secretColor){
    //Extract numbers from "rgb" str
    let i = secretColor.replace("rgb(", "").replace(")", "");
    //Make a list of those numbers
    let hex = i.split(",");
    let r = Number(hex[0]);
    let g = Number(hex[1]);
    let b = Number(hex[2]);
    fullHex(r, g, b);
}
//Turn each number to hex
function fullHex(r,g,b) {  
    let red = oneHex(r);
    let green = oneHex(g);
    let blue = oneHex(b);
    secretColorHex = "#" + red + green + blue;
    return secretColorHex;
};
//Turn individual number to hex
function oneHex (rgb) {
    let hex = Number(rgb).toString(16);
    if (hex.length < 2) {
         hex = "0" + hex;
    }
    return hex;
};
// Color the circles
function fillCircles() {
    for(let i = 0; i < circle.length; i++){
        circle[i].style.display = "block";
        if(colors[i]){
            circle[i].style.backgroundColor = colors[i];
        } else {
            circle[i].style.display = "none";
        }
    }
}
// Guessing logic
function interactiveCircles(){
    for(let i = 0; i < colors.length; i++){
        circle[i].addEventListener("click", clickEvent);
    }
}

function clickEvent(){
	if(!gameOver){
		if(this.style.backgroundColor === secretColor){
			sameColor();
			message.textContent = "Correct!";
			btnReset.classList.add("picked");
		} else {
			removeHeart();
			this.style.backgroundColor = "black";
			message.textContent = "Try Again";
		}
	}
};

// Set secret color to all circles if secret color is guessed
function sameColor(){
    for(let i = 0;i < colors.length; i++){
        circle[i].style.backgroundColor = secretColor;
    }
}
// Hearts dissapear with every wrong guess on hard
function removeHeart(){
    if(numOfColors === 9){
        numOfHearts -=1;
        if(numOfHearts < 1){
            gameOver = true;
            title.style.color = secretColor;
            btnReset.classList.add("picked");
        }
        // Intentionally hard-coded, as I find it more estetically appealing if hearts dissapear in this order
        if(individualHeart[2].style.color === "white"){
            individualHeart[2].style.color = "black";
        } else if(individualHeart[0].style.color === "white"){
            individualHeart[0].style.color = "black";
        } else{
            individualHeart[1].style.color = "black";
        }    
    }
}
// Display message or hearts depending on difficulty
function messageOrHearts(){
    if(colors.length <9){
        message.style.display = "block";
        message.textContent = "";
        heartsDisplay.style.display = "none";
    } else {
        numOfHearts = 3;
        message.style.display = "none";
        heartsDisplay.style.display = "block";
        for(let i = 0; i < 3; i ++){
            individualHeart[i].style.color = "white";
        }
    }
}