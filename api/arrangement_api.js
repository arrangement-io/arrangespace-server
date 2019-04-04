let db = require('../db/database_mongo');
let Export = require('./internal/export');

/**
 * @api {post} /arrangement/:id Create Arrangement
 * @apiName CreateArrangement
 * @apiGroup Arrangement
 * @apiDescription If arrangement does not exist, then create a new one. Otherwise,
 * update existing arrangement.
 *
 * @apiParam {Number} id Arrangments unique ID.
 * @apiParam {Object} Object Arrangement Object.
 *
 * @apiExample Example Arrangement Object:
 *  {
 *    "_id": "aTBG6NVPP",
 *    "containers": [],
 *    "is_deleted": false,
 *    "items": [],
 *    "modified_timestamp": 1554263347.135,
 *    "name": "My New Arrangement",
 *    "owner": "106427691348095657861",
 *    "snapshots": [
 *      {
 *        "_id": "sZ8O2QXLE",
 *        "name": "Snapshot 1",
 *        "snapshot": {},
 *        "snapshotContainers": [],
 *        "unassigned": []
 *      }
 *    ],
 *    "timestamp": 1554263341.683,
 *    "user": "106427691348095657861",
 *    "users": [
 *      "106427691348095657861"
 *    ]
 *  }
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  {
 *    {arrangement-object}
 *  }
 */
exports.createArrangement = function (arrangementId, payload, request, response) {
  return new Promise(resolve => {
    db.createArrangement(arrangementId, payload, request, response).then(results => {
      resolve(results);
    });
  });
};

/**
 * @api {get} /arrangement/:id Retrieve Arrangement
 * @apiName GetArrangement
 * @apiGroup Arrangement
 *
 * @apiParam {Number} id Arrangments unique ID.
 *
 * @apiSuccess {String} _id Id of the Arrangement.
 * @apiSuccess {Object[]} containers List of Containers.
 * @apiSuccess {Boolean} is_deleted Boolean Value if Arrangment is Deleted.
 * @apiSuccess {String[]} items List of Items.
 * @apiSuccess {Number} modified_timestamp Last Modified Timestamp.
 * @apiSuccess {String} owner GoogleId of Arrangement Owner.
 * @apiSuccess {Object[]} snapshots List of Snapshots.
 * @apiSuccess {String} timestamp Timestamp.
 * @apiSuccess {String} user GoogleId of Arrangement Owner.
 * @apiSuccess {String[]} users List of Owner GoogleIds.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  {
 *    "_id": "aTBG6NVPP",
 *    "containers": [],
 *    "is_deleted": false,
 *    "items": [],
 *    "modified_timestamp": 1554263347.135,
 *    "name": "Untitled Arrangement",
 *    "owner": "106427691348095657861",
 *    "snapshots": [
 *      {
 *        "_id": "sZ8O2QXLE",
 *        "name": "Snapshot 1",
 *        "snapshot": {},
 *        "snapshotContainers": [],
 *        "unassigned": []
 *      }
 *    ],
 *    "timestamp": 1554263341.683,
 *    "user": "106427691348095657861",
 *    "users": [
 *      "106427691348095657861"
 *    ]
 *  }
 */
exports.getArrangement = function (arrangementId, request) {
  return new Promise(resolve => {
    db.getArrangement(arrangementId, request).then(results => {
      resolve(results);
    });
  });
};

/**
 * @api {get} /arrangement/:id/export/:type Export Arrangement
 * @apiName ExportArrangement
 * @apiGroup Arrangement
 *
 * @apiParam {Number} id Arrangements unique ID.
 * @apiParam {String=tsv,csv,json} type Export type.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * "Snapshot 1","",""
 * car,bling,unassigned
 * driver,hejo,blah
 * passenger,"",heyya
 */
exports.exportArrangement = function (arrangementId, exportType, request) {
  return new Promise(resolve => {
    db.getArrangement(arrangementId, request).then(arrangement => {
      if (arrangement) {
        Export.exportArrangement(arrangement, exportType).then(exportResults => {
          resolve(exportResults);
        });
      } else {
        resolve('Something went wrong.');
      }
    });
  });
};

exports.doesArrangementExist = function (arrangementId) {
  return new Promise(resolve => {
    db.doesArrangementExist(arrangementId).then(results => {
      resolve(results);
    });
  });
};
