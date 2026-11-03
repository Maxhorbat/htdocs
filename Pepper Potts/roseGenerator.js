/**
 * RoseGenerator - Procedural 3D Red Rose & Floating Petals
 * Optimizado: segmentos y materiales adaptativos según calidad del dispositivo
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['three'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('three'));
    } else {
        root.RoseGenerator = factory(root.THREE || window.THREE);
    }
}(typeof self !== 'undefined' ? self : this, function (THREE) {
    'use strict';

    const PETAL_COLORS = {
        coreDark: 0x8a091e,
        innerDeep: 0xbb0f2e,
        midVelvet: 0xe61c3d,
        outerRuby: 0xff2d55,
        sheenHighlight: 0xff7090,
        dewGlaze: 0xffa0b5
    };

    function getSeg() {
        const q = (window.__APP_QUALITY__ && window.__APP_QUALITY__.petalSeg) || 16;
        return Math.max(8, Math.min(22, q));
    }

    /**
     * Geometría de pétalo (segmentos adaptativos)
     */
    function createPetalGeometry(width, height, curlFactor, cupFactor, reflexFactor, ruffleIntensity) {
        const seg = getSeg();
        const geom = new THREE.PlaneGeometry(width, height, seg, seg);
        const pos = geom.attributes.position;
        const v = new THREE.Vector3();

        for (let i = 0; i < pos.count; i++) {
            v.fromBufferAttribute(pos, i);

            const nx = v.x / (width * 0.5);
            const ny = (v.y + height * 0.5) / height;

            const contour = Math.pow(Math.sin(ny * Math.PI), 0.65) * (1.0 - 0.15 * Math.pow(ny, 2.5));
            v.x = nx * (width * 0.5) * Math.max(0.05, contour);

            const cup = -cupFactor * (1.0 - Math.pow(nx, 2)) * Math.sin(ny * Math.PI * 0.85);
            const arch = -curlFactor * Math.pow(ny, 1.8) * height * 0.4;

            let reflex = 0;
            if (ny > 0.6) {
                const tipProgress = (ny - 0.6) / 0.4;
                reflex = reflexFactor * Math.pow(tipProgress, 2.0) * height * 0.45;
            }

            const ruffle = Math.sin(nx * 9.0 + ny * 6.0) * ruffleIntensity * Math.sin(ny * Math.PI) * 0.08;
            v.z = cup + arch + reflex + ruffle;
            v.y += height * 0.48;

            pos.setXYZ(i, v.x, v.y, v.z);
        }

        geom.computeVertexNormals();
        return geom;
    }

    /**
     * Material: Physical en high/medium, Standard en low (mucho más barato)
     */
    function createPetalMaterial(colorHex, opacity, usePhysical) {
        if (usePhysical && THREE.MeshPhysicalMaterial) {
            return new THREE.MeshPhysicalMaterial({
                color: colorHex,
                roughness: 0.28,
                metalness: 0.02,
                clearcoat: 0.35,
                clearcoatRoughness: 0.15,
                sheen: 1.1,
                sheenColor: new THREE.Color(PETAL_COLORS.sheenHighlight),
                sheenRoughness: 0.4,
                transmission: 0.06,
                thickness: 0.2,
                side: THREE.DoubleSide,
                transparent: opacity < 1.0,
                opacity: opacity,
                depthWrite: true
            });
        }
        // Fallback rápido y estable
        return new THREE.MeshStandardMaterial({
            color: colorHex,
            roughness: 0.35,
            metalness: 0.05,
            side: THREE.DoubleSide,
            transparent: opacity < 1.0,
            opacity: opacity,
            depthWrite: true
        });
    }

    function createRose(options) {
        options = options || {};
        const scale = options.scale !== undefined ? options.scale : 1.0;
        const includeStem = options.includeStem !== false;
        const petalCount = options.petalCount || 28;
        const usePhysical = options.usePhysical !== false;
        const includeInnerLight = options.includeInnerLight !== false;

        const roseGroup = new THREE.Group();

        const hueShift = (Math.random() - 0.5) * 0.03;
        const baseColorInner = new THREE.Color(PETAL_COLORS.innerDeep).offsetHSL(hueShift, 0.02, 0.02);
        const baseColorMid = new THREE.Color(PETAL_COLORS.midVelvet).offsetHSL(hueShift, 0.03, 0.03);
        const baseColorOuter = new THREE.Color(PETAL_COLORS.outerRuby).offsetHSL(hueShift, 0.04, 0.04);

        const innerMat = createPetalMaterial(baseColorInner.getHex(), 1, usePhysical);
        const midMat = createPetalMaterial(baseColorMid.getHex(), 1, usePhysical);
        const outerMat = createPetalMaterial(baseColorOuter.getHex(), 1, usePhysical);

        const goldenAngle = 2.399963;

        for (let i = 0; i < petalCount; i++) {
            const progress = i / Math.max(1, petalCount - 1);
            let pWidth, pHeight, curl, cup, reflex, ruffle, mat;
            let radius, tilt, roll;

            const angle = i * goldenAngle + (Math.random() - 0.5) * 0.12;

            if (progress < 0.26) {
                const localP = progress / 0.26;
                pWidth = 0.55 + localP * 0.35;
                pHeight = 0.95 + localP * 0.35;
                curl = 0.2 + localP * 0.3;
                cup = 0.45 + localP * 0.2;
                reflex = 0.05;
                ruffle = 0.08;
                mat = innerMat;
                radius = 0.08 + localP * 0.18;
                tilt = 0.15 + localP * 0.25;
                roll = (Math.random() - 0.5) * 0.15;
            } else if (progress < 0.6) {
                const localP = (progress - 0.26) / 0.34;
                pWidth = 0.9 + localP * 0.65;
                pHeight = 1.3 + localP * 0.45;
                curl = 0.55 + localP * 0.35;
                cup = 0.65 - localP * 0.15;
                reflex = 0.25 + localP * 0.45;
                ruffle = 0.15 + localP * 0.1;
                mat = midMat;
                radius = 0.25 + localP * 0.4;
                tilt = 0.4 + localP * 0.55;
                roll = (Math.random() - 0.5) * 0.25;
            } else {
                const localP = (progress - 0.6) / 0.4;
                pWidth = 1.55 + localP * 0.5;
                pHeight = 1.7 + localP * 0.28;
                curl = 0.85 + localP * 0.38;
                cup = 0.5 - localP * 0.2;
                reflex = 0.7 + localP * 0.5;
                ruffle = 0.25 + localP * 0.15;
                mat = outerMat;
                radius = 0.65 + localP * 0.45;
                tilt = 0.95 + localP * 0.32;
                roll = (Math.random() - 0.5) * 0.32;
            }

            const petalGeom = createPetalGeometry(pWidth, pHeight, curl, cup, reflex, ruffle);
            const petalMesh = new THREE.Mesh(petalGeom, mat);

            petalMesh.position.set(
                Math.cos(angle) * radius,
                (1.0 - progress) * 0.45,
                Math.sin(angle) * radius
            );
            petalMesh.rotation.y = -angle + Math.PI * 0.5;
            petalMesh.rotation.x = tilt;
            petalMesh.rotation.z = roll;

            const s = 1.0 + (Math.random() - 0.5) * 0.07;
            petalMesh.scale.set(s, s, s);

            // Frustum culling por defecto está activo
            roseGroup.add(petalMesh);
        }

        if (includeStem) {
            const calyxMat = new THREE.MeshStandardMaterial({
                color: 0x224820,
                roughness: 0.55,
                metalness: 0.05
            });

            const receptacleGeom = new THREE.SphereGeometry(0.38, qualitySeg(12, 8), qualitySeg(10, 6));
            receptacleGeom.scale(1.0, 1.25, 1.0);
            const receptacleMesh = new THREE.Mesh(receptacleGeom, calyxMat);
            receptacleMesh.position.y = -0.3;
            roseGroup.add(receptacleMesh);

            for (let s = 0; s < 5; s++) {
                const sAngle = (s / 5) * Math.PI * 2 + 0.3;
                const sepalGeom = new THREE.ConeGeometry(0.16, 1.2, 4);
                sepalGeom.scale(1.0, 1.0, 0.25);
                const sepalMesh = new THREE.Mesh(sepalGeom, calyxMat);
                sepalMesh.position.set(
                    Math.cos(sAngle) * 0.35,
                    -0.2,
                    Math.sin(sAngle) * 0.35
                );
                sepalMesh.rotation.y = -sAngle - Math.PI * 0.5;
                sepalMesh.rotation.x = 1.35 + (Math.random() - 0.5) * 0.2;
                sepalMesh.rotation.z = (Math.random() - 0.5) * 0.2;
                roseGroup.add(sepalMesh);
            }

            const stemCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, -0.3, 0),
                new THREE.Vector3(0.05, -1.5, -0.04),
                new THREE.Vector3(-0.08, -3.0, 0.06),
                new THREE.Vector3(0.02, -4.5, -0.02)
            ]);
            const tubeSeg = qualitySeg(24, 12);
            const stemGeom = new THREE.TubeGeometry(stemCurve, tubeSeg, 0.09, qualitySeg(8, 5), false);
            const stemMesh = new THREE.Mesh(stemGeom, calyxMat);
            roseGroup.add(stemMesh);

            const thornGeom = new THREE.ConeGeometry(0.07, 0.26, 5);
            thornGeom.scale(0.5, 1.0, 1.0);
            const thornMat = new THREE.MeshStandardMaterial({ color: 0x5a2020, roughness: 0.45 });
            [
                { y: -1.2, angle: 0.8 },
                { y: -2.1, angle: 3.2 },
                { y: -3.4, angle: 1.9 }
            ].forEach(function (tp) {
                const thorn = new THREE.Mesh(thornGeom, thornMat);
                thorn.position.set(
                    Math.cos(tp.angle) * 0.12,
                    tp.y,
                    Math.sin(tp.angle) * 0.12
                );
                thorn.rotation.y = -tp.angle;
                thorn.rotation.z = -1.1;
                roseGroup.add(thorn);
            });
        }

        if (includeInnerLight) {
            const innerGlow = new THREE.PointLight(0xff3355, 0.9, 8, 2.0);
            innerGlow.position.set(0, 0.5, 0);
            roseGroup.add(innerGlow);
        }

        roseGroup.scale.set(scale, scale, scale);

        roseGroup.userData = {
            basePosition: new THREE.Vector3(),
            driftVelocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.01,
                (Math.random() - 0.5) * 0.007,
                (Math.random() - 0.5) * 0.01
            ),
            rotationVelocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.004 + 0.0015,
                (Math.random() - 0.5) * 0.007 + 0.003,
                (Math.random() - 0.5) * 0.0035
            ),
            bobbingPhase: Math.random() * Math.PI * 2,
            bobbingAmplitude: 0.9 + Math.random() * 1.3,
            bobbingSpeed: 0.45 + Math.random() * 0.55,
            isRose: true
        };

        return roseGroup;
    }

    function qualitySeg(high, low) {
        const level = (window.__APP_QUALITY__ && window.__APP_QUALITY__.level) || 2;
        return level === 0 ? low : high;
    }

    function createLoosePetal(scale, usePhysical) {
        scale = scale !== undefined ? scale : 1.0;
        usePhysical = usePhysical !== false;

        const pWidth = (1.35 + Math.random() * 0.75) * scale;
        const pHeight = (1.55 + Math.random() * 0.85) * scale;
        const curl = 0.4 + Math.random() * 0.55;
        const cup = 0.35 + Math.random() * 0.28;
        const reflex = 0.4 + Math.random() * 0.45;
        const ruffle = 0.2 + Math.random() * 0.18;

        const geom = createPetalGeometry(pWidth, pHeight, curl, cup, reflex, ruffle);
        const colors = [PETAL_COLORS.midVelvet, PETAL_COLORS.outerRuby, PETAL_COLORS.innerDeep];
        const chosenColor = colors[Math.floor(Math.random() * colors.length)];
        const mat = createPetalMaterial(chosenColor, 0.95, usePhysical);

        const mesh = new THREE.Mesh(geom, mat);

        mesh.userData = {
            rotSpeed: new THREE.Vector3(
                (Math.random() - 0.5) * 0.016,
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.014
            ),
            tumblePhase: Math.random() * Math.PI * 2,
            tumbleFreq: 0.45 + Math.random() * 0.5
        };

        return mesh;
    }

    return {
        createRose: createRose,
        createLoosePetal: createLoosePetal,
        PETAL_COLORS: PETAL_COLORS
    };
}));
