import * as React from 'react'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import SendIcon from '@mui/icons-material/Send'
import { blue } from '@mui/material/colors'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { styled } from '@mui/material/styles'
import PaymentsSharpIcon from '@mui/icons-material/PaymentsSharp'
import CloseIcon from '@mui/icons-material/Close'
import DoneIcon from '@mui/icons-material/Done'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

const nearAPI = require('near-api-js')
import axios from 'axios'
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded'
import {
  Alert,
  Badge,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  Input,
  Paper,
  Snackbar,
  Stack,
} from '@mui/material'
import Modal from '@mui/material/Modal'
import { borderRadius } from '@mui/system'

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}))
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#eeeeee',
  borderRadius: '10px',
  boxShadow: 24,
  p: 1,
}
export default function RequestedByMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [requestedByDetails, setRequestedByDetails] = React.useState([])
  const [itemIndex, setItemIndex] = React.useState(-1)
  const [pass, setPass] = React.useState('')
  const [showPaymentForm, setShowPaymentForm] = React.useState(false)
  const [openSnack, setOpenSnack] = React.useState(false)
  const [snackType, setSnackType] = React.useState('')
  const [buttonState, changeButtonState] = React.useState(false)
  const [openBD, setOpenBD] = React.useState(false)
  const handleOpenBD = () => {
    setOpenBD(true)
  }
  const handleCloseBD = () => {
    setOpenBD(false)
  }
  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpenSnack(false)
  }

  React.useEffect(async () => {
    let reqByDetails = await window.contract.getRequestedByDetails({
      userId: window.accountId,
    })
    setRequestedByDetails(reqByDetails)
  }, [])

  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const acceptMoneyRequest = async (index) => {
    changeButtonState(true)
    handleOpenBD()
    let privateKey = ''
    axios
      .post(`https://rest.nearapi.org/parse_seed_phrase`, {
        seed_phrase: pass,
      })
      .then((res) => {
        console.log(res)
        console.log(res.data)
        privateKey = res.data.secretKey
      })
    await window.contract.transferNearTokens({
      sender: window.accountId,
      receiver: requestedByDetails[index][4],
      amount: requestedByDetails[index][2],
      message: requestedByDetails[index][3],
      datetime: new Date().toLocaleString(),
      parsedAmount: nearAPI.utils.format.parseNearAmount(
        requestedByDetails[index][2]
      ),
    })

    // trial start-----------------------------------------------------------------------------------------------

    const { connect, KeyPair, keyStores, utils } = nearAPI
    require('dotenv').config()

    const sender = window.accountId
    const receiver = requestedByDetails[index][4]
    const networkId = 'testnet'
    const amount = nearAPI.utils.format.parseNearAmount(
      requestedByDetails[index][2]
    )
    // sets up an empty keyStore object in memory using near-api-js
    const keyStore = new keyStores.InMemoryKeyStore()
    // creates a keyPair from the private key provided in your .env file
    const keyPair = KeyPair.fromString(privateKey)
    // adds the key you just created to your keyStore which can hold multiple keys (must be inside an async function)
    await keyStore.setKey(networkId, sender, keyPair)

    // configuration used to connect to NEAR
    const config = {
      networkId,
      keyStore,
      nodeUrl: `https://rpc.${networkId}.near.org`,
      walletUrl: `https://wallet.${networkId}.near.org`,
      helperUrl: `https://helper.${networkId}.near.org`,
      explorerUrl: `https://explorer.${networkId}.near.org`,
    }

    // connect to NEAR! :)
    const near = await connect(config)
    // create a NEAR account object
    const senderAccount = await near.account(sender)
    const result = await senderAccount.sendMoney(receiver, amount)
    console.log('done')
    // trial end---------------------------------------------------------------------

    console.log('accept', requestedByDetails[index][1])
    setSnackType('accepted')
    await window.contract.removeMoneyRequest({
      sender: window.accountId,
      receiver: requestedByDetails[index][4],
      requestId: requestedByDetails[index][1],
    })
    setOpenSnack(true)
    setItemIndex(-1)
    let tempRequestedByDetails = requestedByDetails.filter(
      (item, key) => key !== index
    )

    setRequestedByDetails(tempRequestedByDetails)

    changeButtonState(false)
    handleCloseBD()
    setItemIndex(-1)
    setPass('')
    setShowPaymentForm(false)
  }

  const rejectMoneyRequest = async (index) => {
    changeButtonState(true)
    handleOpenBD()
    console.log('delete', requestedByDetails[index][1])
    setSnackType('rejected')
    await window.contract.removeMoneyRequest({
      sender: window.accountId,
      receiver: requestedByDetails[index][4],
      requestId: requestedByDetails[index][1],
    })

    setOpenSnack(true)
    setItemIndex(-1)
    let tempRequestedByDetails = requestedByDetails.filter(
      (item, key) => key !== index
    )

    setRequestedByDetails(tempRequestedByDetails)

    changeButtonState(false)
    handleCloseBD()
    setItemIndex(-1)
    setPass('')
    setShowPaymentForm(false)
  }

  return (
    <React.Fragment>
      <Tooltip title="New Money Requests">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <StyledBadge badgeContent={requestedByDetails.length} color="warning">
            <PaymentsSharpIcon />
          </StyledBadge>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {requestedByDetails.length === 0 && (
          <Box px="10px" py="10x">
            <Typography variant="body1">No requests found</Typography>
          </Box>
        )}
        {requestedByDetails.map((item, key) => {
          return (
            <MenuItem onClick={() => setItemIndex(key)}>
              <Grid
                container
                direction="column"
                justifyContent="flex-start"
                alignItems="flex-start"
              >
                <Grid item>
                  <Typography variant="subtitle1">
                    {`By: ${item[4]}`}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1">
                    {`Amount: ${item[2]}`}
                  </Typography>
                </Grid>
              </Grid>

              <ListItemIcon>
                <Tooltip
                  placement="left-start"
                  title={`Date & Time : ${item[0]}\n Purpose : ${item[3]}`}
                >
                  <InfoOutlinedIcon fontSize="small" />
                </Tooltip>
              </ListItemIcon>
            </MenuItem>
          )
        })}
      </Menu>
      <Modal
        open={itemIndex >= 0}
        onClose={() => {
          setItemIndex(-1)
          setPass('')
          setShowPaymentForm(false)
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 9 }}
            open={openBD}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          {/* <Box sx={style}>
          <Typography
            color={'#000000'}
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            Requested by :{itemIndex >= 0 && requestedByDetails[itemIndex][4]}
          </Typography>
          <Typography
            color={'#000000'}
            id="modal-modal-description"
            sx={{ mt: 2 }}
          >
            Amount : {itemIndex >= 0 && requestedByDetails[itemIndex][2]} NEAR
          </Typography>
        </Box> */}
          <Card>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: blue[500] }} aria-label="recipe">
                  {itemIndex >= 0 && requestedByDetails[itemIndex][4].charAt(0)}
                </Avatar>
              }
              title={itemIndex >= 0 && requestedByDetails[itemIndex][4]}
              subheader={itemIndex >= 0 && requestedByDetails[itemIndex][0]}
            />
            <CardMedia
              component="img"
              alt="green iguana"
              image="https://techstory.in/wp-content/uploads/2021/09/near_logo.jpg"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {itemIndex >= 0 && requestedByDetails[itemIndex][2]} NEAR
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Purpose : {itemIndex >= 0 && requestedByDetails[itemIndex][3]}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Passphrase : {pass}
              </Typography>
            </CardContent>
            <CardActions>
              {!showPaymentForm && (
                <Stack direction="row" spacing={2}>
                  <Button
                    disabled={buttonState}
                    variant="outlined"
                    onClick={() => setShowPaymentForm(true)}
                    color="success"
                    startIcon={<DoneIcon />}
                  >
                    Accept
                  </Button>
                  <Button
                    disabled={buttonState}
                    onClick={() => rejectMoneyRequest(itemIndex)}
                    variant="outlined"
                    color="error"
                    startIcon={<CloseIcon />}
                  >
                    Reject
                  </Button>
                </Stack>
              )}
              {showPaymentForm && (
                <Box
                  px="10px"
                  py="10px"
                  sx={{
                    width: 400,
                  }}
                >
                  <Input
                    placeholder="Enter Passphrase"
                    inputProps={'Passphrase'}
                    variant="filled"
                    multiline
                    width="292px"
                    fullWidth
                    value={pass}
                    onChange={(event) => setPass(event.target.value)}
                    color="success"
                    focused
                  />
                  <br />
                  <br />
                  <Button
                    onClick={() => acceptMoneyRequest(itemIndex)}
                    disabled={
                      pass.trim().split(' ').length != 12 || buttonState
                    }
                    variant="contained"
                    endIcon={<SendIcon />}
                  >
                    Confirm
                  </Button>
                </Box>
              )}
            </CardActions>
          </Card>
        </Box>
      </Modal>

      <Snackbar
        open={openSnack}
        autoHideDuration={6000}
        onClose={handleCloseSnack}
      >
        <Alert
          onClose={handleCloseSnack}
          severity={snackType === 'accepted' ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {snackType === 'rejected' && 'Money request rejected'}
          {snackType === 'accepted' && 'Money sent successfully'}
        </Alert>
      </Snackbar>
    </React.Fragment>
  )
}
