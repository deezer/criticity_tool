"use strict";

class Estimator {

    setPriorities(dataPriorities) {
        this.priorities = dataPriorities;
    }

    /**
     * Estimate the value.
     */
    estimate() {
        let selects = this.collectionToArray(document.getElementsByTagName('select'));
        let estimation = 0;
        selects.forEach(
            select => {
                estimation += parseInt(select.value);
            }
        );
        if (estimation <= 0) estimation = 1;
        else if (estimation >= Object.keys(this.priorities).length) estimation = Object.keys(this.priorities).length;
        estimation = this.priorities[estimation];
        this.displayEstiamtion(estimation);
    }

    /**
     * Show estimation.
     * @param {Object} data Data estimated.
     */
    displayEstiamtion(data) {
        $('#bug-priority').removeClass();
        $('#bug-priority').addClass(data.message);
        $('#bug-priority').html(this.capitalizeFirstLetter(data.message));
    }

    /**
     * Convert a HTMLCollection to an array.
     * @param {HTMLCollection} htmlCollection Collection to convert.
     */
    collectionToArray(htmlCollection) {
        return [].slice.call(htmlCollection);
    }

    /**
     * Capitalize First letter of a sentence or word.
     * @param {String} sentence Sentence or Word.
     */
    capitalizeFirstLetter(sentence) {
        return sentence.charAt(0).toUpperCase() + sentence.slice(1);
    }
}