import React from 'react';
import {Dialog, FlatButton, TextField} from 'material-ui'
var validator = require('validations/lib/validator');

export default class LayerSave extends React.Component {

  state = {};

  componentWillMount() {
    this.setState({open: this.props.open, layer: this.props.layer, name: this.props.layer.name});
  }

  componentWillReceiveProps(nextProps) {
    this.setState({open: nextProps.open, layer: nextProps.layer, name: nextProps.layer.name});
  }

  render() {
    return <Dialog open={this.state.open || false}
                   actions={[
                     <FlatButton onClick={() => {
                       this.props.onClose();
                     }}>取消</FlatButton>,
                     <FlatButton
                       onClick={() => {
                         let layer = this.state.layer;
                         if (!layer.schema.resources || layer.schema.resources.length == 0) {
                           alert('请配置数据源');
                           return;
                         }

                         layer.name = this.state.name || layer.name;
                         if (!layer.name) {
                           alert('请输 入Layer 名称');
                           return;
                         }
                         layer.appId = this.props.appId;
                         layer.status = layer.status || 'active';

                         let errors = validator.layerValidator(layer);
                         if (errors && errors.length > 0) {
                           alert(errors);
                           return;
                         }

                         this.context.client['Layer'].save(layer).then(() => {
                           this.props.onSave(layer);
                           this.props.onClose();
                         });
                       }}
                     >确定</FlatButton>]}
                   title="保存 Layer"
    >
      <TextField
        hintText="Layer 名称"
        floatingLabelText="Layer 名称"
        fullWidth={true}
        value={this.state.name}
        onChange={(e) => {
          this.setState({name: e.target.value});
        }}
      /><br />
    </Dialog>
  }
}

LayerSave.propTypes = {
  open: React.PropTypes.bool,
  layer: React.PropTypes.object,
  onSave: React.PropTypes.func,
  onClose: React.PropTypes.func,
  appId: React.PropTypes.string
};

LayerSave.contextTypes = {
  router: React.PropTypes.object,
  client: React.PropTypes.object
};
