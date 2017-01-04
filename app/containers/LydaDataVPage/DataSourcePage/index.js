import React from 'react';
import {Button, Modal} from 'react-bootstrap';
import DataSourceSidebar from './DataSourceSidebar';
import ConnectionForms from './ConnectionForms';
import styled from 'styled-components';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import 'storm-react-diagrams/src/sass.scss';
import './cr.scss'
import Layers from './layers';
import {push} from 'react-router-redux';
import {connect} from 'react-redux';

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

class DataSourcePage extends React.Component {

  state = {
    layers: []
  };

  componentWillMount() {
    this.fetchConnections();
    this.context.client["Layer"].get(this.props.params.appId).then((layers) => {
      this.setState({layers: layers || []});
    });
  }

  fetchConnections() {
    this.context.client['Connection'].get(this.props.params.appId).then((connections) => {
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
    this.context.client['Collection'].get(id).then((collections) => {
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
    data.appId = this.props.params.appId;
    this.context.client['Connection'].save(data).then(() => {
      this.fetchConnections()
    });
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
        {!this.props.children ? <Layers layers={this.state.layers}
                                        onChangRoute={(path) => {
                                          this.props.dispatch(push(this.props.location.pathname + path));
                                        }}/> : this.props.children}

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

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapDispatchToProps)(DataSourcePage);

DataSourcePage.propTypes = {
  params: React.PropTypes.object,
  dispatch: React.PropTypes.func.isRequired
};

DataSourcePage.contextTypes = {
  router: React.PropTypes.object,
  client: React.PropTypes.object
};

