import React from 'react'
import Drawer from '@material-ui/core/Drawer'
import withStyles from '@material-ui/core/styles/withStyles'
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@material-ui/core'

import Typography from '@material-ui/core/Typography'
import Toolbar from '@mui/material/Toolbar'
import HomeIcon from '@mui/icons-material/Home'
import PaymentIcon from '@mui/icons-material/Payment'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
import ForwardToInboxRoundedIcon from '@mui/icons-material/ForwardToInboxRounded'
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import MailIcon from '@mui/icons-material/Mail'

const styles = (theme) => ({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
})

class DrawerComponent extends React.Component {
  state = {
    left: false,
  }

  render() {
    const { classes } = this.props

    const sideList = (side) => (
      <div
        className={classes.list}
        role="presentation"
        onClick={this.props.toggleDrawerHandler}
        onKeyDown={this.props.toggleDrawerHandler}
      >
        <List>
          <Toolbar>
            <Typography className={classes.title} variant="h6" noWrap>
              BlockBank
            </Typography>
          </Toolbar>
          <ListItem
            selected={window.location.pathname === '/'}
            button
            component="a"
            href="/"
            key={'home'}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary={'Home'} />
          </ListItem>

          <ListItem
            selected={window.location.pathname === '/transfer'}
            button
            component="a"
            href="/transfer"
            key={'transfer'}
          >
            <ListItemIcon>
              <PaymentIcon />
            </ListItemIcon>
            <ListItemText primary={'Money Transfer'} />
          </ListItem>

          <ListItem
            selected={window.location.pathname === '/fastpayment'}
            button
            component="a"
            href="/fastpayment"
            key={'receivefastpayment'}
          >
            <ListItemIcon>
              <PointOfSaleIcon />
            </ListItemIcon>
            <ListItemText primary={'Receive Fast Payment'} />
          </ListItem>

          <ListItem
            selected={window.location.pathname === '/sendfastpayment'}
            button
            component="a"
            href="/sendfastpayment"
            key={'sendfastpayment'}
          >
            <ListItemIcon>
              <QrCodeScannerIcon />
            </ListItemIcon>
            <ListItemText primary={'Send Fast Payment'} />
          </ListItem>

          <ListItem
            selected={window.location.pathname === '/request_money'}
            button
            component="a"
            href="/request_money"
            key={'request_money'}
          >
            <ListItemIcon>
              <ForwardToInboxRoundedIcon />
            </ListItemIcon>
            <ListItemText primary={'Request Money'} />
          </ListItem>

          <ListItem
            selected={window.location.pathname === '/transaction_history'}
            button
            component="a"
            href="/transaction_history"
            key={'transaction_history'}
          >
            <ListItemIcon>
              <HistoryRoundedIcon />
            </ListItemIcon>
            <ListItemText primary={'Transactions History'} />
          </ListItem>
          {/* {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))} */}
        </List>
        <Divider />
        {/* <List>
          {['Menu Item 1', 'Menu Item 2', 'Menu Item 3'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                <AddCircleOutlineRoundedIcon />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List> */}
      </div>
    )

    return (
      <Drawer open={this.props.left} onClose={this.props.toggleDrawerHandler}>
        {sideList('left')}
      </Drawer>
    )
  }
}

export default withStyles(styles)(DrawerComponent)
