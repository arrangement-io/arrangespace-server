const Cluster = require('./internal/cluster');

/**
 * @api {post} /clusters Create Clusters
 * @apiName CreateClusters
 * @apiGroup Cluster
 * @apiDescription Sort people into cars via geoclustering. Currently only
 *  supports sorting one cluster into one car.
 *
 * @apiParam {Object} Object Cluster Object.
 *
 * @apiExample Example Cluster Object:
 *  {
 *    "items":[
 *      {
 *        "name": "David Home",
 *        "address": "2038 Central Ave",
 *        "zipcode": "94501",
 *        "_id": "zfekidfe"
 *      },
 *      {
 *        "name": "Safeway",
 *        "address": "867 Island Dr",
 *        "zipcode": "94502",
 *        "_id": "abcdefgh"
 *      },
 *      {
 *        "name": "Corica Park Golf Course",
 *        "address": "1 Clubhouse Memorial Rd",
 *        "zipcode": "94502",
 *        "_id": "jjiefjsk"
 *      },
 *      {
 *        "name": "Godfrey Park",
 *        "address": "281 Beach Rd",
 *        "zipcode": "94502",
 *        "_id": "llblah"
 *      }
 *    ],
 *    "containers": [
 *      {
 *        "name": "David SUV",
 *        "size": 5,
 *        "_id": "c739Z0u0u"
 *      },
 *      {
 *        "name": "Bryan Van",
 *        "size": 8,
 *        "_id": "iH34RhRuY"
 *      }
 *    ],
 *    "options": {
 *      "includePolygon": true
 *    }
 *  }
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  {
 *    feature_collection: <FeatureCollection>,
 *    "clusters": {
 *      "0": [
 *        {
 *          "_id": "zfekidfe",
 *          "coordinates": [
 *            37.76761219999999,
 *            -122.2513694
 *          ]
 *        }
 *      ],
 *      "1": [
 *        {
 *          "_id": "abcdefgh",
 *          "coordinates": [
 *            37.7379044,
 *            -122.2394204
 *          ]
 *       },
 *       {
 *         "_id": "jjiefjsk",
 *         "coordinates": [
 *           37.73955,
 *           -122.2329
 *          ]
 *        },
 *        {
 *          "_id": "llblah",
 *          "coordinates": [
 *            37.7336545,
 *            -122.2327653
 *          ]
 *        }
 *      ]
 *    },
 *    "containers": [
 *      {
 *        "name": "Bryan Van",
 *        "size": 8,
 *        "_id": "iH34RhRuY",
 *        "cluster": [
 *          {
 *            "_id": "abcdefgh",
 *            "coordinates": [
 *              37.7379044,
 *              -122.2394204
 *            ]
 *          },
 *          {
 *            "_id": "jjiefjsk",
 *            "coordinates": [
 *              37.73955,
 *              -122.2329
 *            ]
 *          },
 *          {
 *            "_id": "llblah",
 *            "coordinates": [
 *              37.7336545,
 *              -122.2327653
 *            ]
 *          }
 *        ]
 *      },
 *      {
 *        "name": "David SUV",
 *        "size": 5,
 *        "_id": "c739Z0u0u",
 *        "cluster": [
 *          {
 *            "_id": "zfekidfe",
 *            "coordinates": [
 *              37.76761219999999,
 *              -122.2513694
 *            ]
 *          }
 *        ]
 *      }
 *    ]
 *  }
 */
exports.createClusters = function (request) {
  return new Promise(resolve => {
    Cluster.create(request).then(results => {
      resolve(results);
    });
  });
};
