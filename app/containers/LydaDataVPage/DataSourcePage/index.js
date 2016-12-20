import React from 'react';
import {Button, Modal} from 'react-bootstrap';
import DataSourceSidebar from './DataSourceSidebar';
import ConnectionForms from './ConnectionForms';

export default class DataSourcePage extends React.Component {

  state = {connections: [], collections: []};

  componentWillMount() {
    this.fetchConnections();
  }

  fetchConnections() {
    this.props.storage['Connection'].get().then((connections) => {
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
  storage: React.PropTypes.object
};

