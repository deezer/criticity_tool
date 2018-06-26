"use strict";

class Renderer {

    setEstimations(dataEstimations) {
        this.estimations = dataEstimations;
    }

    /**
     * Render data obtained from resources package.
     * @param {URLSearchParams} parameters URL parameters given by user.
     */
    render(parameters) {
        let keys = Object.keys(this.estimations);
        for (let i = keys.length -1; i > -1; i --) {
            this.feedSelector(keys[i], this.estimations[keys[i]], this.extractParam(parameters, keys[i]));
        }
    }

    /**
     * Extract parameter.
     * @param {URLSearchParams} parameters 
     * Parameters container.
     * @param {String} key 
     * Wanted parameter's key.
     */
    extractParam(parameters, key) {
        return parameters.get(key);
    }

    /**
     * Show all elements from the given index up the first item in the forms list
     * @param {String} key Select to feed.
     * @param {Object} data Data to feed inside the Select.
     * @param {String} paramKey Option key to set as selected.
     */
    feedSelector(key, data, paramKey) {
        let options = [];
        let selected = false;
        // This snippet is used to detect an unknown parameter.
        let keyMatch = false;
        data.data.forEach(
            dataItem => {
                if (dataItem.key == paramKey) {
                    keyMatch = true;
                } 
            }
        );
        // end of snippet
        data.data.forEach(
            opt => {
                if (!selected) {
                    if (keyMatch && paramKey == opt.key || opt.selected != undefined && !keyMatch) {
                        selected = true;
                        options.push('<option key="' + opt.key + '" value="' + opt.value + '" selected="selected">' + opt.message + '</option>');
                    } else {
                        options.push('<option key="' + opt.key + '" value="' + opt.value + '">' + opt.message + '</option>');
                    }
                } else {
                    options.push('<option key="' + opt.key + '" value="' + opt.value + '">' + opt.message + '</option>');
                }
            }
        );
        if (data.status == "optional") options.push('<option key="default_key" value="0"' + (!selected ? ' selected="selected" ' : '') + '>Rien à signaler</option>');
        let html = '<div class="form-group">' +
            '<div class="form-inline">' +
                '<label for="bug-' + key + '" ' + (data.status == "mandatory" ? 'title="Mandatory parameter"' : '') + ' class="control-label col-sm-3 ' + data.status + '">' + data.description + ':</label>' +
                '<select id="bug-' + key + '" class="form-control" onchange="main.estimator.estimate();" for="bug-selectors" class="col-sm-9">' + options.join('') + '</select>' +
            '</div>' +
        '</div>';
        $('#bug-selectors').prepend(html);
        return html;
    }

    /**
     * Get selector values.
     * @returns {Object} Selected values.
     */
    getValues() {
        let container = {};
        Array.prototype.slice.call(document.getElementsByTagName("select")).forEach(
            /**
             * @param {Element} item
             */
            (item) => {
                let key = item.getAttribute("id").split("-")[1];
                container[key] = item.options[item.selectedIndex].getAttribute("key");
            }
        )
        return container;
    }
}