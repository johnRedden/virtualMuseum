

// LUCY URLS 
var lucyObjURL = 'https://firebasestorage.googleapis.com/v0/b/fnlvirtualmuseum.appspot.com/o/3dObjects%2FyG5ioP3k8TbFhv1y2iyD%2FHigh_Res.obj?alt=media&token=14b9b670-d665-43cd-8608-d3021c77f182';
var lucyTextureURL = 'https://firebasestorage.googleapis.com/v0/b/fnlvirtualmuseum.appspot.com/o/3dObjects%2FyG5ioP3k8TbFhv1y2iyD%2Fmaterial.jpg?alt=media&token=1eb7963e-e877-4e76-9701-1ad1a3d2be04';

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
//var camera = new THREE.PerspectiveCamera( 45, width / height, 1, 1000 );
camera.position.z = 30;
camera.position.x = 30;
camera.position.y = 30;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 0.75);
keyLight.position.set(-100, 0, 100);

var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.1);
fillLight.position.set(100, 0, 100);

var backLight = new THREE.DirectionalLight(0xffffff, 0.5);
backLight.position.set(100, 0, -100).normalize();

var light = new THREE.AmbientLight(0xffffff, 1.0);
light.position.set(30, 30, 30);

scene.add(keyLight);
scene.add(fillLight);
scene.add(backLight);
scene.add(light);


// https://threejs.org/docs/#api/en/loaders/TextureLoader
var textureLoader = new THREE.TextureLoader();
// load a resource
textureLoader.load(
    lucyTextureURL,  // texture resource URL
    function (texture) {  // onLoad callback

        // create the material when texture jpg is loaded
        var basicMaterial = new THREE.MeshBasicMaterial({
            map: texture
        });

        // Now get the obj file
        var objLoader = new THREE.OBJLoader();
        objLoader.load(lucyObjURL, function (object) {

            // This crazy code sets the material (thanks to Stack Exchange!)
            object.traverse(function (node) {
                if (node.isMesh) node.material = basicMaterial;
            });

            scene.add(object);
         
            var boundingBox = new THREE.Box3();

            boundingBox.setFromObject(object);
            var center = boundingBox.getCenter();

            // set camera to rotate around center of object
            controls.target = center;

            $("#progress").hide();

        });

    },

    // onProgress callback currently not supported
    undefined,

    // onError callback
    function (err) {
        console.error('An error happened.');
    }
);


var animate = function () {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
};

animate();