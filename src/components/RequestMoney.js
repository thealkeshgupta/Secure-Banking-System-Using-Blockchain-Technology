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
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Grid from '@material-ui/core/Grid'
import Autocomplete from '@mui/material/Autocomplete'
import parse from 'autosuggest-highlight/parse'
import match from 'autosuggest-highlight/match'
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

const RequestMoney = (props) => {
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
    handleOpenBD()
    if (+data.amount > 0) {
      changeButtonState(true)

      await window.contract.requestMoney({
        sender: window.accountId,
        receiver: data.receiver,
        amount: data.amount,
        message: data.message,
        datetime: new Date().toLocaleString(),
      })

      changeButtonState(false)

      setOpenSnack(true)
    }
    handleCloseBD()
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
      let allUsers = await window.contract.getUserList()
      let newReceiverList = allUsers.filter((user) => user !== window.accountId)
      setReceiverList(newReceiverList)

      console.log('users----')
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
                Money Request
              </Typography>
              <Typography variant="body2" gutterBottom color="text.secondary">
                Request money from someone by filling the form given below and
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
                      label="Request From"
                      helperText="Please enter the account address"
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
                  label="Money Request Intent"
                  {...register('message')}
                />
                <br />
                <br />

                <Button
                  disabled={buttonState}
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
          {'Request sent'}
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

export default RequestMoney
