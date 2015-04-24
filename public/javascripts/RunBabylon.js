/// <reference path="~/scripts/babylon.js" />

"use strict";

var canvas;
var engine;
var scene;
document.addEventListener("DOMContentLoaded", startBabylonJS, false);


function startBabylonJS() {
    if (BABYLON.Engine.isSupported()) {
        canvas = document.getElementById("renderCanvas");
        engine = new BABYLON.Engine(canvas, true);

        scene = new BABYLON.Scene(engine);

        //Adding a light
        var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(10, 100, 50), scene);

        //Adding an Arc Rotate Camera
        var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 100, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas);
        camera.checkCollisions = true;

        var tessellation = 32;
        var baseHeight = 10;
        var sphereDiam = 4;
        var armLLength = 20;
        var armHLength = 30;

        var ground = BABYLON.Mesh.CreateGround("ground", 1000, 1000, 32, scene);
        var materialground = new BABYLON.StandardMaterial("ground", scene);
        materialground.diffuseTexture = new BABYLON.Texture("/images/textures/ground.jpg", scene);
        materialground.diffuseTexture.uScale = 10;//Repeat 5 times on the Vertical Axes
        materialground.diffuseTexture.vScale = 10;//Repeat 5 times on the Horizontal Axes
        materialground.backFaceCulling = false;//Allways show the front and the back of an element
        ground.material = materialground;
        ground.checkCollisions = true;


        var base = BABYLON.Mesh.CreateCylinder("base", baseHeight, 10, 10, tessellation, scene);
        base.parent = ground;
        base.position = new BABYLON.Vector3(0, baseHeight / 2, 0);

        var sphereL = BABYLON.Mesh.CreateSphere("sphereL", tessellation, sphereDiam, scene);
        sphereL.parent = base;
        sphereL.position = new BABYLON.Vector3(0, (baseHeight + sphereDiam) / 2, 0);
        sphereL.rotation.x = Math.PI / 4;

        var armL = BABYLON.Mesh.CreateCylinder("armL", armLLength, sphereDiam, sphereDiam, tessellation, scene);
        armL.parent = sphereL;
        armL.position = new BABYLON.Vector3(0, (sphereDiam + armLLength) / 2, 0);

        var sphereH = BABYLON.Mesh.CreateSphere("sphereH", tessellation, sphereDiam, scene);
        sphereH.parent = armL;
        sphereH.position = new BABYLON.Vector3(0, (armLLength + sphereDiam) / 2, 0);
        sphereH.rotation.x = Math.PI / 4;

        var armH = BABYLON.Mesh.CreateCylinder("armH", armHLength, sphereDiam, sphereDiam, tessellation, scene);
        armH.parent = sphereH;
        armH.position = new BABYLON.Vector3(0, (sphereDiam + armHLength) / 2, 0);

        // Skybox
        var skybox = BABYLON.Mesh.CreateBox("wall", 500.0, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("wall", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("/images/textures/wall", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;
        skybox.checkCollisions = true;

        //Move the light with the camera
//        scene.registerBeforeRender(function() {
//            light.position = camera.position;
//        });

        // Once the scene is loaded, just register a render loop to render it
        engine.runRenderLoop(function () {
            scene.render();
        });

    }
}

window.addEventListener("resize", function() {
    engine.resize();
});