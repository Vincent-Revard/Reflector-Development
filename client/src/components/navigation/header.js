import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AppBar, Toolbar, IconButton, List, ListItem, ListItemText, Drawer, ButtonBase, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

function Header({ user, logout }) {
  const [menu, setMenu] = useState(false)
  const closeMenu = () => {
    setMenu(false);
  }
  const handleLogout = () => {
    logout();
    closeMenu();
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setMenu(!menu)}>
          <MenuIcon />
        </IconButton>
        {user && (
          <Typography variant="h6" color="inherit" component="div">
            Welcome, {user.username}!
          </Typography>
        )}
        <Drawer anchor="right" open={menu} onClose={() => setMenu(!menu)}>
          <List>
            {user ? (
              <>
                <ListItem>
                  <ButtonBase onClick={handleLogout}>
                    <ListItemText primary="Logout" />
                  </ButtonBase>
                </ListItem>
                <ListItem>
                  <ButtonBase component={Link} to={`/profile/${user.id}`} onClick={closeMenu}>
                    <ListItemText primary="Profile" />
                  </ButtonBase>
                </ListItem>
                <ListItem>
                  <ButtonBase component={Link} to='/courses' onClick={closeMenu}>
                    <ListItemText primary="Courses" />
                  </ButtonBase>
                </ListItem>
              </>
            ) : (
              <>
                <ListItem>
                  <ButtonBase component={Link} to='/registration' onClick={closeMenu}>
                    <ListItemText primary="Login/Register" />
                  </ButtonBase>
                </ListItem>
              </>
            )}
            <ListItem>
              <ButtonBase component={Link} to='/' onClick={closeMenu}>
                <ListItemText primary="Home" />
              </ButtonBase>
            </ListItem>
          </List>
        </Drawer>
      </Toolbar>
    </AppBar>
  )
}

export default Header