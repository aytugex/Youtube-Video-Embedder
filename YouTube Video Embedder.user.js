// ==UserScript==
// @name         YouTube Video Embedder
// @namespace    http://yourwebsite.com
// @version      1.0
// @description  Embeds the current YouTube video in the "player" div.
// @author       Your Name
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let currentVideoId = null;
    let embeddedVideo = null;

    function stopEmbeddedVideo() {
        if (embeddedVideo) {
            // Stop the currently playing video
            embeddedVideo.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
        }
    }

    function checkForPlayerDiv() {
        // Pause the main YouTube video player
        var mainVideoContainer = document.querySelector('div[data-video-id]');
        if (mainVideoContainer) {
            var video = document.querySelector('video');
            if (video) {
                console.log(`stopping main player`);
                video.pause();
            }
        }
        const playerDiv = document.getElementById("player");
        if (playerDiv) {
            const videoId = new URL(window.location.href).searchParams.get("v");

            if (!videoId){
                stopEmbeddedVideo();
            }

            if (videoId && currentVideoId !== videoId) {
                currentVideoId = videoId;
                if (embeddedVideo) {
                    stopEmbeddedVideo();
                }
                embeddedVideo = document.createElement("iframe");
                embeddedVideo.style.width = "100%";
                embeddedVideo.style.aspectRatio="16/9";

                embeddedVideo.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`;
                embeddedVideo.title = "YouTube video player";
                embeddedVideo.frameborder = 0;
                embeddedVideo.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
                embeddedVideo.allowFullscreen = true;

                playerDiv.innerHTML = "";
                playerDiv.appendChild(embeddedVideo);

            }
        }else{
            stopEmbeddedVideo();
        }
    }
    const checkInterval = setInterval(checkForPlayerDiv, 1000);
})();