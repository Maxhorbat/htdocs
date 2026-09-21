/**
 * Main Application - Crimson Galaxy & Drifting Red Roses
 * Optimizado para fluidez en cualquier dispositivo (móvil → desktop)
 */

(function () {
    'use strict';

    // ── Detección de capacidad del dispositivo ──────────────────────────────
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
        (navigator.maxTouchPoints > 1 && window.innerWidth < 1024);
    const cores = navigator.hardwareConcurrency || 4;
    const mem = navigator.deviceMemory || 4; // GB (Chrome)
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Niveles: 0 = low (móviles débiles), 1 = medium, 2 = high
    let quality = 2;
    if (isMobile || cores <= 4 || mem <= 4) quality = 0;
    else if (cores <= 6 || mem <= 6 || dpr > 1.5) quality = 1;

    // Parámetros por calidad
    const Q = {
        0: { // Low – móviles
            stars: 18000,
            starfield: 1800,
            roses: 10,
            petals: 40,
            petalSeg: 10,
            usePhysical: false,
            antialias: false,
            pixelRatio: 1,
            galaxyArms: 3,
            nebulaCount: 18,
            roseLights: false,
            autoRotateSpeed: 0.55
        },
        1: { // Medium
            stars: 42000,
            starfield: 2800,
            roses: 14,
            petals: 70,
            petalSeg: 14,
            usePhysical: true,
            antialias: true,
            pixelRatio: Math.min(dpr, 1.5),
            galaxyArms: 4,
            nebulaCount: 28,
            roseLights: true,
            autoRotateSpeed: 0.48
        },
        2: { // High
            stars: 70000,
            starfield: 3800,
            roses: 18,
            petals: 95,
            petalSeg: 18,
            usePhysical: true,
            antialias: true,
            pixelRatio: Math.min(dpr, 2),
            galaxyArms: 4,
            nebulaCount: 36,
            roseLights: true,
            autoRotateSpeed: 0.45
        }
    }[quality];

    // Exponer calidad a otros módulos
    window.__APP_QUALITY__ = { level: quality, ...Q };

    let scene, camera, renderer, controls;
    let galaxySystem, starfield;
    let roses = [];
    let loosePetals = [];
    let raycaster, mouse;
    let isUserInteracting = false;
    let targetCameraPosition = null;
    let targetControlsTarget = null;
    let focusedRose = null;

    const clock = new THREE.Clock();

    const container = document.getElementById('canvas-container');
    const btnAudio = document.getElementById('btn-audio');
    const btnReset = document.getElementById('btn-reset');
    const btnFullscreen = document.getElementById('btn-fullscreen');
    const infoOverlay = document.getElementById('info-overlay');
    const btnToggleInfo = document.getElementById('btn-toggle-info');
    const loadingScreen = document.getElementById('loading-screen');

    function init() {
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x120208, 0.0007);

        camera = new THREE.PerspectiveCamera(
            isMobile ? 58 : 52,
            window.innerWidth / window.innerHeight,
            0.1,
            2000
        );
        camera.position.set(0, 22, 68);

        renderer = new THREE.WebGLRenderer({
            antialias: Q.antialias,
            alpha: false,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Q.pixelRatio);
        renderer.setClearColor(0x070104, 1);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.35;
        // r128
        if (renderer.outputEncoding !== undefined) {
            renderer.outputEncoding = THREE.sRGBEncoding;
        }
        // Evitar que el canvas bloquee el scroll en móviles
        renderer.domElement.style.touchAction = 'none';
        container.appendChild(renderer.domElement);

        if (typeof THREE.OrbitControls !== 'undefined') {
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.06;
            controls.rotateSpeed = isMobile ? 0.55 : 0.65;
            controls.zoomSpeed = 0.85;
            controls.maxDistance = 260;
            controls.minDistance = 8;
            controls.autoRotate = true;
            controls.autoRotateSpeed = Q.autoRotateSpeed;
            controls.target.set(0, 0, 0);
            controls.enablePan = !isMobile; // Pan molesto en touch

            controls.addEventListener('start', () => {
                isUserInteracting = true;
                targetCameraPosition = null;
                targetControlsTarget = null;
            });
            controls.addEventListener('end', () => {
                setTimeout(() => {
                    isUserInteracting = false;
                    if (controls) controls.autoRotate = true;
                }, 2000);
            });
        }

        setupLighting();
        createCosmos();
        populateRosesAndPetals();

        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();

        setupEventListeners();

        // Carga terminada
        if (loadingScreen) {
            requestAnimationFrame(() => {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 700);
            });
        }

        animate();
    }

    function setupLighting() {
        const ambient = new THREE.AmbientLight(0x601830, quality === 0 ? 2.4 : 2.8);
        scene.add(ambient);

        const key = new THREE.DirectionalLight(0xfff5ec, quality === 0 ? 1.8 : 2.3);
        key.position.set(30, 45, 50);
        scene.add(key);

        const fill = new THREE.DirectionalLight(0xff3366, quality === 0 ? 1.4 : 1.8);
        fill.position.set(-35, -20, 35);
        scene.add(fill);

        if (quality >= 1) {
            const rim = new THREE.DirectionalLight(0x7090ff, 1.6);
            rim.position.set(-65, 45, -50);
            scene.add(rim);
        }

        // Luz suave ligada a la cámara (solo medium/high)
        if (quality >= 1) {
            const camLight = new THREE.PointLight(0xfff0f5, 1.6, 140, 1.2);
            camera.add(camLight);
            scene.add(camera);
        }
    }

    function createCosmos() {
        starfield = window.GalaxyGenerator.createDeepSpaceStarfield(Q.starfield);
        scene.add(starfield);

        galaxySystem = window.GalaxyGenerator.createRedGalaxy({
            starCount: Q.stars,
            radius: 110,
            arms: Q.galaxyArms,
            spiralTwist: 3.6,
            coreRadius: 15,
            thickness: quality === 0 ? 5.5 : 6.5,
            nebulaCount: Q.nebulaCount
        });
        scene.add(galaxySystem.group);
    }

    function populateRosesAndPetals() {
        // Posiciones base (las primeras N según calidad)
        const roseConfigs = [
            { x: -7, y: 3, z: 28, scale: 1.45, rot: [0.4, 0.6, -0.3] },
            { x: 12, y: -4, z: 24, scale: 1.3, rot: [-0.3, -0.8, 0.4] },
            { x: -14, y: -8, z: 22, scale: 1.35, rot: [0.6, 0.3, 0.2] },
            { x: 5, y: 10, z: 20, scale: 1.2, rot: [-0.5, 0.4, -0.6] },
            { x: -28, y: 14, z: -10, scale: 1.25, rot: [0.8, -0.5, 0.1] },
            { x: 26, y: 16, z: -15, scale: 1.35, rot: [-0.2, 0.7, -0.5] },
            { x: -32, y: -16, z: 5, scale: 1.15, rot: [0.3, 0.9, -0.2] },
            { x: 30, y: -14, z: 12, scale: 1.25, rot: [-0.6, -0.4, 0.5] },
            { x: 0, y: -22, z: -25, scale: 1.4, rot: [0.5, 0.2, -0.7] },
            { x: -18, y: 24, z: -28, scale: 1.25, rot: [-0.4, -0.6, 0.3] },
            { x: 22, y: -22, z: -20, scale: 1.15, rot: [0.7, 0.4, -0.2] },
            { x: -45, y: 20, z: -50, scale: 1.5, rot: [0.2, 0.8, -0.4] },
            { x: 42, y: -25, z: -45, scale: 1.4, rot: [-0.5, -0.7, 0.3] },
            { x: -50, y: -28, z: -35, scale: 1.3, rot: [0.6, -0.2, 0.8] },
            { x: 48, y: 32, z: -40, scale: 1.4, rot: [-0.3, 0.5, -0.6] },
            { x: 0, y: 38, z: -60, scale: 1.55, rot: [0.4, -0.4, 0.2] },
            { x: -25, y: -35, z: -55, scale: 1.4, rot: [-0.6, 0.6, 0.1] },
            { x: 35, y: 35, z: -30, scale: 1.25, rot: [0.5, -0.5, -0.3] }
        ].slice(0, Q.roses);

        const petalCountBase = quality === 0 ? 18 : quality === 1 ? 24 : 30;

        roseConfigs.forEach((cfg, idx) => {
            const rose = window.RoseGenerator.createRose({
                scale: cfg.scale,
                includeStem: true,
                petalCount: petalCountBase + (idx % 4),
                usePhysical: Q.usePhysical,
                includeInnerLight: Q.roseLights
            });

            rose.position.set(cfg.x, cfg.y, cfg.z);
            rose.rotation.set(cfg.rot[0], cfg.rot[1], cfg.rot[2]);
            rose.userData.basePosition.copy(rose.position);
            rose.userData.id = idx;

            scene.add(rose);
            roses.push(rose);
        });

        for (let p = 0; p < Q.petals; p++) {
            const petal = window.RoseGenerator.createLoosePetal(
                0.45 + Math.random() * 0.65,
                Q.usePhysical
            );

            const pRadius = 18 + Math.random() * 80;
            const pTheta = Math.random() * Math.PI * 2;
            const pPhi = (Math.random() - 0.5) * Math.PI * 0.75;

            petal.position.set(
                pRadius * Math.cos(pTheta) * Math.cos(pPhi),
                pRadius * Math.sin(pPhi) * 0.6,
                pRadius * Math.sin(pTheta) * Math.cos(pPhi)
            );
            petal.rotation.set(
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2
            );

            petal.userData.initialRadius = pRadius;
            petal.userData.theta = pTheta;
            petal.userData.phi = pPhi;
            petal.userData.orbitSpeed = (0.00025 + Math.random() * 0.0005) * (Math.random() < 0.5 ? 1 : -1);

            scene.add(petal);
            loosePetals.push(petal);
        }
    }

    function setupEventListeners() {
        window.addEventListener('resize', onWindowResize, { passive: true });
        // pointerdown cubre mouse + touch
        renderer.domElement.addEventListener('pointerdown', onPointerDown, { passive: true });

        if (btnAudio) {
            btnAudio.addEventListener('click', (e) => {
                e.stopPropagation();
                const isPlaying = window.CosmicSoundscape.toggle();
                btnAudio.classList.toggle('active', isPlaying);
                const label = btnAudio.querySelector('.btn-label');
                if (label) label.textContent = isPlaying ? 'Silenciar' : 'Música';
            });
        }

        if (btnReset) {
            btnReset.addEventListener('click', (e) => {
                e.stopPropagation();
                resetCameraView();
            });
        }

        if (btnFullscreen) {
            btnFullscreen.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(() => {});
                } else if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            });
        }

        if (btnToggleInfo && infoOverlay) {
            btnToggleInfo.addEventListener('click', (e) => {
                e.stopPropagation();
                infoOverlay.classList.toggle('minimized');
            });
        }

        // Pausar cuando la pestaña no es visible (ahorro de batería)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                clock.stop();
            } else {
                clock.start();
            }
        });
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Q.pixelRatio);

        if (galaxySystem && galaxySystem.material && galaxySystem.material.uniforms) {
            galaxySystem.material.uniforms.uPixelRatio.value = Q.pixelRatio;
        }
    }

    function onPointerDown(event) {
        if (event.target.closest && (event.target.closest('#ui-container') || event.target.closest('button'))) {
            return;
        }

        const clientX = event.clientX !== undefined ? event.clientX : (event.touches && event.touches[0] ? event.touches[0].clientX : 0);
        const clientY = event.clientY !== undefined ? event.clientY : (event.touches && event.touches[0] ? event.touches[0].clientY : 0);

        mouse.x = (clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(roses, true);

        if (intersects.length > 0) {
            let current = intersects[0].object;
            while (current.parent && !current.userData.isRose) {
                current = current.parent;
            }
            if (current && current.userData.isRose) {
                focusOnRose(current);
            }
        }
    }

    function focusOnRose(rose) {
        focusedRose = rose;
        if (controls) controls.autoRotate = false;

        const rosePos = new THREE.Vector3();
        rose.getWorldPosition(rosePos);

        const offsetDir = new THREE.Vector3().subVectors(camera.position, rosePos).normalize();
        targetCameraPosition = rosePos.clone().add(offsetDir.multiplyScalar(10));
        targetControlsTarget = rosePos.clone();

        if (window.CosmicSoundscape && window.CosmicSoundscape.playChime) {
            const notes = [293.66, 329.63, 369.99, 440.0, 554.37, 659.25];
            window.CosmicSoundscape.playChime(notes[Math.floor(Math.random() * notes.length)]);
        }
        showRoseToast();
    }

    function resetCameraView() {
        focusedRose = null;
        targetCameraPosition = new THREE.Vector3(0, 22, 68);
        targetControlsTarget = new THREE.Vector3(0, 0, 0);
        if (controls) controls.autoRotate = true;
    }

    function showRoseToast() {
        let toast = document.getElementById('rose-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'rose-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = 'Rosa Carmesí en Órbita Eterna';
        toast.classList.add('show');
        clearTimeout(toast.timeoutId);
        toast.timeoutId = setTimeout(() => toast.classList.remove('show'), 2800);
    }

    // ── Bucle de animación ──────────────────────────────────────────────────
    let lastFrame = 0;
    const targetFPS = quality === 0 ? 30 : 60;
    const frameInterval = 1000 / targetFPS;

    function animate(now) {
        requestAnimationFrame(animate);

        // Limitar FPS en dispositivos low para ahorrar batería
        if (quality === 0) {
            if (now - lastFrame < frameInterval) return;
            lastFrame = now;
        }

        if (document.hidden) return;

        const elapsedTime = clock.getElapsedTime();

        if (galaxySystem) galaxySystem.update(elapsedTime);

        if (starfield) {
            starfield.rotation.y = elapsedTime * 0.0025;
        }

        // Rosas
        for (let i = 0; i < roses.length; i++) {
            const rose = roses[i];
            const u = rose.userData;

            rose.rotation.x += u.rotationVelocity.x;
            rose.rotation.y += u.rotationVelocity.y;
            rose.rotation.z += u.rotationVelocity.z;

            const bob = Math.sin(elapsedTime * u.bobbingSpeed + u.bobbingPhase) * u.bobbingAmplitude;
            rose.position.y = u.basePosition.y + bob;

            u.basePosition.addScaledVector(u.driftVelocity, 0.35);

            // Rebote suave dentro de una esfera
            if (u.basePosition.lengthSq() > 19600) { // 140²
                u.driftVelocity.negate();
            }
        }

        // Pétalos sueltos
        for (let i = 0; i < loosePetals.length; i++) {
            const petal = loosePetals[i];
            const p = petal.userData;

            p.theta += p.orbitSpeed;
            petal.position.x = p.initialRadius * Math.cos(p.theta) * Math.cos(p.phi);
            petal.position.z = p.initialRadius * Math.sin(p.theta) * Math.cos(p.phi);
            petal.position.y += Math.sin(elapsedTime * p.tumbleFreq + p.tumblePhase) * 0.018;

            petal.rotation.x += p.rotSpeed.x;
            petal.rotation.y += p.rotSpeed.y;
            petal.rotation.z += p.rotSpeed.z;
        }

        // Cámara suave
        if (targetCameraPosition && targetControlsTarget && !isUserInteracting) {
            camera.position.lerp(targetCameraPosition, 0.045);
            if (controls) controls.target.lerp(targetControlsTarget, 0.045);

            if (camera.position.distanceToSquared(targetCameraPosition) < 0.02) {
                targetCameraPosition = null;
                targetControlsTarget = null;
            }
        }

        if (controls) controls.update();
        renderer.render(scene, camera);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
