/**
 * Soundscape - Reproduce "Mi Tesoro" (Zion & Lennox, Nicky Jam) desde YouTube
 * Video: https://youtu.be/T5uxlcVJGw4
 * API compatible: toggle() / playChime()
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.CosmicSoundscape = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    var YT_VIDEO_ID = 'T5uxlcVJGw4';

    function SoundEngine() {
        this.player = null;
        this.isPlaying = false;
        this.ready = false;
        this._pendingPlay = false;
        this._apiLoading = false;
    }

    SoundEngine.prototype._loadApi = function () {
        if (this._apiLoading || (window.YT && window.YT.Player)) return;
        this._apiLoading = true;

        var tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        var first = document.getElementsByTagName('script')[0];
        if (first && first.parentNode) {
            first.parentNode.insertBefore(tag, first);
        } else {
            document.head.appendChild(tag);
        }

        var self = this;
        var prev = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = function () {
            if (typeof prev === 'function') prev();
            self._createPlayer();
        };
    };

    SoundEngine.prototype._createPlayer = function () {
        if (!window.YT || !window.YT.Player) return;
        if (this.player) return;

        var wrap = document.getElementById('yt-player-wrap');
        if (wrap) {
            wrap.style.cssText = 'position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;overflow:hidden;z-index:-1;left:-9999px;';
        }

        var self = this;
        this.player = new window.YT.Player('yt-player', {
            height: '1',
            width: '1',
            videoId: YT_VIDEO_ID,
            playerVars: {
                autoplay: 0,
                controls: 0,
                disablekb: 1,
                fs: 0,
                modestbranding: 1,
                playsinline: 1,
                rel: 0,
                loop: 1,
                playlist: YT_VIDEO_ID
            },
            events: {
                onReady: function () {
                    self.ready = true;
                    if (self._pendingPlay) {
                        self._pendingPlay = false;
                        self._doPlay();
                    }
                },
                onStateChange: function (e) {
                    if (e.data === 1) {
                        self.isPlaying = true;
                    } else if (e.data === 2) {
                        self.isPlaying = false;
                    } else if (e.data === 0) {
                        self.isPlaying = false;
                        if (self.player && self.player.playVideo) {
                            try {
                                self.player.seekTo(0);
                                self.player.playVideo();
                            } catch (err) {}
                        }
                    }
                },
                onError: function () {
                    self.isPlaying = false;
                }
            }
        });
    };

    SoundEngine.prototype._doPlay = function () {
        if (!this.player || typeof this.player.playVideo !== 'function') return;
        try {
            if (typeof this.player.unMute === 'function') this.player.unMute();
            if (typeof this.player.setVolume === 'function') this.player.setVolume(85);
            this.player.playVideo();
            this.isPlaying = true;
        } catch (e) {
            this.isPlaying = false;
        }
    };

    SoundEngine.prototype._doPause = function () {
        if (!this.player || typeof this.player.pauseVideo !== 'function') return;
        try {
            this.player.pauseVideo();
            this.isPlaying = false;
        } catch (e) {}
    };

    SoundEngine.prototype.start = function () {
        if (!window.YT || !window.YT.Player) {
            this._pendingPlay = true;
            this._loadApi();
            return;
        }
        if (!this.player) {
            this._pendingPlay = true;
            this._createPlayer();
            return;
        }
        if (!this.ready) {
            this._pendingPlay = true;
            return;
        }
        this._doPlay();
    };

    SoundEngine.prototype.stop = function () {
        this._pendingPlay = false;
        this._doPause();
    };

    SoundEngine.prototype.toggle = function () {
        if (this.isPlaying) {
            this.stop();
            return false;
        }
        this.start();
        return true;
    };

    SoundEngine.prototype.playChime = function () {
        // Compatible con main.js; la música de YouTube es el ambiente
    };

    var engine = new SoundEngine();
    if (typeof document !== 'undefined') {
        if (window.requestIdleCallback) {
            window.requestIdleCallback(function () { engine._loadApi(); });
        } else {
            setTimeout(function () { engine._loadApi(); }, 600);
        }
    }
    return engine;
}));
