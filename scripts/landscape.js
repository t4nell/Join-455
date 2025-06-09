//onload check

//change bei resize

function checkOrientation(){
    window.addEventListener("resize", checkOrientation);
    const isProbablyMobile = window.innerWidth <= 940;
    const isLandscape = window.matchMedia("(orientation: landscape)").matches;
    const landscapeWrapper = document.getElementById('landscape_modal');
    if (isLandscape && isProbablyMobile) {
        landscapeWrapper.classList.remove('d_none');
        console.log('Landscape mode detected on mobile device');
        
    } else {
        landscapeWrapper.classList.add('d_none');
        console.log('portrait mode detected on mobile device');
    }
}




//event listener für resize

