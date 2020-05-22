var inputDelta = 0;
var exceededThreshold = false;
var inputDown = false;
var hasValidToken = false;

Hooks.on('ready', function() {
    window.addEventListener("mousedown", checkDragBegin);
    window.addEventListener('mousemove', checkDragMove);
    window.addEventListener("mouseup", checkDragEnd);
});

function checkDragBegin(ev) {
    if (!game.user.isGM) return;
    inputDown = true;

    //Check to see if any of the controlled tokens use sight
    //Check to see if any token is interactive and user is hovering
    var controlled = canvas.activeLayer.controlled;
    var hasSightToken = false;
    for (var i=0;i<controlled.length;i++) {
        if (controlled[i].data.vision) hasSightToken = true;
        if (controlled[i].interactive && controlled[i]._hover && hasSightToken) {
            hasValidToken = true;
            break;
        }
    }
}

function checkDragMove() {
    if (!game.user.isGM) return;
    if (!inputDown || exceededThreshold || !hasValidToken) return;

    inputDelta += Math.abs(event.movementX) + Math.abs(event.movementY);

    if (inputDelta > 32) {
        exceededThreshold = true;
        showTokenVision(false);
    }
}

function checkDragEnd() {
    if (!game.user.isGM) return;
    inputDown = false;
    exceededThreshold = false;

    if (!hasValidToken) return;
    showTokenVision(true);
    hasValidToken = false;
}

function showTokenVision(state) {
    canvas.sight.visible = state;
}



