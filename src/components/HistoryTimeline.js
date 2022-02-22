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
import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent'
import TimelineDot from '@mui/lab/TimelineDot'
import FastfoodIcon from '@mui/icons-material/Fastfood'
import LaptopMacIcon from '@mui/icons-material/LaptopMac'
import HotelIcon from '@mui/icons-material/Hotel'
import RepeatIcon from '@mui/icons-material/Repeat'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/material'
const HistoryTimeline = (props) => {
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
    <Box container spacing={2}>
      <Timeline>
        {transactionHistory.map((history, index) => {
          if (index < 5) {
            return (
              <TimelineItem>
                <TimelineOppositeContent
                  sx={{ m: 'auto 0' }}
                  variant="body2"
                  color="text.secondary"
                >
                  {history[1].split(',')[0]}
                  <br />
                  {history[1].split(',')[1].split(':')[0]}:
                  {history[1].split(',')[1].split(':')[1]}{' '}
                  {history[1].split(',')[1].split(' ')[2]}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineConnector />
                  {history[0] === '1' ? (
                    <TimelineDot sx={{ bgcolor: green[500] }}>
                      <ArrowDownwardIcon />
                    </TimelineDot>
                  ) : (
                    <TimelineDot sx={{ bgcolor: red[500] }}>
                      <ArrowUpwardIcon />
                    </TimelineDot>
                  )}
                </TimelineSeparator>
                <TimelineContent sx={{ py: '12px' }}>
                  <Typography
                    style={{
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      width: '200px',
                      display: 'block',
                      overflow: 'hidden',
                    }}
                    variant="h6"
                    component="div"
                  >
                    {history[3]} NEAR {history[0] === '1' ? 'Received' : 'Sent'}
                  </Typography>
                  <Typography
                    style={{
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      width: '200px',
                      display: 'block',
                      overflow: 'hidden',
                    }}
                  >
                    {history[5]}
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            )
          }
        })}
      </Timeline>
    </Box>
  )
}

export default HistoryTimeline
