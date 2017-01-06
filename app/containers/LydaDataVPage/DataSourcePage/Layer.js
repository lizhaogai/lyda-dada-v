import React from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import 'storm-react-diagrams/src/sass.scss';
import './cr.scss'
import CollectionsRelation from './CollectionsRelation'
import {Droppable} from 'react-drag-and-drop';
var validator = require('validations/lib/validator');
import FaCalendar from 'react-icons/lib/fa/calendar';
import FaCog from 'react-icons/lib/fa/cog';
import styled from 'styled-components';
import FieldSetting from './FieldSetting';
import LayerSave from './LayerSave';
import JoinSetting from './JoinSetting';
import Utils from './utils';
import Lookup from './Lookup';

import {
  TableRow,
  Table,
  TableBody,
  TableRowColumn,
  RaisedButton,
  FlatButton,
  Popover,
  MenuItem,
  Menu,
  TableHeader,
  TableHeaderColumn
} from 'material-ui';

let StyledTableRowColumn = styled(TableHeaderColumn)`

    & .field-config{
      display:none;
    }
    &:hover .field-config{
      display:block;
    }
`;

let FieldDiv = styled.div`
    float: right;
    margin-top: -65px;
    color: rgb(23, 196, 187);
    margin-right: -8px;
    
    &:hover {
      cursor: pointer;
    }
    
`;


export default class EditLayer extends React.Component {

  state = {
    layer: {schema: {resources: [], joins: []}}
  };

  componentWillMount() {
    if (this.props.params.layerId) {
      this.context.client['Layer'].findById(this.props.params.layerId).then((layer) => {
        if (layer) {
          this.setState({layer: layer});
        }
      });
    }
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
          if (existSameNameField) {
            newField.name = column.name + "_" + resource.name;
          }
          layer.fields.push(newField);
        });

        this.setState({layer: layer});
      }
    });
  }

  renderHeader() {
    let layer = this.state.layer;
    let fields = (layer && layer.fields) || [];

    let cols = fields.map((field, index) => {
      let resource = Utils.getResource(layer, field.resourceId);
      return <StyledTableRowColumn
        key={index}
        style={{
          width: 100,
          paddingLeft: 10,
          paddingRight: 10,
          backgroundColor: 'rgb(240, 240, 240)'
        }}
      >
        <div style={{fontSize: '0.75em', color: 'rgb(23, 196, 187)', padding: '0.25em'}}>{getTypeIcon(field.type)}</div>
        <div style={{
          padding: '0.25em',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden'
        }}><span>{resource.title || resource.name}</span></div>
        <div style={{
          padding: '0.25em',
          paddingRight: '0.5em',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden'
        }}>{field.label || field.name}</div>
        {this.renderFieldConfig(resource, field)}
      </StyledTableRowColumn>
    });

    return <TableRow>{cols}</TableRow>;
  }

  renderFieldConfig(resource, field) {
    return <FieldDiv className="field-config">
      <FaCog
        onClick={(e) => {
          this.setState({
            anchorEl: e.currentTarget,
            fieldConfig: {resourceId: resource.id, fieldName: field.columnName}
          });
        }}
        label="Click me"
      />
      <Popover
        open={this.state.fieldConfig && this.state.fieldConfig.resourceId == resource.id && this.state.fieldConfig.fieldName == field.columnName}
        anchorEl={this.state.anchorEl}
        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
        targetOrigin={{horizontal: 'left', vertical: 'top'}}
        onRequestClose={() => {
          this.setState({
            fieldConfig: null
          });
        }}
      >
        <Menu>
          <MenuItem
            primaryText="编辑"
            onClick={() => {
              this.setState({fieldConfig: null}, () => {
                this.setState({
                  showFieldSetting: true,
                  fieldConfig: null,
                  field: Object.assign({}, field),
                  resource: resource
                });
              });
            }}
          />
          <MenuItem
            primaryText="自定义显示"
            onClick={() => {
              this.setState({fieldConfig: null}, () => {
                this.setState({
                  showLookupModal: true,
                  fieldConfig: null,
                  field: Object.assign({}, field),
                  resource: resource
                });
              });

            }}
          />
          <MenuItem primaryText="创建计算字段"/>
          <MenuItem primaryText="描述"/>
        </Menu>
      </Popover>
    </FieldDiv>
  }

  renderData() {
    if (this.state.data) {
      return this.state.data.map((item, index) => {
        let layer = this.state.layer;
        let fields = (layer && layer.fields) || [];
        let cols = fields.map((field, index) => (
          <TableRowColumn
            key={index}
            style={{
              width: 100,
              paddingLeft: 5,
              paddingRight: 5,
              textAlign: field.type.toLowerCase() == 'number' ? 'right' : 'left'
            }}
          >{item[field.name]}
          </TableRowColumn>
        ));

        return <TableRow key={index + '_data'}>{cols}</TableRow>;
      });
    }
  }

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
        数据视图/{this.state.layer.title || this.state.layer.name || '添加 Layer'}
        <RaisedButton
          label="保存"
          primary={true}
          style={{
            float: 'right', marginTop: '-0.5em'
          }}
          onClick={() => {
            this.setState({showSaveLayerModal: true});
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
            let layer = Utils.removeResource(this.state.layer, id);
            this.setState({layer: layer});
          }}
          onRelationClick={(link) => {
            let source = Utils.getResource(this.state.layer, link.source);
            let target = Utils.getResource(this.state.layer, link.target);
            let join = Utils.getJoin(this.state.layer, link);
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

      <div style={{marginLeft: '14em', marginTop: '1em', marginBottom: 0}}>
        <Table
          style={{width: '100%'}}
        >
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            {this.renderHeader()}
          </TableHeader>
          <TableBody
            displayRowCheckbox={false}
          >
            {this.renderData()}
          </TableBody>
        </Table>
      </div>

      {!this.state.data || this.state.data.length == 0 ? <div style={{marginTop: '1em', textAlign: 'center'}}>
        <FlatButton onClick={() => {
          let layer = this.state.layer;
          let errors = validator.layerValidator(layer);
          if (errors.length > 0) {
            alert(errors);
            return;
          }
          this.context.client['Report'].query({
            layer: layer,
            fiters: [],
            orders: [],
            fields: layer.fields
          }).then((data) => {
            this.setState({data: data});
          });
        }}>更新数据</FlatButton>
      </div> : null}

      <JoinSetting
        open={this.state.showRelationSettingModal || false}
        source={this.state.source}
        target={this.state.target}
        layer={this.state.layer}
        join={this.state.join}
        link={this.state.selectedLink}
        onSave={(layer) => {
          this.setState({layer: layer, showRelationSettingModal: false});
        }}
        onClose={() => {
          this.setState({showRelationSettingModal: false});
        }}
      />


      <LayerSave
        open={this.state.showSaveLayerModal || false}
        layer={this.state.layer}
        appId={this.props.params.appId}
        onSave={(layer) => {
          this.setState({layer: layer});
        }}
        onClose={() => {
          this.setState({showSaveLayerModal: false});
        }}
      />

      <FieldSetting
        open={this.state.showFieldSetting || false}
        field={this.state.field}
        resource={this.state.resource}
        onSave={(field, resource) => {
          if (Utils.verifyFieldName(this.state.layer, field)) {
            alert('字段名: ' + field.name + ' 已存在, 请修改');
            return;
          }
          let layer = Utils.updateField(this.state.layer, field, resource);
          this.setState({showFieldSetting: false, layer: layer});
        }}
        onClose={() => {
          this.setState({showFieldSetting: false});
        }}
      >
      </FieldSetting>
      <Lookup
        open={this.state && this.state.showLookupModal}
        field={this.state.field}
        resource={this.state.resource}
        onSave={(field, resource) => {
          let layer = Utils.updateField(this.state.layer, field, resource);
          this.setState({showLookupModal: false, layer: layer});
        }}
        onClose={() => {
          this.setState({showLookupModal: false});
        }}
      />
    </div>
  }
}

function getTypeIcon(type) {
  if (type.toLowerCase() == 'number') {
    return <div>#</div>
  } else if (type.toLowerCase() == 'string') {
    return <div>Abc</div>
  } else if (type.toLowerCase() == 'date') {
    return <FaCalendar />
  }
}

EditLayer.propTypes = {
  params: React.PropTypes.object
};

EditLayer.contextTypes = {
  router: React.PropTypes.object,
  client: React.PropTypes.object
};


