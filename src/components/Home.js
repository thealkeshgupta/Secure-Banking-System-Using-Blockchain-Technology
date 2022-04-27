import React, { useState, useEffect } from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { green, red } from '@mui/material/colors'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import HistoryTimeline from './HistoryTimeline'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

const Home = (props) => {
  const [transactionHistory, setTransactionHistory] = React.useState([])
  const [balance, setBalance] = React.useState(0)
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

    const checkBalance = async () => {
      let bal = await window.contract.getWalletBalance({
        userId: window.accountId,
      })

      setBalance(bal)
    }
    checkBalance()

    const transactionListFunction = async () => {
      let transactionHistoryData = await window.contract.getTransactionHistory({
        userId: window.accountId,
      })

      transactionHistoryData.sort((a, b) => {
        if (a[1] === b[1]) {
          return 0
        } else {
          return new Date(a[1]) < new Date(b[1]) ? 1 : -1
        }
      })
      console.log(transactionHistoryData)
      setTransactionHistory(transactionHistoryData)
    }
    transactionListFunction()
  }, [])

  const noTransactionsFound = () => {
    if (transactionHistory.length === 0) {
      return <>No Previous Transactions Found</>
    }
  }

  return (
    <Grid container spacing={2} marginTop={'10vh'}>
      <Grid item xs={8}>
        <div>
          <Paper
            elevation={12}
            sx={{
              maxWidth: 800,
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              padding: 2,
              textAlign: 'center',
              borderRadius: 10,
            }}
          >
            <Typography sx={{ fontSize: 28 }} color="text.primary" gutterBottom>
              Secure Banking System{' '}
              <code style={{ color: '#3f51b5' }}>
                using Blockchain Technology
              </code>
            </Typography>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontSize: 20,
                textAlign: 'justify',
                textJustify: 'inter-word',
                px: 5,
              }}
            >
              A web-based serverless application which works on a decentralized
              system for handling transactions between users ruling out the
              utilization of any centralized database. All the transactions are
              to be verified by smart contract and stored in the{' '}
              <em>Near Blockchain</em>.
            </Typography>
          </Paper>

          <Paper
            elevation={12}
            sx={{
              maxWidth: 800,
              maxHeight: 330,
              // bgcolor: 'background.paper',
              // background-color: #fff;
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: 10,
              my: 2,
              px: 10,
            }}
          >
            <Typography sx={{ fontSize: 28 }} color="text.primary" gutterBottom>
              <div style={{ color: '#3f51b5' }}>Salient Features</div>
            </Typography>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontSize: 20,
                textAlign: 'justify',
                textJustify: 'inter-word',
              }}
            >
              <ul style={{ margin: 0, 'line-height': '50%' }}>
                <li>Money Transfer</li>
                <li>Send Fast Payment using QR Scanning</li>
                <li>Receive Fast Payment using QR Generation</li>
                <li>Money Request</li>
                <li>Transaction History/Logs</li>
                <li>Authenticated Transfer Actions using Passphrase</li>
              </ul>
            </Typography>
          </Paper>
          <br />
          <br />
        </div>
      </Grid>
      <Grid item xs={4} marginTop={'0vh'}>
        <Paper
          elevation={12}
          sx={{
            width: '100%',
            maxWidth: 400,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: 10,
          }}
        >
          {noTransactionsFound()}
          {/* <List dense>
            {transactionHistory.map((item, index) => {
              if (index < 5) {
                return (
                  <>
                    {item[0] === '0' ? (
                      <ListItem
                        secondaryAction={
                          <ListItemText
                            primary={
                              <h2>
                                <b>- Near {item[3]}</b>
                              </h2>
                            }
                            sx={{ color: red[500] }}
                          />
                        }
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: red[500] }}>
                            <ArrowUpwardIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={'Sent'} secondary={item[1]} />
                      </ListItem>
                    ) : (
                      <ListItem
                        secondaryAction={
                          <ListItemText
                            primary={
                              <h2>
                                <b>+ Near {item[3]}</b>
                              </h2>
                            }
                            sx={{ color: green[500] }}
                          />
                        }
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: green[500] }}>
                            <ArrowDownwardIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={'Received'}
                          secondary={item[1]}
                        />
                      </ListItem>
                    )}
                  </>
                )
              }
            })}
          </List> */}
          <HistoryTimeline />
        </Paper>
      </Grid>
    </Grid>
  )
}

export default Home
