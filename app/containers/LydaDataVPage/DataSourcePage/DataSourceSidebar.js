import React from 'react';
import styled from 'styled-components';
import FaDatabase from 'react-icos/lib/fa/database';
import FaTable from 'react-icos/lib/fa/table';
import {Draggable} from 'react-drag-and-drop';

let HGroudDiv = styled.div`
    height: 1.75em;
    line-height: 1.75em;
    background: #2e3840;
    padding: 0 0 0 1.25em;
    position: fixed;
    width:14em;
`;

let StyledH3 = styled.h3`
    line-height: 1.75em;
    color: #949aa2;
    margin: 0;
    display: inline;
    font-size: 0.875em;
`;

let StyledA = styled.a`
    background: #212932;
    float: right;
    text-align: center;
    line-height: 1.75em;
    font-weight: 700;
    color: #fff;
    right: 0;
    text-decoration: none;
    height: 1.75em;
    width: 1.75em;
    display: block;
    outline: 0;
    
    &:hover {
      color:#949aa2;
      cursor:pointer;
      text-decoration: none;
    } 
`;

let StyledConnectionDiv = styled.div`
    min-height: 5em;
    overflow-y: scroll;
    padding-top: 1.75em;
`;

let StyledUl = styled.ul`
    padding: 0.25em 0;
    margin-bottom: 0;
    margin-left: 0;
    list-style: none;
    margin: 0 0 0.625em 1.25em;
`;

let StyledLi = styled.li`
    position: static;
    clear: both;
    line-height:2.25em;
`;

let StyleCA = styled.a`
    font-size: 0.75em;
    font-weight: 700;
    padding: 2px 1.5em 2px 1.125em;
    text-shadow: none!important;
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #fff;
    margin: 0;
    
    &:hover{
      text-decoration: none;
      color:#949aa2;
      cursor:pointer;
    }
`;

let StyleFa = styled(FaDatabase)`
    color: #fff;
    float: left;
    margin-top: 0.7em;
    &:hover {
      cursor:pointer;
    } 
`;
let StyleFaTable = styled(FaTable)`
    color: #fff;
    float: left;
    margin-top: 0.7em;
    &:hover {
      cursor:pointer;
    } 
`;

export default class DataSourceSidebar extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    let Icon = StyleFa;
    if (this.props.iconType == 'collection') {
      Icon = StyleFaTable;
    }
    return (
      <div style={{
        minHeight: this.props.height || '33.3333%',
        maxHeight: this.props.height || '33.3333%',
        overflowY: 'scroll',
        background: '#37414b'
      }}>
        <HGroudDiv>
          {
            this.props.onAdd ? <StyledA onClick={() => {
              if (this.props.onAdd) {
                this.props.onAdd();
              }
            }}>+</StyledA> : ''
          }
          <StyledH3>{this.props.title}</StyledH3>
        </HGroudDiv>
        <StyledConnectionDiv>
          <StyledUl>
            {
              this.props.data.map((_data, index) => {
                return <Draggable type="collection" key={'StyledLi' + index} data={JSON.stringify(_data)}>
                  <StyledLi onClick={() => {
                    if (this.props.onSelect) {
                      this.props.onSelect(_data);
                    }
                  }}>
                    <Icon />
                    <StyleCA>{_data.title || _data.name}</StyleCA>
                  </StyledLi>
                </Draggable>
              })
            }
          </StyledUl>
        </StyledConnectionDiv>
      </div>
    );
  }
}

DataSourceSidebar.propTypes = {
  iconType: React.PropTypes.string,
  data: React.PropTypes.array,
  title: React.PropTypes.string,
  height: React.PropTypes.string,
  onSelect: React.PropTypes.func,
  selectedId: React.PropTypes.string,
  onAdd: React.PropTypes.func,
  on: React.PropTypes.func
};
