import { useState } from 'react'
import {Link} from 'react-router-dom'
import styled from 'styled-components'
import { GiHamburgerMenu } from 'react-icons/gi'

function Header({ handleEdit, user, updateUser }) {
  const [menu, setMenu] = useState(false)

  const handleDelete = () => {
    fetch("/api/v1/logout", {method: "DELETE"})
    .then(resp => {
      if (resp.status === 204) {
        updateUser(null)
      }
    })
    .catch(err => console.log(err))
  }
  return (
  <StyledHeader> 
    <NavH1>Reflector</NavH1>
    <Menu>
      {!menu?
      <div onClick={() => setMenu(!menu)}>
        <GiHamburgerMenu size={30} color="white"/> 
      </div>:
      <ul>
        <ControlPanel>
        <XButton onClick={() => setMenu(!menu)}>X</XButton>
        {user ? (
          <>
            <StyledButtonLink onClick={handleDelete}>Logout</StyledButtonLink>
            <StyledButtonLink to='/courses/new'>New Course</StyledButtonLink>
          </>
        ) : (
          <>
            <StyledButtonLink to='/registration'>Register</StyledButtonLink>
          </>
        )}
        <StyledButtonLink to='/'> Home</StyledButtonLink>
        </ControlPanel>
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
`;

const ControlPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  background-color: #8EAOAE;
  padding: 10px;
  border-radius: 4px;
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
  background-color: #8EAOAE; /* New color */
  color: #fff; /* White text */
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
    background-color: #fff; /* New hover color */
  }
`;

const StyledButtonLink = styled.button`
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