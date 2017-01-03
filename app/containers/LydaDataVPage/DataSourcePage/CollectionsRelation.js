import React, {PropTypes} from 'react';
import {Engine, CanvasWidget} from 'storm-react-diagrams'
import TableRelationNodeWidget from 'storm-react-diagrams/src/widgets/TableRelationNodeWidget';
import styled from 'styled-components';

export default class CollectionsRelation extends React.Component {

  componentWillMount() {
    var engine = Engine({
      zoomOnWheel: false,
      singleLink: true,
      linkPointerAble: false,
      singlePointer: true,
      nodeMovable: false,
      pointerMovable: false,
      canvasMovable: false,
      isTableRelation: true,
      onLinkClick: this.props.onRelationClick,
      onNodeRemove: this.props.onCollectionRemove,
      onLinkAdd: this.props.onRelationAdd
    });

    engine.registerNodeFactory({
      type: 'action',
      generateModel: function (model) {
        return React.createElement(TableRelationNodeWidget, {
          removeAction: function (id) {
            if (engine.onNodeRemove) {
              engine.onNodeRemove(id);
            }
          },
          background: model.data.background,
          color: model.data.color,
          node: model,
          name: model.data.name,
          inPorts: model.data.inVariables
        });
      }
    });

    let model = GenerateNodesAndLinksr(this.props.dataModels);

    engine.loadModel(model);

    this.setState({engine: engine});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dataModels) {
      let model = GenerateNodesAndLinksr(nextProps.dataModels);
      this.state.engine.loadModel(model);
      this.state.engine.forceUpdate();
    }
  }

  render() {
    return (
      <CanvasWidget
        style={{
          width: '100%',
          height: 400,
          background: '#3c3c3c',
          display: 'flex'
        }}
        engine={this.state.engine}/>
    );
  }
}

CollectionsRelation.propTypes = {
  onRelationClick: PropTypes.func,
  onCollectionRemove: PropTypes.func,
  onRelationAdd: PropTypes.func,
  dataModels: PropTypes.object
};

function GenerateNodesAndLinksr(layer) {

  if (!layer.schema || layer.schema.resources.length == 0) {
    return {nodes: [], links: []};
  }

  layer.schema.resources = layer.schema.resources || [];
  layer.schema.joins = layer.schema.joins || [];

  let resourceTargetJoins = {};
  layer.schema.resources.map((resource) => {
    resourceTargetJoins[resource.id] = 0;
  });
  layer.schema.joins.map((join) => {
    let targetCount = resourceTargetJoins[join.targetResourceId] || 0;
    resourceTargetJoins[join.targetResourceId] = targetCount + 1;
  });

  let rootIds = [];
  Object.keys(resourceTargetJoins).map((key) => {
    if (!resourceTargetJoins[key]) {
      rootIds.push(key);
    }
  });

  if (rootIds.length == 0) {
    console.log('layer data has circle, please check and fix first');
    throw new Error('layer data has circle, please check and fix first');
  }

  let resourcesHolder = {};
  layer.schema.resources.map((resource) => {
    resource.found = false;
    resourcesHolder[resource.id] = resource;
  });

  let nodes = generateNodes(resourcesHolder, rootIds, layer.schema.joins, 1);
  let links = layer.schema.joins.map((join) => {
    return {
      id: UID(),
      source: join.sourceResourceId,
      sourcePort: 'in',
      target: join.targetResourceId,
      targetPort: 'in',
      image: '/images/sql-join-icon.png'
    }
  });

  return {nodes: nodes, links: links};
};

function UID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


function generateNodes(resourcesHolder, ids, joins, column) {
  let nodes = [];

  let nextIds = [];
  ids.map((id) => {
    if (resourcesHolder[id].found) {
      return;
    }
    let resource = resourcesHolder[id];
    let node = {
      id: resource.id,
      type: 'action',
      data: {
        color: 'rgb(255, 255, 255)',
        background: 'rgb(50, 50, 50)',
        name: resource.title || resource.name,
        inVariables: ['in'],
        column: column,
        resource: resource
      }
    };

    resourcesHolder[id].found = true;
    nodes.push(node);

    joins.map((join) => {
      if (join.sourceResourceId == id) {
        if (nextIds.indexOf(join.targetResourceId) < 0) {
          nextIds.push(join.targetResourceId);
        }
      }
    })
  });

  if (nextIds.length > 0) {
    nodes = nodes.concat(generateNodes(resourcesHolder, nextIds, joins, column + 1));
  }

  let lastCol = 0;
  let colIndex = 0;
  let _nodes = [];
  nodes.map((node) => {
    if (node.data.column !== lastCol) {
      colIndex = 0;
      lastCol = node.data.column;
    }
    colIndex++;
    node.x = (50 + (node.data.column - 1) * 300);
    node.y = (50 + (colIndex - 1) * 70);

    _nodes.push(node);
  });


  return _nodes;
}
