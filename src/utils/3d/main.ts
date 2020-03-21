
let main: THREE.Mesh | THREE.Group;

export function setMain(value: typeof main) {
    main = value;
}

export function getMain() {
    return main;
}