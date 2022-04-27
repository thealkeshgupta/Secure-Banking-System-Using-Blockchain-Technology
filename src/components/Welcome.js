import React, { useState, useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import Zoom from '@mui/material/Zoom'
import Paper from '@mui/material/Paper'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { CardActionArea } from '@mui/material'

const Welcome = (props) => {
  useEffect(() => {
    const isRegisteredFunction = async () => {
      const isRegistered = await window.contract.isUserRegistered({
        userId: window.accountId,
      })

      if (isRegistered) {
        console.log(window.location)
        window.location.replace(window.location.origin + '/')
      }

      if (window.accountId !== '') {
        window.location.replace(window.location.origin + '/register')
      }
    }
    isRegisteredFunction()
  }, [])

  const icon = (
    <Paper elevation={24}>
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          component="img"
          height="140"
          image="https://cutewallpaper.org/21/welcome-wallpaper/Wallpaper-Welcome-Transparent-Background-png-download-.png"
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Hi there!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            First Login to your wallet to continue
          </Typography>
        </CardContent>
      </Card>
    </Paper>
  )
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ minHeight: '85vh', marginTop: '5vh' }}
    >
      <Grid item xs={5}>
        <Zoom in={true}>{icon}</Zoom>
      </Grid>
    </Grid>
  )
}

export default Welcome
