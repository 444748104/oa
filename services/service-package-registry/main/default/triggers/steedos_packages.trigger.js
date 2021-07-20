const packages = require('../manager/packages');
const _ = require('lodash');
module.exports = {
    listenTo: 'steedos_packages',
    afterFindOne: async function(){
        const allPackages = packages.getAllPackages();
        Object.assign(this.data.values, _.find(allPackages, (package)=>{
            return package._id == this.id
        }))
    },
    afterFind: async function(){
        this.data.values = packages.getAllPackages()
    },
    afterAggregate: async function(){
        this.data.values = packages.getAllPackages()
    },
    afterCount: async function(){
        this.data.values = packages.getAllPackages().length;
    }
}