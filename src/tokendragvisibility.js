var focusToken;
var hoverToken;
var inputDelta = 0;
var exceededThreshold = false;
var inputDown = false;

Hooks.on('ready', function() {
    if (!game.user.isGM) return;

    window.addEventListener("mousedown", function(ev) {
        inputDown = true;
        if (ev.button != 0 || focusToken == undefined || focusToken != hoverToken) return;

        inputDelta = 0;
        exceededThreshold = false;
    });

    window.addEventListener('mousemove', function(ev) {
        if (exceededThreshold || focusToken == undefined || !inputDown) return;
        
        inputDelta += Math.abs(event.movementX) + Math.abs(event.movementY);

        if (inputDelta > 32) {
            canvas.sight.visible = false;
            exceededThreshold = true;
        }
    });

    window.addEventListener("mouseup", function() {
        inputDown = false;
        if (focusToken == undefined) return;
        if (focusToken.data.vision && focusToken.owner) canvas.sight.visible = true;
    });
});

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