import { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import styled from 'styled-components'
import { GiHamburgerMenu } from 'react-icons/gi'

function Header({ user , logout}) {
  const [menu, setMenu] = useState(false)

  return (
  <StyledHeader> 
    <NavH1>Reflector</NavH1>
    <Menu>
      {!menu?
      <div onClick={() => setMenu(!menu)}>
        <GiHamburgerMenu size={30} color="white"/> 
      </div>:
      <ul>
        <li>
          <ControlPanel>
            <XButton onClick={() => setMenu(!menu)}>X</XButton>
            {user ? (
              <>
                <li><StyledButton onClick={logout}>Logout</StyledButton></li>
                <li><StyledButtonLink> <Link to='/courses/new'>New Course</Link> </StyledButtonLink></li>
              </>
            ) : (
              <>
                <li><StyledButtonLink> <Link to='/registration'>Register</Link> </StyledButtonLink></li>
              </>
            )}
            <li><StyledButtonLink> <Link to='/'> Home </Link> </StyledButtonLink></li>
            <li><StyledButtonLink> <Link to='/profile'>Profile</Link> </StyledButtonLink></li>
            <li><StyledButtonLink> <Link to='/notes'>Notes</Link> </StyledButtonLink></li>
            <li><StyledButtonLink> <Link to='/courses'>Courses</Link> </StyledButtonLink></li>
          </ControlPanel>
        </li>
      </ul>
      }
    </Menu>
  </StyledHeader>
    )
  }
  
export default Header

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: var(--header);
  padding: 10px;
  border-radius: 4px;
  position: relative;
`;

const ControlPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  background-color: #D3D3D3;
  padding: 10px;
  border-radius: 4px;
  position: absolute;
  right: 0;
  width: 120px; 
  color: #333; // Dark gray text

`;

const Menu = styled.div`
  display: flex;
  align-items: center;
  color: var(--header);
  div {
    svg {
      color: #00008B; /* Dark blue */
    }
  }
  ul {
    background-color: #8EAOAE; /* Light gray */
    padding: 10px;
    border-radius: 4px;
    list-style: none;
  }
  a {
    color: #343a40; /* Dark gray */
    text-decoration: none;
    &:hover {
      color: #6F8F8F; /* Blue */
    }
  }
`;

  const NavH1 = styled.h1`
  font-family: 'Arial', sans-serif;
  color: var(--bg);
  background-color: var(--header);
`;

const XButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #8EAOAE; 
  color: #000; 
  font-family: Arial, sans-serif;
  font-weight: bold;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-bottom: 10px;
  &:hover {
    background-color: #fff; 
  }
`;
const StyledButton = styled.button`
  display: block;
  cursor: pointer;
  background-color: var(--link);
  color: var(--bg);
  font-family: Arial, sans-serif;
  font-weight: normal;
  text-decoration: none;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 1em;
  transition: background-color 0.3s ease;
  outline: none;
  margin-top: 10px;
  &:hover, &:focus {
    background-color: darken(var(--link), 10%);
    color: var(--bg);
  }
`

const StyledButtonLink = styled(Link)`
  display: block;
  cursor: pointer;
  background-color: var(--link);
  color: var(--bg);
  font-family: Arial, sans-serif;
  font-weight: normal;
  text-decoration: none;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 1em;
  transition: background-color 0.3s ease;
  outline: none;
  margin-top: 10px;
  &:hover, &:focus {
    background-color: darken(var(--link), 10%);
    color: var(--bg);
  }
`;