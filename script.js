document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("renderCanvas");
    const engine = new BABYLON.Engine(canvas, true);

    var targetAlpha = 0;
    var targetBeta = 1.75;
    var dampingFactor = 0.05;
    var camera;

    var createScene = function () {

        var scene = new BABYLON.Scene(engine);

        camera = new BABYLON.ArcRotateCamera("camera1",
        0, 0, 0, new BABYLON.Vector3(0, 0, 0), scene);
        
        camera.setPosition(new BABYLON.Vector3(0, 0, 25));

        camera.attachControl(canvas, true);

        var xsave = document.documentElement.clientWidth/2;
        var ysave = document.documentElement.clientHeight/2;

        canvas.addEventListener("mousemove", function(event) {
            var x = event.clientX;
            var y = event.clientY;

            targetAlpha += (x - xsave) * 0.005;
            targetBeta += (y - ysave) * 0.005;

            xsave = x;
            ysave = y;
        });

        var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 0.7;

        BABYLON.SceneLoader.ImportMesh("", "images/", "earth.glb", scene, function (meshes) {
            var importedMesh = meshes[0];
            var scaleX = -0.01;
            var scaleY = 0.01;
            var scaleZ = 0.01;

            importedMesh.scaling = new BABYLON.Vector3(scaleX, scaleY, scaleZ);
            camera.target = importedMesh;
        });

        const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 2000.0 }, scene);
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

    var toggle = false;

    document.getElementById("button1").addEventListener("click", () => {
        document.getElementById("cover2").style.transform = "translateX(0)";
        toggle = 1;
    });
    var clicks = 0;
    document.getElementById("home").addEventListener("click", () => {
        event.preventDefault();
        if (Math.random() < 0.5) {
            document.getElementById("cover2").style.transform = "translateX(200%)";
            toggle = true;
        } else {
            document.getElementById("cover2").style.transform = "translateX(-100%)";
            toggle = true;
        }
        clicks++;
        if (clicks >= 10) {
            document.getElementById("clicked").style.opacity = "1";
            document.getElementById("clicked").style.pointerEvents = "all";
        }
    });
    document.getElementById("clickedclose").addEventListener("click", () => {
        document.getElementById("clicked").style.opacity = "0";
        document.getElementById("clicked").style.pointerEvents = "none";
        clicks = 0;
    });

    var ul = document.querySelector("#navbar > ul")
    var img = document.querySelector("#navbar > ul > li > a > img")
    var about = document.getElementById("about")

    document.getElementById("reverse").addEventListener("click", () => {
        if (ul.style.float === "left") {
            ul.style.float = "right";
            about.style.flexDirection = "row-reverse";
            img.style.transform = "rotate(180deg)";
        } else {
            ul.style.float = "left";
            about.style.flexDirection = "row";
            img.style.transform = "rotate(0deg)";
        }
    });
    document.addEventListener("mousemove", (event) => {
        if (toggle == true) {
            var x = event.clientX;
            var y = event.clientY;

            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            var translateX = (x - centerX) * 0.05;
            var translateY = (y - centerY) * 0.1;

            const elements = document.getElementsByClassName("icontainer");
            for (let i = 0; i < elements.length; i++) {
                elements[i].style.transform = `translate(${translateX}px, ${translateY}px)`;
            }
        }
    });

    const div = document.querySelector('#contact > div');
    let angle = 0;

    function animate() {
        angle += 2;
        if (angle >= 360) {
            angle = 0;
        }
        div.style.setProperty('--angle', angle + 'deg');
        requestAnimationFrame(animate);
    }

    animate();

    let sections = document.querySelectorAll('.sections');
    let navLinks = document.querySelectorAll('#navbar a');
    let cover = document.getElementById("cover2")

    cover.addEventListener("scroll", scrollFunction)

    function scrollFunction() {
        sections.forEach(sec => {
            let top = cover.scrollTop;
            let offset = sec.offsetTop;
            let height = sec.offsetHeight;
            let id = sec.getAttribute('id');

            if(top >= offset && top < offset + height) {
                navLinks.forEach(links => {
                    links.classList.remove('active');
                    document.querySelector('#navbar a[href*=' + id + ']').classList.add('active');
                });
            };
        });
    };
});