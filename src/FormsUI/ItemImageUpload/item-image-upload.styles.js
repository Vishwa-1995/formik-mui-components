import styled from "styled-components";

export const FormField = styled.input`
  cursor: pointer;
  font-size: 18px;
  display: block;
  width: 0;
  border: none;
  text-transform: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  &:focus {
    outline: none;
  }
`;
