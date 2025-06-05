//onload check

//change bei resize
window.addEventListener("resize", checkOrientation);

function checkOrientation(){
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const isLandscape = window.matchMedia("(orientation: landscape)").matches;
    if (isLandscape && isMobile) {
        console.log('Landscape mode detected');
    } else {
        console.log('Portrait mode detected');
    }
}




//event listener für resize

