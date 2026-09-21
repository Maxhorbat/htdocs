/**
 * GalaxyGenerator - Majestic Crimson Spiral Galaxy with Differential Rotation & Volumetric Core
 * Built for Three.js
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['three'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('three'));
    } else {
        root.GalaxyGenerator = factory(root.THREE || window.THREE);
    }
}(typeof self !== 'undefined' ? self : this, function (THREE) {
    'use strict';

    /**
     * Genera una textura procedural circular con caída suave para las partículas de estrellas
     */
    function createStarSpriteTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');

        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
        grad.addColorStop(0.2, 'rgba(255, 230, 235, 0.95)');
        grad.addColorStop(0.5, 'rgba(255, 50, 80, 0.6)');
        grad.addColorStop(0.8, 'rgba(180, 15, 45, 0.25)');
        grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        return texture;
    }

    /**
     * Genera una textura de polvo nebular suave
     */
    function createNebulaCloudTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');

        const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        grad.addColorStop(0.0, 'rgba(255, 70, 105, 0.65)');
        grad.addColorStop(0.4, 'rgba(230, 25, 60, 0.35)');
        grad.addColorStop(0.75, 'rgba(150, 10, 40, 0.15)');
        grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 128, 128);

        const texture = new THREE.CanvasTexture(canvas);
        return texture;
    }

    /**
     * Shaders GLSL para las partículas estelares de la galaxia
     */
    const GalaxyShader = {
        vertexShader: `
            precision highp float;
            uniform float uTime;
            uniform float uSize;
            uniform float uPixelRatio;

            attribute float aScale;
            attribute float aRandomness;
            attribute float aOrbitSpeed;
            attribute float aDistance;
            attribute vec3 aInitialColor;

            varying vec3 vColor;
            varying float vAlpha;

            void main() {
                // Rotación orbital diferencial: las estrellas internas orbitan a mayor velocidad angular
                float angle = aOrbitSpeed * uTime * 0.18;
                
                // Rotación en el plano XZ (plano galáctico)
                float cosA = cos(angle);
                float sinA = sin(angle);
                
                vec3 rotatedPosition = position;
                rotatedPosition.x = position.x * cosA - position.z * sinA;
                rotatedPosition.z = position.x * sinA + position.z * cosA;

                // Ondulación cósmica vertical
                rotatedPosition.y += sin(uTime * 0.4 + aDistance * 0.1) * (0.3 + aDistance * 0.02);

                vec4 mvPosition = modelViewMatrix * vec4(rotatedPosition, 1.0);
                gl_Position = projectionMatrix * mvPosition;

                // Tamaño de partícula adaptativo a la distancia de la cámara y resolución
                float distFactor = max(1.0, -mvPosition.z * 0.035);
                gl_PointSize = (uSize * aScale * uPixelRatio) / distFactor;
                gl_PointSize = max(gl_PointSize, 2.0);

                // Centelleo estelar sutil
                float twinkle = 0.88 + 0.12 * sin(uTime * 2.8 + aRandomness * 60.0);
                vColor = aInitialColor * twinkle;
                vAlpha = min(1.0, 0.5 + 0.5 * (1.0 - smoothstep(110.0, 150.0, aDistance)));
            }
        `,
        fragmentShader: `
            precision highp float;
            uniform sampler2D uTexture;
            varying vec3 vColor;
            varying float vAlpha;

            void main() {
                vec4 texColor = texture2D(uTexture, gl_PointCoord);
                gl_FragColor = vec4(vColor * texColor.rgb, texColor.a * vAlpha);
            }
        `
    };

    /**
     * Construye la galaxia espiral roja completa
     */
    function createRedGalaxy(options = {}) {
        const {
            starCount = 85000,
            radius = 120,
            arms = 4,
            spiralTwist = 3.8,
            coreRadius = 16,
            thickness = 7.0
        } = options;

        const galaxyGroup = new THREE.Group();

        // 1. GENERACIÓN DE PARTÍCULAS ESTELARES ESPIRALES
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const scales = new Float32Array(starCount);
        const randomness = new Float32Array(starCount);
        const orbitSpeeds = new Float32Array(starCount);
        const distances = new Float32Array(starCount);

        const colorCore = new THREE.Color('#ffffff');      // Núcleo blanco estelar
        const colorInnerGlow = new THREE.Color('#ff5544');  // Resplandor escarlata ardiente
        const colorMidArm = new THREE.Color('#ff1d45');    // Rojo carmesí brillante en los brazos
        const colorOuterArm = new THREE.Color('#c40d2a');  // Rubí vivo
        const colorRimDust = new THREE.Color('#6a0316');   // Polvo cósmico

        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;

            const rNorm = Math.pow(Math.random(), 1.7);
            const r = rNorm * radius;
            distances[i] = r;

            const armIndex = i % arms;
            const armAngle = (armIndex / arms) * Math.PI * 2;
            const spiralAngle = Math.pow(r / radius, 0.75) * spiralTwist;
            const finalAngle = armAngle + spiralAngle;

            const spreadFactor = Math.pow(r / radius, 0.6) * 7.5 + 0.8;
            const randomX = (Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1)) * spreadFactor;
            const randomZ = (Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1)) * spreadFactor;
            
            const heightFalloff = Math.max(0.1, 1.0 - (r / radius) * 0.4);
            const randomY = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1)) * (thickness * heightFalloff);

            positions[i3] = Math.cos(finalAngle) * r + randomX;
            positions[i3 + 1] = randomY;
            positions[i3 + 2] = Math.sin(finalAngle) * r + randomZ;

            orbitSpeeds[i] = 1.0 / Math.sqrt(Math.max(4.0, r * 0.5 + 2.0));
            scales[i] = (0.7 + Math.random() * 2.0) * (r < coreRadius ? 1.5 : 1.0);
            randomness[i] = Math.random();

            let starColor;
            const normDist = r / radius;

            if (normDist < 0.08) {
                starColor = colorCore.clone().lerp(colorInnerGlow, normDist / 0.08);
            } else if (normDist < 0.35) {
                const t = (normDist - 0.08) / 0.27;
                starColor = colorInnerGlow.clone().lerp(colorMidArm, t);
            } else if (normDist < 0.75) {
                const t = (normDist - 0.35) / 0.4;
                starColor = colorMidArm.clone().lerp(colorOuterArm, t);
            } else {
                const t = (normDist - 0.75) / 0.25;
                starColor = colorOuterArm.clone().lerp(colorRimDust, t);
            }

            if (Math.random() < 0.1) {
                starColor.addScalar(0.25);
            }

            colors[i3] = starColor.r;
            colors[i3 + 1] = starColor.g;
            colors[i3 + 2] = starColor.b;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('aInitialColor', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
        geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 1));
        geometry.setAttribute('aOrbitSpeed', new THREE.BufferAttribute(orbitSpeeds, 1));
        geometry.setAttribute('aDistance', new THREE.BufferAttribute(distances, 1));

        const starTexture = createStarSpriteTexture();

        const galaxyMaterial = new THREE.ShaderMaterial({
            vertexShader: GalaxyShader.vertexShader,
            fragmentShader: GalaxyShader.fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uSize: { value: 36.0 },
                uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
                uTexture: { value: starTexture }
            },
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            transparent: true
        });

        const starPoints = new THREE.Points(geometry, galaxyMaterial);
        galaxyGroup.add(starPoints);

        // 2. NÚCLEO GALÁCTICO SUPERMASIVO & HALOS VOLUMÉTRICOS DE RESPLANDOR
        // Esfera externa de resplandor rubí
        const coreGlowGeom = new THREE.SphereGeometry(6.0, 32, 32);
        const coreGlowMat = new THREE.MeshBasicMaterial({
            color: 0xff2d55,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending
        });
        const coreGlowMesh = new THREE.Mesh(coreGlowGeom, coreGlowMat);
        galaxyGroup.add(coreGlowMesh);

        // Halo de resplandor interior blanco estelar puro
        const coreInnerGeom = new THREE.SphereGeometry(2.8, 32, 32);
        const coreInnerMat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 1.0,
            blending: THREE.AdditiveBlending
        });
        const coreInnerMesh = new THREE.Mesh(coreInnerGeom, coreInnerMat);
        galaxyGroup.add(coreInnerMesh);

        // Gran aureola de corona galáctica (bilboard)
        const coronaTexture = createNebulaCloudTexture();
        const coronaMat = new THREE.SpriteMaterial({
            map: coronaTexture,
            color: 0xff3b5c,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.85
        });
        const coronaSprite = new THREE.Sprite(coronaMat);
        coronaSprite.scale.set(45, 45, 1);
        galaxyGroup.add(coronaSprite);

        // Segunda aureola inmensa y suave
        const bigHaloMat = new THREE.SpriteMaterial({
            map: coronaTexture,
            color: 0xe60026,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.45
        });
        const bigHaloSprite = new THREE.Sprite(bigHaloMat);
        bigHaloSprite.scale.set(95, 95, 1);
        galaxyGroup.add(bigHaloSprite);

        // Anillo de acreción ardiente con inclinación
        const ringGeom = new THREE.RingGeometry(6.0, 16.0, 64);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0xff2d4d,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending
        });
        const ringMesh = new THREE.Mesh(ringGeom, ringMat);
        ringMesh.rotation.x = Math.PI * 0.5;
        galaxyGroup.add(ringMesh);

        // 3. NUBES DE NEBULOSA CÓSMICA VOLUMÉTRICA
        const nebulaTexture = createNebulaCloudTexture();
        const nebulaCount = 45;
        const nebulaMat = new THREE.MeshBasicMaterial({
            map: nebulaTexture,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide
        });

        for (let n = 0; n < nebulaCount; n++) {
            const nGeom = new THREE.PlaneGeometry(35 + Math.random() * 45, 35 + Math.random() * 45);
            const nMesh = new THREE.Mesh(nGeom, nebulaMat);

            const nAngle = Math.random() * Math.PI * 2;
            const nDist = 12 + Math.pow(Math.random(), 1.2) * (radius * 0.75);

            nMesh.position.set(
                Math.cos(nAngle) * nDist,
                (Math.random() - 0.5) * 8.0,
                Math.sin(nAngle) * nDist
            );
            nMesh.rotation.x = Math.PI * 0.5 + (Math.random() - 0.5) * 0.3;
            nMesh.rotation.z = Math.random() * Math.PI * 2;

            galaxyGroup.add(nMesh);
        }

        // 4. LUZ PUNTUAL RADIANTE CENTRAL
        const coreLight = new THREE.PointLight(0xff3355, 8.0, 500, 1.0);
        coreLight.position.set(0, 0, 0);
        galaxyGroup.add(coreLight);

        // Luz estelar cálida secundaria
        const warmLight = new THREE.PointLight(0xffc2a0, 4.5, 240, 1.1);
        warmLight.position.set(0, 3, 0);
        galaxyGroup.add(warmLight);

        // Inclinación de la galaxia
        galaxyGroup.rotation.x = 0.55;
        galaxyGroup.rotation.z = -0.25;

        return {
            group: galaxyGroup,
            material: galaxyMaterial,
            coreLight: coreLight,
            update: function (time) {
                galaxyMaterial.uniforms.uTime.value = time;
                galaxyGroup.rotation.y = time * 0.025;
                coreLight.intensity = 7.5 + Math.sin(time * 1.5) * 1.0;
                ringMesh.rotation.z = time * 0.15;
                coronaSprite.scale.set(45 + Math.sin(time * 2.0) * 3.0, 45 + Math.sin(time * 2.0) * 3.0, 1);
            }
        };
    }

    /**
     * Genera un fondo cósmico inmersivo de estrellas distantes
     */
    function createDeepSpaceStarfield(count = 4500) {
        const starGeom = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const starTypes = [
            new THREE.Color('#ffffff'),
            new THREE.Color('#e0ecff'),
            new THREE.Color('#ffe8dc'),
            new THREE.Color('#ff8da0')
        ];

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            const dist = 400 + Math.random() * 400;

            positions[i3] = dist * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = dist * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = dist * Math.cos(phi);

            const chosenColor = starTypes[Math.floor(Math.random() * starTypes.length)];
            colors[i3] = chosenColor.r;
            colors[i3 + 1] = chosenColor.g;
            colors[i3 + 2] = chosenColor.b;
        }

        starGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const starMat = new THREE.PointsMaterial({
            size: 2.8,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            depthWrite: false
        });

        return new THREE.Points(starGeom, starMat);
    }

    return {
        createRedGalaxy,
        createDeepSpaceStarfield
    };
}));
