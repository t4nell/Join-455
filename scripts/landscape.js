function checkOrientation(){
    window.addEventListener("resize", checkOrientation);
    const isProbablyMobile = window.innerWidth <= 940;
    const isLandscape = window.matchMedia("(orientation: landscape)").matches;
    const landscapeWrapper = document.getElementById('landscape_modal');
    const body = document.body;
    if (isLandscape && isProbablyMobile) {
        landscapeWrapper.classList.remove('d_none');
        body.classList.add('no_scroll');
    } else {
        landscapeWrapper.classList.add('d_none');
        body.classList.remove('no_scroll');
    }
}





