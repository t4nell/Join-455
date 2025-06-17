/**
 * Checks the device orientation and screen size to display a landscape mode warning on mobile devices.
 * 
 * This function monitors window resizing events and determines if the device is likely a mobile device
 * in landscape orientation. If so, it displays a warning modal and prevents scrolling on the body.
 * When the orientation changes back to portrait or on larger screens, the modal is hidden and
 * scrolling is re-enabled.
 * 
 * @function
 * @listens window:resize - Triggers when the browser window is resized
 */
function checkOrientation() {
    window.addEventListener('resize', checkOrientation);
    const isProbablyMobile = window.innerWidth <= 940;
    const isLandscape = window.matchMedia('(orientation: landscape)').matches;
    const landscapeWrapper = document.getElementById('landscape_modal');
    const body = document.body;
    if (isLandscape && isProbablyMobile) {
        landscapeWrapper.classList.remove('d_none');
        body.classList.add('no_scroll');
    } else {
        landscapeWrapper.classList.add('d_none');
        body.classList.remove('no_scroll');
    }
};