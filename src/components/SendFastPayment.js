import React, { useState, useRef, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import QRScan from 'qrscan'

import Backdrop from '@mui/material/Backdrop'
import Button from '@mui/material/Button'
import KeyIcon from '@mui/icons-material/Key'
import SendIcon from '@mui/icons-material/Send'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import Grid from '@material-ui/core/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

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

const SendFastPayment = (props) => {
  const [qrValue, setQrValue] = useState('')
  const [isWatching, setWatching] = useState(true)
  const [buttonState, changeButtonState] = useState(false)
  const [pass, setPass] = React.useState('')
  const [formData, setFormData] = useState(
    JSON.parse(`{"amount":"", "message":"", "receiver":""}`)
  )

  // for modal
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const showScanner = () => {
    if (isWatching) {
      console.log('start scanner')
      return <QRScan onFind={onFind} />
    } else {
      return <></>
    }
  }

  const onFind = async (value) => {
    console.log('scanning...')
    try {
      if (!!value) {
        const data = JSON.parse(value)
        console.log(data)
        if (
          data.hasOwnProperty('amount') &&
          +data.amount > 0 &&
          data.hasOwnProperty('message') &&
          data.hasOwnProperty('receiver')
        ) {
          const isRegistered = await window.contract.isUserRegistered({
            userId: data.receiver,
          })

          if (isRegistered) {
            const encryptedPayDetail = cryptr.encrypt(
              JSON.stringify({
                amount: data.amount,
                message: data.message,
                receiver: data.receiver,
              })
            )
            window.location.replace(
              `${window.location.origin}/proceed_fastpay?token=${encryptedPayDetail}`
            )
            // setFormData(data);
            // setQrValue(`${data.amount} $ for ${data.message} to ${data.receiver}`);
            // setWatching(false);
            // navigator.mediaDevices.getUserMedia({video: true, audio: false})
            //     .then(mediaStream => {
            //         const stream = mediaStream;
            //         const tracks = stream.getTracks();

            //         tracks[0].stop;
            //     })
          }
        }
      }
    } catch (e) {}
  }

  const onSubmit2 = () => {
    handleOpen()
  }

  const Scanner = () => {
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
                </Typography>
                {isWatching ? (
                  showScanner()
                ) : (
                  <>
                    <button onClick={() => setWatching(true)}>
                      Scan Again
                    </button>
                    <Grid
                      container
                      spacing={0}
                      direction="column"
                      alignItems="center"
                      justify="center"
                      style={{ minHeight: '100vh', marginTop: '5vh' }}
                    >
                      <TextField
                        id="receiver"
                        label="Receiver"
                        defaultValue={formData.receiver}
                        InputProps={{
                          readOnly: true,
                        }}
                        variant="filled"
                        fullWidth
                      />
                      <TextField
                        id="amount"
                        label="Amount"
                        defaultValue={formData.amount}
                        InputProps={{
                          readOnly: true,
                        }}
                        variant="filled"
                        fullWidth
                      />
                      <TextField
                        id="message"
                        label="Message"
                        defaultValue={formData.message}
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
                        disabled={
                          buttonState || pass.trim().split(' ').length < 12
                        }
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
                  </>
                )}
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

      {Scanner()}
    </>
  )
}

export default SendFastPayment
