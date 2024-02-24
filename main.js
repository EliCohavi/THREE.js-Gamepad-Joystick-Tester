/*  'THREE.js & JS Gamepad API Integration Joystick Tester'
    
    Authors: Eli Cohavi & CodingWith-Adam

    Based off 'Gamepad API Simple Game' by CodingWith-Adam 'https://github.com/CodingWith-Adam/gamepad-api-simple-game/tree/main'

    This program helps test the JavaScript Gamepad API joysticks in a web browser with THREE.js integration.
    I don't have any interaction with other buttons (just joysticks), but I can make something if popularly requested.
    Use as needed :)
*/

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


//Global Variables
var rotationSpeed = 0.05;

//Boilerplate SETUP
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.z = -5;
camera.lookAt(0, 0, 0);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ antialias: true, });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

document.body.appendChild(renderer.domElement);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize, false);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;

//Gamepad SETUP
let controllerIndex = null;
let leftPressed = false;
let rightPressed = false;
let upPressed = false;
let downPressed = false;

window.addEventListener("gamepadconnected", (event) => {
    controllerIndex = event.gamepad.index;
    console.log("connected");
});

window.addEventListener("gamepaddisconnected", (event) => {
    console.log("disconnected");
    controllerIndex = null;
});

function handleButtons(buttons) {
    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        const buttonElement = document.getElementById(`controller-b${i}`);
        //console.log(buttonElement);
    }
}

let leftRightValue;
let upDownValue;
function controllerInput() {
    if (controllerIndex !== null) {
        const gamepad = navigator.getGamepads()[controllerIndex];

        const buttons = gamepad.buttons;
        upPressed = buttons[12].pressed;
        downPressed = buttons[13].pressed;
        leftPressed = buttons[14].pressed;
        rightPressed = buttons[15].pressed;

        const stickDeadZone = 0.2;
        leftRightValue = gamepad.axes[2];
        //console.log(leftRightValue);

        if (leftRightValue >= stickDeadZone) {
            rightPressed = true;
            //console.log(leftRightValue);
        } else if (leftRightValue <= -stickDeadZone) {
            leftPressed = true;
            //console.log(leftRightValue);
        }

        upDownValue = gamepad.axes[1];

        if (upDownValue >= stickDeadZone) {
            downPressed = true;
            //console.log(upDownValue);
        } else if (upDownValue <= -stickDeadZone) {
            upPressed = true;
            //console.log(upDownValue);
        }
    }
}

//Cube SETUP
const geo = new THREE.BoxGeometry(1, 1, 1);
const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
const cube = new THREE.Mesh(geo, mat);
scene.add(cube);

//Cube MOVEMENT
function moveCube() {
    if (upPressed) {
        cube.rotation.x -= Math.abs((upDownValue * rotationSpeed));
    }
    if (downPressed) {
        cube.rotation.x += (upDownValue * rotationSpeed);
    }
    if (leftPressed) {
        cube.rotation.y -= Math.abs((leftRightValue * rotationSpeed));
    }
    if (rightPressed) {
        cube.rotation.y += (leftRightValue * rotationSpeed);
    }
    /*  These are all using the axes value paired with the rotationSpeed as a multiplier to create variable speeds based off input.
        Absolute value is added so direction can reverse (Rules of Math for adding and subtracting positive and negative integers).*/
}

function updateCube() {
    moveCube();
}

//Animate
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    if (controllerIndex !== null) {
        const gamepad = navigator.getGamepads()[controllerIndex];
        handleButtons(gamepad.buttons);
    }
    controllerInput();
    if (controllerIndex !== null) {
        const gamepad = navigator.getGamepads()[controllerIndex];
        handleButtons(gamepad.buttons);
    }
    updateCube();
    //console.log(leftRightValue);
    //console.log(upDownValue);
    renderer.render(scene, camera);
}
animate();