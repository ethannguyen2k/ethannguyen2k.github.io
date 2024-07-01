var TVScreen = function(screenElement, width, height) {
    var container = $(screenElement);
    container.css({
        "background-color": "black",
        "position": "relative",
        "overflow": "hidden",
        "width": width,
        "height": height
    });

    var baseLayer = $("<div />");
    var ghostLayer = $("<div />");
    var overlayLayer = $("<div />");

    baseLayer.add(ghostLayer).add(overlayLayer).css({
        "position": "absolute",
        "top": "0px",
        "left": "0px",
        "width": "100%",
        "height": "100%"
    });

    ghostLayer.css("z-index", 100);
    overlayLayer.css({
        "z-index": 200,
        "background": "url('images/screen.png') center center / cover no-repeat",
        "width": "100%",
        "height": "100%"
    });

    container.append([baseLayer, ghostLayer, overlayLayer]);

    function animate() {
        var ghosting = Math.random() / 1.5;
        var judder = Math.floor(Math.exp(Math.random() * 1.5)) - 5;
        var flicker = Math.random() / 1.5 + 0.75;

        baseLayer.css("opacity", flicker);
        baseLayer.css("-webkit-filter", "saturate(1) blur(2px)");
        baseLayer.css("filter", "saturate(1) blur(2px)"); // Add standard filter property
        baseLayer.css("transform", "translate(0px," + judder + "px)");

        ghostLayer.css("opacity", ghosting);
        ghostLayer.css("-webkit-filter", "saturate(0.5) blur(2px)");
        ghostLayer.css("filter", "saturate(0.5) blur(2px)"); // Add standard filter property
        ghostLayer.css("transform", "translate(10px," + judder + "px)");
    }

    this.contentLayers = [baseLayer, ghostLayer];
    this.interval = window.setInterval(animate, 40);
};

TVScreen.prototype.loadContent = function(htmlContent) {
    this.contentLayers.forEach(layer => {
        layer.html(htmlContent);
    });
};
