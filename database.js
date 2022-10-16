const {Entity} = require('./entity');

/**
 * Class that represents database, can perfrom saving and loading data from Firestore Database.
 */
module.exports.Database = class Database {
    constructor() {
        const admin = require('firebase-admin');
        const serviceAccount = require('./firebase.json');
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        this.firestore = admin.firestore();
    }

    /**
     * Add any serilizable entity object to corresponded collection depends on 'type' field of 'Entity' instance.
     * @param {Entity} entity instance of 'Entity' class.
     */
    async saveJSON(entity) {

        if(typeof entity.data === 'string') {
            entity.data = JSON.parse(entity.data);
        }

        //Corresponding collection where to add object
        var correspondedCollection;

        //Searhing for corresponding collection
        var snapshots = await this.firestore.listCollections()
        for(var i = 0; i < snapshots.length; i++) {
            if(snapshots[i].path == entity.type) {
                correspondedCollection = snapshots[i];
                break;
            }
        }
        
        //If we do not found required collection - return false
        if(!correspondedCollection) {
            console.error("Collection with name '" + entity.type + "' does not exist");
            return false;
        }
        
        var entitityId = entity.data["id"];

        //Check if we have id
        if(entitityId && entitityId != "") {
            //If we have id, find document and update.
            var documents = await (await correspondedCollection.get()).docs;
            for(var i = 0; i < documents.length; i++) {
                //Get document by it id
                if(documents[i].id == entitityId) {
                    await documents[i].ref.update({
                        jsonData: entity.data
                    });
                    return documents[i].id;
                }
            }

            console.error("Document with id '" + entitityId + "' does not exist");
            return false;
        } else {
            
            //Create new document
            var newDocument = await correspondedCollection.add({
                jsonData: entity.data
            });
            //Assign id to the document
            entity.data["id"] = newDocument.id;
            await newDocument.update({
                jsonData: entity.data
            });

            return newDocument.id;
        }
    }

    /**
     * Select all documents that satisfy filter's requirements from specific collection
     * @param {string} category The name of collection from which we will get data
     * @param {*} searchFilters JSON object with fields that represents filters
     * @returns Array of documnets
     */
    async selectJSONCategory(category, searchFilters) {
        //Corresponding collection where to add object
        var correspondedCollection;

        //Searhing for corresponding collection
        var snapshots = await this.firestore.listCollections()
        for(var i = 0; i < snapshots.length; i++) {
            if(snapshots[i].path == category) {
                correspondedCollection = snapshots[i];
                break;
            }
        }

        //If we do not found required collection - return false
        if(!correspondedCollection) {
            console.error("Collection with name '" + category + "' does not exist");
            return false;
        }

        //Array of all data obtained from collections
        var entitiesData = [];

        //Gather data from all documents
        var documents = await (await correspondedCollection.get()).docs;
        for(var i = 0; i < documents.length; i++) {
            if(documents[i].data()["jsonData"]["login"] == searchFilters["login"])
                entitiesData.push(documents[i].data()["jsonData"]);
        }

        return entitiesData;
    }


}
