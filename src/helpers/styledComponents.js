import styled from "styled-components";

const primaryColor = '#1976d2';

export const Button = styled.button`
display: flex;
-webkit-box-align: center;
align-items: center;
-webkit-box-pack: center;
justify-content: center;
position: relative;
box-sizing: border-box;
-webkit-tap-highlight-color: transparent;
outline: 0px;
border: 0px;
margin: 0px;
cursor: pointer;
user-select: none;
vertical-align: middle;
appearance: none;
text-decoration: none;
font-family: Roboto, Helvetica, Arial, sans-serif;
font-weight: 500;
font-size: 0.875rem;
line-height: 1.75;
letter-spacing: 0.02857em;
text-transform: uppercase;
min-width: 64px;
padding: 6px 16px;
border-radius: 4px;
transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
color: white;
background-color: ${primaryColor};
height: 56px;
box-shadow: rgb(0 0 0 / 20%) 0px 3px 1px -2px, rgb(0 0 0 / 14%) 0px 2px 2px 0px, rgb(0 0 0 / 12%) 0px 1px 5px 0px;
`;