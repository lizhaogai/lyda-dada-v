import React from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import 'storm-react-diagrams/src/sass.scss';
import './cr.scss'
import CollectionsRelation from './CollectionsRelation'
import {Droppable} from 'react-drag-and-drop';
import {Button, FormControl} from 'react-bootstrap';
import {
  Dialog,
  Tabs,
  Tab,
  TableHeaderColumn,
  TableRow,
  TableHeader,
  Table,
  TableBody,
  TableRowColumn,
  RaisedButton,
  FlatButton
} from 'material-ui';

export default class NewLayer extends React.Component {

  state = {
    layer: {schema: {resources: [], joins: []}}
  };

  componentWillMount() {
  }


  onDrop(data) {
    data = JSON.parse(data.collection);
    this.context.client['Resource'].get(data.connectionId, data.name).then((resource) => {
      let layer = this.state.layer;
      let resources = (layer.schema && layer.schema.resources) || [];
      let found = resources.find((item) => {
        return item.id == resource.id;
      });
      if (!found) {
        resources.push(resource);
        layer.schema = layer.schema || {};
        layer.schema.resources = resources;

        layer.fields = layer.fields || [];
        resource.columns.map(column => {
          let existSameNameField = layer.fields.find(field => {
            return field.name == column.name;
          });

          let newField = {
            "name": column.name,
            "label": column.label,
            "type": column.type,
            "resourceId": resource.id,
            "columnName": column.name
          };
          if (!existSameNameField) {
            newField.name = column.name + "_" + resource.name;
          }
          layer.fields.push(newField);
        });

        this.setState({layer: layer});
      }
    });
  }

  closeRelationSettingModal = () => {
    this.setState({showRelationSettingModal: false});
  };

  handleSelect = (value) => {
    let join = this.state.join;
    join.type = value;
    this.setState({join: join});
  };

  removeJoin = (link) => {
    let layer = removeJoinByLink(this.state.layer, link);
    this.setState({layer: layer});
    this.setState({showRelationSettingModal: false});
  };


  render() {
    return <div>
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        height: '3em',
        borderBottom: '1px solid #ddd',
        background: '#fcfcfc',
        padding: '0.75em 1em',
        left: '14em',
        zIndex: 10
      }}>
        数据视图/添加Layer
        <RaisedButton
          label="保存"
          primary={true}
          style={{
            float: 'right', marginTop: '-0.5em'
          }}
          onClick={() => {
            console.log(this.state.layer);
          }}
        />
      </div>
      <Droppable
        style={{
          marginLeft: '14em',
          marginTop: '3.5em'
        }}
        types={['collection']}
        onDrop={(data) => {
          this.onDrop(data)
        }}>
        <CollectionsRelation
          dataModels={this.state.layer}
          onCollectionRemove={(id) => {
            let layer = removeResource(this.state.layer, id);
            this.setState({layer: layer});
          }}
          onRelationClick={(link) => {
            let source = getResource(this.state.layer, link.source);
            let target = getResource(this.state.layer, link.target);
            let join = getJoin(this.state.layer, link);
            this.setState({
              showRelationSettingModal: true,
              selectedLink: link,
              source: source,
              target: target,
              join: Object.assign({type: 'full'}, join)
            });
          }}
          onRelationAdd={(link) => {
            let join = {
              "sourceResourceId": link.source,
              "targetResourceId": link.target
            };
            let layer = this.state.layer;
            layer.schema.joins.push(join);
            this.setState({layer: layer});
          }}
        />
      </Droppable>
      <Dialog open={this.state.showRelationSettingModal} onHide={this.closeRelationSettingModal}
              actions={[<FlatButton onClick={this.closeRelationSettingModal}>取消</FlatButton>,
                <FlatButton onClick={() => {
                  this.removeJoin(this.state.selectedLink)
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
                    let layer = this.state.layer;
                    layer = updateJoin(layer, join);
                    this.setState({layer: layer});
                    this.closeRelationSettingModal();
                  }}
                >确定</FlatButton>]}
              title="关联设置"
      >
        <Tabs value={(this.state.join && this.state.join.type) || 'full'} onChange={this.handleSelect}
        >
          <Tab value={'full'} label="全连接" onClick={() => {
            this.handleSelect('full')
          }}/>
          <Tab value={'left'} label="左连接" onClick={(value) => {
            this.handleSelect('left')
          }}/>
          <Tab value={'right'} label="右连接" onClick={(value) => {
            this.handleSelect('right')
          }}/>
          <Tab value={'inner'} label="内连接" onClick={(value) => {
            this.handleSelect('inner')
          }}/>
        </Tabs>

        <Table style={{marginTop: 15, marginBottom: 15}}>
          <TableHeader>
            <TableRow>
              <TableHeaderColumn
                style={{borderBottom: 0}}>{this.state.source && (this.state.source.title || this.state.source.name)}</TableHeaderColumn>
              <TableHeaderColumn style={{borderBottom: 0, textAlign: 'center'}}>全连接</TableHeaderColumn>
              <TableHeaderColumn
                style={{borderBottom: 0}}>{this.state.target && (this.state.target.title || this.state.target.name)}</TableHeaderColumn>
              <TableHeaderColumn></TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
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
                  style={{
                    border: 'none'
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
                  style={{
                    border: 'none'
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
                    console.log(this.state.layer);
                    this.setState({layer: layer, join: join});
                  }}
                  style={{
                    border: 'none'
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
                  style={{
                    border: 'none'
                  }}
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
    </div>
  }
}

function getResource(layer, id) {
  return layer.schema.resources.find(function (resource) {
    return resource.id == id;
  });
}

function getJoin(layer, link) {
  let joins = layer.schema.joins;
  return joins.find(join => {
    return join.sourceResourceId == link.source && join.targetResourceId == link.target;
  });
}

function updateJoin(layer, join) {
  let joins = layer.schema.joins;
  let found = false;
  joins.map((_join) => {
    if (_join.sourceResourceId == join.sourceResourceId && _join.targetResourceId == join.targetResourceId) {
      found = true;
      _join.type = join.type;
      _join.on = join.on;
    }
  });

  if (!found) {
    layer.schema.joins.push(join);
  }
  return layer;
}

function removeJoinByLink(layer, link) {
  let joins = layer.schema.joins;
  for (var i = 0; i < joins.length; i++) {
    let value = joins[i];
    if (value.sourceResourceId == link.source && value.targetResourceId == link.target) {
      joins.splice(i, 1);
      i--;
    }
  }

  layer.schema.joins = joins;

  return layer;
}

function removeResource(layer, id) {
  let resources = layer.schema.resources;
  resources.map((resource, index) => {
    if (resource.id == id) {
      resources.splice(index, 1);
    }
  });
  layer.schema.resources = resources;

  let joins = layer.schema.joins;
  for (var i = 0; i < joins.length; i++) {
    let value = joins[i];
    if (value.sourceResourceId == id || value.targetResourceId == id) {
      joins.splice(i, 1);
      i--;
    }
  }

  let fields = layer.fields;
  for (var i = 0; i < fields.length; i++) {
    let value = fields[i];
    if (value.resourceId == id) {
      fields.splice(i, 1);
      i--;
    }
  }

  layer.schema.joins = joins;
  layer.fields = fields;

  return layer;
};

NewLayer.propTypes = {
  storage: React.PropTypes.object,
  appId: React.PropTypes.string
};

NewLayer.contextTypes = {
  router: React.PropTypes.object,
  client: React.PropTypes.object
};


