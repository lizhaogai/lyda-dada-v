import React from 'react';
import {
  Dialog, FlatButton, TableHeader,
  TableRow,
  TableHeaderColumn,
  TableRowColumn,
  TableBody, TextField,
  Table
} from 'material-ui'
import {FormControl} from 'react-bootstrap';

export default class Lookup extends React.Component {

  state = {};

  componentWillMount() {
    this.setState({open: this.props.open, field: this.props.field, resource: this.props.resource});
  }

  componentWillReceiveProps(nextProps) {
    this.setState({open: nextProps.open, field: nextProps.field, resource: nextProps.resource});
  }

  render() {
    let lookupData = (this.state.field && this.state.field.lookup && this.state.field.lookup.data) || {};
    return <Dialog open={this.state.open || false}
                   actions={[
                     <FlatButton onClick={() => {
                       this.props.onClose();
                     }}>取消</FlatButton>,
                     <FlatButton
                       onClick={() => {
                         this.props.onSave(this.state.field, this.state.resources);
                       }}
                     >确定</FlatButton>]}
                   title={"配置字段 " + (this.state.field && this.state.field.columnName) + ' 自定义显示'}
    >
      <div>
        <FormControl
          componentClass="select"
          placeholder="select"
          value={(this.state.field && this.state.field.lookup && (this.state.field.lookup.model ? this.state.field.lookup.model : this.state.field.lookup.type)) || 'none'}
          onChange={(e) => {
            let value = e.target.value;
            let field = this.state.field;
            if (value == 'none') {
              field.lookup = null;
            } else if (value == 'Org') {
              field.lookup = {
                "type": "model",
                "model": "Org",
                "source": "id",
                "target": "name"
              };
            } else if (value == 'Team') {
              field.lookup = {
                "type": "model",
                "model": "Team",
                "source": "id",
                "target": "name"
              };
            } else if (value == 'Account') {
              field.lookup = {
                "type": "model",
                "model": "Account",
                "source": "id",
                "target": "fullname"
              };
            } else if (value == 'data') {
              let data = field.lookup && field.lookup.data;
              field.lookup = {
                "type": "data",
                "data": data
              };
            }
            this.setState({field: field});
          }}
        >
          <option value="none"> 无自定义显示
          </option >
          < option value="Org">显示为部门
          </option>
          <option value="Team">显示为团队
          </option>
          <option value="Account">显示为成员
          </option>
          <option value="data">自定义枚举
          </option>
        </FormControl>
      </div>
      {this.state.field && this.state.field.lookup && this.state.field && this.state.field.lookup.type == 'data' ?
        <Table style={{marginTop: 15, marginBottom: 15}} selectable={false}>
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn
                style={{borderBottom: 0}}>真实值</TableHeaderColumn>
              <TableHeaderColumn
                style={{borderBottom: 0}}>显示值</TableHeaderColumn>
              <TableHeaderColumn style={{borderBottom: 0}}></TableHeaderColumn>
              <TableHeaderColumn style={{textAlign: 'right'}}>操作</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {
              Object.keys(lookupData).map((key, index) => {
                return <TableRow key={key + "index"}>
                  <TableRowColumn>
                    <span>{key}</span>
                  </TableRowColumn>
                  <TableRowColumn>
                    <span>{lookupData[key]}</span>
                  </TableRowColumn>
                  <TableRowColumn style={{textAlign: 'right'}}>
                <span
                  style={{
                    cursor: 'pointer',

                  }}
                  onClick={ () => {
                    let field = this.state.field;
                    let data = field.lookup.data || {};
                    delete data[key];
                    field.lookup.data = data;
                    this.setState({field: field});
                  }}> 删除</span>
                  </TableRowColumn>
                </TableRow>
              })
            }
            <TableRow>
              <TableRowColumn>
                <TextField id="_sss3"
                           onChange={(e) => {
                             let value = e.target.value.trim();
                             this.setState({_key: value});
                           }}
                />
              </TableRowColumn>
              <TableRowColumn>
                <TextField id="_sss2"
                           onChange={(e) => {
                             let value = e.target.value.trim();
                             this.setState({_value: value});
                           }}
                />
              </TableRowColumn>
              <TableRowColumn style={{textAlign: 'right'}}>
                <span
                  style={{
                    cursor: 'pointer',
                  }}
                  onClick={ () => {
                    let field = this.state.field;
                    let data = field.lookup.data || {};

                    if (!this.state._key || !this.state._value) {
                      alert('请输入真实值与显示值');
                      return;
                    }
                    data[this.state._key] = this.state._value;
                    field.lookup.data = data;
                    this.setState({field: field, _key: '', _value: ''});
                  }}>添加</span>
              </TableRowColumn>
            </TableRow>
          </TableBody>
        </Table> : null}
    </Dialog>
  }
}

Lookup.propTypes = {
  open: React.PropTypes.bool,
  resource: React.PropTypes.object,
  field: React.PropTypes.object,
  onSave: React.PropTypes.func,
  onClose: React.PropTypes.func
};

