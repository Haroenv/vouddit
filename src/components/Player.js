import React from 'react';
import ReactPlayer from 'react-player';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100vw;
  height: 80vh;
`;

const Progress = styled.div`
  width: 100%;
  height: 5px;
  background-color: #FFF;
`;

const ProgressFilled = styled.div`
  background-color: #000;
  height: 100%;
  width: 5%;
`;

const Controls = styled.div`
  width: 100%;
  display: none;
`;

const Toggle = styled.button`
  
`;

const Volume = styled.input`
  
`;

export default () => {
  return (
    <Wrapper>
      <ReactPlayer url="https://youtube.com/watch?v=ysz5S6PUM-U" width="100%" height="100%" />
      <Progress>
        <ProgressFilled />
      </Progress>
      <Controls>
        <Toggle>►</Toggle>
        <Volume type="range" name="volume" min={0} max={1} step={0.05} value={1} />
      </Controls>
    </Wrapper>
  );
}
