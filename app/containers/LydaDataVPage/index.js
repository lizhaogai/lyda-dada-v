import React from 'react';
import {Link} from 'react-router';
import styled from 'styled-components';
import DataSource from './DataSourcePage'
import LocalStorage from './LocalStorage'

let StyledLink = styled(Link)`
  line-height: 2em;
  padding: 0.28em 0.5em;
  cursor: pointer;
  outline: none
  borderRight: 1px solid #ddd
  color: #333;
  text-decoration: none;
  
  &:hover {
    cursor:pointer;
  }
`;


let appId = '1234';

export default class LydaDataVPage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
  }

  // Since state and props are static,
  // there's no need to re-render this component
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div style={{fontSize: '16px'}}>
        <DataSource appId={appId} storage={LocalStorage}/>
        <div style={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          height: '2em',
          borderTop: '1px solid #ddd',
          background: '#fcfcfc',
          padding: '0em',
          left: '14em'
        }}>
          <StyledLink to={'/data_v'} style={{marginRight: '2em', paddingLeft: '2em', borderRight: 'none'}}><span
            style={{fontSize: '0.875em'}}>数据源</span>
          </StyledLink>

          <StyledLink
            to={'/data_v'} style={{borderLeft: '1px solid #ddd'}}
          ><span style={{fontSize: '0.875em'}}>销售部月度完成情况</span>
          </StyledLink>
          <StyledLink
            to={'/data_v'}
          ><span style={{fontSize: '0.875em'}}>销售部月度团队完成情况</span>
          </StyledLink>
          <StyledLink
            to={'/data_v'}
          ><span style={{fontSize: '0.875em'}}>销售部月度龙虎榜</span>
          </StyledLink>
          <StyledLink
            to={'/data_v'}
          ><span style={{fontSize: '0.875em'}}>+</span>
          </StyledLink>
        </div>
      </div>
    );
  }
}
