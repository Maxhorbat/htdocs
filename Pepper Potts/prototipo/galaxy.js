/**
 * GalaxyGenerator - Crimson Spiral Galaxy
 * Optimizado: conteos y detalle adaptativos según calidad del dispositivo
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

        return new THREE.CanvasTexture(canvas);
    }

    const GalaxyShader = {
        vertexShader: [
            'precision mediump float;',
            'uniform float uTime;',
            'uniform float uSize;',
            'uniform float uPixelRatio;',
            'attribute float aScale;',
            'attribute float aRandomness;',
            'attribute float aOrbitSpeed;',
            'attribute float aDistance;',
            'attribute vec3 aInitialColor;',
            'varying vec3 vColor;',
            'varying float vAlpha;',
            'void main() {',
            '  float angle = aOrbitSpeed * uTime * 0.18;',
            '  float cosA = cos(angle);',
            '  float sinA = sin(angle);',
            '  vec3 rotatedPosition = position;',
            '  rotatedPosition.x = position.x * cosA - position.z * sinA;',
            '  rotatedPosition.z = position.x * sinA + position.z * cosA;',
            '  rotatedPosition.y += sin(uTime * 0.4 + aDistance * 0.1) * (0.25 + aDistance * 0.015);',
            '  vec4 mvPosition = modelViewMatrix * vec4(rotatedPosition, 1.0);',
            '  gl_Position = projectionMatrix * mvPosition;',
            '  float distFactor = max(1.0, -mvPosition.z * 0.035);',
            '  gl_PointSize = (uSize * aScale * uPixelRatio) / distFactor;',
            '  gl_PointSize = max(gl_PointSize, 1.5);',
            '  float twinkle = 0.88 + 0.12 * sin(uTime * 2.8 + aRandomness * 60.0);',
            '  vColor = aInitialColor * twinkle;',
            '  vAlpha = min(1.0, 0.5 + 0.5 * (1.0 - smoothstep(100.0, 145.0, aDistance)));',
            '}'
        ].join('\n'),
        fragmentShader: [
            'precision mediump float;',
            'uniform sampler2D uTexture;',
            'varying vec3 vColor;',
            'varying float vAlpha;',
            'void main() {',
            '  vec4 texColor = texture2D(uTexture, gl_PointCoord);',
            '  gl_FragColor = vec4(vColor * texColor.rgb, texColor.a * vAlpha);',
            '}'
        ].join('\n')
    };

    function createRedGalaxy(options) {
        options = options || {};
        const starCount = options.starCount || 45000;
        const radius = options.radius || 110;
        const arms = options.arms || 4;
        const spiralTwist = options.spiralTwist || 3.6;
        const coreRadius = options.coreRadius || 15;
        const thickness = options.thickness || 6.5;
        const nebulaCount = options.nebulaCount !== undefined ? options.nebulaCount : 30;

        const galaxyGroup = new THREE.Group();

        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const scales = new Float32Array(starCount);
        const randomness = new Float32Array(starCount);
        const orbitSpeeds = new Float32Array(starCount);
        const distances = new Float32Array(starCount);

        const colorCore = new THREE.Color('#ffffff');
        const colorInnerGlow = new THREE.Color('#ff5544');
        const colorMidArm = new THREE.Color('#ff1d45');
        const colorOuterArm = new THREE.Color('#c40d2a');
        const colorRimDust = new THREE.Color('#6a0316');

        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            const rNorm = Math.pow(Math.random(), 1.7);
            const r = rNorm * radius;
            distances[i] = r;

            const armIndex = i % arms;
            const armAngle = (armIndex / arms) * Math.PI * 2;
            const spiralAngle = Math.pow(r / radius, 0.75) * spiralTwist;
            const finalAngle = armAngle + spiralAngle;

            const spreadFactor = Math.pow(r / radius, 0.6) * 7.0 + 0.8;
            const randomX = (Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1)) * spreadFactor;
            const randomZ = (Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1)) * spreadFactor;

            const heightFalloff = Math.max(0.1, 1.0 - (r / radius) * 0.4);
            const randomY = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1)) * (thickness * heightFalloff);

            positions[i3] = Math.cos(finalAngle) * r + randomX;
            positions[i3 + 1] = randomY;
            positions[i3 + 2] = Math.sin(finalAngle) * r + randomZ;

            orbitSpeeds[i] = 1.0 / Math.sqrt(Math.max(4.0, r * 0.5 + 2.0));
            scales[i] = (0.65 + Math.random() * 1.9) * (r < coreRadius ? 1.45 : 1.0);
            randomness[i] = Math.random();

            const normDist = r / radius;
            let starColor;
            if (normDist < 0.08) {
                starColor = colorCore.clone().lerp(colorInnerGlow, normDist / 0.08);
            } else if (normDist < 0.35) {
                starColor = colorInnerGlow.clone().lerp(colorMidArm, (normDist - 0.08) / 0.27);
            } else if (normDist < 0.75) {
                starColor = colorMidArm.clone().lerp(colorOuterArm, (normDist - 0.35) / 0.4);
            } else {
                starColor = colorOuterArm.clone().lerp(colorRimDust, (normDist - 0.75) / 0.25);
            }
            if (Math.random() < 0.08) starColor.addScalar(0.22);

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
        const pixelRatio = (window.__APP_QUALITY__ && window.__APP_QUALITY__.pixelRatio) || Math.min(window.devicePixelRatio || 1, 2);

        const galaxyMaterial = new THREE.ShaderMaterial({
            vertexShader: GalaxyShader.vertexShader,
            fragmentShader: GalaxyShader.fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uSize: { value: 32.0 },
                uPixelRatio: { value: pixelRatio },
                uTexture: { value: starTexture }
            },
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            transparent: true
        });

        const starPoints = new THREE.Points(geometry, galaxyMaterial);
        galaxyGroup.add(starPoints);

        // Núcleo (menos segmentos en low)
        const coreSeg = (window.__APP_QUALITY__ && window.__APP_QUALITY__.level === 0) ? 16 : 28;

        const coreGlowGeom = new THREE.SphereGeometry(5.8, coreSeg, coreSeg);
        const coreGlowMat = new THREE.MeshBasicMaterial({
            color: 0xff2d55,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending
        });
        galaxyGroup.add(new THREE.Mesh(coreGlowGeom, coreGlowMat));

        const coreInnerGeom = new THREE.SphereGeometry(2.6, coreSeg, coreSeg);
        const coreInnerMat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 1.0,
            blending: THREE.AdditiveBlending
        });
        galaxyGroup.add(new THREE.Mesh(coreInnerGeom, coreInnerMat));

        const coronaTexture = createNebulaCloudTexture();
        const coronaMat = new THREE.SpriteMaterial({
            map: coronaTexture,
            color: 0xff3b5c,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.8
        });
        const coronaSprite = new THREE.Sprite(coronaMat);
        coronaSprite.scale.set(42, 42, 1);
        galaxyGroup.add(coronaSprite);

        const bigHaloMat = new THREE.SpriteMaterial({
            map: coronaTexture,
            color: 0xe60026,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.4
        });
        const bigHaloSprite = new THREE.Sprite(bigHaloMat);
        bigHaloSprite.scale.set(88, 88, 1);
        galaxyGroup.add(bigHaloSprite);

        const ringSeg = (window.__APP_QUALITY__ && window.__APP_QUALITY__.level === 0) ? 32 : 56;
        const ringGeom = new THREE.RingGeometry(5.8, 15.0, ringSeg);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0xff2d4d,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        const ringMesh = new THREE.Mesh(ringGeom, ringMat);
        ringMesh.rotation.x = Math.PI * 0.5;
        galaxyGroup.add(ringMesh);

        // Nebulosas
        const nebulaTexture = createNebulaCloudTexture();
        const nebulaMat = new THREE.MeshBasicMaterial({
            map: nebulaTexture,
            transparent: true,
            opacity: 0.38,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide
        });

        for (let n = 0; n < nebulaCount; n++) {
            const nGeom = new THREE.PlaneGeometry(32 + Math.random() * 40, 32 + Math.random() * 40);
            const nMesh = new THREE.Mesh(nGeom, nebulaMat);
            const nAngle = Math.random() * Math.PI * 2;
            const nDist = 12 + Math.pow(Math.random(), 1.2) * (radius * 0.72);
            nMesh.position.set(
                Math.cos(nAngle) * nDist,
                (Math.random() - 0.5) * 7.5,
                Math.sin(nAngle) * nDist
            );
            nMesh.rotation.x = Math.PI * 0.5 + (Math.random() - 0.5) * 0.28;
            nMesh.rotation.z = Math.random() * Math.PI * 2;
            galaxyGroup.add(nMesh);
        }

        const coreLight = new THREE.PointLight(0xff3355, 6.5, 420, 1.1);
        coreLight.position.set(0, 0, 0);
        galaxyGroup.add(coreLight);

        if (!(window.__APP_QUALITY__ && window.__APP_QUALITY__.level === 0)) {
            const warmLight = new THREE.PointLight(0xffc2a0, 3.8, 200, 1.2);
            warmLight.position.set(0, 3, 0);
            galaxyGroup.add(warmLight);
        }

        galaxyGroup.rotation.x = 0.55;
        galaxyGroup.rotation.z = -0.25;

        return {
            group: galaxyGroup,
            material: galaxyMaterial,
            coreLight: coreLight,
            update: function (time) {
                galaxyMaterial.uniforms.uTime.value = time;
                galaxyGroup.rotation.y = time * 0.022;
                coreLight.intensity = 6.2 + Math.sin(time * 1.4) * 0.9;
                ringMesh.rotation.z = time * 0.13;
                const pulse = 42 + Math.sin(time * 1.8) * 2.5;
                coronaSprite.scale.set(pulse, pulse, 1);
            }
        };
    }

    function createDeepSpaceStarfield(count) {
        count = count || 3000;
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
            const dist = 380 + Math.random() * 380;

            positions[i3] = dist * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = dist * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = dist * Math.cos(phi);

            const c = starTypes[Math.floor(Math.random() * starTypes.length)];
            colors[i3] = c.r;
            colors[i3 + 1] = c.g;
            colors[i3 + 2] = c.b;
        }

        starGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const starMat = new THREE.PointsMaterial({
            size: 2.4,
            vertexColors: true,
            transparent: true,
            opacity: 0.88,
            depthWrite: false,
            sizeAttenuation: true
        });

        return new THREE.Points(starGeom, starMat);
    }

    return {
        createRedGalaxy: createRedGalaxy,
        createDeepSpaceStarfield: createDeepSpaceStarfield
    };
}));
