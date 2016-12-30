import React from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import 'storm-react-diagrams/src/sass.scss';
import './cr.scss'
import CollectionsRelation from './CollectionsRelation'
import {Droppable} from 'react-drag-and-drop';

export default class NewLayer extends React.Component {


  onDrop(data) {
    data = JSON.parse(data.collection);
    console.log(data);
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
        dataModels={{}}
        onCollectionRemove={(id) => {
          console.log(id);
        }}
        onRelationClick={(link) => {
          console.log(link);
        }}
        onRelationAdd={(link) => {
          console.log(link);
        }}
      />
    </Droppable>
  }
}

NewLayer.propTypes = {
  storage: React.PropTypes.object,
  appId: React.PropTypes.string
};

