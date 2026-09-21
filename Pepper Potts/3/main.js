/**
 * Main Application - Crimson Galaxy & Drifting Red Roses
 * Renderizado directo de alta fidelidad, auto-inicio y bucle continuo
 */

(function () {
    'use strict';

    // Variables de escena
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

    // Referencias DOM
    const container = document.getElementById('canvas-container');
    const btnAudio = document.getElementById('btn-audio');
    const btnReset = document.getElementById('btn-reset');
    const btnFullscreen = document.getElementById('btn-fullscreen');
    const infoOverlay = document.getElementById('info-overlay');
    const btnToggleInfo = document.getElementById('btn-toggle-info');
    const loadingScreen = document.getElementById('loading-screen');

    /**
     * Inicialización del entorno 3D
     */
    function init() {
        // 1. ESCENA
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x120208, 0.0006);

        // 2. CÁMARA
        camera = new THREE.PerspectiveCamera(
            52,
            window.innerWidth / window.innerHeight,
            0.1,
            2500
        );
        camera.position.set(0, 22, 68);

        // 3. RENDERIZADOR (Directo, sin búferes secundarios que oscurezcan)
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance'
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setClearColor(0x070104, 1);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.45;
        renderer.outputEncoding = THREE.sRGBEncoding;
        container.appendChild(renderer.domElement);

        // 4. CONTROLES DE ÓRBITA CON GIRO CONTINUO AUTOMÁTICO EN BUCLE
        if (typeof THREE.OrbitControls !== 'undefined') {
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.04;
            controls.rotateSpeed = 0.65;
            controls.zoomSpeed = 0.8;
            controls.maxDistance = 280;
            controls.minDistance = 6;
            controls.autoRotate = true;       // Inicia solo y en bucle continuo
            controls.autoRotateSpeed = 0.45;  // Velocidad de giro majestuosa
            controls.target.set(0, 0, 0);

            // Reanudar automáticamente la rotación después de la interacción del usuario
            controls.addEventListener('start', () => {
                isUserInteracting = true;
                targetCameraPosition = null;
                targetControlsTarget = null;
            });
            controls.addEventListener('end', () => {
                setTimeout(() => {
                    isUserInteracting = false;
                    controls.autoRotate = true;
                }, 2200);
            });
        }

        // 5. ILUMINACIÓN MULTICAPA ULTRA-LUMINOSA
        setupLighting();

        // 6. CREACIÓN DE LA GALAXIA ROJA Y ESTRELLAS
        createCosmos();

        // 7. CREACIÓN DE LAS ROSAS ROJAS Y PÉTALOS FLOTANTES
        populateRosesAndPetals();

        // 8. RAYCASTING PARA INTERACCIÓN
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();

        // 9. EVENT LISTENERS
        setupEventListeners();

        // Desvanecer pantalla de carga inmediatamente
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 600);
        }

        // Iniciar bucle continuo de animación
        animate();
    }

    /**
     * Iluminación multicapa: ambient, clave, relleno, rim y luz acoplada a la cámara
     */
    function setupLighting() {
        // Luz ambiental cósmica viva
        const ambientLight = new THREE.AmbientLight(0x601830, 3.2);
        scene.add(ambientLight);

        // Luz frontal principal (Key Light)
        const keyLight = new THREE.DirectionalLight(0xfff5ec, 2.6);
        keyLight.position.set(30, 45, 50);
        scene.add(keyLight);

        // Luz de relleno rubí
        const fillLight = new THREE.DirectionalLight(0xff3366, 2.0);
        fillLight.position.set(-35, -20, 35);
        scene.add(fillLight);

        // Luz de borde cósmica azulada para contraste dramático
        const rimLight = new THREE.DirectionalLight(0x7090ff, 2.2);
        rimLight.position.set(-65, 45, -50);
        scene.add(rimLight);

        // Luz puntual acoplada a la cámara: garantiza que cualquier ángulo esté bien iluminado
        const cameraLight = new THREE.PointLight(0xfff0f5, 2.2, 160, 1.0);
        camera.add(cameraLight);
        scene.add(camera);
    }

    /**
     * Construye la Galaxia Roja y el Fondo de Estrellas
     */
    function createCosmos() {
        starfield = window.GalaxyGenerator.createDeepSpaceStarfield(4200);
        scene.add(starfield);

        galaxySystem = window.GalaxyGenerator.createRedGalaxy({
            starCount: 85000,
            radius: 115,
            arms: 4,
            spiralTwist: 3.8,
            coreRadius: 16,
            thickness: 6.8
        });
        scene.add(galaxySystem.group);
    }

    /**
     * Genera las rosas rojas y los pétalos a la deriva
     */
    function populateRosesAndPetals() {
        const roseConfigs = [
            // Rosas de primer plano cercano
            { x: -7, y: 3, z: 28, scale: 1.5, rot: [0.4, 0.6, -0.3] },
            { x: 12, y: -4, z: 24, scale: 1.35, rot: [-0.3, -0.8, 0.4] },
            { x: -14, y: -8, z: 22, scale: 1.4, rot: [0.6, 0.3, 0.2] },
            { x: 5, y: 10, z: 20, scale: 1.25, rot: [-0.5, 0.4, -0.6] },

            // Rosas de plano medio
            { x: -28, y: 14, z: -10, scale: 1.3, rot: [0.8, -0.5, 0.1] },
            { x: 26, y: 16, z: -15, scale: 1.4, rot: [-0.2, 0.7, -0.5] },
            { x: -32, y: -16, z: 5, scale: 1.2, rot: [0.3, 0.9, -0.2] },
            { x: 30, y: -14, z: 12, scale: 1.3, rot: [-0.6, -0.4, 0.5] },
            { x: 0, y: -22, z: -25, scale: 1.5, rot: [0.5, 0.2, -0.7] },
            { x: -18, y: 24, z: -28, scale: 1.3, rot: [-0.4, -0.6, 0.3] },
            { x: 22, y: -22, z: -20, scale: 1.2, rot: [0.7, 0.4, -0.2] },

            // Rosas lejanas a la deriva
            { x: -45, y: 20, z: -50, scale: 1.6, rot: [0.2, 0.8, -0.4] },
            { x: 42, y: -25, z: -45, scale: 1.5, rot: [-0.5, -0.7, 0.3] },
            { x: -50, y: -28, z: -35, scale: 1.4, rot: [0.6, -0.2, 0.8] },
            { x: 48, y: 32, z: -40, scale: 1.5, rot: [-0.3, 0.5, -0.6] },
            { x: 0, y: 38, z: -60, scale: 1.7, rot: [0.4, -0.4, 0.2] },
            { x: -25, y: -35, z: -55, scale: 1.5, rot: [-0.6, 0.6, 0.1] },
            { x: 35, y: 35, z: -30, scale: 1.3, rot: [0.5, -0.5, -0.3] }
        ];

        roseConfigs.forEach((cfg, idx) => {
            const rose = window.RoseGenerator.createRose({
                scale: cfg.scale,
                includeStem: true,
                petalCount: 32 + (idx % 6)
            });

            rose.position.set(cfg.x, cfg.y, cfg.z);
            rose.rotation.set(cfg.rot[0], cfg.rot[1], cfg.rot[2]);

            rose.userData.basePosition.copy(rose.position);
            rose.userData.id = idx;

            scene.add(rose);
            roses.push(rose);
        });

        // 110 pétalos sueltos a la deriva en gravedad cero
        const loosePetalCount = 110;
        for (let p = 0; p < loosePetalCount; p++) {
            const petal = window.RoseGenerator.createLoosePetal(0.5 + Math.random() * 0.7);

            const pRadius = 15 + Math.random() * 85;
            const pTheta = Math.random() * Math.PI * 2;
            const pPhi = (Math.random() - 0.5) * Math.PI * 0.8;

            petal.position.set(
                pRadius * Math.cos(pTheta) * Math.cos(pPhi),
                pRadius * Math.sin(pPhi) * 0.65,
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
            petal.userData.orbitSpeed = (0.0003 + Math.random() * 0.0006) * (Math.random() < 0.5 ? 1 : -1);

            scene.add(petal);
            loosePetals.push(petal);
        }
    }

    /**
     * Eventos de usuario e interactividad
     */
    function setupEventListeners() {
        window.addEventListener('resize', onWindowResize, false);
        window.addEventListener('pointerdown', onPointerDown, false);

        // Botón de Audio
        if (btnAudio) {
            btnAudio.addEventListener('click', (e) => {
                e.stopPropagation();
                const isPlaying = window.CosmicSoundscape.toggle();
                if (isPlaying) {
                    btnAudio.classList.add('active');
                    btnAudio.querySelector('.btn-label').textContent = 'Silenciar Cosmos';
                } else {
                    btnAudio.classList.remove('active');
                    btnAudio.querySelector('.btn-label').textContent = 'Sonido Cósmico';
                }
            });
        }

        // Botón de Vista Cósmica General (Reset)
        if (btnReset) {
            btnReset.addEventListener('click', (e) => {
                e.stopPropagation();
                resetCameraView();
            });
        }

        // Botón de Pantalla Completa
        if (btnFullscreen) {
            btnFullscreen.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(() => {});
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    }
                }
            });
        }

        // Botón para alternar texto informativo
        if (btnToggleInfo && infoOverlay) {
            btnToggleInfo.addEventListener('click', (e) => {
                e.stopPropagation();
                infoOverlay.classList.toggle('minimized');
            });
        }
    }

    /**
     * Manejo de redimensionamiento de ventana
     */
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

        if (galaxySystem && galaxySystem.material) {
            galaxySystem.material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio || 1, 2);
        }
    }

    /**
     * Clic o toque: enfocar una rosa flotante
     */
    function onPointerDown(event) {
        if (event.target.closest('#ui-container') || event.target.closest('button')) {
            return;
        }

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

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

    /**
     * Enfocar una rosa suavemente
     */
    function focusOnRose(rose) {
        focusedRose = rose;
        if (controls) {
            controls.autoRotate = false;
        }

        const rosePos = new THREE.Vector3();
        rose.getWorldPosition(rosePos);

        const offsetDir = new THREE.Vector3().subVectors(camera.position, rosePos).normalize();
        targetCameraPosition = rosePos.clone().add(offsetDir.multiplyScalar(9.5));
        targetControlsTarget = rosePos.clone();

        const notes = [293.66, 329.63, 369.99, 440.0, 554.37, 659.25];
        const randomNote = notes[Math.floor(Math.random() * notes.length)];
        window.CosmicSoundscape.playChime(randomNote);

        showRoseToast();
    }

    /**
     * Regresar la vista panorámica a la galaxia
     */
    function resetCameraView() {
        focusedRose = null;
        targetCameraPosition = new THREE.Vector3(0, 22, 68);
        targetControlsTarget = new THREE.Vector3(0, 0, 0);

        if (controls) {
            controls.autoRotate = true;
        }
    }

    /**
     * Notificación visual al contemplar una rosa
     */
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
        toast.timeoutId = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    /**
     * Bucle continuo de animación (Loop infinito automático)
     */
    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // 1. Galaxia Roja en rotación y pulsación continua
        if (galaxySystem) {
            galaxySystem.update(elapsedTime);
        }

        // 2. Fondo estelar
        if (starfield) {
            starfield.rotation.y = elapsedTime * 0.003;
        }

        // 3. Flotación de rosas en gravedad cero
        roses.forEach((rose) => {
            const uData = rose.userData;

            rose.rotation.x += uData.rotationVelocity.x;
            rose.rotation.y += uData.rotationVelocity.y;
            rose.rotation.z += uData.rotationVelocity.z;

            const bob = Math.sin(elapsedTime * uData.bobbingSpeed + uData.bobbingPhase) * uData.bobbingAmplitude;
            rose.position.y = uData.basePosition.y + bob;

            uData.basePosition.addScaledVector(uData.driftVelocity, 0.4);

            if (uData.basePosition.length() > 140) {
                uData.driftVelocity.negate();
            }
        });

        // 4. Pétalos sueltos a la deriva en bucle envolvente
        loosePetals.forEach((petal) => {
            const pData = petal.userData;

            pData.theta += pData.orbitSpeed;
            petal.position.x = pData.initialRadius * Math.cos(pData.theta) * Math.cos(pData.phi);
            petal.position.z = pData.initialRadius * Math.sin(pData.theta) * Math.cos(pData.phi);
            petal.position.y += Math.sin(elapsedTime * pData.tumbleFreq + pData.tumblePhase) * 0.02;

            petal.rotation.x += pData.rotSpeed.x;
            petal.rotation.y += pData.rotSpeed.y;
            petal.rotation.z += pData.rotSpeed.z;
        });

        // 5. Suavizado de cámara hacia la rosa enfocada o vista cósmica
        if (targetCameraPosition && targetControlsTarget && !isUserInteracting) {
            camera.position.lerp(targetCameraPosition, 0.04);
            if (controls) {
                controls.target.lerp(targetControlsTarget, 0.04);
            }

            if (camera.position.distanceTo(targetCameraPosition) < 0.1) {
                targetCameraPosition = null;
                targetControlsTarget = null;
            }
        }

        // 6. Actualización continua de OrbitControls (Giro automático en bucle continuo)
        if (controls) {
            controls.update();
        }

        // 7. Renderizado directo garantizado (sin pantallas negras)
        renderer.render(scene, camera);
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
