import React from 'react';
import {Button, Modal} from 'react-bootstrap';
import {Grid, Row, Col} from 'react-bootstrap';
import DataSourceSidebar from './DataSourceSidebar';
import ConnectionForms from './ConnectionForms';
import styled from 'styled-components';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import 'components/CollectionRelation/sass.scss';
var Canvas = require("components/CollectionRelation/widgets/CanvasWidget");
var BasicNodeWidget = require("components/CollectionRelation/widgets/BasicNodeWidget");

import {Droppable} from 'react-drag-and-drop';

import _ from 'lodash';

let LayerDiv = styled.div`
    border-radius: 3px;
    padding: 0.5em 0em;
    text-align: center;
    font-size: 2em;
    border: 1px solid rgb(204, 204, 204);
                
    &:hover{
       cursor:pointer;
    }
`;

function generateLayout(title) {
  var y = Math.ceil(Math.random() * 4) + 1;
  return {
    x: 5,
    y: 0,
    w: 1,
    h: 2,
    i: title
  };
}

let Engine = require("components/CollectionRelation/Engine")();

let model = {links: [], nodes: []};

Engine.registerNodeFactory({
  type: 'action',
  generateModel: function (model) {
    return React.createElement(BasicNodeWidget, {
      removeAction: function () {
        Engine.removeNode(model);
      },
      color: model.data.color,
      node: model,
      name: model.data.name,
      inPorts: model.data.inVariables,
      outPorts: model.data.outVariables
    });
  }
});

Engine.loadModel(model);

export default class DataSourcePage extends React.Component {

  static defaultProps = {
    className: "layout",
    rowHeight: 30,
    cols: {lg: 3, md: 3, sm: 3, xs: 2, xxs: 2},
  };

  state = {
    connections: [], collections: [], layers: [], mode: 'LayerList', currentBreakpoint: 'lg',
    mounted: false,
    layouts: {lg: []},
  };

  componentWillMount() {
    this.fetchConnections();
  }

  fetchConnections() {
    this.props.storage['Connection'].get(this.props.appId).then((connections) => {
      if (connections.length == 1) {
        this.setState({selectedConnectId: connections[0].id});
        this.fetchCollections(connections[0].id);
      } else {
        if (!this.state.selectedConnectId && connections.length > 0) {
          this.fetchCollections(connections[0].id);
        }
      }
      this.setState({connections: connections});
    })
  }

  fetchCollections(id) {
    this.props.storage['Collection'].get(id).then((collections) => {
      this.setState({collections: collections});
    })
  }

  doShowConnectModal = () => {
    this.setState({showConnectModal: true});
  };

  closeConnectModal = () => {
    this.setState({showConnectModal: false});
  };

  saveConnection = (data) => {
    data.appId = this.props.appId;
    if (this.props.storage) {
      this.props.storage['Connection'].save(data).then(() => {
        this.fetchConnections()
      });
    }
    this.closeConnectModal();
  };

  onConnectionClicked(connection) {
    if (this.state.selectedConnectId != connection.id) {
      this.fetchCollections(connection.id);
      this.setState({selectedConnectId: connection.id});
    }
  }

  generateDOM() {
    return _.map(this.state.layouts.lg, function (l, i) {
      return (
        <div key={i} className={l.static ? 'static' : ''}>
          {l.static ?
            <span className="text" title="This item is static and cannot be removed or resized.">Static - {i}</span>
            : <span className="text">{i}</span>
          }
        </div>);
    });
  }

  onDrop(data) {
    data = JSON.parse(data.collection);
    console.log(data);
  }

  render() {
    let ConnectionForm = ConnectionForms['formio'];
    return (
      <div>
        <div style={{
          width: '14em',
          marginLeft: -16,
          display: 'block',
          position: 'fixed',
          top: 0,
          bottom: 0,
          boxSizing: 'border-box'
        }}>
          <DataSourceSidebar
            onAdd={() => {
              this.doShowConnectModal();
            }}
            title="连接"
            height="33.333333%"
            selectedId={this.state.selectedConnectId}
            onSelect={(connection) => {
              this.onConnectionClicked(connection);
            }}
            data={
              this.state.connections || []
            }
          />

          <DataSourceSidebar
            title="数据表"
            iconType="collection"
            height="66.666666%"
            data={
              this.state.collections || []
            }
          />
        </div>
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '2em',
          borderBottom: '1px solid #ddd',
          background: '#fcfcfc',
          padding: '0.25em 1em',
          left: '14em',
          zIndex: 10
        }}>
          数据视图/{this.state.title}
        </div>
        {this.state.mode == 'LayerList' ? <Grid style={{
          right: 0,
          marginTop: '2.25em',
          marginLeft: '14em',
        }}>
          <Row className="show-grid">
            {
              this.state.layers.map((layer) => {
                return <Col xs={12} md={3} style={{padding: '0.75em 1.5em'}}>
                  <LayerDiv>{layer.name}</LayerDiv>
                </Col>
              })
            }
            <Col xs={12} md={3} style={{padding: '0.75em 1.5em'}}>
              <LayerDiv onClick={() => {
                this.setState({'mode': 'AddLayer', title: '添加Layer'});
              }}>+</LayerDiv>
            </Col>
          </Row>
        </Grid> : ''}

        {
          this.state.mode == 'AddLayer' ? <Droppable
            types={['collection']}
            onDrop={(data) => {
              this.onDrop(data)
            }}>
            <div style={{
              marginLeft: '14em',
              right: 0,
              marginTop: '2.5em',
              height: '100%',
              overflowY: 'scroll',
              marginBottom: '2em',
              background: '#eee',
              minHeight: '15em'
            }}>
              <Canvas
                style={{
                  width: '100%',
                  minHeight: '30em',
                  background: 'rgb(60, 60, 60)',
                  display: 'flex'
                }}
                engine={Engine}
              />
            </div>
          </Droppable> : ''
        }


        <Modal show={this.state && this.state.showConnectModal} onHide={this.closeConnectModal}>
          <Modal.Header closeButton>
            <Modal.Title>添加数据源</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ConnectionForm ref="connectionForm" onSubmit={(data) => {
              this.saveConnection(data);
            }}/>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.closeConnectModal()}>取消</Button>
            <Button onClick={() => {
              this.refs['connectionForm'].submit();
            }}>确定</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

DataSourcePage.propTypes = {
  storage: React.PropTypes.object,
  appId: React.PropTypes.string,
  onLayoutChange: React.PropTypes.func
};

