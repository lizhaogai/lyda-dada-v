import React from 'react';
import {
  Dialog,
  FlatButton,
  Table,
  Tabs,
  Tab,
  TableHeader,
  TableRow,
  TableHeaderColumn,
  TableRowColumn,
  TableBody
} from 'material-ui';
import {FormControl} from 'react-bootstrap'
import Utils from './utils';

export default class LayerSave extends React.Component {

  state = {};

  componentWillMount() {
    this.setState({
      open: this.props.open,
      layer: this.props.layer,
      join: this.props.join,
      source: this.props.source,
      target: this.props.target,
      link: this.props.link
    });
  }


  componentWillReceiveProps(nextProps) {
    this.setState({
      open: nextProps.open,
      layer: nextProps.layer,
      join: nextProps.join,
      source: nextProps.source,
      target: nextProps.target,
      link: nextProps.link
    });
  }

  renderRelationType(join) {
    let type = join && join.type;
    let operator = join && join.operator;
    if (type == 'left') {
      return <FormControl
        componentClass="select"
        placeholder="select"
        value={operator || 'outer'}
        onChange={(e) => {
          let value = e.target.value;
          let join = this.state.join;
          join.operator = value;
          this.setState({join: join});
        }}
      >
        <option value="outer">左连接-outer</option>
        <option value="anti">左连接-anti</option>
        <option value="semi">左连接-semi</option>
      </FormControl>
    } else if (type == 'right') {
      return <FormControl
        componentClass="select"
        placeholder="select"
        value={operator || 'outer'}
        onChange={(e) => {
          let value = e.target.value;
          let join = this.state.join;
          join.operator = value;
          this.setState({join: join});
        }}
      >
        <option value="outer">右连接-outer</option>
        <option value="anti">右连接-anti</option>
        <option value="semi">右连接-semi</option>
      </FormControl>

    } else if (type == 'inner') {
      return '内连接';
    } else {
      return '全连接';
    }
  }

  handleSelect = (value) => {
    let join = this.state.join;
    join.type = value;
    this.setState({join: join});
  };

  render() {
    return <Dialog open={this.state.open || false}
                   actions={[<FlatButton onClick={() => {
                     this.props.onClose()
                   }}>取消</FlatButton>,
                     <FlatButton onClick={() => {
                       let join = this.state.join;
                       let _join = {
                         sourceResourceId: join.targetResourceId,
                         targetResourceId: join.sourceResourceId,
                         type: join.type,
                         on: []
                       };

                       let source = Utils.getResource(this.state.layer, _join.sourceResourceId);
                       let target = Utils.getResource(this.state.layer, _join.targetResourceId);
                       (join.on || []).map(on => {
                         _join.on.push({sourceColumnName: on.targetColumnName, targetColumnName: on.sourceColumnName});
                       });
                       this.setState({
                         join: _join,
                         source: source,
                         target: target,
                       });

                     }}>左右调换</FlatButton>,
                     <FlatButton onClick={() => {
                       let layer = Utils.removeJoinByLink(this.state.layer, this.props.link);
                       this.setState({layer: layer});
                       this.props.onSave(layer);
                     }}>删除关联</FlatButton>,
                     <FlatButton
                       onClick={() => {
                         let join = this.state.join;
                         let notFinishedOn = (join.on || []).find(on => {
                           return !on.sourceColumnName || !on.targetColumnName;
                         });

                         if (notFinishedOn) {
                           alert('请检查关联字段是否已全部设置');
                           return;
                         }

                         if (!join.on || join.on.length == 0) {
                           alert('请选择关联字段');
                           return;
                         }

                         if (!join.type) {
                           join.type = 'full';
                         }

                         if (join.type == 'right' || join.type == 'left') {
                           join.operator = join.operator || 'outer';
                         } else {
                           join.operator = '';
                         }

                         let layer = this.state.layer;
                         layer = Utils.updateJoin(layer, join);
                         this.setState({layer: layer});
                         this.props.onSave(layer);
                       }}
                     >确定</FlatButton>]}
                   title="关联设置"
    >
      <Tabs value={(this.state.join && this.state.join.type) || 'full'}
      >
        <Tab value={'full'} label="全连接" onClick={() => {
          this.handleSelect('full')
        }}/>
        <Tab value={'left'} label="左连接" onClick={() => {
          this.handleSelect('left')
        }}/>
        <Tab value={'right'} label="右连接" onClick={() => {
          this.handleSelect('right')
        }}/>
        <Tab value={'inner'} label="内连接" onClick={() => {
          this.handleSelect('inner')
        }}/>
      </Tabs>

      <Table style={{marginTop: 15, marginBottom: 15}} selectable={false}>
        <TableHeader
          displaySelectAll={false}
          adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn
              style={{borderBottom: 0}}>{this.state.source && (this.state.source.title || this.state.source.name)}</TableHeaderColumn>
            <TableHeaderColumn style={{borderBottom: 0, textAlign: 'center'}}>
              {this.renderRelationType(this.state.join)}
            </TableHeaderColumn>
            <TableHeaderColumn
              style={{borderBottom: 0}}>{this.state.target && (this.state.target.title || this.state.target.name)}</TableHeaderColumn>
            <TableHeaderColumn></TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {((this.state.join && this.state.join.on) || []).map((joinOn, index) => {
            return <TableRow key={index + '_join_on'}>
              <TableRowColumn><FormControl
                componentClass="select"
                placeholder="select"
                value={joinOn.sourceColumnName}
                onChange={(value) => {
                  let sourceColumn = value.target.value;
                  let join = this.state.join;
                  join.on[index].sourceColumnName = sourceColumn;
                  this.setState({join: join});
                }}
              >
                <option value="">选择关联字段</option>
                {((this.state.source && this.state.source.columns) || []).map((column, index) => {
                  return <option value={column.name}
                                 key={index + 'relation_source_column'}>{column.label || column.name}</option>
                })}
              </FormControl></TableRowColumn>
              <TableRowColumn style={{textAlign: 'center', paddingTop: 12}}>=</TableRowColumn>
              <TableRowColumn><FormControl
                componentClass="select"
                placeholder="select"
                value={joinOn.targetColumnName}
                onChange={(value) => {
                  let targetColumnName = value.target.value;
                  let join = this.state.join;
                  join.on[index].targetColumnName = targetColumnName;
                  this.setState({join: join});
                }}
              >
                <option value="">选择关联字段</option>
                {((this.state.source && this.state.target.columns) || []).map((column, index) => {
                  return <option value={column.name}
                                 key={index + 'relation_target_column'}>{column.label || column.name}</option>
                })}
              </FormControl></TableRowColumn>
              <TableRowColumn
                style={{
                  textAlign: 'center',
                  lineHeight: '33px',
                  cursor: 'pointer',
                }}

              >
                  <span onClick={ () => {
                    let join = this.state.join;
                    join.on.splice(index, 1);
                    this.setState({join: join});
                  }}> 删除</span>
              </TableRowColumn>
            </TableRow>
          })}
          <TableRow>
            <TableRowColumn>
              <FormControl
                componentClass="select"
                placeholder="select"
                value={""}
                onChange={(value) => {
                  let sourceColumn = value.target.value;
                  let layer = this.state.layer;
                  let join = this.state.join;
                  join.on = join.on || [];
                  join.on.push({
                    "sourceColumnName": sourceColumn,
                    "targetColumnName": ""
                  });
                  this.setState({layer: layer, join: join});
                }}
              >
                <option value="">添加新的关联字段</option>
                {((this.state.source && this.state.source.columns) || []).map((column, index) => {
                  return <option value={column.name}
                                 key={index + 'relation_source_column'}>{column.label || column.name}</option>
                })}
              </FormControl>
            </TableRowColumn>
            <TableRowColumn style={{textAlign: 'center', paddingTop: 12}}>=</TableRowColumn>
            <TableRowColumn>
              <FormControl
                componentClass="select"
                placeholder="select"
                value={""}
                onChange={(value) => {
                  let targetColumn = value.target.value;
                  let layer = this.state.layer;
                  let join = this.state.join;
                  join.on = join.on || [];
                  join.on.push({
                    "sourceColumnName": "",
                    "targetColumnName": targetColumn
                  });
                  this.setState({layer: layer, join: join});
                }}
              >
                <option value="">添加新的关联字段</option>
                {((this.state.target && this.state.target.columns) || []).map((column, index) => {
                  return <option value={column.name}
                                 key={index + 'relation_target_column'}>{column.label || column.name}</option>
                })}
              </FormControl>
            </TableRowColumn>
            <TableRowColumn></TableRowColumn>
          </TableRow>
        </TableBody>
      </Table>
    </Dialog>
  }
}

LayerSave.propTypes = {
  open: React.PropTypes.bool,
  layer: React.PropTypes.object,
  source: React.PropTypes.object,
  target: React.PropTypes.object,
  join: React.PropTypes.object,
  link: React.PropTypes.object,
  onSave: React.PropTypes.func,
  onClose: React.PropTypes.func
};

LayerSave.contextTypes = {
  router: React.PropTypes.object,
  client: React.PropTypes.object
};
