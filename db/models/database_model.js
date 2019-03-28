/* eslint-disable */
let databaseSchema = {
    'type': 'object',
    'properties': {
        '_id': { 'type' : 'string' },
        'containers': {
            'type': 'array',
            'items': {
                'type': 'object',
                'properties': {
                    '_id': { 'type': 'string' },
                    'name': { 'type': 'string' },
                    'size': { 'type': 'integer' }
                },
                'additionalProperties': false,
                'required': ['_id', 'name', 'size']
            }
        },
        'is_deleted': { 'type': 'boolean' },
        'items': {
            'type': 'array',
            'items': {
                'type': 'object',
                'properties': {
                    '_id': { 'type': 'string' },
                    'name': { 'type': 'string' },
                    'size': { 'type': 'integer' }
                },
                'additionalProperties': false,
                'required': ['_id', 'name', 'size']
            }
        },
        'name': { 'type': 'string' },
        'owner': { 'type': 'string' },
        'snapshots': {
            'type': 'array',
            'items': {
                'type': 'object',
                'properties': {
                    '_id': { 'type': 'string' },
                    'name': { 'type': 'string' },
                    'unassigned': {
                        'type': 'array',
                        'items': { 'type': 'string' }
                    },
                    'snapshot': {
                        'type': 'object'
                    },
                    'snapshotContainers': {
                        'type': 'array',
                        'items': {
                            'type': 'object',
                            'properties': {
                                '_id': { 'type': 'string' },
                                'items': {
                                    'type': 'array',
                                    'items': { 'type': 'string' }
                                }
                            },
                            'required': ['_id', 'items']
                        }
                    }
                },
                'additionalProperties':false,
                'required': ['_id', 'name', 'unassigned', 'snapshotContainers']
            }
        },
        'modified_timestamp': { 'type': 'number' },
        'timestamp': { 'type': 'number' },
        'users': {
            'type': 'array',
            'items': { 'type': 'string' }
        }
    },
    'required': ['_id', 'containers']
}