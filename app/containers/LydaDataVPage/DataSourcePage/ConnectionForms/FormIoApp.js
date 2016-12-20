import React from 'react';
import {Form, FormGroup, FormControl, Col} from 'react-bootstrap';

export default class FromIoAppConnectionForm extends React.Component {

  onSave = () => {

    let name = this.state.name;
    let database = this.state.database;
    if (!name || !database) {
      return;
    }

    console.log(44);
    let data = Object.assign({}, this.props.data, {
      name: name,
      service: 'formio',
      settings: {database: database}
    });
    if (this.props.onSubmit) {
      this.props.onSubmit(data);
    }
  };

  submit = () => {
    this.onSave();
  };

  render() {
    return <div>
      <Form horizontal>
        <FormGroup>
          <Col style={{marginTop: '0.5em'}} sm={2}>
            连接名称
          </Col>
          <Col sm={10}>
            <FormControl ref='name' type="text"
                         value={(this.state && (this.state.name || (this.state.data && this.state.data.name))) || ''}
                         placeholder="连接名称"
                         onChange={(e) => {
                           this.setState({name: e.target.value});
                         }}/>
          </Col>
        </FormGroup>

        <FormGroup>
          <Col style={{marginTop: '0.5em'}} sm={2}>
            数据库名
          </Col>
          <Col sm={10}>
            <FormControl ref="database" type="text"
                         value={(this.state && (this.state.database || (this.state.data && this.state.data.database))) || ''}
                         placeholder="数据库名"
                         onChange={(e) => {
                           this.setState({database: e.target.value});
                         }}/>
          </Col>
        </FormGroup>
      </Form>
    </div>
  }
}

FromIoAppConnectionForm.propTypes = {
  onSubmit: React.PropTypes.func,
  data: React.PropTypes.object,
  formIoUrl: React.PropTypes.string,
  formIoId: React.PropTypes.string
};

FromIoAppConnectionForm.service = 'formio';
