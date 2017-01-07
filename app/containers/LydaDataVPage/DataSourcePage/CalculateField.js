import React from 'react';
import {Dialog, FlatButton, TextField, Checkbox} from 'material-ui';

export default class CaculateField extends React.Component {

  state = {};

  componentWillMount() {
    this.setState({
      open: this.props.open,
      field: this.props.field,
      resource: this.props.resource,
      layer: this.props.layer,
      expression: this.props.field && (this.props.editMode ? this.props.field.expression : this.props.field.name),
      name: this.props.field && (this.props.editMode ? this.props.field.name : ''),
      label: this.props.field && (this.props.editMode ? this.props.field.label : ''),
      editMode: this.props.editMode,
      preName: this.props.field && this.props.field.name
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      open: nextProps.open,
      field: nextProps.field,
      resource: nextProps.resource,
      layer: nextProps.layer,
      expression: nextProps.field && (nextProps.editMode ? nextProps.field.expression : nextProps.field.name),
      name: nextProps.field && (nextProps.editMode ? nextProps.field.name : ''),
      label: nextProps.field && (nextProps.editMode ? nextProps.field.label : ''),
      editMode: nextProps.editMode,
      preName: nextProps.field && nextProps.field.name
    });
  }

  render() {
    return <Dialog
      open={this.state.open || false}
      style={{overflow: 'scroll'}}
      actions={[
        <FlatButton onClick={() => {
          this.props.onClose();
        }}>取消</FlatButton>,
        <FlatButton
          onClick={() => {
            if (!this.state.name) {
              alert('请输入计算字段名称');
              return;
            }

            let field = {
              name: this.state.name,
              label: this.state.label || this.state.name,
              resourceId: this.state.field.resourceId,
              type: this.state.field.type,
              expression: this.state.expression
            };

            this.props.onSave(this.props.editMode, this.state.preName, field, this.state.resource);
            this.setState({name: '', label: '', expression: ''});
          }}
        >确定</FlatButton>]}
      title={"创建计算字段"}
    >
      <TextField
        hintText="字段名称"
        floatingLabelText="名称"
        value={this.state.name || (this.state.editMode ? this.state.field.name : '')}
        onChange={(e) => {
          let value = e.target.value.trim();
          this.setState({name: value});
        }}
      /><br />
      <TextField
        hintText="字段显示名称"
        floatingLabelText="显示名称"
        value={this.state.label || (this.state.editMode ? this.state.field.label : '')}
        onChange={(e) => {
          let value = e.target.value.trim();
          this.setState({label: value});
        }}
      /><br />
      <TextField
        hintText="字段表达式"
        floatingLabelText="字段表达式"
        value={this.state.expression || this.state.expression === '' ? this.state.expression : (this.state.field && this.state.field.name)}
        fullWidth={true}
        onChange={(e) => {
          let value = e.target.value;
          this.setState({expression: value});
        }}
      /><br />
      <div style={{
        maxHeight: 300,
        overflow: 'scroll'
      }}>
        <div style={{
          marginTop: '1em'
        }}>可选字段
        </div>
        <ul style={{
          marginTop: '0.5em',
          overflow: 'auto'
        }}>
          {
            ((this.state.layer && this.state.layer.fields) || []).map((field, index) => {
              if (field.resourceId == (this.state.field && this.state.field.resourceId))
                return <li
                  key={'field_' + index}
                  style={{
                    listStyle: 'none',
                    padding: '10px 6px',
                    textTndent: '10px',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    let expression = this.state.expression || '';
                    expression = expression + ' ' + field.name;
                    this.setState({expression: expression});
                  }}
                >
                  <span>{field.name}({field.label})</span>
                </li>
            })
          }
        </ul>
      </div>
    </Dialog>
  }
}

CaculateField.propTypes = {
  open: React.PropTypes.bool,
  field: React.PropTypes.object,
  resource: React.PropTypes.object,
  layer: React.PropTypes.object,
  onSave: React.PropTypes.func,
  onClose: React.PropTypes.func,
  editMode: React.PropTypes.bool
};