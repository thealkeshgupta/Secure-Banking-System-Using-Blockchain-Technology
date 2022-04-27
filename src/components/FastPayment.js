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
  image:
    'data:image/png;base64,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',
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
