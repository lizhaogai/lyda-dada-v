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

export default class Layers extends React.Component {

  state = {
    layers: []
  };

  componentWillMount() {
    this.setState({layers: this.props.layers || []});
  }

  render() {
    return <Grid style={{
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
            let router = this.context.router;
            router.push(this.context.router.location.pathname + '/newLayer');
          }}>+</LayerDiv>
        </Col>
      </Row>
    </Grid>
  }
}

Layers.propTypes = {
  storage: React.PropTypes.object,
  appId: React.PropTypes.string,
  layers: React.PropTypes.array
};

Layers.contextTypes = {
  router: React.PropTypes.object,
};

