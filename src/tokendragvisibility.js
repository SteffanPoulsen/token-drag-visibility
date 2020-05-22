var focusToken;
var hoverToken;
var inputDelta = 0;
var exceededThreshold = false;
var inputDown = false;

Hooks.on('ready', function() {
    window.addEventListener("mousedown", checkDragBegin);
    window.addEventListener('mousemove', checkDragMove);
    window.addEventListener("mouseup", checkDragEnd);
});

function checkDragBegin(ev) {
    if (!game.user.isGM) return;

    inputDown = true;
    if (ev.button != 0 || focusToken == undefined || focusToken != hoverToken) return;

    inputDelta = 0;
    exceededThreshold = false;
}

function checkDragMove() {
    if (!game.user.isGM) return;

    if (exceededThreshold || focusToken == undefined || !inputDown) return;
        
    inputDelta += Math.abs(event.movementX) + Math.abs(event.movementY);

    if (inputDelta > 32) {
        canvas.sight.visible = false;
        exceededThreshold = true;
    }
}

function checkDragEnd() {
    if (!game.user.isGM) return;

    inputDown = false;
    if (focusToken == undefined) return;
    if (focusToken.data.vision && focusToken.owner) canvas.sight.visible = true;
}

Hooks.on("hoverToken", (token, isHovering) => {
    if (!game.user.isGM || inputDown) return;
    hoverToken = isHovering? token : undefined;
});

Hooks.on('controlToken', (token, hasControl) => {
    if (!game.user.isGM) return;

    if (hasControl) {
        focusToken = token;
        hoverToken = token;
    } else if (focusToken == undefined || token.data._id == focusToken.data._id) {
        canvas.sight.visible = false;
        focusToken = undefined;
    }
});