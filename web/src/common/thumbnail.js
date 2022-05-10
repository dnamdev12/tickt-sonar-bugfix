export const thumbnailExtract = ({ videoId, canvasId }) => {
    let _VIDEO = document.querySelector(videoId),
        _CANVAS = document.querySelector(canvasId),
        _CANVAS_CTX = _CANVAS.getContext("2d");

    // Video metadata is loaded
    _VIDEO.addEventListener('loadedmetadata', function () {
        // Set canvas dimensions same as video dimensions
        _CANVAS.width = _VIDEO.videoWidth;
        _CANVAS.height = _VIDEO.videoHeight;
    });

    // Video playback position is changed
    document.querySelector(videoId).addEventListener('timeupdate', function () {
        // You are now ready to grab the thumbnail from the <canvas> element
    });

    // Placing the current frame image of the video in the canvas
    _CANVAS_CTX.drawImage(_VIDEO, 0, 0, _VIDEO.videoWidth, _VIDEO.videoHeight);

    var img = new Image();
    img.crossOrigin = "anonymous"
    img.src = _CANVAS?.toDataURL()
    console.log({
        src: img
    })
    return img.src;
}