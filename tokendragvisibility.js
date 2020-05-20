var focusToken;
var hoverToken;
var inputDelta = 0;
var exceededThreshold = false;

Hooks.on('ready', function() {
    if (!game.user.isGM) return;

    window.addEventListener("mousedown", function(ev) {
        if (ev.button != 0 || hoverToken == undefined) return;

        focusToken = hoverToken;
        inputDelta = 0;
        exceededThreshold = false;
    });

    window.addEventListener('mousemove', function(ev) {
        if (exceededThreshold || focusToken == undefined) return;
        
        inputDelta += Math.abs(event.movementX) + Math.abs(event.movementY);

        if (inputDelta > 32) {
            canvas.sight.visible = false;
            exceededThreshold = true;
        }
    });

    window.addEventListener("mouseup", function() {
        if (focusToken == undefined) return;

        if (focusToken.data.vision && focusToken.owner) canvas.sight.visible = true;
        focusToken = undefined;
    });
});

Hooks.on("hoverToken", (token, isHovering) => {
    if (!game.user.isGM || focusToken != undefined) return;

    hoverToken = isHovering? token : undefined;
});

Hooks.on('controlToken', (token, hasControl) => {
    if (!game.user.isGM) return;

    //Lost control of token, reenable vision
    if (!hasControl && (focusToken == undefined || token.data._id == focusToken.data._id)) {
        canvas.sight.visible = false;
        focusToken = undefined;
    }
});

