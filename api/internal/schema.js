const Joi = require('joi');
const urlRegex = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;

const userDataSchema = Joi.object({
  googleId: Joi.string().required(),
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  givenName: Joi.string().optional(),
  familyName: Joi.string().optional(),
  imageUrl: Joi.string().regex(urlRegex).optional()
});

const userSchema = Joi.object({
  access_token: Joi.string().optional(),
  user_data: userDataSchema
});

const arrangementSchema = Joi.object({
  _id: Joi.string().required(),
  containers: Joi.array().required(),
  is_deleted: Joi.boolean().required(),
  items: Joi.array().required(),
  modified_timestamp: Joi.number().required(),
  name: Joi.string().required(),
  owner: Joi.string().required(),
  snapshots: Joi.array().required(),
  timestamp: Joi.number().required(),
  user: Joi.string().required(),
  users: Joi.array().required()
});

module.exports = function (model, data) {
  let schema = model.collectionName === 'users' ? userSchema : arrangementSchema;
  let errors = Joi.validate(data, schema);

  if (errors.error) {
    return errors.error.details;
  } else {
    return null;
  }
};
