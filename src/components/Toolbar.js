import React from 'react'
import { login, logout } from '../utils'
import { fade, makeStyles, withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import MoreIcon from '@mui/icons-material/MoreVert'
import Button from '@mui/material/Button'
import LogoutIcon from '@mui/icons-material/Logout'
import LoginIcon from '@mui/icons-material/Login'
import Link from '@mui/material/Link'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import FaceIcon from '@mui/icons-material/Face'
import RequestedByMenu from './temp'
import logo from '../assets/logo.png'
import { Box } from '@mui/material'

const styles = (theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
})

class ToolbarComponent extends React.Component {
  state = {
    achorEl: false,
    MobileMoreAnchorEl: false,
  }

  handleProfileMenuOpen = (event) => {
    this.setState({
      achorEl: event.currentTarget,
    })
  }

  handleMobileMenuClose = () => {
    this.setState({
      mobileMoreAnchorEl: null,
    })
  }

  handleMenuClose = () => {
    this.setState({
      achorEl: null,
      mobileMoreAnchorEl: null,
    })
  }

  handleMobileMenuOpen = (event) => {
    this.setState({
      mobileMoreAnchorEl: event.currentTarget,
    })
  }

  // logButton=()=>{
  //   // if(window.accountId===''){
  //   //   return (
  //   //     <Button size="small" variant="contained" onClick={this.handleProfileMenuOpen} startIcon={<LoginIcon />}> Login </Button>
  //   //   )
  //   // } else {
  //   //   return (
  //   //     <>
  //   //       <Typography variant="h1" component="h2">{ window.accountId}</Typography>
  //   //       <Button size="small" variant="contained" onClick={this.handleProfileMenuOpen} startIcon={<LogoutIcon />}> Logout </Button>
  //   //     </>
  //   //   )
  //   // }

  //    return (<div>log buttons here</div>)
  // }

  render() {
    const { classes } = this.props
    const isMenuOpen = Boolean(this.state.anchorEl)
    const isMobileMenuOpen = Boolean(this.state.mobileMoreAnchorEl)

    const menuId = 'primary-search-account-menu'

    const mobileMenuId = 'primary-search-account-menu-mobile'
    const renderMobileMenu =
      window.accountId === '' ? (
        <Menu
          anchorEl={this.state.mobileMoreAnchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          id={mobileMenuId}
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={isMobileMenuOpen}
          onClose={this.handleMobileMenuClose}
        >
          <MenuItem onClick={login}>
            <IconButton color="primary">
              <LoginIcon />
            </IconButton>
            <p>Login</p>
          </MenuItem>
        </Menu>
      ) : (
        <Menu
          anchorEl={this.state.mobileMoreAnchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          id={mobileMenuId}
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={isMobileMenuOpen}
          onClose={this.handleMobileMenuClose}
        >
          <MenuItem>
            <Chip
              icon={<FaceIcon />}
              color="primary"
              label={window.accountId}
              variant="outlined"
            />
          </MenuItem>
          <MenuItem onClick={logout}>
            <IconButton color="primary">
              <LogoutIcon />
            </IconButton>
            <p>Logout</p>
          </MenuItem>
        </Menu>
      )

    const logButton =
      window.accountId === '' ? (
        <Button
          size="small"
          variant="contained"
          onClick={login}
          startIcon={<LoginIcon />}
        >
          {' '}
          Login{' '}
        </Button>
      ) : (
        <>
          <Stack direction="row" spacing={3}>
            <Chip
              icon={<FaceIcon />}
              color="primary"
              label={window.accountId}
            />
            <Button
              size="small"
              variant="contained"
              onClick={logout}
              startIcon={<LogoutIcon />}
            >
              {' '}
              Logout{' '}
            </Button>
          </Stack>
        </>
      )

    return (
      <div className={classes.grow}>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
              onClick={this.props.openDrawerHandler}
            >
              <MenuIcon />
            </IconButton>
            {/* <Typography className={classes.title} variant="h6" noWrap> */}
            <Link href="/" color="inherit" underline="none">
              <img src={logo} height="40" />
            </Link>
            {/* </Typography> */}
            {/* <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput
                }}
                inputProps={{ "aria-label": "search" }}
              />
            </div> */}
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <Box marginRight="20px">
                <RequestedByMenu />
              </Box>
              {/* <IconButton aria-label="show 4 new mails" color="inherit">
                <Badge badgeContent={4} color="secondary">
                  <MailIcon />
                </Badge>
              </IconButton>
              <IconButton
                aria-label="show 17 new notifications"
                color="inherit"
              >
                <Badge badgeContent={17} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton> */}
              {/* <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={this.handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton> */}

              {/* <Button size="small" variant="contained" onClick={this.handleProfileMenuOpen} startIcon={<LogoutIcon />}> Logout </Button> */}
              {logButton}
            </div>

            <div className={classes.sectionMobile}>
              <RequestedByMenu />
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={this.handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
      </div>
    )
  }
}

export default withStyles(styles)(ToolbarComponent)
