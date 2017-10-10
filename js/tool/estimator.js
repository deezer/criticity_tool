"use strict";

class Estimator {
    constructor() {
        this.priorities = dataPriorities;
    }

    /**
     * Estimate the value.
     */
    estimate() {
        var selects = this.collectionToArray(document.getElementsByTagName('select'));
        var estimation = 0;
        selects.forEach(
            select => {
                estimation += parseInt(select.value);
            }
        );
        if (estimation <= 0) estimation = 1;
        else if (estimation >= Object.keys(dataPriorities).length) estimation = Object.keys(dataPriorities).length;
        estimation = dataPriorities[estimation];
        this.displayEstiamtion(estimation);
    }

    /**
     * Show estimation.
     * @param data: {*} Data estimated.
     */
    displayEstiamtion(data) {
        $('#bug-priority').removeClass();
        $('#bug-priority').addClass(data.message);
        $('#bug-priority').html(this.capitalizeFirstLetter(data.message));
    }

    /**
     * Convert a HTMLCollection to an array.
     * @param htmlCollection: HTMLCollection Collection to convert.
     */
    collectionToArray(htmlCollection) {
        return [].slice.call(htmlCollection);
    }

    /**
     * Capitalize First letter of a sentence or word.
     * @param sentence: string Sentence or Word.
     */
    capitalizeFirstLetter(sentence) {
        return sentence.charAt(0).toUpperCase() + sentence.slice(1);
    }
}