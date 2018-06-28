"use strict";

class BugMeter {
    /**
     * Constructor.
     */
    constructor() {
        this.init();
    }

    /**
     * Initializer.
     */
    init() {
        this.estimator = new Estimator();
        this.renderer = new Renderer();
        this.data = {};
        this.eventHandler = document;
        this.eventAppReady = new CustomEvent("app_ready", {detail: this});
        this.eventDataLoaded = new CustomEvent("data_loaded", {detail: this});
    }

    /**
     * Launch app method.
     */
    launch() {
        this.eventHandler.addEventListener("data_loaded", this.onDataLoaded);
        this.eventHandler.addEventListener("app_ready", this.onAppReady);
        this.loadJSONs(
            [
                {
                    "name": "estimations",
                    "path": "resources/estimations.json"
                },
                {
                    "name": "priorities",
                    "path": "resources/priorities.json"
                }
            ]
        )
    }

    /**
     * On data loaded.
     * @param {CustomEvent} e Event
     */
    onDataLoaded(e) {
        let that = e.detail;
        that.renderer.setEstimations(that.data.estimations.content);
        that.estimator.setPriorities(that.data.priorities.content);
        that.eventHandler.dispatchEvent(that.eventAppReady);
    }

    /**
     * On app ready.
     * @param {CustomEvent} e Event
     */
    onAppReady(e) {
        let that = e.detail;
        that.renderer.render((new URL(document.location)).searchParams);
        that.estimator.estimate();
        that.updateLink();
    }

    /**
     * Load multiple JSONs
     * @param {Object[]} data Data references to use for load.
     */
    loadJSONs(data) {
        let count = 0;
        data.forEach(d => {
            this.loadDataJSON(d, (response) => {
                this.data[d.name] = response;
                count++;
                if (count >= Object.keys(data).length) {
                    this.eventHandler.dispatchEvent(this.eventDataLoaded);
                }
            })
        })
    }

    /**
     * Load JSON data.
     * @param {Object} data Data to load.
     * @param {function} callback Callback.
     */
    loadDataJSON(data, callback) {
        let xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        let url = document.location.toString();
        url = url.substr(0, url.lastIndexOf('/') + 1);
        xobj.open('GET', url + data.path, true);
        xobj.onreadystatechange = () => {
                if (xobj.readyState == 4 && xobj.status == "200") {
                    data.content = JSON.parse(xobj.responseText);
                    callback(data);
                }
        };
        xobj.send(null);
    }

    /**
     * Update data on select change.
     */
    update() {
        this.updateLink();
        this.estimator.estimate();
    }

    /**
     * Generate url link.
     * @returns {String} URL link.
     */
    generateLink() {
        return this.formatUrl(this.renderer.getValues());
    }

    /**
     * Generate an exportable link.
     */
    exportLink() {
        let url = this.generateLink();
        try {
            navigator.clipboard.writeText(url).then(
                () => {
                    console.log('Copying to clipboard was successful!');
                },
                (err) => {
                    console.error('Could not copy text: ', err);
                }
            );
        } catch (error) {
            console.error("Something went wrong with the experimental functions", error);
            this.exportLinkFromField();
        }
    }

    /**
     * Generate an exportable link from field (alternate method).
     */
    exportLinkFromField() {
        this.updateLink();
        console.log("Copying to clipboard with the old fashion way...");
        let link = document.getElementById("link-generated");
        link.disabled = false;
        link.select();
        document.execCommand("copy");
        console.log('Copying to clipboard was successful!');
        link.disabled = true;
    }

    /**
     * Update link input value.
     */
    updateLink() {
        document.getElementById("link-generated").value = this.generateLink();
    }

    /**
     * Format URL.
     * @param {Object} values Selected values.
     * @returns {String} URL formatted.
     */
    formatUrl(values) {
        let url = document.location.toString().split("?")[0];
        let params = [];
        Object.keys(values).forEach(key => {
            params.push(key + "=" + values[key]);
        });
        url += "?" + params.join("&");
        return url;
    }
}