function checkOrientation(){
    window.addEventListener("resize", checkOrientation);
    const isProbablyMobile = window.innerWidth <= 940;
    const isLandscape = window.matchMedia("(orientation: landscape)").matches;
    const landscapeWrapper = document.getElementById('landscape_modal');
    if (isLandscape && isProbablyMobile) {
        landscapeWrapper.classList.remove('d_none');
    } else {
        landscapeWrapper.classList.add('d_none');
    }
}





