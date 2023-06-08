const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

var targetAlpha = 0;
var targetBeta = 0.5;
var dampingFactor = 0.05;
var camera;

var createScene = function () {

    var scene = new BABYLON.Scene(engine);

    camera = new BABYLON.ArcRotateCamera("camera1",
    0, 0, 0, new BABYLON.Vector3(0, 0, 0), scene);
    
    camera.setPosition(new BABYLON.Vector3(5, 0, 0));

    camera.attachControl(canvas, true);

    var xsave;
    var ysave;

    canvas.addEventListener("mousemove", function(event) {
        var x = event.clientX;
        var y = event.clientY;
        
        if (typeof xsave === 'undefined' || typeof ysave === 'undefined') {
            xsave = x;
            ysave = y;
            return;
        }

        targetAlpha += (x - xsave) * 0.005;
        targetBeta += (y - ysave) * 0.005;

        xsave = x;
        ysave = y;
    });

    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    BABYLON.SceneLoader.ImportMesh("", "images/", "earth.glb", scene, function (newMeshes) {
        // Set the target of the camera to the first imported mesh
        camera.target = newMeshes[0];
    });

    const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
    const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("images/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;

    engine.runRenderLoop(function() {
        camera.alpha += (targetAlpha - camera.alpha) * dampingFactor;
        camera.beta += (targetBeta - camera.beta) * dampingFactor;
        scene.render();
    });

    return scene;
};

const scene = createScene();

window.addEventListener("resize", function () {
    engine.resize();
});