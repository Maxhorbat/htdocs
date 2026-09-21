/**
 * Soundscape - Procedural Cosmic Ambient Sound Engine
 * Built with Web Audio API (Zero external audio files required)
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

    class SoundEngine {
        constructor() {
            this.ctx = null;
            this.masterGain = null;
            this.isPlaying = false;
            this.droneNodes = [];
            this.chordNodes = [];
            this.filterNode = null;
        }

        init() {
            if (this.ctx) return;
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();

            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
            this.masterGain.connect(this.ctx.destination);

            // Filtro maestro cálido para emular el vacío del espacio
            this.filterNode = this.ctx.createBiquadFilter();
            this.filterNode.type = 'lowpass';
            this.filterNode.frequency.setValueAtTime(650, this.ctx.currentTime);
            this.filterNode.Q.setValueAtTime(2.5, this.ctx.currentTime);
            this.filterNode.connect(this.masterGain);

            // Reverb convolucional sintética / retardo espacial estéreo
            this.createSpaceDelay();
        }

        createSpaceDelay() {
            const delay = this.ctx.createDelay();
            delay.delayTime.setValueAtTime(0.65, this.ctx.currentTime);

            const feedback = this.ctx.createGain();
            feedback.gain.setValueAtTime(0.42, this.ctx.currentTime);

            const delayFilter = this.ctx.createBiquadFilter();
            delayFilter.type = 'lowpass';
            delayFilter.frequency.setValueAtTime(800, this.ctx.currentTime);

            this.filterNode.connect(delay);
            delay.connect(delayFilter);
            delayFilter.connect(feedback);
            feedback.connect(delay);
            feedback.connect(this.masterGain);
        }

        start() {
            if (!this.ctx) this.init();
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }

            if (this.isPlaying) return;

            const now = this.ctx.currentTime;
            this.masterGain.gain.cancelScheduledValues(now);
            this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
            this.masterGain.gain.exponentialRampToValueAtTime(0.35, now + 3.0);

            this.spawnDrone();
            this.spawnChords();

            this.isPlaying = true;
        }

        stop() {
            if (!this.isPlaying || !this.ctx) return;

            const now = this.ctx.currentTime;
            this.masterGain.gain.cancelScheduledValues(now);
            this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
            this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);

            setTimeout(() => {
                this.cleanupNodes();
                this.isPlaying = false;
            }, 1600);
        }

        toggle() {
            if (this.isPlaying) {
                this.stop();
                return false;
            } else {
                this.start();
                return true;
            }
        }

        spawnDrone() {
            // Frecuencias base en afinación profunda (D2 = 73.42Hz, A1 = 55Hz, D1 = 36.7Hz)
            const freqs = [36.71, 73.42, 110.0];

            freqs.forEach((f, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = idx === 0 ? 'sine' : 'triangle';
                osc.frequency.setValueAtTime(f, this.ctx.currentTime);

                // LFO para respiración cósmica lenta
                const lfo = this.ctx.createOscillator();
                const lfoGain = this.ctx.createGain();
                lfo.frequency.setValueAtTime(0.08 + idx * 0.04, this.ctx.currentTime);
                lfoGain.gain.setValueAtTime(1.5 + idx, this.ctx.currentTime);
                lfo.connect(osc.detune);
                lfo.start();

                gain.gain.setValueAtTime(0.12 / (idx + 1), this.ctx.currentTime);

                osc.connect(gain);
                gain.connect(this.filterNode);
                osc.start();

                this.droneNodes.push(osc, gain, lfo, lfoGain);
            });
        }

        spawnChords() {
            // Acorde etéreo extendido: D menor 9 (D3, F3, A3, C4, E4)
            const chordFreqs = [146.83, 174.61, 220.0, 261.63, 329.63];

            chordFreqs.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sine';
                // Ligera desafinación para textura de coro analógico
                const detuneCents = (Math.random() - 0.5) * 14.0;
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
                osc.detune.setValueAtTime(detuneCents, this.ctx.currentTime);

                // Modulación de amplitud lenta e independiente
                const tremolo = this.ctx.createOscillator();
                const tremoloGain = this.ctx.createGain();
                tremolo.frequency.setValueAtTime(0.12 + Math.random() * 0.08, this.ctx.currentTime);
                tremoloGain.gain.setValueAtTime(0.025, this.ctx.currentTime);

                gain.gain.setValueAtTime(0.045, this.ctx.currentTime);

                tremolo.connect(tremoloGain);
                tremoloGain.connect(gain.gain);
                tremolo.start();

                osc.connect(gain);
                gain.connect(this.filterNode);
                osc.start();

                this.chordNodes.push(osc, gain, tremolo, tremoloGain);
            });
        }

        playChime(noteFreq = 440) {
            if (!this.ctx || !this.isPlaying) return;

            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(noteFreq, now);
            osc.frequency.exponentialRampToValueAtTime(noteFreq * 1.5, now + 1.2);

            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(0.12, now + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

            osc.connect(gain);
            gain.connect(this.filterNode);

            osc.start(now);
            osc.stop(now + 2.5);
        }

        cleanupNodes() {
            [...this.droneNodes, ...this.chordNodes].forEach(node => {
                try {
                    if (node.stop) node.stop();
                    if (node.disconnect) node.disconnect();
                } catch (e) {
                    // Ignorar errores al desconectar nodos inactivos
                }
            });
            this.droneNodes = [];
            this.chordNodes = [];
        }
    }

    return new SoundEngine();
}));
