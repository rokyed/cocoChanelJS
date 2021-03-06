(function() {
    /**
     * @class EventListenerWrapper
     * @description Wraps event listeners with new functions.
     * @returns {undefined}
     */
    function EventListenerWrapper () {
        this.listeners = [];
        this.wrappers = {};

        this.initWrappers();
    }

    /**
     * @memberof EventListenerWrapper
     * @function addEventListener
     * @description Adds a DOM event listener, with new functions alongside Event's functions and stores reference for easier removal.
     * @param {DOMElement} element - Element on which we attach the listener.
     * @param {String} eventName - DOMEvent name e.g. "click".
     * @param {Function} callback - Method called by the event.
     * @param {(Object|Context)} scope - The scope/context of the method called by the event.
     * @param {Boolean} useCapture - Same as on the DOMEvent.
     * @returns {undefined}
     */
    EventListenerWrapper.prototype.addEventListener = function(element, eventName, callback, scope, useCapture) {
        var me = this,
            listener = {
                element: element,
                eventName: eventName,
                callback: callback,
                scope: scope,
                useCapture: useCapture
            };

        listener.fnx = function (e) {
            for (var key in me.wrappers) {
                e[key] = me.wrappers[key];
            }

            listener.callback.apply(listener.scope, arguments);
        };

        listener.element.addEventListener(listener.eventName, listener.fnx, listener.useCapture);
        this.listeners.push(listener);
    };

    /**
     * @memberof EventListenerWrapper
     * @function removeEventListener
     * @description Removes event listener
     * @param {DOMElement} element - Element on which we attached the listener.
     * @param {String} eventName - DOMEvent name e.g. "click".
     * @returns {undefined}
     */
    EventListenerWrapper.prototype.removeEventListener = function(element, eventName) {
        var listener = this.getListener(element, eventName),
            index = this.indexListener(listener);

        listener.element.removeEventListener(listener.eventName,listener.fnx,listener.useCapture);

        delete listener.element;
        delete listener.eventName;
        delete listener.callback;
        delete listener.scope;
        delete listener.fnx;
        delete listener.useCapture;
    };

    /**
     * @memberof EventListenerWrapper
     * @function getListener
     * @description Removes event listener
     * @param {DOMElement} element - Element on which we attached the listener.
     * @param {String} eventName - DOMEvent name e.g. "click".
     * @returns {Object}
     */
    EventListenerWrapper.prototype.getListener = function(element, eventName) {
        for (var i = 0, listeners = this.listneers, ln = listners; i < ln; i++) {
            if (listeners[i].element === element && listeners[i].eventName === eventName)
                return listeners[i];
        }

        return false;
    };

    /**
     * @memberof EventListenerWrapper
     * @function indexListener
     * @description Removes event listener
     * @param {Object} listener - The listener we have as object.
     * @returns {Number}
     */
    EventListenerWrapper.prototype.indexListener = function(listener) {
        return this.listeners.indexOf(listener);
    };

    /**
     * @memberof EventListenerWrapper
     * @function initWrappers
     * @description Initializes the new functions on the triggered event.
     * @returns {DOMEvent}
     */
    EventListenerWrapper.prototype.initWrappers = function () {
        this.wrappers['getTarget'] = function (selector, depth) {
            var target = null,
                currentElement = this.target;

            depth = depth || 1;

            for (var i = 0; i < depth; i++) {
                if (!currentElement.matches)
                    break;

                if (currentElement.matches(selector)) {
                    target = currentElement;
                    break;
                }

                if (! currentElement.parentNode)
                    break;

                currentElement = currentElement.parentNode;
            }

            return target;
        };
    };

    module.exports = new EventListenerWrapper();
})();
