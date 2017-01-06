import React from 'react';
import {Dialog, FlatButton} from 'material-ui'

export default class FieldSetting extends React.Component {

  state = {};

  componentWillMount() {
    this.setState({open: this.props.open, field: this.props.field, resource: this.props.resource});
  }

  componentWillReceiveProps(nextProps) {
    this.setState({open: nextProps.open, field: nextProps.field, resource: nextProps.resource});
  }

  render() {
    return <Dialog open={this.state.open || false}
                   actions={[
                     <FlatButton onClick={() => {
                       this.props.onClose();
                     }}>取消</FlatButton>,
                     <FlatButton
                       onClick={() => {
                         this.props.onSave(this.props.field);
                         this.props.onClose();
                       }}
                     >确定</FlatButton>]}
                   title="字段配置"
    >
      {this.state.field && this.state.field.name}
    </Dialog>
  }
}

FieldSetting.propTypes = {
  open: React.PropTypes.bool,
  field: React.PropTypes.object,
  resource: React.PropTypes.object,
  onSave: React.PropTypes.func,
  onClose: React.PropTypes.func
};