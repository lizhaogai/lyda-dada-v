import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import styled from 'styled-components';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import 'storm-react-diagrams/src/sass.scss';
import './cr.scss'
import {connect} from 'react-redux';

let LayerDiv = styled.div`
    border-radius: 3px;
    padding: 0.75em 0em;
    text-align: center;
    font-size: 1.25em;
    border: 1px solid rgb(204, 204, 204);
                
    &:hover{
       cursor:pointer;
    }
`;

class Layers extends React.Component {

  state = {
    layers: []
  };

  componentWillMount() {

  }

  componentWillReceiveProps(nextProps) {
    this.setState({layers: nextProps.layers});
  }

  render() {
    return <div>
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
        数据视图
      </div>
      <Grid style={{
        right: 0,
        marginTop: '2.25em',
        paddingLeft: '8.5em',
      }}>
        <Row className="show-grid">
          {
            this.state.layers.map((layer, index) => {
              return <Col key={layer.id + index} xs={12} md={3} style={{padding: '0.75em 1.5em'}}>
                <LayerDiv onClick={() => {
                  this.props.onChangRoute('/layer/' + layer.id);
                }}>{layer.name}</LayerDiv>
              </Col>
            })
          }
          <Col xs={12} md={3} style={{padding: '0.75em 1.5em'}}>
            <LayerDiv onClick={() => {
              this.props.onChangRoute('/newLayer');
            }}>+</LayerDiv>
          </Col>
        </Row>
      </Grid>
    </div>
  }
}


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapDispatchToProps)(Layers);

Layers.propTypes = {
  layers: React.PropTypes.array,
  dispatch: React.PropTypes.func.isRequired,
  onChangRoute: React.PropTypes.func.isRequired
};

Layers.contextTypes = {
  router: React.PropTypes.object,
  client: React.PropTypes.object
};

