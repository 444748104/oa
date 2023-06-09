/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-03-10 15:18:11
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-03-10 15:19:35
 * @Description: 
 */
const express = require("express");
const router = express.Router();
const core = require('@steedos/core');
const objectql = require('@steedos/objectql')
const _ = require('lodash');
const Fiber = require("fibers");

router.get('/api/workflow/v2/get_object_workflows', core.requireAuthentication, async function (req, res) {
    try {
        let userSession = req.user;
        const { spaceId, userId } = userSession;
        Fiber(async function () {
            try {
                Meteor.call('object_workflows.get', spaceId, userId, (error, result)=>{
                    if(error){
                        res.status(200).send({
                            error: error.message
                        });
                    }else{
                        res.status(200).send(result); 
                    }
                })
            } catch (error) {
                console.error(error);
                res.status(200).send({
                    error: error.message
                });
            }

        }).run()
    
    } catch (error) {
        console.error(error);
        res.status(200).send({
            error: error.message
        });
    }
});
exports.default = router;