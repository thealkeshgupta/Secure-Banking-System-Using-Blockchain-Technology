import React, { useState, useEffect } from 'react'
const nearAPI = require('near-api-js')
import { useForm } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import NumberFormat from 'react-number-format'

import axios from 'axios'
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import SendIcon from '@mui/icons-material/Send'
import KeyIcon from '@mui/icons-material/Key'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Grid from '@material-ui/core/Grid'
import Autocomplete from '@mui/material/Autocomplete'
import parse from 'autosuggest-highlight/parse'
import match from 'autosuggest-highlight/match'

import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import { Alert, Snackbar } from '@mui/material'

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

console.log('env>>', process.env.SENDER_PRIVATE_KEY)
console.log('env<<')
const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(
  props,
  ref
) {
  const { onChange, ...other } = props

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        })
      }}
      isNumericString
    />
  )
})

const Transfer = (props) => {
  const { register, handleSubmit } = useForm()
  const [buttonState, changeButtonState] = useState(false)
  const [value, setValue] = React.useState('')
  const [pass, setPass] = React.useState('')
  const [receiverList, setReceiverList] = React.useState([])

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

  // for modal
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  // const onSubmit = async (data) => {
  //   console.log(data.amount + " & " + data.message + " & " + data.receiver);
  //   let currentBalance = await window.contract.getWalletBalance({
  //     userId: window.accountId,
  //   });

  //   console.log("check transer for " + currentBalance + " & " + data.amount);
  //   console.log("check tranfser" + (currentBalance < data.amount));
  //   if (+currentBalance < data.amount) {
  //     alert(
  //       "Sorry! Your current balance is " +
  //         currentBalance +
  //         ". Please enter the amount within your balance limit."
  //     );
  //   } else {
  //     await window.contract.transfer({
  //       userId: window.accountId,
  //       receiverId: data.receiver,
  //       amount: data.amount,
  //       message: data.message,
  //       datetime: new Date().toLocaleString(),
  //     });

  //     alert(data.amount + " transfered to " + data.receiver);

  //     let transferKeys = await window.contract.getTransferHistoryKeyArray({
  //       userId: window.accountId,
  //     });
  //     console.log(transferKeys);

  //     transferKeys.map(async (transferId) => {
  //       console.log(transferId + " check");
  //       let details = await window.contract.getTransferHistoryDetail({
  //         transferId: transferId,
  //       });
  //       console.log(details);
  //     });
  //   }
  // };

  const onSubmit = async (data) => {
    changeButtonState(true)
    handleOpenBD()
    console.log(
      data.amount +
        ' & ' +
        data.message +
        ' & ' +
        data.receiver +
        ' & pass : ' +
        pass
    )

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

    // await window.contract.createTransactionLogs({
    //   sender: window.accountId,
    //   receiver: data.receiver,
    //   amount: data.amount,
    //   message: data.message,
    //   datetime: new Date().toLocaleString()
    // })

    await window.contract.transferNearTokens({
      sender: window.accountId,
      receiver: data.receiver,
      amount: data.amount,
      message: data.message,
      datetime: new Date().toLocaleString(),
      parsedAmount: nearAPI.utils.format.parseNearAmount(data.amount),
    })

    // trial start-----------------------------------------------------------------------------------------------

    const { connect, KeyPair, keyStores, utils } = nearAPI
    require('dotenv').config()

    const sender = window.accountId
    const receiver = data.receiver
    const networkId = 'testnet'
    const amount = nearAPI.utils.format.parseNearAmount(data.amount)
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
    console.log(result)
    console.log('done')
    // trial end---------------------------------------------------------------------

    changeButtonState(false)

    setOpenSnack(true)
    handleCloseBD()
  }

  const onSubmit2 = () => {
    handleOpen()
  }

  useEffect(() => {
    const isRegisteredFunction = async () => {
      const isRegistered = await window.contract.isUserRegistered({
        userId: window.accountId,
      })

      if (!isRegistered) {
        console.log(window.location)
        window.location.replace(window.location.origin + '/register')
      }
    }
    isRegisteredFunction()

    const receiverListFunction = async () => {
      let allUsers = await window.contract.getUserList({})
      let newReceiverList = allUsers.filter((user) => user !== window.accountId)
      setReceiverList(newReceiverList)
    }
    receiverListFunction()
  }, [])
  return (
    <>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: '100vh', marginTop: '15vh' }}
      >
        <Grid item xs={12}>
          <Card sx={{ maxWidth: 355 }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Money Transfer
              </Typography>
              <Typography variant="body2" gutterBottom color="text.secondary">
                Send money to someone by filling the form given below and
                submitting it.
              </Typography>
              <br />
              <form onSubmit={handleSubmit(onSubmit)}>
                <Autocomplete
                  value={value}
                  onChange={(event, newValue) => {
                    setValue(newValue)
                  }}
                  id="highlights-demo"
                  options={receiverList}
                  getOptionLabel={(option) => option}
                  renderInput={(params) => (
                    <TextField
                      required
                      fullWidth
                      {...params}
                      label="Receiver Account Address"
                      helperText="Please enter the receiver account address"
                      {...register('receiver')}
                    />
                  )}
                  renderOption={(props, option, { inputValue }) => {
                    const matches = match(option, inputValue)
                    const parts = parse(option, matches)

                    return (
                      <li {...props}>
                        <div>
                          {parts.map((part, index) => (
                            <span
                              key={index}
                              style={{
                                fontWeight: part.highlight ? 700 : 400,
                                color: part.highlight ? '#0b9e17' : '#000000',
                              }}
                            >
                              {part.text}
                            </span>
                          ))}
                        </div>
                      </li>
                    )
                  }}
                />
                <br />
                <TextField
                  required
                  fullWidth
                  helperText="Please enter the amount to be sent"
                  id="demo-helper-text-misaligned"
                  label="Amount"
                  InputProps={{
                    inputComponent: NumberFormatCustom,
                  }}
                  {...register('amount')}
                />
                <br />
                <br />
                {/* <TextField
                required
                fullWidth
                helperText="Please enter the receiver account id"
                id="demo-helper-text-misaligned"
                label="Receiver Account ID"
                InputProps={{
                  inputComponent: NumberFormatCustom,
                }}
                {...register("receiver")}
              />
              <br />
              <br /> */}
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  helperText="Please enter your message(if any)"
                  id="demo-helper-text-misaligned"
                  label="Money Transfer Message"
                  {...register('message')}
                />
                <br />
                <br />
                <Button
                  onClick={onSubmit2}
                  variant="outlined"
                  endIcon={<KeyIcon />}
                >
                  Proceed to enter passphrase
                </Button>
                Passphrase : {pass}
                <br />
                <br />
                <br />
                <Button
                  disabled={buttonState || pass.trim().split(' ').length < 12}
                  fullWidth
                  type="submit"
                  variant="contained"
                  endIcon={<SendIcon />}
                >
                  Confirm
                </Button>
              </form>
            </CardContent>
          </Card>

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
        </Grid>
      </Grid>
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

export default Transfer
