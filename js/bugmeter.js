"use strict";

class BugMeter {
    constructor() {
        this.init();
    }

    init() {
        this.estimator = new Estimator();
        this.renderer = new Renderer();
    }

    launch() {
        this.renderer.render();
        this.estimator.estimate();
    }
}