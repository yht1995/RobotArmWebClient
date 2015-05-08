"use strict";

var canvas;
var engine;
var scene;
var armH;
var sphereH;
var armL;
var sphereL;

document.addEventListener("DOMContentLoaded", startBabylonJS, false);

function startBabylonJS() {

    if (BABYLON.Engine.isSupported()) {
        canvas = document.getElementById("renderCanvas");
        engine = new BABYLON.Engine(canvas, true);

        scene = new BABYLON.Scene(engine);

        //Adding a light
        var light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-1, -2, -1), scene);
        light.position = new BABYLON.Vector3(40, 80, 40);
        light.intensity = 1;


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
        base.checkCollisions = true;

        sphereL = BABYLON.Mesh.CreateSphere("sphereL", tessellation, sphereDiam, scene);
        sphereL.parent = base;
        sphereL.position = new BABYLON.Vector3(0, (baseHeight + sphereDiam) / 2, 0);
        sphereL.rotation.x = Math.PI / 4;
        sphereL.checkCollisions = true;

        armL = BABYLON.Mesh.CreateCylinder("armL", armLLength, sphereDiam, sphereDiam, tessellation, scene);
        armL.parent = sphereL;
        armL.position = new BABYLON.Vector3(0, (sphereDiam + armLLength) / 2, 0);
        armL.checkCollisions = true;

        sphereH = BABYLON.Mesh.CreateSphere("sphereH", tessellation, sphereDiam, scene);
        sphereH.parent = armL;
        sphereH.position = new BABYLON.Vector3(0, (armLLength + sphereDiam) / 2, 0);
        sphereH.rotation.x = Math.PI / 4;
        sphereH.checkCollisions = true;

        armH = BABYLON.Mesh.CreateCylinder("armH", armHLength, sphereDiam, sphereDiam, tessellation, scene);
        armH.parent = sphereH;
        armH.position = new BABYLON.Vector3(0, (sphereDiam + armHLength) / 2, 0);
        armH.checkCollisions = true;

        // Skybox
        var skybox = BABYLON.Mesh.CreateBox("wall", 300.0, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("wall", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("/images/textures/wall", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;
        skybox.checkCollisions = true;

        // Shadows
        var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
        shadowGenerator.getShadowMap().renderList.push(base);
        shadowGenerator.getShadowMap().renderList.push(sphereL);
        shadowGenerator.getShadowMap().renderList.push(armL);
        shadowGenerator.getShadowMap().renderList.push(sphereH);
        shadowGenerator.getShadowMap().renderList.push(armH);
        shadowGenerator.useVarianceShadowMap = true;
        ground.receiveShadows = true;
        skybox.receiveShadows = true;

        // Once the scene is loaded, just register a render loop to render it
        engine.runRenderLoop(function () {
            scene.render();
        });
    }
    setSlider();
}


function setSlider() {
    $("#rangeLA").bind("slider:changed", function (event, data) {
        sphereL.rotation.y = data.value * Math.PI / 180;
    });
    $("#rangeLC").bind("slider:changed", function (event, data) {
        sphereL.rotation.x = data.value * Math.PI / 180;
    });
    $("#rangeLC").simpleSlider("setValue", 45);
    $("#rangeHA").bind("slider:changed", function (event, data) {
        sphereH.rotation.x = data.value * Math.PI / 180;
    });
    $("#rangeHA").simpleSlider("setValue", 45);
    $("#rangeHC").bind("slider:changed", function (event, data) {
        armH.rotation.y = data.value * Math.PI / 180;
    });
}

window.addEventListener("resize", function () {
    engine.resize();
});