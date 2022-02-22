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

const Home = (props) => {
  const [transactionHistory, setTransactionHistory] = React.useState([])
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
    <Grid container spacing={2} marginTop={'15vh'}>
      <Grid item xs={8}>
        <div>
          Hello {window.accountId}, Welcome to Blockbank.
          {/* {transactionHistory.length}
          {console.log(transactionHistory)} */}
          <br />
          <br />
        </div>
      </Grid>
      <Grid item xs={4} marginTop={'10vh'}>
        <Paper
          elevation={12}
          sx={{ width: '100%', maxWidth: 400, bgcolor: 'background.paper' }}
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
