import React from 'react';
import {Button, Modal} from 'react-bootstrap';
import {Grid, Row, Col} from 'react-bootstrap';
import DataSourceSidebar from './DataSourceSidebar';
import ConnectionForms from './ConnectionForms';
import styled from 'styled-components';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import 'storm-react-diagrams/src/sass.scss';
import './cr.scss'

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

export default class DataSourcePage extends React.Component {

  state = {
    layers: []
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
        {!this.props.children ? <Grid style={{
          right: 0,
          marginTop: '2.25em',
          paddingLeft: '8.5em',
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
                console.log(this.props);
              }}>+</LayerDiv>
            </Col>
          </Row>
        </Grid> : this.props.children}

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
  appId: React.PropTypes.string
};

