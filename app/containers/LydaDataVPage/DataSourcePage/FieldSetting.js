import React from 'react';
import {Dialog, FlatButton, TextField, Checkbox} from 'material-ui';

export default class FieldSetting extends React.Component {

  state = {};

  componentWillMount() {
    this.setState({
      open: this.props.open,
      field: this.props.field,
      resource: this.props.resource,
      layer: this.props.layer
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      open: nextProps.open,
      field: nextProps.field,
      resource: nextProps.resource,
      layer: nextProps.layer
    });
  }

  render() {
    return <Dialog open={this.state.open || false}
                   actions={[
                     <FlatButton onClick={() => {
                       this.props.onClose();
                     }}>取消</FlatButton>,
                     <FlatButton
                       onClick={() => {
                         this.props.onSave(this.state.field, this.state.resource);
                       }}
                     >确定</FlatButton>]}
                   title="字段配置"
    >
      <TextField
        hintText="字段名称"
        floatingLabelText="名称"
        fullWidth={true}
        value={this.state.field && this.state.field.name}
        onChange={(e) => {
          let field = this.state.field;
          field.name = e.target.value;
          this.setState({field: field});
        }}
      /><br />
      <TextField
        hintText="字段显示名称"
        floatingLabelText="显示名称"
        fullWidth={true}
        value={this.state.field && this.state.field.label}
        onChange={(e) => {
          let field = this.state.field;
          field.label = e.target.value;
          this.setState({field: field});
        }}
      /><br />
      <Checkbox
        label="隐藏"
        style={{marginTop: '0.75em'}}
        checked={(this.state.field && this.state.field.hidden) || false}
        onCheck={(e) => {
          console.log(e);
          let field = this.state.field;
          field.hidden = e.target.checked;
          this.setState({field: field});
        }}
      />
      <br />
    </Dialog>
  }
}

FieldSetting.propTypes = {
  open: React.PropTypes.bool,
  field: React.PropTypes.object,
  resource: React.PropTypes.object,
  layer: React.PropTypes.object,
  onSave: React.PropTypes.func,
  onClose: React.PropTypes.func
};