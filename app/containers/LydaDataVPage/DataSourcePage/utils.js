function getResource(layer, id) {
  return layer.schema.resources.find(function (resource) {
    return resource.id == id;
  });
}

function getJoin(layer, link) {
  let joins = layer.schema.joins;
  return joins.find(join => {
    return join.sourceResourceId == link.source && join.targetResourceId == link.target;
  });
}

function updateJoin(layer, join) {
  let joins = layer.schema.joins;
  let found = false;
  joins.map((_join) => {
    if ((_join.sourceResourceId == join.sourceResourceId && _join.targetResourceId == join.targetResourceId) || (_join.targetResourceId == join.sourceResourceId && _join.targetResourceId == join.sourceResourceId)) {
      found = true;
      _join.sourceResourceId = join.sourceResourceId
      _join.targetResourceId = join.targetResourceId
      _join.type = join.type;
      _join.operator = join.operator;
      _join.on = join.on;
    }
  });

  if (!found) {
    layer.schema.joins.push(join);
  }
  return layer;
}

function removeJoinByLink(layer, link) {
  let joins = layer.schema.joins;
  for (var i = 0; i < joins.length; i++) {
    let value = joins[i];
    if (value.sourceResourceId == link.source && value.targetResourceId == link.target) {
      joins.splice(i, 1);
      i--;
    }
  }

  layer.schema.joins = joins;

  return layer;
}

function removeResource(layer, id) {
  let resources = layer.schema.resources;
  resources.map((resource, index) => {
    if (resource.id == id) {
      resources.splice(index, 1);
    }
  });
  layer.schema.resources = resources;

  let joins = layer.schema.joins;
  for (var i = 0; i < joins.length; i++) {
    let value = joins[i];
    if (value.sourceResourceId == id || value.targetResourceId == id) {
      joins.splice(i, 1);
      i--;
    }
  }

  let fields = layer.fields;
  for (var i = 0; i < fields.length; i++) {
    let value = fields[i];
    if (value.resourceId == id) {
      fields.splice(i, 1);
      i--;
    }
  }

  layer.schema.joins = joins;
  layer.fields = fields;

  return layer;
};


function updateField(layer, field, resource) {
  let i = 0;
  let _field = layer.fields.find((item, index) => {
    let result = item.resourceId == field.resourceId && item.columnName == field.columnName;
    if (result) {
      i = index;
    }
    return result;
  });

  if (!field.label) {
    let resourceField = resource.columns.find(item => {
      return item.name == field.columnName;
    });
    field.label = resourceField.label;
  }
  if (!field.name) {
    let layField = layer.fields.find(item => {
      return item.name == field.columnName;
    });
    if (layField) {
      field.name = field.columnName + '_' + resource.name;
    } else {
      field.name = field.columnName
    }
  }


  _field = Object.assign(_field, field);
  layer.fields[i] = _field;
  return layer;
}

function verifyFieldName(layer, field) {
  let _field = layer.fields.find(item => {
    return item.columnName != field.columnName && item.name == field.name;
  });

  return !!_field;
}

module.exports = {
  getJoin: getJoin,
  getResource: getResource,
  updateJoin: updateJoin,
  removeJoinByLink: removeJoinByLink,
  removeResource: removeResource,
  updateField: updateField,
  verifyFieldName: verifyFieldName
};