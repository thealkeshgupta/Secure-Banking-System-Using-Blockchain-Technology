import React, { useState, useRef, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import QRScan from 'qrscan'

const nearAPI = require('near-api-js')
import axios from 'axios'
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded'
import Backdrop from '@mui/material/Backdrop'
import Button from '@mui/material/Button'
import KeyIcon from '@mui/icons-material/Key'
import SendIcon from '@mui/icons-material/Send'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import Grid from '@material-ui/core/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import { Alert, Snackbar } from '@mui/material'
const Cryptr = require('cryptr')

const cryptr = new Cryptr('myTotalySecretKey')

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #3f51b5',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
}

const ProceedSendFastPayment = (props) => {
  const [formData, setFormData] = useState(
    JSON.parse(`{"amount":"", "message":"", "receiver":""}`)
  )
  const [buttonState, changeButtonState] = useState(false)
  const [pass, setPass] = React.useState('')

  // for modal
  const [open, setOpen] = React.useState(false)
  const [openBD, setOpenBD] = React.useState(false)
  const [openSnack, setOpenSnack] = React.useState(false)
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

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  useEffect(() => {
    setFormData(
      JSON.parse(
        cryptr.decrypt(new URLSearchParams(window.location.search).get('token'))
      )
    )
  }, [])

  const submitMoney = async () => {
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
      receiver: formData.receiver,
      amount: formData.amount,
      message: formData.message,
      datetime: new Date().toLocaleString(),
      parsedAmount: nearAPI.utils.format.parseNearAmount(formData.amount),
    })

    // trial start-----------------------------------------------------------------------------------------------

    const { connect, KeyPair, keyStores, utils } = nearAPI
    require('dotenv').config()

    const sender = window.accountId
    const receiver = formData.receiver
    const networkId = 'testnet'
    const amount = nearAPI.utils.format.parseNearAmount(formData.amount)
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

    setOpenSnack(true)
    changeButtonState(false)
    handleCloseBD()
  }

  const onSubmit2 = () => {
    handleOpen()
  }

  const Payment = () => {
    return (
      <>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minHeight: '100vh', marginTop: '5vh' }}
        >
          <Grid item xs={12}>
            <Card sx={{ textAlign: 'center', minWidth: 400 }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Money Transfer
                </Typography>
                <Typography variant="body2" gutterBottom color="text.secondary">
                  Send money to someone by filling the form given below and
                  submitting it.
                  {formData.receiver}
                </Typography>

                <Grid
                  container
                  spacing={0}
                  direction="column"
                  alignItems="center"
                  justify="center"
                >
                  <TextField
                    id="receiver"
                    label="Receiver"
                    value={formData.receiver}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="filled"
                    fullWidth
                  />
                  <TextField
                    id="amount"
                    label="Amount"
                    value={formData.amount}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="filled"
                    fullWidth
                  />
                  <TextField
                    id="message"
                    label="Message"
                    value={formData.message}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="filled"
                    multiline
                    fullWidth
                  />
                  <br />
                  <Button
                    onClick={onSubmit2}
                    variant="outlined"
                    endIcon={<KeyIcon />}
                  >
                    Proceed to enter passphrase
                  </Button>
                  <br />
                  Passphrase : {pass}
                  <br />
                  <br />
                  <br />
                  <Button
                    onClick={submitMoney}
                    disabled={buttonState || pass.trim().split(' ').length < 12}
                    fullWidth
                    type="submit"
                    variant="contained"
                    endIcon={<SendIcon />}
                  >
                    Confirm
                  </Button>
                </Grid>

                <Modal
                  aria-labelledby="transition-modal-title"
                  aria-describedby="transition-modal-description"
                  open={open}
                  onClose={handleClose}
                  closeAfterTransition
                  BackdropComponent={Backdrop}
                  BackdropProps={{
                    timeout: 500,
                  }}
                >
                  <Fade in={open}>
                    <Box sx={style}>
                      <Typography
                        id="transition-modal-title"
                        variant="h6"
                        color="black"
                        component="h6"
                      >
                        Enter your Passphrase
                      </Typography>
                      <br />
                      <TextField
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        label="Pass Phrase"
                        color="primary"
                        multiline
                        rows={4}
                        focused
                        fullWidth
                        helperText="Enter your 12 word passphrase"
                      />

                      <Button
                        onClick={handleClose}
                        fullWidth
                        variant="contained"
                        endIcon={<KeyIcon />}
                      >
                        Continue
                      </Button>
                    </Box>
                  </Fade>
                </Modal>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </>
    )
  }

  return (
    <>
      <Typography gutterBottom variant="h5" component="div">
        Fast Payment
      </Typography>

      {Payment()}

      <Snackbar
        open={openSnack}
        autoHideDuration={6000}
        onClose={handleCloseSnack}
      >
        <Alert
          onClose={handleCloseSnack}
          severity={'success'}
          sx={{ width: '100%' }}
        >
          {'Money Sent'}
        </Alert>
      </Snackbar>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBD}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
}

export default ProceedSendFastPayment
