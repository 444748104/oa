import * as _ from 'lodash';
import { METADATA_TYPE } from '..';
const clone = require('clone');

export const SYSTEM_DATASOURCE = '__SYSTEM_DATASOURCE';
export const MONGO_BASE_OBJECT = '__MONGO_BASE_OBJECT';
export const SQL_BASE_OBJECT = '__SQL_BASE_OBJECT';

export function getObjectServiceName(objectApiName: string){
    return `@${objectApiName}`;
}


async function getBaseObjectConfig(ctx, datasourceName) {
    const serviceName = '*';
    const metadataType = METADATA_TYPE;
    let metadataApiName = SQL_BASE_OBJECT;
    if (datasourceName === 'default' || datasourceName === 'meteor') {
        metadataApiName = MONGO_BASE_OBJECT
    }
    const configs = await ctx.broker.call(`metadata.getServiceMetadatas`, {
        serviceName,
        metadataType,
        metadataApiName: metadataApiName
    })
    return configs && configs.length > 0 ? configs[0]?.metadata : null;
}

async function getObjectConfigs(ctx, objectApiName) {
    const serviceName = '*';
    const metadataType = METADATA_TYPE;
    const objectConfigs = await ctx.broker.call(`metadata.getServiceMetadatas`, {
        serviceName,
        metadataType,
        metadataApiName: objectApiName
    })
    return _.compact(_.map(objectConfigs, 'metadata'));
}

function getObjectDatasource(objectConfigs: Array<any>) {
    const config = _.find(objectConfigs, function (objectConfig) {
        return objectConfig?.datasource;
    })
    // if(!config){
    //     console.log(`getObjectDatasource`, _.map(objectConfigs, 'name'))
    // }
    return config?.datasource;
}


// async function refreshFields() {

// }

// async function refreshActions() {

// }


// async function refreshListViews() {

// }

// async function refreshListViews() {

// }

// async function refreshPermission() {

// }

export async function getOriginalObject(ctx, objectApiName){
    let objectConfig: any = {};

    const objectConfigs = await getObjectConfigs(ctx, objectApiName);

    if(objectConfigs.length == 0){
        return null
    }

    objectConfig = _.defaultsDeep({}, ..._.reverse(objectConfigs), objectConfig)

    const _objectConfig = _.clone(objectConfig)

    objectConfig.fields = _.clone(_objectConfig.fields);

    objectConfig = _.defaultsDeep({}, clone(_objectConfig), objectConfig);

    _.each(objectConfig.fields, function(field, field_name){
        if (field.is_name) {
            objectConfig.NAME_FIELD_KEY = field_name
        } else if (field_name == 'name' && !objectConfig.NAME_FIELD_KEY) {
            objectConfig.NAME_FIELD_KEY = field_name
        }
    })
    return objectConfig;
}

export async function refreshObject(ctx, objectApiName) {
    let objectConfig: any = {};

    const objectConfigs = await getObjectConfigs(ctx, objectApiName);

    if(objectConfigs.length == 0){
        return null
    }

    const objectDatasource = getObjectDatasource(objectConfigs);

    const baseObjectConfig = await getBaseObjectConfig(ctx, objectDatasource);
    if(baseObjectConfig){
        delete baseObjectConfig.datasource
        delete baseObjectConfig.hidden;
    }

    const mainConfigs = _.filter(objectConfigs, (conf) => {
        return conf.isMain;
    });

    let mainConfig = null;

    if(mainConfigs.length == 1){
        mainConfig = mainConfigs[0]
    }else if(mainConfigs.length > 1){
        let dbMainConfig = _.find(mainConfigs, (conf)=>{
            return _.has(conf, '_id') && !_.has(conf, '__filename')
        })
        if (dbMainConfig) {
          delete dbMainConfig.isMain;
        }

        mainConfig = _.find(mainConfigs, (conf)=>{
            return conf.isMain;
        })

        if(!mainConfig){
            mainConfig = mainConfigs[0]
        }
    }

    if (!mainConfig) {
        return null;
    }

    objectConfig = _.defaultsDeep({}, ..._.sortBy(objectConfigs, function(o){return o.isMain ? 1:-1}), objectConfig)

    const _objectConfig = _.clone(objectConfig)

    objectConfig.fields = _.clone(_objectConfig.fields);

    if (objectApiName != MONGO_BASE_OBJECT && objectApiName != SQL_BASE_OBJECT){
        _.each(objectConfig.actions, (action) => {
            if (!_.has(action, '_visible') && _.has(action, 'visible')) {
                action._visible = `
                    function(){ 
                        return ${action.visible} 
                    }
                `;
            }
        })
    }

    objectConfig = _.defaultsDeep({}, clone(_objectConfig), baseObjectConfig, objectConfig);

    _.each(objectConfig.fields, function(field, field_name){
        if (field.is_name) {
            objectConfig.NAME_FIELD_KEY = field_name
        } else if (field_name == 'name' && !objectConfig.NAME_FIELD_KEY) {
            objectConfig.NAME_FIELD_KEY = field_name
        }
    })

    _.each(objectConfig.actions, (action, key) => {
        if (!_.has(action, 'name')) {
            action.name = key;
        }
    });

    objectConfig.datasource = mainConfig.datasource

    try {
        const maxSortNoField = _.maxBy(_.values(objectConfig.fields), function(field) { return field.sort_no; })
        if(maxSortNoField){
            objectConfig.fields_serial_number = maxSortNoField.sort_no;
        }
    } catch (error) {
        
    }

    return objectConfig;
}
