import React from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import 'storm-react-diagrams/src/sass.scss';
import './cr.scss'
import CollectionsRelation from './CollectionsRelation'
import {Droppable} from 'react-drag-and-drop';

export default class NewLayer extends React.Component {

  state = {
    layer: {schema: {resources: [], joins: []}}
  };

  componentWillMount() {
  }


  onDrop(data) {
    data = JSON.parse(data.collection);
    console.log(data)
    this.context.client['Resource'].get(data.connectionId, data.name).then((resource) => {
      let layer = this.state.layer;
      let resources = (layer.schema && layer.schema.resources) || [];

      let found = resources.find((item) => {
        return item.id == resource.id;
      });
      if (!found) {
        resources.push(resource);
        layer.schema = layer.schema || {};
        layer.schema.resources = resources;
        this.setState({layer: layer});
      }
    });
  }

  render() {
    return <Droppable
      style={{
        marginLeft: '14em',
        marginTop: '2.5em'
      }}
      types={['collection']}
      onDrop={(data) => {
        this.onDrop(data)
      }}>
      <CollectionsRelation
        dataModels={this.state.layer}
        onCollectionRemove={(id) => {
          let layer = removeResource(this.state.layer, id);
          this.setState({layer: layer});
        }}
        onRelationClick={(link) => {
          console.log(link);
        }}
        onRelationAdd={(link) => {
          let join = {
            "sourceResourceId": link.source,
            "targetResourceId": link.target
          };
          let layer = this.state.layer;
          layer.schema.joins.push(join);
          this.setState({layer: layer});
        }}
      />
    </Droppable>
  }
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

  layer.schema.joins = joins;

  return layer;
};

NewLayer.propTypes = {
  storage: React.PropTypes.object,
  appId: React.PropTypes.string
};

NewLayer.contextTypes = {
  router: React.PropTypes.object,
  client: React.PropTypes.object
};


