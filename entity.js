/**
 * Class that represents JSON serializable entity.
 */
module.exports.Entity = class Entity {
    /**
     * Creates instance of 'Entity'.
     * @param {string} type Type of the entity. Available types: 'Customer', 'Driver', 'Order', 'Transport'.
     * @param {*} data String that contains JSON serialized object.
     */
    constructor(type, data) {
        this.type = type;
        this.data = data;
    }
}