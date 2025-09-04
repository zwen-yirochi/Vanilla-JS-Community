import Counter from "./components/Counter.js";

class App {
    constructor() {
        const app = document.getElementById("app");
        new Counter(app);
        // new ErrorCounter(app);
    }
}
console.log("App is running");
new App();

export default App;