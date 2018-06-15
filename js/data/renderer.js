"use strict";

class Renderer {

    setEstimations(dataEstimations) {
        this.estimations = dataEstimations;
    }

    /**
     * Render data obtained from resources package.
     */
    render() {
        let keys = Object.keys(this.estimations);
        for (let i = keys.length -1; i > -1; i --) {
            this.feedSelector(keys[i], this.estimations[keys[i]]);
        }
    }

    /**
     * Show all elements from the given index up the first item in the forms list
     * @param {String} key Select to feed.
     * @param {Object} data Data to feed inside the Select.
     */
    feedSelector(key, data) {
        let options = '';
        let count = 0;
        data.data.forEach(
            opt => {
                count++;
                options += '<option value="' + opt.value + '"' + (opt.selected != undefined ? ' selected="selected" ' : '') + '>' + opt.message + '</option>';
            }
        );
        if (data.status == "optional") options += '<option value="0" selected="selected">Rien à signaler</option>';
        let html = '<div class="form-group">' +
            '<div class="form-inline">' +
                '<label for="bug-' + key + '" ' + (data.status == "mandatory" ? 'title="Mandatory parameter"' : '') + ' class="control-label col-sm-3 ' + data.status + '">' + data.description + ':</label>' +
                '<select id="bug-' + key + '" class="form-control" onchange="main.estimator.estimate();" for="bug-selectors" class="col-sm-9">' + options + '</select>' +
            '</div>' +
        '</div>';
        $('#bug-selectors').prepend(html);
        return html;
    }
}