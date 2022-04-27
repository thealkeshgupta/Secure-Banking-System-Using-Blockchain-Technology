import React, { useState, useEffect } from 'react'

import { useForm } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import NumberFormat from 'react-number-format'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Grid from '@material-ui/core/Grid'

import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import MobileDatePicker from '@mui/lab/MobileDatePicker'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import { Alert, Snackbar } from '@mui/material'

const Register = (props) => {
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

  const { register, handleSubmit } = useForm()
  const onSubmit = async (data) => {
    handleOpenBD()
    await window.contract.registerUser({
      userId: window.accountId,
      fName: data.firstname,
      lName: data.lastname,
      email: data.email,
      mobile: data.mobile,
      dob: data.dob,
    })

    setOpenSnack(true)
    handleCloseBD()
    window.location.replace(window.location.origin + '/')
  }

  const [value, setValue] = React.useState(new Date())

  useEffect(() => {
    const isRegisteredFunction = async () => {
      handleOpenBD()
      const isRegistered = await window.contract.isUserRegistered({
        userId: window.accountId,
      })

      if (isRegistered) {
        console.log(window.location)
        window.location.replace(window.location.origin + '/')
      }

      if (window.accountId === '') {
        window.location.replace(window.location.origin + '/welcome')
      }

      handleCloseBD()
    }
    isRegisteredFunction()
  }, [])

  return (
    <>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: '85vh', marginTop: '15vh' }}
      >
        <Grid item xs={12}>
          <Card sx={{ maxWidth: 355 }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Account Registration
              </Typography>
              <Typography variant="body2" gutterBottom color="text.secondary">
                Create your account below by filling the form given and
                submitting it.
              </Typography>
              <br />
              <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  required
                  fullWidth
                  helperText="Enter your first name"
                  id="demo-helper-text-misaligned"
                  label="First Name"
                  {...register('firstname')}
                />
                <br />
                <br />
                <TextField
                  required
                  fullWidth
                  helperText="Enter your last name"
                  id="demo-helper-text-misaligned"
                  label="Last Name"
                  {...register('lastname')}
                />
                <br />
                <br />
                <TextField
                  required
                  fullWidth
                  helperText="Enter your email"
                  id="demo-helper-text-misaligned"
                  label="Email"
                  {...register('email')}
                />
                <br />
                <br />
                <TextField
                  required
                  fullWidth
                  helperText="Enter your mobile number"
                  id="demo-helper-text-misaligned"
                  label="Mobile Number"
                  {...register('mobile')}
                />
                <br />
                <br />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <MobileDatePicker
                    label="Date of Birth"
                    minDate={new Date('1900-01-01')}
                    maxDate={new Date()}
                    value={value}
                    onChange={(newValue) => {
                      setValue(newValue)
                    }}
                    renderInput={(params) => (
                      <TextField
                        helperText="Enter your date of birth"
                        {...params}
                        {...register('dob')}
                      />
                    )}
                  />
                </LocalizationProvider>
                <br />
                <br />
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  endIcon={<PersonAddIcon />}
                >
                  Register My Account
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
          {'Account Created'}
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

export default Register
