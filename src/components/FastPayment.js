import React, { useState, useRef, useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import Zoom from '@mui/material/Zoom'
import Paper from '@mui/material/Paper'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import SendIcon from '@mui/icons-material/Send'
import QrCode2Icon from '@mui/icons-material/QrCode2'
import QrCodeIcon from '@mui/icons-material/QrCode'
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import Backdrop from '@mui/material/Backdrop'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import QRCodeStyling from 'qr-code-styling'

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
const qrCode = new QRCodeStyling({
  width: 200,
  height: 200,
  image: 'https://cryptologos.cc/logos/near-protocol-near-logo.png',
  dotsOptions: {
    color: '#3f51b5',
    type: 'rectangular',
  },
  imageOptions: {
    crossOrigin: 'anonymous',
    margin: 2,
  },
})

const FastPayment = (props) => {
  // for modal
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [amount, setAmount] = useState()
  const [message, setMessage] = useState('')
  const [qrAmount, setQrAmount] = useState('')
  const [isQrGenerated, setIsQrGenerated] = useState(false)
  const ref = useRef(null)

  const onSubmit2 = () => {
    if (amount > 0) {
      qrCode.update({
        data:
          amount > 0
            ? JSON.stringify({
                amount: amount,
                message: message,
                receiver: window.accountId,
              })
            : '',
      })
      setQrAmount(amount)
      setIsQrGenerated(true)
    }
  }

  useEffect(() => {
    qrCode.append(ref.current)
  }, [])

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ minHeight: '85vh', marginTop: '5vh' }}
    >
      <Grid item xs={12}>
        <Card sx={{ textAlign: 'center' }}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Fast Payment
            </Typography>

            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography
                    id="transition-modal-title"
                    variant="h6"
                    color="black"
                    component="h6"
                  >
                    Enter Payment Request Details
                  </Typography>

                  <TextField
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    label="Amount"
                    color="primary"
                    fullWidth
                    helperText="Enter amount"
                  />

                  <TextField
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    label="Message"
                    color="primary"
                    fullWidth
                    helperText="Enter message"
                  />

                  <Button
                    onClick={onSubmit2}
                    variant="contained"
                    endIcon={<QrCodeIcon />}
                  >
                    {isQrGenerated ? 'Regenerate QR' : 'Generate QR'}
                  </Button>

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

                        <Button
                          onClick={handleClose}
                          fullWidth
                          variant="contained"
                          endIcon={<CancelPresentationIcon />}
                        >
                          Close
                        </Button>
                      </Box>
                    </Fade>
                  </Modal>
                </Grid>
                <Grid item xs={4}>
                  <Box
                    sx={{
                      width: 300,
                      height: 300,
                      border: '2px dashed grey',
                    }}
                    children={
                      <Box>
                        <div style={{ marginTop: '0.5em' }}>
                          {isQrGenerated ? (
                            <>
                              <em>QR for amount of </em> <b>{qrAmount} NEAR </b>
                            </>
                          ) : (
                            <em>QR will be generated below...</em>
                          )}
                        </div>
                        <br />
                        <div ref={ref} />
                      </Box>
                    }
                  />
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default FastPayment
