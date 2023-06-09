import { getSteedosSchema } from '../index';
import { SteedosFieldFormulaTypeConfig } from './type';
import { checkUserSessionNotRequiredForFieldFormulas } from './util';
import { getFieldFormulaConfig, getQuotedByFieldFormulaConfigs } from './field_formula';
import { computeFieldFormulaValue, pickFieldFormulaVarFields, updateQuotedByObjectFieldFormulaValue } from './core';
import { getQuotedByFieldSummaryConfigs, recomputeFieldSummaryValues } from '../summary';

const runCurrentFieldFormulas = async function (fieldFormulaConfig: SteedosFieldFormulaTypeConfig, userSession: any) {
    const { field_name: fieldName, object_name: objectName } = fieldFormulaConfig;
    const formulaVarFields = pickFieldFormulaVarFields(fieldFormulaConfig);
    const docs = await getSteedosSchema().getObject(objectName).find({ filters: [], fields: formulaVarFields })
    for (const doc of docs) {
        const value = await computeFieldFormulaValue(doc, fieldFormulaConfig, userSession);
        let setDoc = {};
        setDoc[fieldName] = value;
        await getSteedosSchema().getObject(objectName).directUpdate(doc._id, setDoc);
        await runQuotedFieldFormulas(doc._id, fieldFormulaConfig, userSession);
    }
    await runQuotedFieldSummaries(fieldFormulaConfig, userSession);
}

const runQuotedFieldFormulas = async function (recordId: string, fieldFormulaConfig: SteedosFieldFormulaTypeConfig, userSession: any) {
    const formulaQuotedBys = await getQuotedByFieldFormulaConfigs(fieldFormulaConfig);
    for (const config of formulaQuotedBys.allConfigs) {
        await updateQuotedByObjectFieldFormulaValue(fieldFormulaConfig.object_name, recordId, config, userSession);
    }
}

/**
 * 找到公式字段被哪些汇总字段引用，并重新计算汇总字段值（相当于点击一次界面上的“批量重算汇总值”按钮）
 * @param fieldFormulaConfig 
 * @param userSession 
 */
const runQuotedFieldSummaries = async function (fieldFormulaConfig: SteedosFieldFormulaTypeConfig, userSession: any) {
    const summaryQuotedBys = await getQuotedByFieldSummaryConfigs(fieldFormulaConfig);
    for (const config of summaryQuotedBys) {
        await recomputeFieldSummaryValues(config, userSession);
    }
}

/**
 * 重算指定公式字段Id对应的公式值
 * @param fieldId : ${objectApiName}.${fieldApiName}
 */
export const recomputeFormulaValues = async (fieldId: string, userSession: any) => {
    let config = await getFieldFormulaConfig(fieldId);
    if (!config) {
        throw new Error(`recomputeFormulaValues:${fieldId} not found in field_formula configs.`);
    }
    return await recomputeFieldFormulaValues(config, userSession);
}

/**
 * 重算指定公式字段的公式值
 * @param fieldFormulaConfig 
 */
export const recomputeFieldFormulaValues = async (fieldFormulaConfig: SteedosFieldFormulaTypeConfig, userSession: any) => {
    if (!userSession) {
        checkUserSessionNotRequiredForFieldFormulas(fieldFormulaConfig);
    }
    await runCurrentFieldFormulas(fieldFormulaConfig, userSession);
    return true;
}